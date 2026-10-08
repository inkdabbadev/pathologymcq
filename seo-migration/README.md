# SEO migration

The production canonical origin is `https://pathologymcq.com`. The Cloudflare
workers.dev address is a preview; applying these changes does not switch DNS.

## Implemented

- Imported effective titles, descriptions, robots directives, social images,
  image descriptions and article dates from the crawler exports.
- Added server-generated metadata for static pages and published dynamic content.
- Preserved 200 existing article paths using published Supabase content. These
  pages render the article body on the server. `/blog/<slug>` honors the editable
  destination URL using a temporary redirect; it does not redirect the original
  URL back to itself. Admin blog editing continues using the original editor.
- Added 74 explicit 301 redirects to matching current pages. No blanket
  attachment-to-homepage redirects or redirects to missing lesson/quiz routes.
- Added Organization, WebSite, WebPage, BreadcrumbList, Article and Course JSON-LD.
  The exported schema supplies dates and organization social URLs. Old plugin
  graphs are not injected wholesale: they contain stale prices, reviews, search
  actions and WordPress-specific references that may not describe this app.
- Added a live `sitemap.xml` from published public content. External destinations,
  noindex pages, admin pages and preview pages are excluded. A database failure
  fails the request instead of publishing an incomplete sitemap as successful.
- Added `robots.txt`, admin noindex metadata and noindex for `/home1`.
- Unknown articles return 404. Next.js currently emits a noindex soft-404
  response for unknown database-backed courses, categories, practice topics and
  services. Search engines are explicitly told not to index those responses.

## Domain cutover work still needed

`summary.json` and `url-review.csv` compare the crawl to the published Supabase
inventory. Of 1,000 effective crawled pages, 286 are mapped and 714 need content or
an explicit destination decision. This includes WordPress lessons, quizzes,
account/commerce pages, and articles missing from the current app. The WordPress
post CSV contains 251 published posts; Supabase currently contains 200. SEO
metadata does not recreate their content or learning/payment functionality.

Do not treat this as complete WordPress replacement coverage. Before retiring
WordPress, resolve the URLs that must remain available in `url-review.csv`.
Retain or migrate referenced `/wp-content/uploads/` media too; metadata and
article image URLs do not copy the underlying files. Course purchase/enrollment
links to WordPress also need working destinations after the domain switch.

The export includes 6,627 historical redirects to `/`, mainly attachment URLs.
Those are deliberately not carried over as unrelated homepage redirects.

## Regenerating the import

From the project root, after updating the crawler export:

```sh
python3 scripts/import-seo.py seo-export
node scripts/seo-inventory.cjs /tmp/pathologymcq-seo-inventory.json
python3 scripts/map-seo.py /tmp/pathologymcq-seo-inventory.json
node scripts/test-seo.cjs
```

The inventory reads published data using the public Supabase key. It performs no
writes. Raw SEO exports stay ignored; the generated JSON and review reports are
versioned so deployment does not depend on local CSV files.

New published blog posts retaining an original single-segment path are resolved
from Supabase at runtime. Re-run the mapping for newly migrated courses,
categories, or changed legacy URLs to update static redirect rules.
