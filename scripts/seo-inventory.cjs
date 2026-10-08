// Read-only snapshot of published content for scripts/map-seo.py. No keys are saved.
require('@next/env').loadEnvConfig(process.cwd());
const { createClient } = require('@supabase/supabase-js');
const fs = require('node:fs');
async function main() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  async function collect(query) {
    const rows = [];
    for (let offset = 0; ; offset += 500) {
      const { data, error } = await query().range(offset, offset + 499);
      if (error) throw new Error(error.message);
      rows.push(...data);
      if (data.length < 500) return rows;
    }
  }
  const [posts, categories, catalog] = await Promise.all([
    collect(() => db.from('posts').select('slug,title,external_url,status').eq('status', 'published').order('id')),
    collect(() => db.from('categories').select('slug,name').order('id')),
    collect(() => db.from('catalog_items').select('kind,slug,data').in('kind', ['courses', 'practice_topics', 'pages']).order('kind').order('id')),
  ]);
  const file = process.argv[2] || '/tmp/pathologymcq-seo-inventory.json';
  fs.writeFileSync(file, JSON.stringify({ posts, categories, catalog }));
  console.log(`Saved ${posts.length} published posts, ${categories.length} categories and ${catalog.length} catalog entries to ${file}`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
