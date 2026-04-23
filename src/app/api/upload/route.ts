import { NextRequest, NextResponse } from "next/server";
import {
  createAdminApiUnauthorizedResponse,
  isAdminRequestAuthenticated,
} from "@/lib/adminAuth";
import { createR2ObjectKey, uploadBufferToR2 } from "@/lib/r2";

export async function POST(req: NextRequest) {
  if (!isAdminRequestAuthenticated(req)) {
    return createAdminApiUnauthorizedResponse();
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Chưa chọn tệp ảnh." }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique filename
    const publicUrl = await uploadBufferToR2({
      body: buffer,
      contentType: file.type,
      key: createR2ObjectKey(file.name, "admin-images"),
    });

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Không thể tải ảnh lên." },
      { status: 500 }
    );
  }
}
