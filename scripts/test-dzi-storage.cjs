const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const compiled = ts.transpileModule(fs.readFileSync('lib/dzi/storage.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const exportsObject = {};
vm.runInNewContext(compiled, { exports: exportsObject });
const { validDziId, listDziUploads, deleteDziBatch } = exportsObject;

function mockStorage(paths) {
  const objects = new Set(paths);
  return {
    objects,
    async list(prefix, { limit, offset }) {
      const children = new Map();
      const start = prefix ? prefix + '/' : '';
      for (const path of objects) {
        if (!path.startsWith(start)) continue;
        const rel = path.slice(start.length);
        const name = rel.split('/')[0];
        const file = !rel.includes('/');
        children.set(name, { name, id: file ? path : null, created_at: '2026-10-07T00:00:00Z' });
      }
      return { data: [...children.values()].sort((a, b) => a.name.localeCompare(b.name)).slice(offset, offset + limit), error: null };
    },
    getPublicUrl(path) { return { data: { publicUrl: 'https://example.test/' + path } }; },
    async remove(paths) {
      assert.ok(paths.length <= 1000);
      paths.forEach(path => objects.delete(path));
      return { data: paths.map(name => ({ name })), error: null };
    },
  };
}

(async () => {
  for (const id of ['dzi', 'dzi/../other', 'dzi/123-a/tiles', 'photo.png', '../123-a.dzi']) assert.equal(validDziId(id), false);
  const id = 'dzi/1791377321570-abc';
  const descriptor = id + '/nested/slide.dzi';
  const tiles = Array.from({ length: 425 }, (_, i) => `${id}/nested/slide_files/10/${i}_0.jpeg`);
  const storage = mockStorage([descriptor, ...tiles, '123-legacy.dzi', 'photo.png', 'dzi/1791377321571-def/other.dzi']);
  const history = await listDziUploads(storage);
  assert.equal(history.length, 3);
  assert.equal(history.find(x => x.id === id).url, 'https://example.test/' + descriptor);
  let result = await deleteDziBatch(storage, id);
  assert.equal(result.done, true);
  assert.equal(result.removed, 426);
  assert.equal([...storage.objects].filter(p => p.startsWith(id + '/')).length, 0);
  assert.ok(storage.objects.has('photo.png'));
  assert.ok(storage.objects.has('dzi/1791377321571-def/other.dzi'));
  await deleteDziBatch(storage, '123-legacy.dzi');
  assert.ok(storage.objects.has('photo.png'));
  await assert.rejects(() => deleteDziBatch(storage, '../photo.png'), /Invalid slide id/);
  await assert.rejects(() => deleteDziBatch({ ...storage, remove: async () => ({ data: null, error: { message: 'Storage unavailable' } }) }, '123-legacy.dzi'), /Storage unavailable/);
  const incomplete = mockStorage(['dzi/1791377321570-abc/slide_files/0/0_0.jpeg']);
  assert.equal((await listDziUploads(incomplete))[0].url, null);
  const many = mockStorage(Array.from({ length: 205 }, (_, i) => `${1000 + i}-legacy.dzi`));
  assert.equal((await listDziUploads(many)).length, 205);
  const hugeId = 'dzi/1791377321572-huge';
  const huge = mockStorage([
    `${hugeId}/slide.dzi`,
    ...Array.from({ length: 1005 }, (_, i) => `${hugeId}/slide_files/12/${i}_0.jpeg`),
  ]);
  result = await deleteDziBatch(huge, hugeId);
  assert.equal(result.done, false);
  assert.equal(result.removed, 1000);
  result = await deleteDziBatch(huge, hugeId);
  assert.equal(result.done, true);
  assert.equal(result.removed, 6);
  console.log('DZI history and deletion checks passed (pagination, nested packages, isolation, partial uploads, storage errors).');
})().catch(error => { console.error(error); process.exitCode = 1; });
