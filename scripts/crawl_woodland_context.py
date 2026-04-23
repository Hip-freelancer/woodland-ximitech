#!/usr/bin/env python3

from __future__ import annotations

import html
import re
import sys
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from dataclasses import field
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable
from urllib.parse import urljoin
from urllib.parse import urlparse
from urllib.request import Request, urlopen

SITEMAP_URL = "https://woodland.vn/sitemap.xml"
OUTPUT_PATH = Path("docs/woodland-old-site-context.md")
USER_AGENT = "Mozilla/5.0 (compatible; WoodlandContextCrawler/1.0)"
TIMEOUT_SECONDS = 30
IMAGE_EXTENSIONS = (
    ".avif",
    ".gif",
    ".jpeg",
    ".jpg",
    ".png",
    ".svg",
    ".webp",
)
CORE_SLUGS = {
    "home",
    "gioi-thieu",
    "lien-he",
}
PROJECT_AND_MEDIA_SLUGS = {
    "du-an",
    "hinh-anh",
}
POLICY_SLUGS = {
    "huong-dan-mua-hang",
    "bao-mat-thong-tin-khach-hang",
    "phuong-phuc-thanh-toan",
    "cach-thuc-van-chuyen",
}
OPERATIONS_SLUGS = {
    "nang-luc-hoat-dong",
    "quy-mo-va-kha-nang-cung-ung",
    "san-pham-da-dang",
    "giao-hang-toan-quoc",
    "kho-xuong-hien-dai",
    "doi-ngu-nhan-vien-tan-tam",
    "cam-ket-chat-luong",
}
PRODUCT_CATALOG_SLUGS = {
    "san-pham",
    "plywood-nhap-khau",
    "plywood-melamine-carb-p2",
    "plywood-viet-nam",
    "plywood-phu-veneer",
    "van-mdf",
    "go-ghep",
}
GROUP_TITLES = {
    "core-pages": "Core Pages",
    "product-catalog-pages": "Product Catalog Pages",
    "product-detail-pages": "Product Detail Pages",
    "news-pages": "News Pages",
    "policy-pages": "Policy Pages",
    "operations-pages": "Operations Pages",
    "project-gallery-pages": "Project And Gallery Pages",
    "other-pages": "Other Pages",
}


def fetch_text(url: str) -> str:
    request = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=TIMEOUT_SECONDS) as response:
        charset = response.headers.get_content_charset() or "utf-8"
        return response.read().decode(charset, "ignore")


def normalize_whitespace(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def strip_tags(raw_html: str) -> str:
    text = re.sub(r"<(script|style)\b[^>]*>.*?</\1>", " ", raw_html, flags=re.I | re.S)
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.I)
    text = re.sub(r"</(p|div|section|article|li|h1|h2|h3|h4|h5|h6)>", "\n", text, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    return "\n".join(line.strip() for line in text.splitlines() if line.strip())


class HeadingParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.current_tag: str | None = None
        self.buffer: list[str] = []
        self.headings: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"h1", "h2", "h3"}:
            self.current_tag = tag
            self.buffer = []

    def handle_data(self, data: str) -> None:
        if self.current_tag:
            self.buffer.append(data)

    def handle_endtag(self, tag: str) -> None:
        if self.current_tag == tag:
            text = normalize_whitespace("".join(self.buffer))
            if text:
                self.headings.append((tag, text))
            self.current_tag = None
            self.buffer = []


class MediaUrlParser(HTMLParser):
    def __init__(self, base_url: str) -> None:
        super().__init__()
        self.base_url = base_url
        self.image_urls: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = {key.lower(): value for key, value in attrs if key}
        tag = tag.lower()

        if tag == "img":
            self._add_url(attr_map.get("src"), force=True)
            self._add_url(attr_map.get("data-src"), force=True)
            self._add_url(attr_map.get("data-lazy-src"), force=True)
            self._add_srcset(attr_map.get("srcset"))
            self._add_srcset(attr_map.get("data-srcset"))
            return

        if tag == "source":
            self._add_srcset(attr_map.get("srcset"))
            return

        if tag == "video":
            self._add_url(attr_map.get("poster"), force=True)
            return

        if tag != "meta":
            return

        meta_key = (attr_map.get("property") or attr_map.get("name") or "").lower()
        if meta_key in {
            "og:image",
            "og:image:url",
            "og:image:secure_url",
            "twitter:image",
            "twitter:image:src",
        }:
            self._add_url(attr_map.get("content"), force=True)

    def _add_srcset(self, value: str | None) -> None:
        if not value:
            return

        for candidate in value.split(","):
            source = candidate.strip().split(" ", 1)[0]
            self._add_url(source)

    def _add_url(self, value: str | None, *, force: bool = False) -> None:
        candidate = resolve_url(self.base_url, value)
        if not candidate:
            return

        if not force and not looks_like_image_url(candidate):
            return

        self.image_urls.append(candidate)


@dataclass
class SitemapEntry:
    url: str
    image_urls: list[str] = field(default_factory=list)


@dataclass
class PageRecord:
    url: str
    slug: str
    title: str
    meta_description: str
    headings: list[tuple[str, str]]
    content: str
    image_urls: list[str] = field(default_factory=list)
    page_type: str = ""


def parse_title(html_text: str) -> str:
    match = re.search(r"<title[^>]*>(.*?)</title>", html_text, flags=re.I | re.S)
    return normalize_whitespace(html.unescape(match.group(1))) if match else ""


def parse_meta_description(html_text: str) -> str:
    match = re.search(
        r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']',
        html_text,
        flags=re.I | re.S,
    )
    return normalize_whitespace(html.unescape(match.group(1))) if match else ""


def parse_headings(html_text: str) -> list[tuple[str, str]]:
    parser = HeadingParser()
    parser.feed(html_text)
    return parser.headings


def extract_main_content(html_text: str) -> str:
    cleaned = strip_tags(html_text)
    lines = [line for line in cleaned.splitlines() if len(line.strip()) > 1]
    return "\n".join(lines)


def resolve_url(base_url: str, value: str | None) -> str:
    if not value:
        return ""

    candidate = value.strip()
    if not candidate:
        return ""

    if candidate.startswith(("data:", "javascript:", "mailto:", "tel:", "#")):
        return ""

    return urljoin(base_url, candidate)


def unique_preserve(values: Iterable[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []

    for raw_value in values:
        value = raw_value.strip()
        if not value or value in seen:
            continue

        seen.add(value)
        result.append(value)

    return result


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def looks_like_image_url(url: str) -> bool:
    path = urlparse(url).path.lower()
    return any(path.endswith(ext) for ext in IMAGE_EXTENSIONS)


def parse_html_image_urls(html_text: str, page_url: str) -> list[str]:
    parser = MediaUrlParser(page_url)
    parser.feed(html_text)
    return unique_preserve(parser.image_urls)


def parse_sitemap_document(xml_text: str, source_url: str) -> tuple[list[SitemapEntry], list[str]]:
    root = ET.fromstring(xml_text)
    root_tag = local_name(root.tag)

    if root_tag == "sitemapindex":
        nested_sitemaps: list[str] = []
        for sitemap_node in root:
            if local_name(sitemap_node.tag) != "sitemap":
                continue

            for child in sitemap_node:
                if local_name(child.tag) == "loc" and child.text:
                    nested_sitemaps.append(resolve_url(source_url, child.text))
                    break

        return [], unique_preserve(nested_sitemaps)

    if root_tag != "urlset":
        raise ValueError(f"Unsupported sitemap root tag: {root.tag}")

    entries: list[SitemapEntry] = []
    for url_node in root:
        if local_name(url_node.tag) != "url":
            continue

        page_url = ""
        image_urls: list[str] = []

        for child in url_node:
            child_name = local_name(child.tag)
            if child_name == "loc" and child.text and not page_url:
                page_url = resolve_url(source_url, child.text)
                continue

            if child_name != "image":
                continue

            for image_child in child:
                if local_name(image_child.tag) == "loc" and image_child.text:
                    resolved = resolve_url(source_url, image_child.text)
                    if resolved:
                        image_urls.append(resolved)

        if page_url:
            entries.append(SitemapEntry(url=page_url, image_urls=unique_preserve(image_urls)))

    return entries, []


def merge_sitemap_entries(entries: Iterable[SitemapEntry]) -> list[SitemapEntry]:
    merged: dict[str, list[str]] = {}

    for entry in entries:
        bucket = merged.setdefault(entry.url, [])
        bucket.extend(entry.image_urls)

    return [
        SitemapEntry(url=url, image_urls=unique_preserve(image_urls))
        for url, image_urls in merged.items()
    ]


def collect_sitemap_entries(sitemap_url: str, visited: set[str] | None = None) -> list[SitemapEntry]:
    visited = visited or set()
    if sitemap_url in visited:
        return []

    visited.add(sitemap_url)
    xml_text = fetch_text(sitemap_url)
    entries, nested_sitemaps = parse_sitemap_document(xml_text, sitemap_url)

    if not nested_sitemaps:
        return merge_sitemap_entries(entries)

    nested_entries: list[SitemapEntry] = []
    for nested_sitemap_url in nested_sitemaps:
        nested_entries.extend(collect_sitemap_entries(nested_sitemap_url, visited))

    return merge_sitemap_entries([*entries, *nested_entries])


def slug_from_url(url: str) -> str:
    path = urlparse(url).path.strip("/")
    return path or "home"


def build_search_blob(record: PageRecord) -> str:
    parts = [
        record.slug,
        record.title,
        record.meta_description,
        " ".join(text for _, text in record.headings[:16]),
        record.content[:8000],
    ]
    return normalize_whitespace(" ".join(parts)).lower()


def is_news_page(record: PageRecord, blob: str) -> bool:
    path = urlparse(record.url).path.lower()
    if record.slug == "tin-tuc" or path.startswith("/tin-tuc/"):
        return True

    return "trang chủ tin tức" in blob


def is_product_catalog_page(record: PageRecord, blob: str) -> bool:
    if record.slug in PRODUCT_CATALOG_SLUGS and not is_product_detail_page(blob):
        return True

    if "trang chủ sản phẩm" not in blob:
        return False

    return (
        ("lọc" in blob and "sắp xếp" in blob)
        or "page 1/" in blob
        or "đang cập nhật dữ liệu" in blob
    )


def is_product_detail_page(blob: str) -> bool:
    if "trang chủ sản phẩm" not in blob:
        return False

    detail_markers = {
        "chi tiết sản phẩm",
        "sản phẩm tương tự",
        "bình luận",
        "thông số kỹ thuật",
    }

    return (
        ("giá:" in blob and any(marker in blob for marker in detail_markers))
        or "sản phẩm tương tự" in blob
        or "thông số kỹ thuật" in blob
    )


def classify(record: PageRecord) -> str:
    blob = build_search_blob(record)

    if record.slug in POLICY_SLUGS:
        return "policy-pages"

    if record.slug in PROJECT_AND_MEDIA_SLUGS:
        return "project-gallery-pages"

    if record.slug in OPERATIONS_SLUGS or "năng lực hoạt động liên quan" in blob:
        return "operations-pages"

    if is_news_page(record, blob):
        return "news-pages"

    if is_product_catalog_page(record, blob):
        return "product-catalog-pages"

    if is_product_detail_page(blob) or "trang chủ sản phẩm" in blob:
        return "product-detail-pages"

    if record.slug in CORE_SLUGS:
        return "core-pages"

    return "other-pages"


def render_section(title: str, records: Iterable[PageRecord]) -> str:
    chunks = [f"## {title}\n"]
    for record in records:
        chunks.append(f"### {record.slug}")
        chunks.append(f"- URL: {record.url}")
        if record.page_type:
            chunks.append(f"- Page type: {record.page_type}")
        if record.title:
            chunks.append(f"- Title: {record.title}")
        if record.meta_description:
            chunks.append(f"- Meta: {record.meta_description}")
        if record.headings:
            chunks.append("- Headings:")
            for level, text in record.headings[:12]:
                chunks.append(f"  - {level.upper()}: {text}")
        if record.image_urls:
            visible_images = record.image_urls[:12]
            suffix = (
                f" ({len(visible_images)}/{len(record.image_urls)} shown)"
                if len(visible_images) < len(record.image_urls)
                else ""
            )
            chunks.append(f"- Image URLs{suffix}:")
            for image_url in visible_images:
                chunks.append(f"  - {image_url}")
        preview = record.content[:5000].strip()
        if preview:
            chunks.append("- Extracted content:")
            chunks.append("")
            chunks.append("```text")
            chunks.append(preview)
            chunks.append("```")
        chunks.append("")
    return "\n".join(chunks)


def render_url_section(title: str, urls: Iterable[str]) -> str:
    items = list(urls)
    chunks = [f"## {title}\n"]

    if not items:
        chunks.append("- None")
        chunks.append("")
        return "\n".join(chunks)

    for url in items:
        chunks.append(f"- {url}")

    chunks.append("")
    return "\n".join(chunks)


def main() -> int:
    sitemap_entries = collect_sitemap_entries(SITEMAP_URL)
    urls = [entry.url for entry in sitemap_entries]

    records: list[PageRecord] = []
    failures: list[str] = []
    direct_image_urls: list[str] = []

    for index, entry in enumerate(sitemap_entries, start=1):
        url = entry.url
        if looks_like_image_url(url):
            direct_image_urls.append(url)
            print(f"[{index}/{len(sitemap_entries)}] asset {url}", file=sys.stderr)
            continue

        try:
            html_text = fetch_text(url)
            record = PageRecord(
                url=url,
                slug=slug_from_url(url),
                title=parse_title(html_text),
                meta_description=parse_meta_description(html_text),
                headings=parse_headings(html_text),
                content=extract_main_content(html_text),
                image_urls=unique_preserve(
                    [
                        *entry.image_urls,
                        *parse_html_image_urls(html_text, url),
                    ]
                ),
            )
            record.page_type = record.page_type or classify(record)
            records.append(record)
            print(f"[{index}/{len(urls)}] crawled {url}", file=sys.stderr)
        except Exception as exc:  # noqa: BLE001
            failures.append(f"{url} :: {exc}")
            print(f"[{index}/{len(urls)}] failed {url} :: {exc}", file=sys.stderr)

    grouped: dict[str, list[PageRecord]] = {key: [] for key in GROUP_TITLES}
    for record in records:
        grouped[record.page_type].append(record)

    unique_image_urls = unique_preserve(
        [
            *direct_image_urls,
            *(image_url for record in records for image_url in record.image_urls),
        ]
    )

    output_parts = [
        "# Woodland Old Site Context",
        "",
        f"- Source sitemap: {SITEMAP_URL}",
        f"- Total URLs in sitemap: {len(urls)}",
        f"- Direct image URLs in sitemap: {len(direct_image_urls)}",
        f"- Pages crawled successfully: {len(records)}",
        f"- Pages failed: {len(failures)}",
        f"- Unique image URLs discovered: {len(unique_image_urls)}",
        "",
        "Tài liệu này được crawl tự động từ `https://woodland.vn/` để dùng làm context nội dung khi dựng lại UI/UX theo layout mới.",
        "",
        "## Failure Log",
        "",
    ]

    if failures:
        output_parts.extend(f"- {item}" for item in failures)
    else:
        output_parts.append("- None")

    output_parts.extend(
        [
            "",
            render_url_section("Direct Image URLs From Sitemap", direct_image_urls),
        ]
    )

    for group_key, group_title in GROUP_TITLES.items():
        output_parts.extend(["", render_section(group_title, grouped[group_key])])

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text("\n".join(output_parts), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
