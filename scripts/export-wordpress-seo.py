#!/usr/bin/env python3
"""Export the effective SEO metadata from a live WordPress website.

The crawler discovers URLs from XML sitemaps and optional WP All Export CSVs.
It uses only Python's standard library and writes:

* pages.csv      - one row per crawled URL and its effective metadata
* redirects.csv  - requested URLs whose final URL differs
* schema.jsonl   - JSON-LD blocks, preserved without flattening
* errors.csv     - URLs that could not be fetched or parsed
"""

from __future__ import annotations

import argparse
import csv
import gzip
import html
import json
import re
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable


USER_AGENT = "PathologyMCQ-SEOMigration/1.0 (+https://pathologymcq.com/)"
TIMEOUT = 30
PRINT_LOCK = threading.Lock()


def clean(value: str | None) -> str:
    return re.sub(r"\s+", " ", html.unescape(value or "")).strip()


def first(mapping: dict[str, list[str]], key: str) -> str:
    values = mapping.get(key.lower(), [])
    return values[0] if values else ""


class HeadParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.title_parts: list[str] = []
        self.h1_parts: list[str] = []
        self.meta: dict[str, list[str]] = {}
        self.links: dict[str, list[str]] = {}
        self.json_ld: list[str] = []
        self.html_lang = ""
        self._in_title = False
        self._in_h1 = False
        self._in_json_ld = False
        self._json_parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        # Real-world WordPress markup can contain malformed attributes. HTMLParser
        # represents an attribute without a usable name as None, so ignore it.
        attrs_map = {key.lower(): value or "" for key, value in attrs if key}
        tag = tag.lower()
        if tag == "html":
            self.html_lang = attrs_map.get("lang", "")
        elif tag == "title":
            self._in_title = True
        elif tag == "h1":
            self._in_h1 = True
        elif tag == "meta":
            key = (attrs_map.get("name") or attrs_map.get("property") or attrs_map.get("itemprop") or "").lower()
            if key:
                self.meta.setdefault(key, []).append(clean(attrs_map.get("content")))
        elif tag == "link":
            rels = attrs_map.get("rel", "").lower().split()
            href = attrs_map.get("href", "")
            for rel in rels:
                if href:
                    self.links.setdefault(rel, []).append(href)
        elif tag == "script" and "ld+json" in attrs_map.get("type", "").lower():
            self._in_json_ld = True
            self._json_parts = []

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag == "title":
            self._in_title = False
        elif tag == "h1":
            self._in_h1 = False
        elif tag == "script" and self._in_json_ld:
            raw = "".join(self._json_parts).strip()
            if raw:
                self.json_ld.append(raw)
            self._in_json_ld = False
            self._json_parts = []

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title_parts.append(data)
        if self._in_h1:
            self.h1_parts.append(data)
        if self._in_json_ld:
            self._json_parts.append(data)


@dataclass
class UrlRecord:
    url: str
    sources: set[str] = field(default_factory=set)
    wordpress_id: str = ""
    wordpress_type: str = ""
    wordpress_status: str = ""
    wordpress_slug: str = ""
    wordpress_title: str = ""
    wordpress_excerpt: str = ""
    wordpress_categories: str = ""
    wordpress_tags: str = ""
    wordpress_featured_image: str = ""
    wordpress_published: str = ""
    wordpress_modified: str = ""
    sitemap_lastmod: str = ""


def request(url: str) -> tuple[int, str, dict[str, str], bytes]:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept-Encoding": "gzip"})
    try:
        response = urllib.request.urlopen(req, timeout=TIMEOUT)
    except urllib.error.HTTPError as exc:
        response = exc
    body = response.read()
    if response.headers.get("Content-Encoding", "").lower() == "gzip":
        body = gzip.decompress(body)
    headers = {key.lower(): value for key, value in response.headers.items()}
    return response.status, response.geturl(), headers, body


def discover_sitemaps(base_url: str) -> list[str]:
    parsed = urllib.parse.urlsplit(base_url)
    root = f"{parsed.scheme}://{parsed.netloc}"
    candidates: list[str] = []
    try:
        status, _, _, body = request(root + "/robots.txt")
        if status < 400:
            for line in body.decode("utf-8", "replace").splitlines():
                if line.lower().startswith("sitemap:"):
                    candidates.append(line.split(":", 1)[1].strip())
    except Exception:
        pass
    candidates.extend(root + path for path in ("/wp-sitemap.xml", "/sitemap_index.xml", "/sitemap.xml"))
    return list(dict.fromkeys(candidates))


def sitemap_urls(base_url: str) -> dict[str, str]:
    host = urllib.parse.urlsplit(base_url).netloc.lower()
    pending = discover_sitemaps(base_url)
    seen: set[str] = set()
    pages: dict[str, str] = {}
    while pending:
        sitemap = pending.pop(0)
        if sitemap in seen:
            continue
        seen.add(sitemap)
        try:
            status, _, _, body = request(sitemap)
            if status >= 400:
                continue
            root = ET.fromstring(body)
        except Exception:
            continue
        root_name = root.tag.rsplit("}", 1)[-1].lower()
        if root_name == "sitemapindex":
            for node in root:
                loc = next((clean(child.text) for child in node if child.tag.endswith("loc")), "")
                if loc:
                    pending.append(loc)
        elif root_name == "urlset":
            for node in root:
                loc = next((clean(child.text) for child in node if child.tag.endswith("loc")), "")
                lastmod = next((clean(child.text) for child in node if child.tag.endswith("lastmod")), "")
                if loc and urllib.parse.urlsplit(loc).netloc.lower() == host:
                    pages[loc] = lastmod
    return pages


def read_csv(path: Path) -> Iterable[dict[str, str]]:
    csv.field_size_limit(sys.maxsize)
    with path.open(newline="", encoding="utf-8-sig") as handle:
        yield from csv.DictReader(handle)


def add_csv(records: dict[str, UrlRecord], path: Path, source: str, include_unpublished: bool) -> None:
    for row in read_csv(path):
        status = clean(row.get("Status"))
        if not include_unpublished and status and status.lower() != "publish":
            continue
        url = clean(row.get("Permalink"))
        if not url.startswith(("http://", "https://")):
            continue
        record = records.setdefault(url, UrlRecord(url=url))
        record.sources.add(source)
        record.wordpress_id = clean(row.get("ID"))
        record.wordpress_type = clean(row.get("Post Type"))
        record.wordpress_status = status
        record.wordpress_slug = clean(row.get("Slug"))
        record.wordpress_title = clean(row.get("Title"))
        record.wordpress_excerpt = clean(row.get("Excerpt"))
        record.wordpress_categories = clean(row.get("Categories"))
        record.wordpress_tags = clean(row.get("Tags"))
        record.wordpress_featured_image = clean(row.get("Image Featured"))
        record.wordpress_published = clean(row.get("Date"))
        record.wordpress_modified = clean(row.get("Post Modified Date"))


def crawl(record: UrlRecord) -> tuple[dict[str, object] | None, list[dict[str, object]], str | None]:
    try:
        status, final_url, headers, body = request(record.url)
        content_type = headers.get("content-type", "")
        if "html" not in content_type.lower():
            raise ValueError(f"Expected HTML, received {content_type or 'unknown content type'}")
        charset_match = re.search(r"charset=([^;\s]+)", content_type, re.I)
        charset = charset_match.group(1).strip('"\'') if charset_match else "utf-8"
        text = body.decode(charset, "replace")
        parser = HeadParser()
        parser.feed(text)
        canonical = first(parser.links, "canonical")
        schemas: list[dict[str, object]] = []
        schema_types: set[str] = set()
        for index, raw in enumerate(parser.json_ld):
            try:
                value = json.loads(raw)
                schemas.append({"url": record.url, "index": index, "schema": value})
                stack = [value]
                while stack:
                    item = stack.pop()
                    if isinstance(item, dict):
                        kind = item.get("@type")
                        if isinstance(kind, str):
                            schema_types.add(kind)
                        elif isinstance(kind, list):
                            schema_types.update(str(part) for part in kind)
                        stack.extend(item.values())
                    elif isinstance(item, list):
                        stack.extend(item)
            except json.JSONDecodeError:
                schemas.append({"url": record.url, "index": index, "raw": raw, "parse_error": True})
        row: dict[str, object] = {
            "requested_url": record.url,
            "final_url": final_url,
            "http_status": status,
            "redirected": "yes" if final_url.rstrip("/") != record.url.rstrip("/") else "no",
            "content_type": content_type,
            "sources": "|".join(sorted(record.sources)),
            "title": clean("".join(parser.title_parts)),
            "meta_description": first(parser.meta, "description"),
            "canonical": canonical,
            "robots": first(parser.meta, "robots"),
            "googlebot": first(parser.meta, "googlebot"),
            "language": clean(parser.html_lang),
            "h1": clean(" | ".join(parser.h1_parts)),
            "og_type": first(parser.meta, "og:type"),
            "og_title": first(parser.meta, "og:title"),
            "og_description": first(parser.meta, "og:description"),
            "og_url": first(parser.meta, "og:url"),
            "og_image": first(parser.meta, "og:image"),
            "og_image_alt": first(parser.meta, "og:image:alt"),
            "twitter_card": first(parser.meta, "twitter:card"),
            "twitter_title": first(parser.meta, "twitter:title"),
            "twitter_description": first(parser.meta, "twitter:description"),
            "twitter_image": first(parser.meta, "twitter:image"),
            "article_published_time": first(parser.meta, "article:published_time"),
            "article_modified_time": first(parser.meta, "article:modified_time"),
            "schema_types": "|".join(sorted(schema_types)),
            "schema_blocks": len(parser.json_ld),
            "sitemap_lastmod": record.sitemap_lastmod,
            "wordpress_id": record.wordpress_id,
            "wordpress_type": record.wordpress_type,
            "wordpress_status": record.wordpress_status,
            "wordpress_slug": record.wordpress_slug,
            "wordpress_title": record.wordpress_title,
            "wordpress_excerpt": record.wordpress_excerpt,
            "wordpress_categories": record.wordpress_categories,
            "wordpress_tags": record.wordpress_tags,
            "wordpress_featured_image": record.wordpress_featured_image,
            "wordpress_published": record.wordpress_published,
            "wordpress_modified": record.wordpress_modified,
        }
        return row, schemas, None
    except Exception as exc:
        return None, [], f"{type(exc).__name__}: {exc}"


def write_csv(path: Path, rows: list[dict[str, object]], fields: list[str] | None = None) -> None:
    if fields is None:
        fields = list(rows[0]) if rows else []
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--base-url", default="https://pathologymcq.com/", help="WordPress site URL")
    parser.add_argument("--pages-csv", type=Path, help="WP All Export pages CSV")
    parser.add_argument("--posts-csv", type=Path, help="WP All Export posts CSV")
    parser.add_argument("--output-dir", type=Path, default=Path("seo-export"))
    parser.add_argument("--concurrency", type=int, default=6)
    parser.add_argument("--delay", type=float, default=0.15, help="Delay before each request per worker")
    parser.add_argument("--limit", type=int, default=0, help="Crawl only N URLs for testing; 0 means all")
    parser.add_argument("--include-unpublished", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    records: dict[str, UrlRecord] = {}
    print("Discovering XML sitemaps…", flush=True)
    for url, lastmod in sitemap_urls(args.base_url).items():
        record = records.setdefault(url, UrlRecord(url=url))
        record.sources.add("sitemap")
        record.sitemap_lastmod = lastmod
    for path, source in ((args.pages_csv, "pages_csv"), (args.posts_csv, "posts_csv")):
        if path:
            if not path.exists():
                raise SystemExit(f"CSV does not exist: {path}")
            add_csv(records, path, source, args.include_unpublished)

    urls = sorted(records)
    if args.limit > 0:
        urls = urls[: args.limit]
    if not urls:
        raise SystemExit("No URLs found. Supply valid CSV files or check the site's XML sitemap.")

    args.output_dir.mkdir(parents=True, exist_ok=True)
    print(f"Crawling {len(urls)} URLs with {args.concurrency} workers…", flush=True)
    page_rows: list[dict[str, object]] = []
    schema_rows: list[dict[str, object]] = []
    error_rows: list[dict[str, object]] = []

    def task(url: str):
        if args.delay:
            time.sleep(args.delay)
        return url, crawl(records[url])

    completed = 0
    with ThreadPoolExecutor(max_workers=max(1, args.concurrency)) as executor:
        futures = [executor.submit(task, url) for url in urls]
        for future in as_completed(futures):
            url, (row, schemas, error) = future.result()
            completed += 1
            if row:
                page_rows.append(row)
                schema_rows.extend(schemas)
            else:
                error_rows.append({"url": url, "error": error or "Unknown error"})
            if completed % 25 == 0 or completed == len(urls):
                with PRINT_LOCK:
                    print(f"  {completed}/{len(urls)} complete", flush=True)

    page_rows.sort(key=lambda row: str(row["requested_url"]))
    error_rows.sort(key=lambda row: str(row["url"]))
    write_csv(args.output_dir / "pages.csv", page_rows)
    redirects = [
        {
            "source_url": row["requested_url"],
            "destination_url": row["final_url"],
            "final_status": row["http_status"],
        }
        for row in page_rows
        if row["redirected"] == "yes"
    ]
    write_csv(args.output_dir / "redirects.csv", redirects, ["source_url", "destination_url", "final_status"])
    write_csv(args.output_dir / "errors.csv", error_rows, ["url", "error"])
    with (args.output_dir / "schema.jsonl").open("w", encoding="utf-8") as handle:
        for row in schema_rows:
            handle.write(json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n")

    print(f"Saved {len(page_rows)} pages, {len(redirects)} redirects, {len(schema_rows)} schema blocks, "
          f"and {len(error_rows)} errors to {args.output_dir}/")
    return 0 if not error_rows else 2


if __name__ == "__main__":
    raise SystemExit(main())
