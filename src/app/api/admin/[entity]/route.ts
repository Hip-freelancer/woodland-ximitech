import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import {
  createAdminApiUnauthorizedResponse,
  isAdminRequestAuthenticated,
} from "@/lib/adminAuth";
import { normalizeAdminEntityPayload } from "@/lib/adminEntityTransform";

// Dynamically import models
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

const getSort = (
  entityName: string
): Record<string, "asc" | "desc"> => {
  switch (entityName.toLowerCase()) {
    case "products":
    case "categories":
    case "news":
      return { createdAt: "desc", updatedAt: "desc" };
    case "contacts":
      return { submittedAt: "desc", createdAt: "desc" };
    case "team":
      return { order: "asc", createdAt: "desc" };
    default:
      return { createdAt: "desc" };
  }
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ entity: string }> }) {
  if (!isAdminRequestAuthenticated(req)) {
    return createAdminApiUnauthorizedResponse();
  }

  await dbConnect();
  const { entity } = await params;
  
  const Model = getModel(entity);
  if (!Model) {
    return NextResponse.json({ error: `Entity ${entity} not found` }, { status: 404 });
  }

  try {
    const data = await Model.find({}).sort(getSort(entity));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ entity: string }> }) {
  if (!isAdminRequestAuthenticated(req)) {
    return createAdminApiUnauthorizedResponse();
  }

  await dbConnect();
  const { entity } = await params;

  const Model = getModel(entity);
  if (!Model) {
    return NextResponse.json({ error: `Entity ${entity} not found` }, { status: 404 });
  }

  try {
    const body = await req.json();
    const normalizedBody = normalizeAdminEntityPayload(entity, body);
    const newDoc = await Model.create(normalizedBody as Record<string, unknown>);
    return NextResponse.json(newDoc, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create document",
      },
      { status: 500 }
    );
  }
}
