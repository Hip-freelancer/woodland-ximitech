import { randomUUID } from "node:crypto";
import { writeFile, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { execFile } from "node:child_process";
import { NextRequest, NextResponse } from "next/server";
import {
  createAdminApiUnauthorizedResponse,
  isAdminRequestAuthenticated,
} from "@/lib/adminAuth";
import {
  deleteHeroLocalMediaFile,
  ensureHeroMediaDirectory,
  getHeroMediaPublicUrl,
} from "@/lib/localMedia";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);
const MAX_VIDEO_SIZE_BYTES = 150 * 1024 * 1024;

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
}

export async function POST(req: NextRequest) {
  if (!isAdminRequestAuthenticated(req)) {
    return createAdminApiUnauthorizedResponse();
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const previousUrl = String(formData.get("previousUrl") ?? "").trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Chưa chọn file video." }, { status: 400 });
    }

    if (!file.type.startsWith("video/")) {
      return NextResponse.json(
        { error: "Chỉ chấp nhận file video cho hero." },
        { status: 400 }
      );
    }

    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Video vượt quá giới hạn 150MB trước khi nén." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mediaDirectory = await ensureHeroMediaDirectory();
    const inputExtension = path.extname(file.name || "") || ".mp4";
    const baseName = sanitizeFilename(path.basename(file.name, inputExtension)) || "hero";
    const uniqueId = `${Date.now()}-${randomUUID().slice(0, 8)}`;
    const tempInputPath = path.join(tmpdir(), `${uniqueId}${inputExtension}`);
    const outputFilename = `${baseName}-${uniqueId}.mp4`;
    const outputPath = path.join(mediaDirectory, outputFilename);

    await writeFile(tempInputPath, buffer);

    try {
      await execFileAsync("ffmpeg", [
        "-y",
        "-i",
        tempInputPath,
        "-vf",
        "scale='min(1920,iw)':-2",
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "30",
        "-movflags",
        "+faststart",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "96k",
        outputPath,
      ]);
    } finally {
      await unlink(tempInputPath).catch(() => undefined);
    }

    if (previousUrl) {
      await deleteHeroLocalMediaFile(previousUrl).catch(() => undefined);
    }

    return NextResponse.json({ url: getHeroMediaPublicUrl(outputFilename) });
  } catch (error) {
    console.error("Home hero video upload error:", error);
    return NextResponse.json(
      { error: "Không thể xử lý video hero." },
      { status: 500 }
    );
  }
}
