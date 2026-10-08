#!/usr/bin/env python3
"""Map the crawl against a read-only published-content inventory.
Usage: python3 scripts/map-seo.py /tmp/pathologymcq-seo-inventory.json
"""
import csv
import json
import sys
from pathlib import Path
from urllib.parse import urlsplit, unquote
ROOT = Path(__file__).resolve().parent.parent
crawl = json.loads((ROOT / 'lib/seo/imported.json').read_text())
routes = json.loads((ROOT / 'lib/seo/routes.json').read_text())
inventory = json.loads(Path(sys.argv[1]).read_text())
pages = crawl['pages']
map_to = {}
source_for = {}
posts = {}
for target, config in routes.items():
    for source in config['sources']:
        if source in pages:
            map_to[source] = target
            source_for.setdefault(target, source)
for post in inventory['posts']:
    url = urlsplit(post.get('external_url') or '')
    source = unquote(url.path).rstrip('/') or '/'
    if url.hostname in ('pathologymcq.com', 'www.pathologymcq.com') and source in pages and source not in routes:
        posts[source] = post['slug']
        map_to[source] = source
for row in inventory['catalog']:
    if row['kind'] != 'courses': continue
    slug = row['data']['slug']
    target = '/courses/' + slug
    for source in [target, '/product/' + slug, '/' + slug]:
        if source in pages and source not in map_to:
            map_to[source] = target
            source_for.setdefault(target, source)
for category in inventory['categories']:
    target = '/blog/category/' + category['slug']
    for source in pages:
        if source.startswith('/category/') and source.rsplit('/', 1)[-1] == category['slug']:
            map_to[source] = target
            source_for.setdefault(target, source)
redirects = {source:target for source,target in map_to.items() if source != target and source not in routes}
for row in crawl['legacyRedirects']:
    source, final = row['source'], row['destination']
    # Attachment-to-home redirects are not meaningful content replacements.
    if final == '/' or source in routes or source in map_to: continue
    target = map_to.get(final)
    if target and source != target: redirects[source] = target
payload = {'sources': source_for, 'posts': posts, 'redirects': redirects}
(ROOT / 'lib/seo/migration.json').write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n')
report = ROOT / 'seo-migration'
report.mkdir(exist_ok=True)
with (report / 'url-review.csv').open('w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['old_path', 'new_path', 'status'])
    for source in sorted(pages):
        target = map_to.get(source)
        writer.writerow([source, target or '', 'mapped' if target else 'needs_content_or_mapping'])
summary = {'export_records': crawl['crawl']['records'], 'effective_pages': len(pages),
           'mapped_source_pages': len(map_to), 'preserved_article_paths': len(posts),
           'permanent_redirects': len(redirects), 'unmapped_pages': len(pages.keys() - map_to.keys()),
           'homepage_redirect_candidates_excluded': sum(r['destination'] == '/' for r in crawl['legacyRedirects'])}
(report / 'summary.json').write_text(json.dumps(summary, indent=2) + '\n')
print(json.dumps(summary, indent=2))
