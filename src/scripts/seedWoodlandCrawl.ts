import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import * as dotenv from "dotenv";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createSlug } from "@/lib/slug";

dotenv.config({ path: ".env.local" });

type DbConnectFn = typeof import("@/lib/dbConnect").default;
type CategoryModel = typeof import("@/models/Category").default;
type NewsArticleModel = typeof import("@/models/NewsArticle").default;
type ProductModel = typeof import("@/models/Product").default;

let dbConnect: DbConnectFn | null = null;
let Category: CategoryModel | null = null;
let NewsArticle: NewsArticleModel | null = null;
let Product: ProductModel | null = null;

type HeadingLevel = "h1" | "h2" | "h3";
type CrawlPageType =
  | "core-pages"
  | "product-catalog-pages"
  | "product-detail-pages"
  | "news-pages"
  | "policy-pages"
  | "operations-pages"
  | "project-gallery-pages"
  | "other-pages";

interface CrawlHeading {
  level: HeadingLevel;
  text: string;
}

interface CrawlRecord {
  slug: string;
  url: string;
  pageType: CrawlPageType | "";
  title: string;
  metaDescription: string;
  headings: CrawlHeading[];
  imageUrls: string[];
  content: string;
}

interface LocalizedText {
  en: string;
  vi: string;
}

interface ProductSpec {
  attribute: LocalizedText;
  specification: LocalizedText;
  tolerance: string;
  standard: string;
}

interface ProductSeedDocument {
  name: LocalizedText;
  series: string;
  slug: string;
  description: LocalizedText;
  grade: LocalizedText;
  category: string;
  thickness: number[];
  material: LocalizedText;
  bonding: LocalizedText;
  dimensions: string[];
  image: string;
  galleryImages: string[];
  certifications: string[];
  availability: LocalizedText;
  specifications: ProductSpec[];
  applications: [];
  featured: boolean;
  isVisible: boolean;
  priority: number;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  imageCandidates?: string[];
}

interface NewsSeedDocument {
  title: LocalizedText;
  content: LocalizedText;
  excerpt: LocalizedText;
  image: string;
  author: string;
  publishDate: Date;
  slug: string;
  category: string;
  tags: string[];
  isVisible: boolean;
  priority: number;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  imageCandidates?: string[];
}

interface CategorySeedDocument {
  contentType: "product" | "news";
  name: LocalizedText;
  slug: string;
  image: string;
  isVisible: boolean;
  priority: number;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  imageCandidates?: string[];
}

const SOURCE_PATH = path.resolve("docs/woodland-old-site-context.md");
const DEFAULT_NEWS_CATEGORY_SLUG = "tin-tuc";
const FEATURED_PRODUCT_KEYWORDS = [
  "plywood melamine nhập khẩu",
  "plywood marine tiêu chuẩn carb p2",
  "plywood poplar 100% carb p2",
  "plywood full birch nhập khẩu",
  "plywood polownia flexible",
];
const NOISY_TEXT_PATTERNS = [
  /^công ty tnhh woodland$/i,
  /^0908\s*759\s*007$/i,
  /^0979\s*685\s*971$/i,
  /^https?:\/\/woodland\.vn\/?$/i,
  /^năng lực woodland$/i,
  /^trang chủ$/i,
  /^sản phẩm$/i,
  /^tin tức$/i,
  /^liên hệ$/i,
  /^hình ảnh kho hàng$/i,
  /^dự án$/i,
  /^email:/i,
  /^địa chỉ:/i,
  /^website:/i,
  /^điện thoại:/i,
  /^fanpage facebook$/i,
  /^facebook$/i,
  /^chính sách$/i,
  /^thông tin liên hệ$/i,
  /^copyright/i,
  /^online:/i,
  /^ngày:/i,
  /^tuần:/i,
  /^tháng:/i,
  /^tổng:/i,
];

const PRODUCT_CATEGORY_FALLBACKS: Array<[RegExp, string]> = [
  [/(melamine|wl\d{3}|wl\d{3}[a-z-]*)/i, "Plywood Melamine"],
  [/(birch|okoume|okume|poplar|marine|import|nhập khẩu|flexible|uốn cong)/i, "Plywood Nhập Khẩu"],
  [/(cao su|finger)/i, "Gỗ Cao Su Ghép Finger"],
  [/(veneer|walnut|căm xe)/i, "Plywood Phủ Veneer"],
  [/(mdf)/i, "Ván MDF"],
  [/(việt nam|viet nam)/i, "Plywood Việt Nam"],
];
const REMOTE_IMAGE_USER_AGENT =
  "Mozilla/5.0 (compatible; WoodlandSeedBot/1.0; +https://woodland.vn)";
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

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeForMatch(value: string) {
  return normalizeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function createLocalizedText(value: string, fallbackEn?: string): LocalizedText {
  const normalizedValue = normalizeText(value);
  const englishValue = normalizeText(fallbackEn || normalizedValue);

  return {
    en: englishValue || normalizedValue || "Updating",
    vi: normalizedValue || englishValue || "Đang cập nhật",
  };
}

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

async function rehostRemoteImageToR2(
  url: string,
  prefix = "remote-seed",
  cache = new Map<string, string>()
) {
  const normalizedUrl = url.trim();

  if (!/^https?:\/\//i.test(normalizedUrl)) {
    return normalizedUrl;
  }

  if (cache.has(normalizedUrl)) {
    return cache.get(normalizedUrl) as string;
  }

  const candidateUrls = Array.from(
    new Set([
      normalizedUrl,
      canonicalizeImageUrl(normalizedUrl),
      removeWordPressSizeSuffix(canonicalizeImageUrl(normalizedUrl)),
      removeWordPressSizeSuffix(normalizedUrl),
    ])
  );

  let lastErrorMessage = "";

  for (const candidateUrl of candidateUrls) {
    const response = await fetch(candidateUrl, {
      headers: {
        referer: "https://woodland.vn/",
        "user-agent": REMOTE_IMAGE_USER_AGENT,
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      lastErrorMessage = `Không thể tải ảnh từ ${candidateUrl} (${response.status}).`;
      continue;
    }

    const contentType = (response.headers.get("content-type") || "").toLowerCase();

    if (!contentType.startsWith("image/")) {
      lastErrorMessage = `URL ${candidateUrl} không phải ảnh hợp lệ.`;
      continue;
    }

    const body = Buffer.from(await response.arrayBuffer());
    const key = createR2ObjectKey(
      resolveFilenameFromUrl(candidateUrl, contentType),
      prefix
    );
    const uploadedUrl = await uploadBufferToR2(body, contentType, key);

    cache.set(normalizedUrl, uploadedUrl);
    cache.set(candidateUrl, uploadedUrl);

    return uploadedUrl;
  }

  throw new Error(
    lastErrorMessage ||
      `Không thể tải ảnh từ ${normalizedUrl}. Đã thử ${candidateUrls.length} biến thể URL.`
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isDateLine(value: string) {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(value) || /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function parseDateLine(value: string) {
  const trimmed = value.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(`${trimmed}T00:00:00.000Z`);
  }

  const match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    return null;
  }

  const [, day, month, year] = match;
  return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
}

function splitLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => normalizeText(line))
    .filter(Boolean);
}

function parseCrawlMarkdown(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const records: CrawlRecord[] = [];
  let currentRecord: CrawlRecord | null = null;
  let mode: "none" | "headings" | "images" | "content" = "none";

  const pushRecord = () => {
    if (!currentRecord) {
      return;
    }

    currentRecord.content = currentRecord.content.trim();
    records.push(currentRecord);
    currentRecord = null;
    mode = "none";
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, "");

    if (line.startsWith("### ")) {
      pushRecord();
      currentRecord = {
        slug: line.slice(4).trim(),
        url: "",
        pageType: "",
        title: "",
        metaDescription: "",
        headings: [],
        imageUrls: [],
        content: "",
      };
      continue;
    }

    if (!currentRecord) {
      continue;
    }

    if (mode === "content") {
      if (line === "```") {
        mode = "none";
      } else {
        currentRecord.content += `${line}\n`;
      }
      continue;
    }

    if (line.startsWith("- URL: ")) {
      currentRecord.url = line.slice(7).trim();
      mode = "none";
      continue;
    }

    if (line.startsWith("- Page type: ")) {
      currentRecord.pageType = line.slice(13).trim() as CrawlPageType;
      mode = "none";
      continue;
    }

    if (line.startsWith("- Title: ")) {
      currentRecord.title = line.slice(9).trim();
      mode = "none";
      continue;
    }

    if (line.startsWith("- Meta: ")) {
      currentRecord.metaDescription = line.slice(8).trim();
      mode = "none";
      continue;
    }

    if (line === "- Headings:") {
      mode = "headings";
      continue;
    }

    if (line.startsWith("- Image URLs")) {
      mode = "images";
      continue;
    }

    if (line === "- Extracted content:") {
      mode = "none";
      continue;
    }

    if (line === "```text") {
      mode = "content";
      continue;
    }

    if (mode === "headings" && line.startsWith("  - ")) {
      const match = line.slice(4).match(/^(H[123]):\s*(.+)$/);
      if (match) {
        currentRecord.headings.push({
          level: match[1].toLowerCase() as HeadingLevel,
          text: normalizeText(match[2]),
        });
      }
      continue;
    }

    if (mode === "images" && line.startsWith("  - ")) {
      currentRecord.imageUrls.push(line.slice(4).trim());
      continue;
    }

    mode = "none";
  }

  pushRecord();
  return records;
}

function canonicalizeImageUrl(url: string) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.search = "";
    parsed.pathname = parsed.pathname
      .replace(/\/thumbs\/\d+x\d+x1\//i, "/")
      .replace(/\/watermarks\/\d+x\d+x1\//i, "/");
    return parsed.toString();
  } catch {
    return url;
  }
}

function removeWordPressSizeSuffix(url: string) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.search = "";
    parsed.pathname = parsed.pathname.replace(
      /-\d+x\d+(?:-\d+)?(?=\.[a-z0-9]+$)/i,
      ""
    );
    return parsed.toString();
  } catch {
    return url;
  }
}

function imageScore(url: string) {
  const normalized = url.toLowerCase();

  if (normalized.includes("/upload/filemanager/files/")) return 90;
  if (normalized.includes("/upload/product/")) return 84;
  if (normalized.includes("/upload/news/")) return 82;
  if (normalized.includes("/thumbs/1080x1080x1/")) return 76;
  if (normalized.includes("/thumbs/940x788x1/")) return 74;
  if (normalized.includes("/thumbs/720x760x1/")) return 72;
  if (normalized.includes("/thumbs/1000x1000x1/")) return 72;
  if (normalized.includes("/wp-content/uploads/")) return 46;
  if (normalized.includes("/thumbs/390x300x1/")) return 30;
  if (normalized.includes("/thumbs/100x75x1/")) return 18;
  if (normalized.includes("/watermarks/")) return 24;
  return 50;
}

function isLikelyContentImage(url: string, type: "product" | "news" | "category") {
  if (!/^https?:\/\//i.test(url)) {
    return false;
  }

  const normalized = url.toLowerCase();

  if (
    normalized.includes("facebook.com/tr") ||
    normalized.includes("/upload/photo/logowoodland") ||
    normalized.includes("/upload/photo/2023facebookicon") ||
    normalized.includes("/assets/images/photo/icon-") ||
    normalized.includes("/upload/photo/f3-") ||
    normalized.includes("/upload/photo/f4-") ||
    normalized.includes("/upload/photo/f5-") ||
    normalized.includes("/upload/photo/f6-")
  ) {
    return false;
  }

  if (type === "news") {
    return (
      normalized.includes("/upload/news/") ||
      normalized.includes("/upload/filemanager/files/") ||
      normalized.includes("/wp-content/uploads/") ||
      normalized.includes("/thumbs/1080x1080x1/upload/news/") ||
      normalized.includes("/thumbs/1920x") ||
      normalized.includes("/thumbs/940x788x1/upload/news/")
    );
  }

  if (type === "category") {
    return (
      normalized.includes("/upload/product/") ||
      normalized.includes("/upload/news/") ||
      normalized.includes("/upload/filemanager/files/") ||
      normalized.includes("/wp-content/uploads/")
    );
  }

  return (
    normalized.includes("/upload/product/") ||
    normalized.includes("/upload/filemanager/files/") ||
    normalized.includes("/wp-content/uploads/") ||
    normalized.includes("/thumbs/") ||
    normalized.includes("/watermarks/")
  );
}

function pickImageSet(
  urls: string[],
  type: "product" | "news" | "category",
  limit = 8
) {
  const scored = urls
    .filter((url) => isLikelyContentImage(url, type))
    .sort((left, right) => imageScore(right) - imageScore(left));

  const uniqueByCanonical = new Map<string, string>();

  for (const url of scored) {
    const key = canonicalizeImageUrl(url);
    if (!uniqueByCanonical.has(key)) {
      uniqueByCanonical.set(key, url);
    }
  }

  return Array.from(uniqueByCanonical.values()).slice(0, limit);
}

function buildDateMap(records: CrawlRecord[]) {
  const dateMap = new Map<string, Date>();

  for (const record of records) {
    const lines = splitLines(record.content);

    for (let index = 0; index < lines.length - 1; index += 1) {
      const line = lines[index];
      const nextLine = lines[index + 1];

      if (!line || !nextLine || isDateLine(line) || !isDateLine(nextLine)) {
        continue;
      }

      const parsedDate = parseDateLine(nextLine);
      if (!parsedDate) {
        continue;
      }

      const key = normalizeForMatch(line);
      if (key && !dateMap.has(key)) {
        dateMap.set(key, parsedDate);
      }
    }
  }

  return dateMap;
}

function parseBreadcrumbAfterRoot(lines: string[], rootLabel: string) {
  const normalizedRoot = normalizeForMatch(rootLabel);

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (normalizeForMatch(lines[index]) !== "trang chu") {
      continue;
    }

    const nextLine = lines[index + 1];
    if (!nextLine || normalizeForMatch(nextLine) !== normalizedRoot) {
      continue;
    }

    return lines
      .slice(index + 2)
      .filter((line) => !NOISY_TEXT_PATTERNS.some((pattern) => pattern.test(line)));
  }

  return [];
}

function deriveProductCategoryName(record: CrawlRecord, productName: string) {
  const lines = splitLines(record.content);
  const breadcrumbTail = parseBreadcrumbAfterRoot(lines, "Sản phẩm");
  const productNameKey = normalizeForMatch(productName);

  for (const line of breadcrumbTail) {
    const normalizedLine = normalizeForMatch(line);
    if (!normalizedLine || normalizedLine === productNameKey) {
      continue;
    }

    if (normalizedLine === "gia:" || normalizedLine === "lien he") {
      break;
    }

    return line;
  }

  const productSearchBlob = normalizeForMatch(
    `${record.title} ${record.headings.map((item) => item.text).join(" ")} ${record.content}`
  );

  for (const [pattern, label] of PRODUCT_CATEGORY_FALLBACKS) {
    if (pattern.test(productSearchBlob)) {
      return label;
    }
  }

  return "Plywood Nhập Khẩu";
}

function shouldSkipBodyLine(line: string, title: string) {
  const normalizedLine = normalizeForMatch(line);
  const normalizedTitle = normalizeForMatch(title);

  if (!normalizedLine) {
    return true;
  }

  if (normalizedLine === normalizedTitle) {
    return true;
  }

  if (
    NOISY_TEXT_PATTERNS.some((pattern) => pattern.test(line)) ||
    normalizedLine === "gia:" ||
    normalizedLine === "lien he" ||
    normalizedLine === "chi tiet san pham" ||
    normalizedLine === "binh luan" ||
    normalizedLine === "hinh anh" ||
    normalizedLine === "muc luc"
  ) {
    return true;
  }

  return false;
}

function extractMainBodyLines(record: CrawlRecord, type: "product" | "news", title: string) {
  const lines = splitLines(record.content);
  const startMarker = type === "news" ? "Mục lục" : "Liên hệ";
  let startIndex = lines.findIndex((line) => line === startMarker);

  if (startIndex < 0) {
    const normalizedTitle = normalizeForMatch(title);
    const lastTitleIndex = lines.findLastIndex(
      (line) => normalizeForMatch(line) === normalizedTitle
    );
    startIndex = lastTitleIndex >= 0 ? lastTitleIndex : 0;
  }

  const rawBody = lines.slice(startIndex + 1);
  const bodyLines: string[] = [];

  for (const line of rawBody) {
    if (
      /^thong tin lien he$/i.test(normalizeForMatch(line)) ||
      /^san pham tuong tu$/i.test(normalizeForMatch(line)) ||
      /^bai viet lien quan$/i.test(normalizeForMatch(line)) ||
      /^chinh sach$/i.test(normalizeForMatch(line)) ||
      /^fanpage facebook$/i.test(normalizeForMatch(line)) ||
      /^copyright/i.test(line)
    ) {
      break;
    }

    if (shouldSkipBodyLine(line, title)) {
      continue;
    }

    bodyLines.push(line);
  }

  return bodyLines;
}

function buildHeadingMap(record: CrawlRecord) {
  return new Map(
    record.headings.map((heading) => [normalizeForMatch(heading.text), heading.level])
  );
}

function isBulletLine(line: string) {
  return /^[-*•]/.test(line) || /^\d+[.)]\s+/.test(line);
}

function isShortLabelBeforeColon(line: string) {
  const colonIndex = line.indexOf(":");
  if (colonIndex <= 0) {
    return false;
  }

  return colonIndex <= 42;
}

function buildHtmlFromLines(lines: string[], record: CrawlRecord) {
  const headingMap = buildHeadingMap(record);
  const parts: string[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length === 0) {
      return;
    }

    parts.push(
      `<ul>${listBuffer
        .map((item) => `<li>${escapeHtml(item.replace(/^[-*•]\s*/, "").replace(/^\d+[.)]\s+/, ""))}</li>`)
        .join("")}</ul>`
    );
    listBuffer = [];
  };

  for (const line of lines) {
    const headingLevel = headingMap.get(normalizeForMatch(line));

    if (headingLevel) {
      flushList();
      parts.push(`<${headingLevel}>${escapeHtml(line)}</${headingLevel}>`);
      continue;
    }

    if (isBulletLine(line)) {
      listBuffer.push(line);
      continue;
    }

    flushList();

    if (isShortLabelBeforeColon(line)) {
      const colonIndex = line.indexOf(":");
      const label = line.slice(0, colonIndex + 1);
      const value = line.slice(colonIndex + 1).trim();
      parts.push(
        `<p><strong>${escapeHtml(label)}</strong>${value ? ` ${escapeHtml(value)}` : ""}</p>`
      );
      continue;
    }

    parts.push(`<p>${escapeHtml(line)}</p>`);
  }

  flushList();
  return parts.join("");
}

function extractSummaryParagraph(lines: string[]) {
  return lines.find((line) => line.length > 40 && !isBulletLine(line)) || "";
}

function parseThickness(lines: string[]) {
  const values = new Set<number>();

  for (const line of lines) {
    if (!/độ dày|thickness/i.test(line)) {
      continue;
    }

    for (const match of line.matchAll(/(\d+(?:[.,]\d+)?)\s*mm/gi)) {
      values.add(Number(match[1].replace(",", ".")));
    }
  }

  return Array.from(values).filter(Number.isFinite).sort((left, right) => left - right);
}

function parseDimensions(lines: string[]) {
  const values = new Set<string>();

  for (const line of lines) {
    if (!/kích thước|quy cách|dimensions?/i.test(line)) {
      continue;
    }

    for (const match of line.matchAll(/\b\d{2,4}\s*[x×]\s*\d{2,4}(?:\s*[x×]\s*\d{1,4})?\s*(?:mm|cm)?\b/gi)) {
      values.add(match[0].replace(/\s+/g, " ").trim());
    }
  }

  return Array.from(values);
}

function parseSpecifications(lines: string[]) {
  const specs: ProductSpec[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex <= 0 || colonIndex > 48) {
      continue;
    }

    const label = normalizeText(line.slice(0, colonIndex));
    const value = normalizeText(line.slice(colonIndex + 1));

    if (!label || !value) {
      continue;
    }

    const key = `${normalizeForMatch(label)}::${normalizeForMatch(value)}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    specs.push({
      attribute: createLocalizedText(label),
      specification: createLocalizedText(value),
      tolerance: "",
      standard: "",
    });
  }

  return specs;
}

function parseMaterial(lines: string[]) {
  const line = lines.find((item) => /lõi|nguyên liệu|mặt:|cấu tạo/i.test(item) && item.includes(":"));
  if (!line) {
    return createLocalizedText("");
  }

  return createLocalizedText(line.slice(line.indexOf(":") + 1).trim());
}

function parseBonding(lines: string[]) {
  const line = lines.find((item) => /keo|bond/i.test(item) && item.includes(":"));
  if (!line) {
    return createLocalizedText("");
  }

  return createLocalizedText(line.slice(line.indexOf(":") + 1).trim());
}

function parseGrade(lines: string[], categoryName: string) {
  const gradeLine = lines.find((item) =>
    /(mặt|grade|phẩm cấp|surface)/i.test(item) && item.includes(":")
  );

  if (gradeLine) {
    return createLocalizedText(gradeLine.slice(gradeLine.indexOf(":") + 1).trim());
  }

  return createLocalizedText(categoryName, categoryName);
}

function parseCertifications(text: string) {
  const patterns = [
    /CARB P2/gi,
    /FSC/gi,
    /TSCA EPA(?: TITLE VI)?/gi,
    /EPA TSCA(?: TITLE VI)?/gi,
    /QUATEST ?3/gi,
    /E0/gi,
    /E1/gi,
    /E2/gi,
    /MUF/gi,
    /MR/gi,
  ];

  const values = new Set<string>();

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      values.add(match[0].toUpperCase());
    }
  }

  return Array.from(values);
}

function buildKeywords(...values: string[]) {
  return Array.from(
    new Set(
      values
        .flatMap((value) => normalizeText(value).split(/[,|/]+/))
        .map((value) => value.trim())
        .filter(Boolean)
    )
  ).join(", ");
}

function extractProductCategories(records: CrawlRecord[]) {
  const categories = new Map<string, CategorySeedDocument>();
  let priority = 0;

  for (const record of records) {
    if (record.slug === "san-pham") {
      continue;
    }

    const breadcrumbLines = parseBreadcrumbAfterRoot(splitLines(record.content), "Sản phẩm");
    const categoryName = breadcrumbLines[0] || record.headings.find((item) => item.level === "h1")?.text || record.title;
    const categorySlug = createSlug(categoryName);

    if (!categorySlug || categories.has(categorySlug)) {
      continue;
    }

    categories.set(categorySlug, {
      contentType: "product",
      name: createLocalizedText(categoryName),
      slug: categorySlug,
      image: pickImageSet(record.imageUrls, "category", 1)[0] || "",
      isVisible: true,
      priority,
      seo: {
        title: categoryName,
        description: record.metaDescription || categoryName,
        keywords: buildKeywords(categoryName),
      },
      imageCandidates: pickImageSet(record.imageUrls, "category", 4),
    });
    priority += 1;
  }

  if (!categories.size) {
    for (const fallbackName of [
      "Plywood Nhập Khẩu",
      "Plywood Melamine",
      "Plywood Việt Nam",
      "Gỗ Cao Su Ghép Finger",
      "Plywood Phủ Veneer",
      "Ván MDF",
    ]) {
      const slug = createSlug(fallbackName);
      categories.set(slug, {
        contentType: "product",
        name: createLocalizedText(fallbackName),
        slug,
        image: "",
        isVisible: true,
        priority: categories.size,
        seo: {
          title: fallbackName,
          description: fallbackName,
          keywords: fallbackName,
        },
        imageCandidates: [],
      });
    }
  }

  return categories;
}

function buildProductSeedDocuments(
  records: CrawlRecord[],
  productCategories: Map<string, CategorySeedDocument>
) {
  return records.map((record, index) => {
    const productName =
      record.headings.find((heading) => heading.level === "h1")?.text || record.title || record.slug;
    const categoryName = deriveProductCategoryName(record, productName);
    const categorySlug = createSlug(categoryName);

    if (!productCategories.has(categorySlug)) {
      productCategories.set(categorySlug, {
        contentType: "product",
        name: createLocalizedText(categoryName),
        slug: categorySlug,
        image: "",
        isVisible: true,
        priority: productCategories.size,
        seo: {
          title: categoryName,
          description: categoryName,
          keywords: buildKeywords(categoryName),
        },
      });
    }

    const bodyLines = extractMainBodyLines(record, "product", productName);
    const bodyText = bodyLines.join("\n");
    const summary = extractSummaryParagraph(bodyLines) || record.metaDescription || productName;
    const filteredImages = pickImageSet(record.imageUrls, "product", 10);
    const image = filteredImages[0] || "";
    const galleryImages = filteredImages.length > 1 ? filteredImages : image ? [image] : [];
    const featured = FEATURED_PRODUCT_KEYWORDS.some((keyword) =>
      normalizeForMatch(productName).includes(normalizeForMatch(keyword))
    );

    return {
      name: createLocalizedText(productName),
      series: categoryName,
      slug: record.slug || createSlug(productName),
      description: createLocalizedText(buildHtmlFromLines(bodyLines, record)),
      grade: parseGrade(bodyLines, categoryName),
      category: categorySlug,
      thickness: parseThickness(bodyLines),
      material: parseMaterial(bodyLines),
      bonding: parseBonding(bodyLines),
      dimensions: parseDimensions(bodyLines),
      image,
      galleryImages,
      certifications: parseCertifications(bodyText),
      availability: {
        en: "In Stock",
        vi: "Còn hàng",
      },
      specifications: parseSpecifications(bodyLines),
      applications: [],
      featured,
      isVisible: true,
      priority: index,
      seo: {
        title: productName,
        description: record.metaDescription || summary,
        keywords: buildKeywords(productName, categoryName, record.metaDescription),
      },
      imageCandidates: filteredImages,
    } satisfies ProductSeedDocument;
  });
}

function buildNewsSeedDocuments(records: CrawlRecord[], dateMap: Map<string, Date>) {
  return records.map((record, index) => {
    const title =
      record.headings.find((heading) => heading.level === "h1")?.text || record.title || record.slug;
    const bodyLines = extractMainBodyLines(record, "news", title);
    const excerpt =
      extractSummaryParagraph(bodyLines) || record.metaDescription || title;
    const dateCandidates = [
      title,
      record.title,
      ...record.headings.map((heading) => heading.text),
    ].map((value) => normalizeForMatch(value));
    const publishDate =
      dateCandidates
        .map((candidate) => dateMap.get(candidate))
        .find((value): value is Date => value instanceof Date) ||
      new Date(Date.UTC(2025, 0, 1 + index));
    const filteredImages = pickImageSet(record.imageUrls, "news", 1);
    const imageCandidates = pickImageSet(record.imageUrls, "news", 4);

    return {
      title: createLocalizedText(title),
      content: createLocalizedText(buildHtmlFromLines(bodyLines, record)),
      excerpt: createLocalizedText(excerpt),
      image: filteredImages[0] || imageCandidates[0] || "",
      author: "Woodland",
      publishDate,
      slug: record.slug || createSlug(title),
      category: DEFAULT_NEWS_CATEGORY_SLUG,
      tags: Array.from(
        new Set(
          record.headings
            .filter((heading) => heading.level === "h2")
            .slice(0, 5)
            .map((heading) => heading.text)
        )
      ),
      isVisible: true,
      priority: index,
      seo: {
        title,
        description: record.metaDescription || excerpt,
        keywords: buildKeywords(title, record.metaDescription, ...record.headings.map((item) => item.text)),
      },
      imageCandidates,
    } satisfies NewsSeedDocument;
  });
}

async function rehostFirstAvailableImage(
  candidateUrls: string[],
  prefix: string,
  cache: Map<string, string>,
  required = false
) {
  let lastError: Error | null = null;

  for (const candidateUrl of candidateUrls) {
    if (!candidateUrl) {
      continue;
    }

    try {
      return await rehostRemoteImageToR2(candidateUrl, prefix, cache);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`[seed:woodland-crawl] Bỏ qua ảnh lỗi: ${candidateUrl}`);
    }
  }

  if (required && lastError) {
    throw lastError;
  }

  return "";
}

async function rehostCategoryDocuments(
  categories: CategorySeedDocument[],
  cache: Map<string, string>
) {
  return Promise.all(
    categories.map(async (category) => {
      const { imageCandidates, ...rest } = category;

      return {
        ...rest,
        image: await rehostFirstAvailableImage(
          imageCandidates && imageCandidates.length > 0 ? imageCandidates : [category.image],
          `seed-categories-${category.contentType}`,
          cache
        ),
      };
    })
  );
}

async function rehostProductDocuments(
  products: ProductSeedDocument[],
  cache: Map<string, string>
) {
  return Promise.all(
    products.map(async (product) => {
      const { imageCandidates, ...rest } = product;
      const rehostedGallery = (
        await Promise.all(
          product.galleryImages.map((imageUrl) =>
            rehostFirstAvailableImage([imageUrl], "seed-products-gallery", cache)
          )
        )
      ).filter(Boolean);
      const image = await rehostFirstAvailableImage(
        imageCandidates && imageCandidates.length > 0 ? imageCandidates : [product.image],
        "seed-products-cover",
        cache,
        true
      );

      return {
        ...rest,
        image: image || rehostedGallery[0] || "",
        galleryImages:
          rehostedGallery.length > 0
            ? Array.from(new Set([image || rehostedGallery[0], ...rehostedGallery].filter(Boolean)))
            : image
              ? [image]
              : [],
      };
    })
  );
}

async function rehostNewsDocuments(
  articles: NewsSeedDocument[],
  cache: Map<string, string>
) {
  return Promise.all(
    articles.map(async (article) => {
      const { imageCandidates, ...rest } = article;

      return {
        ...rest,
        image: await rehostFirstAvailableImage(
          imageCandidates && imageCandidates.length > 0 ? imageCandidates : [article.image],
          "seed-news-cover",
          cache,
          true
        ),
      };
    })
  );
}

function ensureRequiredSeedFields(products: ProductSeedDocument[], news: NewsSeedDocument[]) {
  const productMissingImage = products.filter((product) => !product.image);
  if (productMissingImage.length > 0) {
    throw new Error(
      `Có ${productMissingImage.length} sản phẩm không tìm được ảnh cover: ${productMissingImage
        .slice(0, 5)
        .map((item) => item.slug)
        .join(", ")}`
    );
  }

  const newsMissingImage = news.filter((article) => !article.image);
  if (newsMissingImage.length > 0) {
    throw new Error(
      `Có ${newsMissingImage.length} bài viết không tìm được ảnh cover: ${newsMissingImage
        .slice(0, 5)
        .map((item) => item.slug)
        .join(", ")}`
    );
  }
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const markdown = await fs.readFile(SOURCE_PATH, "utf8");
  const records = parseCrawlMarkdown(markdown);
  const dateMap = buildDateMap(records);

  const productCatalogRecords = records.filter(
    (record) => record.pageType === "product-catalog-pages"
  );
  const productDetailRecords = records.filter(
    (record) => record.pageType === "product-detail-pages"
  );
  const newsRecords = records.filter((record) => record.pageType === "news-pages");

  const productCategoryMap = extractProductCategories(productCatalogRecords);
  const productDocuments = buildProductSeedDocuments(
    productDetailRecords,
    productCategoryMap
  );
  const newsDocuments = buildNewsSeedDocuments(newsRecords, dateMap);
  const categoryDocuments: CategorySeedDocument[] = [
    ...Array.from(productCategoryMap.values()),
    {
      contentType: "news",
      name: {
        en: "News",
        vi: "Tin tức",
      },
      slug: DEFAULT_NEWS_CATEGORY_SLUG,
      image: pickImageSet(
        newsRecords.flatMap((record) => record.imageUrls),
        "category",
        1
      )[0] || "",
      isVisible: true,
      priority: 0,
      seo: {
        title: "Tin tức",
        description: "Tin tức và kiến thức gỗ công nghiệp Woodland",
        keywords: "Tin tức, Woodland, Plywood",
      },
      imageCandidates: pickImageSet(
        newsRecords.flatMap((record) => record.imageUrls),
        "category",
        4
      ),
    },
  ];

  ensureRequiredSeedFields(productDocuments, newsDocuments);

  console.log(
    `[seed:woodland-crawl] Parsed ${records.length} records -> ${categoryDocuments.length} categories, ${productDocuments.length} products, ${newsDocuments.length} news articles.`
  );

  if (dryRun) {
    console.log("[seed:woodland-crawl] Dry run hoàn tất, chưa ghi DB và chưa upload ảnh lên R2.");
    return;
  }

  const [
    dbConnectModule,
    categoryModule,
    newsArticleModule,
    productModule,
  ] = await Promise.all([
    import("@/lib/dbConnect"),
    import("@/models/Category"),
    import("@/models/NewsArticle"),
    import("@/models/Product"),
  ]);

  dbConnect = dbConnectModule.default;
  Category = categoryModule.default;
  NewsArticle = newsArticleModule.default;
  Product = productModule.default;

  const imageCache = new Map<string, string>();
  console.log("[seed:woodland-crawl] Đang upload ảnh remote lên R2...");

  const [seedCategories, seedProducts, seedNews] = await Promise.all([
    rehostCategoryDocuments(categoryDocuments, imageCache),
    rehostProductDocuments(productDocuments, imageCache),
    rehostNewsDocuments(newsDocuments, imageCache),
  ]);

  console.log(
    `[seed:woodland-crawl] Đã rehost ${imageCache.size} ảnh lên R2, bắt đầu ghi MongoDB...`
  );

  if (!dbConnect || !Category || !Product || !NewsArticle) {
    throw new Error("Các model seed chưa được khởi tạo.");
  }

  await dbConnect();

  await Promise.all([
    Category.deleteMany({ contentType: { $in: ["product", "news"] } }),
    Product.deleteMany({}),
    NewsArticle.deleteMany({}),
  ]);

  await Category.insertMany(seedCategories, { ordered: false });
  await Product.insertMany(seedProducts, { ordered: false });
  await NewsArticle.insertMany(seedNews, { ordered: false });

  console.log(
    `[seed:woodland-crawl] Hoàn tất: ${seedCategories.length} categories, ${seedProducts.length} products, ${seedNews.length} news articles.`
  );
}

main().catch((error) => {
  console.error("[seed:woodland-crawl] Lỗi:", error);
  process.exitCode = 1;
});
