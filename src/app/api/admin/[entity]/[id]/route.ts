import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import {
  createAdminApiUnauthorizedResponse,
  isAdminRequestAuthenticated,
} from "@/lib/adminAuth";
import { normalizeAdminEntityPayload } from "@/lib/adminEntityTransform";
import { deleteHeroLocalMediaFile, isHeroLocalMediaUrl } from "@/lib/localMedia";

import "@/models/Product";
import "@/models/Category";
import "@/models/NewsArticle";
import "@/models/Contact";
import "@/models/Project";
import "@/models/TeamMember";
import "@/models/HomeSettings";

const getModel = (entityName: string) => {
  const models: { [key: string]: string } = {
    products: "Product",
    categories: "Category",
    news: "NewsArticle",
    contacts: "Contact",
    projects: "Project",
    team: "TeamMember",
    "home-settings": "HomeSettings",
  };
  
  const modelName = models[entityName.toLowerCase()];
  if (!modelName) return null;
  return mongoose.models[modelName];
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeEntityState(
  currentValue: unknown,
  nextValue: unknown
): unknown {
  if (!isPlainObject(currentValue) || !isPlainObject(nextValue)) {
    return nextValue === undefined ? currentValue : nextValue;
  }

  const merged: Record<string, unknown> = { ...currentValue };

  Object.entries(nextValue).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    merged[key] = mergeEntityState(merged[key], value);
  });

  return merged;
}

function extractHomeSettingsMediaUrls(
  value: unknown
) {
  if (typeof value !== "object" || value === null) {
    return [];
  }

  const heroSlides = (value as { heroSlides?: Array<{ mediaUrl?: string }> }).heroSlides;

  if (!Array.isArray(heroSlides)) {
    return [];
  }

  return heroSlides
    .map((slide) => slide?.mediaUrl ?? "")
    .filter((item) => isHeroLocalMediaUrl(item));
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ entity: string; id: string }> }) {
  if (!isAdminRequestAuthenticated(req)) {
    return createAdminApiUnauthorizedResponse();
  }

  await dbConnect();
  const { entity, id } = await params;
  
  const Model = getModel(entity);
  if (!Model) {
    return NextResponse.json({ error: `Entity ${entity} not found` }, { status: 404 });
  }

  try {
    const data = await Model.findById(id);
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ entity: string; id: string }> }) {
  if (!isAdminRequestAuthenticated(req)) {
    return createAdminApiUnauthorizedResponse();
  }

  await dbConnect();
  const { entity, id } = await params;

  const Model = getModel(entity);
  if (!Model) {
    return NextResponse.json({ error: `Entity ${entity} not found` }, { status: 404 });
  }

  try {
    const body = await req.json();
    const shouldMergeBeforeNormalize = [
      "products",
      "categories",
      "news",
      "home-settings",
    ].includes(entity.toLowerCase());
    let normalizedBody: unknown = body;
    let existingDocForCleanup: unknown = null;

    if (shouldMergeBeforeNormalize) {
      const existingDoc = await Model.findById(id);

      if (!existingDoc) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      existingDocForCleanup = existingDoc.toObject ? existingDoc.toObject() : existingDoc;

      const mergedBody = mergeEntityState(
        existingDocForCleanup,
        body
      );

      normalizedBody = normalizeAdminEntityPayload(entity, mergedBody);
    }

    const updatedDoc = await Model.findByIdAndUpdate(
      id,
      normalizedBody as Record<string, unknown>,
      {
      new: true,
      runValidators: true,
      }
    );

    if (entity.toLowerCase() === "home-settings" && existingDocForCleanup) {
      const previousUrls = extractHomeSettingsMediaUrls(existingDocForCleanup);
      const nextUrls = new Set(extractHomeSettingsMediaUrls(normalizedBody));

      await Promise.all(
        previousUrls
          .filter((url) => !nextUrls.has(url))
          .map((url) => deleteHeroLocalMediaFile(url).catch(() => undefined))
      );
    }

    return NextResponse.json(updatedDoc);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update document",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ entity: string; id: string }> }) {
  if (!isAdminRequestAuthenticated(req)) {
    return createAdminApiUnauthorizedResponse();
  }

  await dbConnect();
  const { entity, id } = await params;

  const Model = getModel(entity);
  if (!Model) {
    return NextResponse.json({ error: `Entity ${entity} not found` }, { status: 404 });
  }

  try {
    const existingDoc =
      entity.toLowerCase() === "home-settings" ? await Model.findById(id) : null;
    const deletedDoc = await Model.findByIdAndDelete(id);
    if (!deletedDoc) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (existingDoc) {
      await Promise.all(
        extractHomeSettingsMediaUrls(
          existingDoc.toObject ? existingDoc.toObject() : existingDoc
        ).map((url) => deleteHeroLocalMediaFile(url).catch(() => undefined))
      );
    }
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
