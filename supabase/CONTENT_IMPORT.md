# Import the supplied website content

The supplied exports are converted into `migrations/0005_import_website_content.sql`:

- 4 courses with editable enrollment URLs.
- 3 specific mock-test offerings with editable access URLs.
- 200 unique published articles, with their original destination URLs, cover images, dates, and text retained.
- 47 categories. The two FRCPath Part 1 labels that normalize to the same slug are merged. Articles retain membership in multiple categories.
- No practice questions: the supplied `practice_questions.json` is empty.

“See all courses” and the generic “MOCK TESTS” navigation page are excluded. Plugin interface images are excluded. Article images remain hosted at their source URLs. Unknown course prices display “View pricing”; unspecified question counts are hidden. No prices, faculty, curricula, or question counts have been invented. Export timestamps without offsets are interpreted in Asia/Kolkata.

## Apply to Supabase

This checkout has no configured Supabase credentials, so these migrations have **not been applied to a database**.

In your existing Supabase project's SQL editor, run these files in order:

1. `migrations/0004_blog_links.sql`
2. `migrations/0005_import_website_content.sql`

For a new database, run migrations `0001`–`0003` first. Apply `0004` before running the updated application because its blog queries use the new columns. The content import is transactional and inserts missing records only; it does not delete existing sample content or overwrite admin changes. Existing matching course/mock destination URLs and course slugs are skipped. Stable article IDs and unique slugs prevent duplicate imports.

## Edit later

- `/admin/blog`: open a category, select an article, edit **Article destination link**, then **Save**. Clear the link to render the retained article locally. Additional categories are editable too.
- `/admin/courses`: select a course and change its enrollment/buy URL. A blank price means unspecified; an explicit zero is a free course.
- `/admin/mock-tests`: edit the card's buy/access URL.

Public blog cards and local article routes open the configured destination. Admin cards always open the editor. Public course cards use their enrollment URL when set. The homepage featured-course grid now reads the same catalog as the course listing.

## Regenerate and verify

```bash
python3 scripts/import-content.py /home/zoro/Documents
python3 -m unittest discover -s tests -p 'test_*.py'
node --test tests/blog-links.test.mjs
```

The generator requires all four original JSON files in the supplied directory. Generated SQL safely quotes content and is deterministic. The tests verify normalization and destination handling; they do not replace applying the migration against your Supabase database.
