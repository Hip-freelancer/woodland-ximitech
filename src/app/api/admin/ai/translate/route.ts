import { NextRequest, NextResponse } from "next/server";
import {
  createAdminApiUnauthorizedResponse,
  isAdminRequestAuthenticated,
} from "@/lib/adminAuth";
import { callGroqJson } from "@/lib/groq";
import { normalizeRichTextHtml } from "@/lib/richText";

interface TranslateBody {
  content?: unknown;
  fieldLabel?: unknown;
  preserveHtml?: unknown;
  sourceLanguage?: unknown;
  targetLanguage?: unknown;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asBoolean(value: unknown) {
  return typeof value === "boolean" ? value : false;
}

export async function POST(req: NextRequest) {
  if (!isAdminRequestAuthenticated(req)) {
    return createAdminApiUnauthorizedResponse();
  }

  try {
    const body = (await req.json()) as TranslateBody;
    const content = asString(body.content).trim();
    const fieldLabel = asString(body.fieldLabel).trim() || "nội dung";
    const preserveHtml = asBoolean(body.preserveHtml);
    const sourceLanguage = asString(body.sourceLanguage).trim() || "vi";
    const targetLanguage = asString(body.targetLanguage).trim() || "en";

    if (!content) {
      return NextResponse.json(
        { error: "Thiếu nội dung cần dịch." },
        { status: 400 }
      );
    }

    const systemPrompt = preserveHtml
      ? "Bạn là biên dịch viên Việt - Anh cho website ngành gỗ. Luôn trả JSON hợp lệ. Nếu đầu vào là HTML, phải giữ nguyên cấu trúc HTML, chỉ dịch phần nội dung văn bản."
      : "Bạn là biên dịch viên Việt - Anh cho website ngành gỗ. Luôn trả JSON hợp lệ. Không tự ý thêm bớt thông tin.";

    const userPrompt = `Dịch ${fieldLabel} từ ${sourceLanguage} sang ${targetLanguage}.
Yêu cầu:
- Giữ nguyên số liệu, đơn vị, URL, mã kỹ thuật nếu có.
- Giữ nguyên ý nghĩa và mức độ trang trọng.
- ${preserveHtml ? "Nếu có HTML thì giữ nguyên tag, cấu trúc danh sách, tiêu đề, đoạn văn và chỉ dịch text bên trong." : "Trả về văn bản thuần."}

Nội dung đầu vào:
${content}

Trả về object JSON:
{
  "translation": ""
}`;

    const result = await callGroqJson(systemPrompt, userPrompt);
    const translationValue = asString(result.translation);
    const translation = preserveHtml
      ? normalizeRichTextHtml(translationValue)
      : translationValue.trim();

    if (!translation) {
      throw new Error("Groq không trả về bản dịch hợp lệ.");
    }

    return NextResponse.json({ translation });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Không thể dịch nội dung.",
      },
      { status: 500 }
    );
  }
}
