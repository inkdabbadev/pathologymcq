import assert from 'node:assert/strict';
import { test } from 'node:test';
import { articleUrl, blogHref } from '../lib/blog/links.ts';

test('external articles stay editable from admin and open their destination publicly', () => {
  const post = { slug: 'example', external_url: 'https://pathologymcq.com/original/' };
  assert.equal(blogHref(post), post.external_url);
  assert.equal(blogHref(post, '/admin/blog'), '/admin/blog/example');
});

test('blank or unsafe destinations fall back to a local article', () => {
  for (const value of ['', null, 'javascript:alert(1)', 'data:text/html,test', '//evil.example', 'https://user:password@example.com']) {
    assert.equal(articleUrl(value), null);
    assert.equal(blogHref({ slug: 'example', external_url: value }), '/blog/example');
  }
  assert.equal(articleUrl(' https://example.com/article '), 'https://example.com/article');
});
