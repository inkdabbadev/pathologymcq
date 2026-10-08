const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ts = require('typescript');
const { createRequire } = require('node:module');
function load(file) {
  const absolute = path.resolve(file);
  const exports = {};
  const compiled = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true,
  } }).outputText;
  vm.runInNewContext(compiled, { exports, require: createRequire(absolute), URL });
  return exports;
}
const seo = load('lib/seo/metadata.ts');
const migration = require('../lib/seo/migration.json');
const imported = require('../lib/seo/imported.json');
const routes = require('../lib/seo/routes.json');
for (const [source, target] of Object.entries(migration.redirects)) {
  assert.notEqual(source, target, 'Self redirect');
  assert.ok(!migration.redirects[target], `Redirect chain: ${source}`);
  assert.ok(!routes[source], `Redirect overrides current page: ${source}`);
  assert.ok(target !== '/', 'No blanket homepage redirect');
  assert.ok(routes[target] || migration.posts[target] || /^\/(courses|blog\/category)\//.test(target));
}
for (const route of Object.keys(routes)) {
  const meta = seo.pageMetadata(route);
  assert.equal(meta.alternates.canonical, 'https://pathologymcq.com' + route);
  assert.ok(meta.title.absolute);
  assert.ok(meta.description);
  assert.equal(meta.openGraph.url, meta.alternates.canonical);
  assert.ok(!String(meta.title.absolute).includes('undefined'));
}
assert.equal(seo.safeUrl('javascript:alert(1)'), undefined);
assert.equal(seo.safeUrl('https://user:pass@example.test'), undefined);
assert.equal(seo.validDate('nonsense'), undefined);
assert.equal(seo.normalizePath('https://pathologymcq.com/blog/'), '/blog');
assert.equal(seo.exportedSeo('/contact').title, imported.pages['/contact-us'].title);
for (const oldPath of Object.keys(migration.posts)) {
  assert.ok(imported.pages[oldPath]);
  const meta = seo.pageMetadata(oldPath, { title: 'Fallback' }, true);
  assert.equal(meta.title.absolute, imported.pages[oldPath].title);
  assert.equal(meta.openGraph.type, 'article');
}
console.log(`SEO checks passed: ${Object.keys(routes).length} static routes, ${Object.keys(migration.posts).length} preserved articles, ${Object.keys(migration.redirects).length} redirects.`);
