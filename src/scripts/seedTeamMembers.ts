import { randomUUID } from "node:crypto";
import path from "node:path";
import * as dotenv from "dotenv";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

dotenv.config({ path: ".env.local" });

type DbConnectFn = typeof import("@/lib/dbConnect").default;
type TeamMemberModel = typeof import("@/models/TeamMember").default;

let dbConnect: DbConnectFn | null = null;
let TeamMember: TeamMemberModel | null = null;

interface LocalizedText {
  en: string;
  vi: string;
}

interface TeamSeedInput {
  email: string;
  isVisible: boolean;
  name: LocalizedText;
  order: number;
  phone: string;
  region: LocalizedText;
  sourceImage: string;
  title: LocalizedText;
  whatsapp: string;
  zalo: string;
}

const TEAM_MEMBERS_TO_SEED: TeamSeedInput[] = [
  {
    email: "lienphuonghl@yahoo.com",
    isVisible: true,
    name: {
      en: "Woodland Customer Care",
      vi: "Chăm sóc khách hàng Woodland",
    },
    order: 1,
    phone: "0908 759 007",
    region: {
      en: "Binh Duong and Southeast Vietnam",
      vi: "Bình Dương và Đông Nam Bộ",
    },
    sourceImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDI2hGXUi0ar6R1YdGBVByYkkyEg61Zf7PtN7NAySiLt5CeVYiXqCqkQLm3ehNaLJWbub4zlD5Xy9mgB7KKhjxGIZnlf0dLGxOhERXH3b7jFMqXY8BGuZ0uUWez76H9NvBK2bWbZQVGLEl1OqUUn_zLs5HP-gBqhnnZkDcWQtXE4eOEp05JUav0COCt3gYBqTmeemmDM9FL6AY3tpRR2mWdTOtq2uHs8Lpu7ezv-1sCH0I2xb5hXJA6L8tIxSBZuPAdOcoFNV3gJ6Cr",
    title: {
      en: "Product consulting, quotations and order support",
      vi: "Tư vấn sản phẩm, báo giá và hỗ trợ đơn hàng",
    },
    whatsapp: "84908759007",
    zalo: "0908759007",
  },
  {
    email: "lienphuonghl@yahoo.com",
    isVisible: true,
    name: {
      en: "Woodland Project Support",
      vi: "Tư vấn dự án Woodland",
    },
    order: 2,
    phone: "0908 759 007",
    region: {
      en: "Southern Vietnam",
      vi: "Miền Nam",
    },
    sourceImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDI2hGXUi0ar6R1YdGBVByYkkyEg61Zf7PtN7NAySiLt5CeVYiXqCqkQLm3ehNaLJWbub4zlD5Xy9mgB7KKhjxGIZnlf0dLGxOhERXH3b7jFMqXY8BGuZ0uUWez76H9NvBK2bWbZQVGLEl1OqUUn_zLs5HP-gBqhnnZkDcWQtXE4eOEp05JUav0COCt3gYBqTmeemmDM9FL6AY3tpRR2mWdTOtq2uHs8Lpu7ezv-1sCH0I2xb5hXJA6L8tIxSBZuPAdOcoFNV3gJ6Cr",
    title: {
      en: "Material consulting for interiors, construction and project orders",
      vi: "Tư vấn vật liệu cho nội thất, xây dựng và đơn hàng dự án",
    },
    whatsapp: "84908759007",
    zalo: "",
  },
  {
    email: "lienphuonghl@yahoo.com",
    isVisible: true,
    name: {
      en: "Woodland Logistics",
      vi: "Giao nhận Woodland",
    },
    order: 3,
    phone: "0979 685 971",
    region: {
      en: "Binh Duong Warehouse",
      vi: "Kho Bình Dương",
    },
    sourceImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCa-XGKrwtgZlDj2laoH2DsjfoXq3XNqZTLcGBvALocxLxmoNmBwz4ee3XkYOq8Wy854wWOdMjsm8TJvZhHNpUp4SoRznwV5kQwV6SAfUytP53EOZjJANxvnFv7jCpDwH6BYgowKgfbKABPgb6MIBoBr2imrvIydPVVfS_gF3ZRITc7-hXjyGg5EXiuDSRadtN_GSeUI87uVCdivb6XfSz2mpGFjxHNSd0BPZ8LWxznjEFJ6h_cYAMxk_BN1Jl6imbuqLoNkyTettEJ",
    title: {
      en: "Warehouse and delivery coordination",
      vi: "Điều phối kho hàng và giao nhận",
    },
    whatsapp: "",
    zalo: "0979685971",
  },
  {
    email: "woodenhousevietnam.vn@gmail.com",
    isVisible: true,
    name: {
      en: "Woodland Online Desk",
      vi: "Woodland Online",
    },
    order: 4,
    phone: "0933 088 585",
    region: {
      en: "Nationwide",
      vi: "Toàn quốc",
    },
    sourceImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBX_A_FkU1yiAYYPdpxLINnFEPmPwNi63SHjtJg3ss6P3RpsS4IgfCcWyuZu7P3lsu9sfZGNp0xZeIQIAzf_F_1iPbXVTG6tHqpfYVm9paP35hrG3YBr3O-uWV9sY2auEw52DRqldixhIPkhlD5uY0vkt4t5zDJEW9lZDvKpdq5X2L0hQShx6OtxuDAchV85xB-idssSkbj-HLkZEkyqN16uVhzLWgBMRLS-coI4LMQ_5yL9dztIGFhHdAFen5kgMmnqaF0rHlnEG8n",
    title: {
      en: "Online inquiries and website support",
      vi: "Tiếp nhận yêu cầu trực tuyến và hỗ trợ website",
    },
    whatsapp: "84933088585",
    zalo: "0933088585",
  },
];

const REMOTE_IMAGE_USER_AGENT =
  "Mozilla/5.0 (compatible; WoodlandTeamSeedBot/1.0; +https://woodland.vn)";
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

function extensionFromContentType(contentType: string) {
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("gif")) return ".gif";
  if (contentType.includes("svg")) return ".svg";
  if (contentType.includes("bmp")) return ".bmp";
  if (contentType.includes("avif")) return ".avif";
  if (contentType.includes("jpeg")) return ".jpg";
  return ".jpg";
}

function buildR2PublicUrl(key: string) {
  const publicDomain = (process.env.R2_PUBLIC_DOMAIN || "").replace(/\/+$/, "");

  if (!publicDomain) {
    throw new Error("Thiếu R2_PUBLIC_DOMAIN để tạo đường dẫn ảnh công khai.");
  }

  return `${publicDomain}/${key}`;
}

function createR2ObjectKey(originalName: string, prefix = "uploads") {
  const extension = path.extname(originalName) || "";
  const baseName =
    sanitizeFilenamePart(path.basename(originalName, extension)) || "asset";
  const normalizedPrefix = sanitizeFilenamePart(prefix).replace(/^-+|-+$/g, "");
  const uniqueId = `${Date.now()}-${randomUUID().slice(0, 8)}`;

  return normalizedPrefix
    ? `${normalizedPrefix}/${baseName}-${uniqueId}${extension.toLowerCase()}`
    : `${baseName}-${uniqueId}${extension.toLowerCase()}`;
}

function resolveFilenameFromUrl(url: string, contentType: string) {
  try {
    const parsed = new URL(url);
    const pathnameValue = decodeURIComponent(parsed.pathname);
    const basename = path.basename(pathnameValue) || "remote-image";

    if (path.extname(basename)) {
      return basename;
    }

    return `${basename}${extensionFromContentType(contentType)}`;
  } catch {
    return `remote-image${extensionFromContentType(contentType)}`;
  }
}

async function uploadBufferToR2(
  body: Buffer,
  contentType: string,
  key: string
) {
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("Thiếu R2_BUCKET_NAME để upload ảnh lên R2.");
  }

  await r2Client.send(
    new PutObjectCommand({
      ACL: "public-read",
      Body: body,
      Bucket: bucketName,
      ContentType: contentType,
      Key: key,
    })
  );

  return buildR2PublicUrl(key);
}

async function rehostRemoteImageToR2(url: string, prefix: string) {
  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return "";
  }

  const response = await fetch(trimmedUrl, {
    headers: {
      "user-agent": REMOTE_IMAGE_USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Không tải được ảnh nguồn: ${trimmedUrl} (${response.status} ${response.statusText})`
    );
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";

  if (!contentType.startsWith("image/")) {
    throw new Error(`URL không phải ảnh hợp lệ: ${trimmedUrl}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const originalName = resolveFilenameFromUrl(trimmedUrl, contentType);
  const key = createR2ObjectKey(originalName, prefix);

  return uploadBufferToR2(buffer, contentType, key);
}

function getMemberLabel(member: TeamSeedInput) {
  return member.name.vi || member.name.en;
}

async function main() {
  const isDryRun = process.argv.includes("--dry-run");

  if (!isDryRun) {
    const [{ default: importedDbConnect }, { default: importedTeamMember }] =
      await Promise.all([import("@/lib/dbConnect"), import("@/models/TeamMember")]);

    dbConnect = importedDbConnect;
    TeamMember = importedTeamMember;

    await dbConnect();
  }

  let createdCount = 0;
  let updatedCount = 0;

  for (const member of TEAM_MEMBERS_TO_SEED) {
    const label = getMemberLabel(member);
    console.log(`[seed:team] Đang xử lý: ${label}`);

    if (isDryRun) {
      console.log(
        `[seed:team] DRY RUN: sẽ upsert ${label} với ảnh nguồn ${member.sourceImage}`
      );
      continue;
    }

    const existing = await TeamMember!.findOne({ "name.vi": member.name.vi }).lean();
    const image = await rehostRemoteImageToR2(member.sourceImage, "team");
    const payload = {
      email: member.email,
      isVisible: member.isVisible,
      name: member.name,
      order: member.order,
      phone: member.phone,
      region: member.region,
      title: member.title,
      whatsapp: member.whatsapp,
      zalo: member.zalo,
    };

    await TeamMember!.findOneAndUpdate(
      { "name.vi": member.name.vi },
      {
        ...payload,
        image,
      },
      {
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
        upsert: true,
      }
    );

    if (existing) {
      updatedCount += 1;
      console.log(`[seed:team] Đã cập nhật: ${label}`);
    } else {
      createdCount += 1;
      console.log(`[seed:team] Đã tạo mới: ${label}`);
    }
  }

  console.log(
    `[seed:team] Hoàn tất. Tạo mới ${createdCount}, cập nhật ${updatedCount}, tổng ${TEAM_MEMBERS_TO_SEED.length} nhân sự.`
  );
}

main().catch((error) => {
  console.error(
    `[seed:team] ${error instanceof Error ? error.message : String(error)}`
  );
  process.exitCode = 1;
});
