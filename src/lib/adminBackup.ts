import "server-only";

import mongoose from "mongoose";
import { normalizeAdminEntityPayload } from "@/lib/adminEntityTransform";
import { resolveAdminEntityRemoteMedia } from "@/lib/adminRemoteMedia";
import { deleteHeroLocalMediaFile, isHeroLocalMediaUrl } from "@/lib/localMedia";

export const ADMIN_BACKUP_VERSION = 1;

export interface AdminBackupPayload {
  version: number;
  exportedAt: string;
  data: {
    categories: Record<string, unknown>[];
    contacts: Record<string, unknown>[];
    "home-settings": Record<string, unknown>[];
    news: Record<string, unknown>[];
    products: Record<string, unknown>[];
    projects: Record<string, unknown>[];
    team: Record<string, unknown>[];
  };
}

type AdminModelRegistry = {
  Category: mongoose.Model<Record<string, unknown>>;
  Contact: mongoose.Model<Record<string, unknown>>;
  HomeSettings: mongoose.Model<Record<string, unknown>>;
  NewsArticle: mongoose.Model<Record<string, unknown>>;
  Product: mongoose.Model<Record<string, unknown>>;
  Project: mongoose.Model<Record<string, unknown>>;
  TeamMember: mongoose.Model<Record<string, unknown>>;
};

function stripMongoFields<T extends Record<string, unknown>>(document: T) {
  const nextDocument = { ...document };
  delete nextDocument.__v;
  delete nextDocument._id;
  return nextDocument;
}

function sanitizeHomeSettingsForBackup(document: Record<string, unknown>) {
  const heroSlides = Array.isArray(document.heroSlides)
    ? document.heroSlides.filter((slide) => {
        const slideRecord =
          typeof slide === "object" && slide !== null
            ? (slide as Record<string, unknown>)
            : {};

        return !(
          slideRecord.mediaType === "video" &&
          typeof slideRecord.mediaUrl === "string" &&
          isHeroLocalMediaUrl(slideRecord.mediaUrl)
        );
      })
    : [];

  return {
    ...stripMongoFields(document),
    heroSlides,
  };
}

export async function createAdminBackup(
  models: AdminModelRegistry
): Promise<AdminBackupPayload> {
  const [categories, contacts, homeSettings, news, products, projects, team] =
    await Promise.all([
      models.Category.find({}).lean(),
      models.Contact.find({}).lean(),
      models.HomeSettings.find({}).lean(),
      models.NewsArticle.find({}).lean(),
      models.Product.find({}).lean(),
      models.Project.find({}).lean(),
      models.TeamMember.find({}).lean(),
    ]);

  return {
    data: {
      categories: categories.map((item) => stripMongoFields(item)),
      contacts: contacts.map((item) => stripMongoFields(item)),
      "home-settings": homeSettings.map((item) =>
        sanitizeHomeSettingsForBackup(item)
      ),
      news: news.map((item) => stripMongoFields(item)),
      products: products.map((item) => stripMongoFields(item)),
      projects: projects.map((item) => stripMongoFields(item)),
      team: team.map((item) => stripMongoFields(item)),
    },
    exportedAt: new Date().toISOString(),
    version: ADMIN_BACKUP_VERSION,
  };
}

async function cleanupExistingHomeMedia(models: AdminModelRegistry) {
  const homeSettings = await models.HomeSettings.find({}).lean();
  const mediaUrls = Array.from(
    new Set(
      homeSettings.flatMap((item) =>
        Array.isArray(item.heroSlides)
          ? item.heroSlides
              .map((slide) =>
                typeof slide?.mediaUrl === "string" ? slide.mediaUrl : ""
              )
              .filter((url) => isHeroLocalMediaUrl(url))
          : []
      )
    )
  );

  await Promise.all(
    mediaUrls.map((url) => deleteHeroLocalMediaFile(url).catch(() => undefined))
  );
}

async function prepareImportDocuments(
  entity: string,
  documents: unknown[]
) {
  const preparedDocuments: Record<string, unknown>[] = [];

  for (const item of documents) {
    const baseDocument =
      typeof item === "object" && item !== null ? (item as Record<string, unknown>) : {};
    const normalizedDocument = [
      "categories",
      "home-settings",
      "news",
      "products",
      "team",
    ].includes(entity)
      ? normalizeAdminEntityPayload(entity, baseDocument)
      : stripMongoFields(baseDocument);
    const resolvedMediaDocument = await resolveAdminEntityRemoteMedia(
      entity,
      normalizedDocument
    );

    preparedDocuments.push(resolvedMediaDocument as Record<string, unknown>);
  }

  return preparedDocuments;
}

export async function importAdminBackup(
  models: AdminModelRegistry,
  backup: AdminBackupPayload
) {
  if (backup.version !== ADMIN_BACKUP_VERSION) {
    throw new Error(
      `Phiên bản backup không hỗ trợ. Nhận ${backup.version}, cần ${ADMIN_BACKUP_VERSION}.`
    );
  }

  await cleanupExistingHomeMedia(models);

  const preparedData = {
    categories: await prepareImportDocuments("categories", backup.data.categories),
    contacts: await prepareImportDocuments("contacts", backup.data.contacts),
    "home-settings": await prepareImportDocuments(
      "home-settings",
      backup.data["home-settings"]
    ),
    news: await prepareImportDocuments("news", backup.data.news),
    products: await prepareImportDocuments("products", backup.data.products),
    projects: await prepareImportDocuments("projects", backup.data.projects),
    team: await prepareImportDocuments("team", backup.data.team),
  };

  await Promise.all([
    models.Category.deleteMany({}),
    models.Contact.deleteMany({}),
    models.HomeSettings.deleteMany({}),
    models.NewsArticle.deleteMany({}),
    models.Product.deleteMany({}),
    models.Project.deleteMany({}),
    models.TeamMember.deleteMany({}),
  ]);

  await Promise.all([
    preparedData.categories.length
      ? models.Category.insertMany(preparedData.categories, { ordered: false })
      : Promise.resolve(),
    preparedData.contacts.length
      ? models.Contact.insertMany(preparedData.contacts, { ordered: false })
      : Promise.resolve(),
    preparedData["home-settings"].length
      ? models.HomeSettings.insertMany(preparedData["home-settings"], {
          ordered: false,
        })
      : Promise.resolve(),
    preparedData.news.length
      ? models.NewsArticle.insertMany(preparedData.news, { ordered: false })
      : Promise.resolve(),
    preparedData.products.length
      ? models.Product.insertMany(preparedData.products, { ordered: false })
      : Promise.resolve(),
    preparedData.projects.length
      ? models.Project.insertMany(preparedData.projects, { ordered: false })
      : Promise.resolve(),
    preparedData.team.length
      ? models.TeamMember.insertMany(preparedData.team, { ordered: false })
      : Promise.resolve(),
  ]);
}
