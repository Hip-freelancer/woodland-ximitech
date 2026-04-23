import { readFile } from "node:fs/promises";
import path from "node:path";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default async function AppleIcon() {
  const iconPath = path.join(process.cwd(), "public", "logowoodland.png");
  const icon = await readFile(iconPath);

  return new Response(icon, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
