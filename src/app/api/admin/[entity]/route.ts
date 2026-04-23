import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import {
  createAdminApiUnauthorizedResponse,
  isAdminRequestAuthenticated,
} from "@/lib/adminAuth";
import { normalizeAdminEntityPayload } from "@/lib/adminEntityTransform";
import { resolveAdminEntityRemoteMedia } from "@/lib/adminRemoteMedia";

// Dynamically import models
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
    case "home-settings":
      return { updatedAt: "desc" };
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
    return NextResponse.json(
      { error: `Không tìm thấy module quản trị: ${entity}.` },
      { status: 404 }
    );
  }

  try {
    const data = await Model.find({}).sort(getSort(entity));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Không thể tải dữ liệu quản trị." },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: `Không tìm thấy module quản trị: ${entity}.` },
      { status: 404 }
    );
  }

  try {
    const body = await req.json();
    const normalizedBody = normalizeAdminEntityPayload(entity, body);
    const resolvedMediaBody = await resolveAdminEntityRemoteMedia(
      entity,
      normalizedBody
    );
    const newDoc = await Model.create(
      resolvedMediaBody as Record<string, unknown>
    );
    return NextResponse.json(newDoc, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Không thể tạo dữ liệu mới.",
      },
      { status: 500 }
    );
  }
}
