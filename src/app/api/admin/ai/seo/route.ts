import { NextRequest, NextResponse } from "next/server";

import {
  createAdminApiUnauthorizedResponse,
  isAdminRequestAuthenticated,
} from "@/lib/adminAuth";
import { callGroqJson } from "@/lib/groq";

interface AutoSeoBody {
  module?: unknown;
  payload?: unknown;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asObject(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

export async function POST(req: NextRequest) {
  if (!isAdminRequestAuthenticated(req)) {
    return createAdminApiUnauthorizedResponse();
  }

  try {
    const body = (await req.json()) as AutoSeoBody;
    const moduleName = asString(body.module).trim() || "content";
    const payload = asObject(body.payload) ?? {};

    const result = await callGroqJson(
      "Bạn là trợ lý SEO song ngữ cho website ngành gỗ. Luôn trả JSON hợp lệ.",
      `Sinh SEO song ngữ vi/en cho module ${moduleName}. Dữ liệu đầu vào: ${JSON.stringify(
        payload
      )}.
Trả về object có cấu trúc:
{
  "seo": {
    "vi": { "title": "", "description": "", "keywords": [] },
    "en": { "title": "", "description": "", "keywords": [] }
  },
  "excerpt": { "vi": "", "en": "" }
}`
    );

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Không thể tạo SEO tự động.",
      },
      { status: 500 }
    );
  }
}
