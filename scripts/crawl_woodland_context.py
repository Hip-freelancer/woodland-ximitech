#!/usr/bin/env python3

from __future__ import annotations

import html
import re
import sys
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable
from urllib.parse import urlparse
from urllib.request import Request, urlopen

SITEMAP_URL = "https://woodland.vn/sitemap.xml"
OUTPUT_PATH = Path("docs/woodland-old-site-context.md")
USER_AGENT = "Mozilla/5.0 (compatible; WoodlandContextCrawler/1.0)"
TIMEOUT_SECONDS = 30


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


@dataclass
class PageRecord:
    url: str
    slug: str
    title: str
    meta_description: str
    headings: list[tuple[str, str]]
    content: str


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


def parse_sitemap_urls(xml_text: str) -> list[str]:
    root = ET.fromstring(xml_text)
    namespace = {"sm": "https://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [node.text.strip() for node in root.findall("sm:url/sm:loc", namespace) if node.text]
    return urls


def slug_from_url(url: str) -> str:
    path = urlparse(url).path.strip("/")
    return path or "home"


def classify(url: str) -> str:
    slug = slug_from_url(url)
    if slug in {"home", "gioi-thieu", "san-pham", "du-an", "hinh-anh", "lien-he", "tin-tuc", "nang-luc-hoat-dong"}:
      return "core-pages"
    if slug in {"huong-dan-mua-hang", "bao-mat-thong-tin-khach-hang", "phuong-phuc-thanh-toan", "cach-thuc-van-chuyen"}:
      return "policy-pages"
    if slug.startswith("plywood-") or slug.startswith("go-") or slug.startswith("van-"):
      return "products-articles"
    return "other-pages"


def render_section(title: str, records: Iterable[PageRecord]) -> str:
    chunks = [f"## {title}\n"]
    for record in records:
        chunks.append(f"### {record.slug}")
        chunks.append(f"- URL: {record.url}")
        if record.title:
            chunks.append(f"- Title: {record.title}")
        if record.meta_description:
            chunks.append(f"- Meta: {record.meta_description}")
        if record.headings:
            chunks.append("- Headings:")
            for level, text in record.headings[:12]:
                chunks.append(f"  - {level.upper()}: {text}")
        preview = record.content[:5000].strip()
        if preview:
            chunks.append("- Extracted content:")
            chunks.append("")
            chunks.append("```text")
            chunks.append(preview)
            chunks.append("```")
        chunks.append("")
    return "\n".join(chunks)


def main() -> int:
    sitemap_xml = fetch_text(SITEMAP_URL)
    urls = parse_sitemap_urls(sitemap_xml)

    records: list[PageRecord] = []
    failures: list[str] = []

    for index, url in enumerate(urls, start=1):
        try:
            html_text = fetch_text(url)
            record = PageRecord(
                url=url,
                slug=slug_from_url(url),
                title=parse_title(html_text),
                meta_description=parse_meta_description(html_text),
                headings=parse_headings(html_text),
                content=extract_main_content(html_text),
            )
            records.append(record)
            print(f"[{index}/{len(urls)}] crawled {url}", file=sys.stderr)
        except Exception as exc:  # noqa: BLE001
            failures.append(f"{url} :: {exc}")
            print(f"[{index}/{len(urls)}] failed {url} :: {exc}", file=sys.stderr)

    grouped: dict[str, list[PageRecord]] = {
        "core-pages": [],
        "policy-pages": [],
        "products-articles": [],
        "other-pages": [],
    }
    for record in records:
        grouped[classify(record.url)].append(record)

    output_parts = [
        "# Woodland Old Site Context",
        "",
        f"- Source sitemap: {SITEMAP_URL}",
        f"- Total URLs in sitemap: {len(urls)}",
        f"- Pages crawled successfully: {len(records)}",
        f"- Pages failed: {len(failures)}",
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
            render_section("Core Pages", grouped["core-pages"]),
            render_section("Policy Pages", grouped["policy-pages"]),
            render_section("Products And Articles", grouped["products-articles"]),
            render_section("Other Pages", grouped["other-pages"]),
        ]
    )

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text("\n".join(output_parts), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
