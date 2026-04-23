import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import "@/models/Category";
import "@/models/HomeSettings";
import "@/models/NewsArticle";
import "@/models/Product";
import "@/models/TeamMember";
import Category from "@/models/Category";
import HomeSettings from "@/models/HomeSettings";
import NewsArticle from "@/models/NewsArticle";
import Product from "@/models/Product";
import TeamMember from "@/models/TeamMember";
import dbConnect from "@/lib/dbConnect";
import { resolveAdminEntityRemoteMedia } from "@/lib/adminRemoteMedia";

type CollectionEntity =
  | "categories"
  | "products"
  | "news"
  | "team"
  | "home-settings";

const ENTITY_MODELS: Record<
  CollectionEntity,
  mongoose.Model<Record<string, unknown>>
> = {
  categories: Category,
  "home-settings": HomeSettings,
  news: NewsArticle,
  products: Product,
  team: TeamMember,
};

async function processEntity(entity: CollectionEntity) {
  const Model = ENTITY_MODELS[entity];
  const documents = await Model.find({}).lean();
  let updatedCount = 0;

  for (const document of documents) {
    const nextDocument = await resolveAdminEntityRemoteMedia(entity, document);
    const currentDocument =
      typeof document === "object" && document !== null
        ? (document as Record<string, unknown>)
        : {};

    if (JSON.stringify(document) === JSON.stringify(nextDocument)) {
      continue;
    }

    await Model.findByIdAndUpdate(currentDocument._id, nextDocument as Record<string, unknown>, {
      new: false,
      runValidators: false,
    });
    updatedCount += 1;
  }

  return updatedCount;
}

async function run() {
  await dbConnect();

  const result = {
    categories: await processEntity("categories"),
    "home-settings": await processEntity("home-settings"),
    news: await processEntity("news"),
    products: await processEntity("products"),
    team: await processEntity("team"),
  };

  console.log(JSON.stringify(result, null, 2));
  await mongoose.disconnect();
}

run().catch((error) => {
  console.error("Không thể backfill ảnh woodland cũ:", error);
  process.exit(1);
});
