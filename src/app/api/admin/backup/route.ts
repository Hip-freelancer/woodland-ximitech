import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import {
  createAdminApiUnauthorizedResponse,
  isAdminRequestAuthenticated,
} from "@/lib/adminAuth";
import {
  createAdminBackup,
  importAdminBackup,
  type AdminBackupPayload,
} from "@/lib/adminBackup";
import CategoryModel from "@/models/Category";
import ContactModel from "@/models/Contact";
import HomeSettingsModel from "@/models/HomeSettings";
import NewsArticleModel from "@/models/NewsArticle";
import ProductModel from "@/models/Product";
import ProjectModel from "@/models/Project";
import TeamMemberModel from "@/models/TeamMember";

const models = {
  Category: CategoryModel,
  Contact: ContactModel,
  HomeSettings: HomeSettingsModel,
  NewsArticle: NewsArticleModel,
  Product: ProductModel,
  Project: ProjectModel,
  TeamMember: TeamMemberModel,
};

export async function GET(req: NextRequest) {
  if (!isAdminRequestAuthenticated(req)) {
    return createAdminApiUnauthorizedResponse();
  }

  try {
    await dbConnect();
    const backup = await createAdminBackup(models);
    return NextResponse.json(backup);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Không thể xuất dữ liệu backup.",
      },
      { status: 500 }
    );
  }
}

function isAdminBackupPayload(value: unknown): value is AdminBackupPayload {
  return typeof value === "object" && value !== null && "data" in value;
}

export async function POST(req: NextRequest) {
  if (!isAdminRequestAuthenticated(req)) {
    return createAdminApiUnauthorizedResponse();
  }

  try {
    const body = (await req.json()) as unknown;

    if (!isAdminBackupPayload(body)) {
      return NextResponse.json(
        { error: "Dữ liệu import không đúng định dạng backup." },
        { status: 400 }
      );
    }

    await dbConnect();
    await importAdminBackup(models, body);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Không thể nhập dữ liệu backup.",
      },
      { status: 500 }
    );
  }
}
