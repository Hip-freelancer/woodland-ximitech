import "server-only";

import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

const HERO_MEDIA_DIRECTORY = path.join(
  process.cwd(),
  "public",
  "uploads",
  "hero-media"
);
const HERO_MEDIA_PUBLIC_PREFIX = "/uploads/hero-media/";

export function isHeroLocalMediaUrl(value: string) {
  return value.startsWith(HERO_MEDIA_PUBLIC_PREFIX);
}

export async function ensureHeroMediaDirectory() {
  await mkdir(HERO_MEDIA_DIRECTORY, { recursive: true });
  return HERO_MEDIA_DIRECTORY;
}

export function getHeroMediaPublicUrl(filename: string) {
  return `${HERO_MEDIA_PUBLIC_PREFIX}${filename}`;
}

export function getHeroMediaAbsolutePath(publicUrl: string) {
  if (!isHeroLocalMediaUrl(publicUrl)) {
    return null;
  }

  const relativePath = publicUrl.replace(HERO_MEDIA_PUBLIC_PREFIX, "");
  return path.join(HERO_MEDIA_DIRECTORY, relativePath);
}

export async function deleteHeroLocalMediaFile(publicUrl: string) {
  const absolutePath = getHeroMediaAbsolutePath(publicUrl);

  if (!absolutePath) {
    return;
  }

  await rm(absolutePath, { force: true });
}
