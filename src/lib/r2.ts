import "server-only";

import { randomUUID } from "node:crypto";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const R2_ENDPOINT = process.env.R2_ACCOUNT_ID
  ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  : "";

const r2Client = new S3Client({
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
  endpoint: R2_ENDPOINT,
  region: "auto",
});

function sanitizeFilenamePart(value: string) {
  return value.replace(/[^a-zA-Z0-9.-]/g, "-").replace(/-+/g, "-").toLowerCase();
}

export function buildR2PublicUrl(key: string) {
  const publicDomain = (process.env.R2_PUBLIC_DOMAIN || "").replace(/\/+$/, "");

  if (!publicDomain) {
    throw new Error("Thiếu R2_PUBLIC_DOMAIN để tạo đường dẫn ảnh công khai.");
  }

  return `${publicDomain}/${key}`;
}

export function createR2ObjectKey(originalName: string, prefix = "uploads") {
  const extension = path.extname(originalName) || "";
  const baseName =
    sanitizeFilenamePart(path.basename(originalName, extension)) || "asset";
  const normalizedPrefix = sanitizeFilenamePart(prefix).replace(/^-+|-+$/g, "");
  const uniqueId = `${Date.now()}-${randomUUID().slice(0, 8)}`;

  return normalizedPrefix
    ? `${normalizedPrefix}/${baseName}-${uniqueId}${extension.toLowerCase()}`
    : `${baseName}-${uniqueId}${extension.toLowerCase()}`;
}

interface UploadBufferToR2Input {
  body: Buffer;
  contentType: string;
  key: string;
}

export async function uploadBufferToR2({
  body,
  contentType,
  key,
}: UploadBufferToR2Input) {
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!bucketName || !R2_ENDPOINT) {
    throw new Error("Thiếu cấu hình Cloudflare R2.");
  }

  await r2Client.send(
    new PutObjectCommand({
      Body: body,
      Bucket: bucketName,
      ContentType: contentType,
      Key: key,
    })
  );

  return buildR2PublicUrl(key);
}
