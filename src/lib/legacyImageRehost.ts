import "server-only";

import path from "node:path";
import { createR2ObjectKey, uploadBufferToR2 } from "@/lib/r2";

const LEGACY_WOODLAND_PREFIX = "https://woodland.vn/";

function extensionFromContentType(contentType: string) {
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("gif")) return ".gif";
  if (contentType.includes("svg")) return ".svg";
  if (contentType.includes("bmp")) return ".bmp";
  if (contentType.includes("avif")) return ".avif";
  return ".jpg";
}

function resolveFilenameFromUrl(url: string, contentType: string) {
  try {
    const parsed = new URL(url);
    const pathnameValue = decodeURIComponent(parsed.pathname);
    const basename = path.basename(pathnameValue) || "legacy-image";

    if (path.extname(basename)) {
      return basename;
    }

    return `${basename}${extensionFromContentType(contentType)}`;
  } catch {
    return `legacy-image${extensionFromContentType(contentType)}`;
  }
}

export function isLegacyWoodlandImageUrl(value: string) {
  return value.startsWith(LEGACY_WOODLAND_PREFIX);
}

export async function rehostLegacyWoodlandImage(
  url: string,
  prefix = "legacy-woodland",
  cache = new Map<string, string>()
) {
  if (!isLegacyWoodlandImageUrl(url)) {
    return url;
  }

  if (cache.has(url)) {
    return cache.get(url) as string;
  }

  const response = await fetch(url, {
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error(`Không thể tải ảnh cũ từ ${url} (${response.status}).`);
  }

  const contentType = (response.headers.get("content-type") || "").toLowerCase();

  if (!contentType.startsWith("image/")) {
    throw new Error(`URL ${url} không phải ảnh hợp lệ.`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const body = Buffer.from(arrayBuffer);
  const filename = resolveFilenameFromUrl(url, contentType);
  const key = createR2ObjectKey(filename, prefix);
  const uploadedUrl = await uploadBufferToR2({
    body,
    contentType,
    key,
  });

  cache.set(url, uploadedUrl);

  return uploadedUrl;
}

export async function rehostLegacyWoodlandImagesInHtml(
  html: string,
  prefix = "legacy-rich-text",
  cache = new Map<string, string>()
) {
  if (!html || !html.includes(LEGACY_WOODLAND_PREFIX)) {
    return html;
  }

  const imageUrls = Array.from(
    new Set(
      Array.from(
        html.matchAll(/<img\b[^>]*\bsrc=(["'])(.*?)\1/gi),
        (match) => match[2]
      ).filter((item) => isLegacyWoodlandImageUrl(item))
    )
  );

  if (imageUrls.length === 0) {
    return html;
  }

  let nextHtml = html;

  for (const imageUrl of imageUrls) {
    const uploadedUrl = await rehostLegacyWoodlandImage(imageUrl, prefix, cache);
    nextHtml = nextHtml.split(imageUrl).join(uploadedUrl);
  }

  return nextHtml;
}
