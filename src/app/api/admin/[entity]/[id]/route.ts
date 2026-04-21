import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import {
  createAdminApiUnauthorizedResponse,
  isAdminRequestAuthenticated,
} from "@/lib/adminAuth";
import { normalizeAdminEntityPayload } from "@/lib/adminEntityTransform";

import "@/models/Product";
import "@/models/Category";
import "@/models/NewsArticle";
import "@/models/Contact";
import "@/models/Project";
import "@/models/TeamMember";

const getModel = (entityName: string) => {
  const models: { [key: string]: string } = {
    products: "Product",
    categories: "Category",
    news: "NewsArticle",
    contacts: "Contact",
    projects: "Project",
    team: "TeamMember"
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
    const shouldMergeBeforeNormalize = ["products", "categories", "news"].includes(
      entity.toLowerCase()
    );
    let normalizedBody: unknown = body;

    if (shouldMergeBeforeNormalize) {
      const existingDoc = await Model.findById(id);

      if (!existingDoc) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      const mergedBody = mergeEntityState(
        existingDoc.toObject ? existingDoc.toObject() : existingDoc,
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
    const deletedDoc = await Model.findByIdAndDelete(id);
    if (!deletedDoc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
