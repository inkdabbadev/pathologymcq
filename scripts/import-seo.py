#!/usr/bin/env python3
"""Compile crawler exports into deployable metadata, excluding query/failed pages.
Usage: python3 scripts/import-seo.py [export-directory]
The raw crawl stays ignored; the compact generated dataset is versioned.
"""
import csv
import html
import json
import sys
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parent.parent

def path_of(value):
    u = urlsplit(value)
    if u.hostname not in ('pathologymcq.com', 'www.pathologymcq.com') or u.query:
        return None
    return unquote(u.path).rstrip('/') or '/'


def build(directory):
    schemas = {}
    for line in (directory / 'schema.jsonl').open():
        item = json.loads(line)
        path = path_of(item['url'])
        if not path or path in schemas:
            continue
        schema = item.get('schema', {})
        if not isinstance(schema, dict):
            continue
        graph = schema.get('@graph', [schema])
        extracted = {}
        for node in graph:
            if not isinstance(node, dict):
                continue
            types = node.get('@type', [])
            if isinstance(types, str): types = [types]
            if any(t in types for t in ['Article', 'BlogPosting', 'WebPage']):
                for field in ['datePublished', 'dateModified']:
                    if node.get(field): extracted[field] = node[field]
            if 'Organization' in types and node.get('sameAs'):
                extracted['sameAs'] = node['sameAs']
        schemas[path] = extracted
    pages = {}
    rows = list(csv.DictReader((directory / 'pages.csv').open(newline='')))
    for row in rows:
        path = path_of(row['requested_url'])
        if not path or row['http_status'] != '200' or path != path_of(row['final_url']):
            continue
        if row.get('wordpress_status') and row['wordpress_status'] != 'publish':
            continue
        desc = row['meta_description'] or row['og_description'] or row['twitter_description'] or row['wordpress_excerpt']
        pages[path] = {
            'title': html.unescape(row['title']),
            'description': html.unescape(desc),
            'image': html.unescape(row['og_image'] or row['twitter_image'] or row['wordpress_featured_image']),
            'imageAlt': html.unescape(row['og_image_alt']),
            'robots': row['robots'],
            'googlebot': row['googlebot'],
            'published': row['article_published_time'] or schemas.get(path, {}).get('datePublished', '') or row['wordpress_published'],
            'modified': row['article_modified_time'] or schemas.get(path, {}).get('dateModified', '') or row['wordpress_modified'],
        }
    redirects = []
    for row in csv.DictReader((directory / 'redirects.csv').open(newline='')):
        source, target = path_of(row['source_url']), path_of(row['destination_url'])
        if source and target and source != target and row['final_status'] == '200':
            redirects.append({'source': source, 'destination': target})
    payload = {'pages': pages, 'legacyRedirects': redirects,
               'sameAs': schemas.get('/', {}).get('sameAs', []),
               'crawl': {'records': len(rows), 'redirects': len(redirects)}}
    out = ROOT / 'lib/seo/imported.json'
    out.write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':')) + '\n')
    print(f'Imported {len(pages)} effective pages and {len(redirects)} redirect candidates into {out.relative_to(ROOT)}')

if __name__ == '__main__':
    build(Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'seo-export')
