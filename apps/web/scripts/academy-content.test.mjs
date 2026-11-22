import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { compileArticle, compileLibrary } from './academy-content.mjs';

const frontmatter = '---\nid: amber\nslug: amber\nlang: en\ntitle: Amber\nsummary: Learn about amber.\n---\n';
const article = (body) => frontmatter + '\n' + body;
const valid = article('## Sources\n\n- [Amber](https://example.org/amber)');

test('renders supported Markdown with a deterministic library order', () => {
  const other = valid.replaceAll(': amber', ': waves');
  const inputs = [['z.md', other], ['a.md', valid]];
  const result = compileLibrary(inputs);
  assert.deepEqual(result, compileLibrary(inputs.reverse()));
  assert.deepEqual(result.map(({ slug }) => slug), ['amber', 'waves']);
  assert.match(result[0].html, /<h2>Sources<\/h2>/);
  assert.match(result[0].html, /<a href="https:\/\/example.org\/amber">Amber<\/a>/);
});

test('rejects duplicate, absent and invalid frontmatter and identifiers', () => {
  for (const source of [
    '## No frontmatter',
    valid.replace('lang: en\n', ''),
    valid.replace('id: amber', 'id: amber\nid: second'),
    valid.replace('slug: amber', 'slug: ../amber'),
    valid.replace('id: amber', 'id: Uppercase'),
    valid.replace('title: Amber', 'title: '),
  ]) assert.throws(() => compileArticle(source), /frontmatter/i);
  for (const second of [valid.replace('id: amber', 'id: new'), valid.replace('slug: amber', 'slug: new')]) {
    assert.throws(() => compileLibrary([['first.md', valid], ['second.md', second]]), /second.md: Duplicate/);
  }
});

test('rejects unsupported syntax and unsafe link destinations', () => {
  for (const body of [
    '<script>alert(1)</script>', '<img src=x onerror=alert(1)>',
    '[text](<https://example.com>)', '[text](javascript:alert(1))',
    '[text](jav&#x61;script:alert(1))', '[text](javascript%3Aalert%281%29)',
    '[text](&#106;avascript:alert(1))', '[text](//example.org)',
    '[text](https://user@example.org)', '[text](data:text/html,x)',
    '# Incorrect heading', '~~strike~~', '- [ ] task', '    code', '***', '[text][ref]\n\n[ref]: https://example.org',
  ]) assert.throws(() => compileArticle(article(body)), undefined, body);
  assert.doesNotMatch(compileArticle(article('&lt;script&gt;')).html, /<script>/);
});

test('images require alt text and an existing contained raster path', (context) => {
  const assets = mkdtempSync(join(tmpdir(), 'academy-assets-'));
  context.after(() => rmSync(assets, { recursive: true, force: true }));
  const images = join(assets, 'academy-images');
  mkdirSync(images);
  writeFileSync(join(images, 'amber.png'), '');
  symlinkSync(join(images, 'amber.png'), join(images, 'alias.png'));
  const specimens = join(images, 'specimens');
  mkdirSync(specimens);
  writeFileSync(join(specimens, 'amber.png'), '');
  symlinkSync(specimens, join(images, 'linked-specimens'), 'dir');
  assert.match(compileArticle(article('![A specimen](/academy-images/amber.png)'), assets).html, /alt="A specimen"/);
  assert.match(compileArticle(article('![Amber](/academy-images/specimens/amber.png)'), assets).html, /alt="Amber"/);
  for (const image of [
    '![](/academy-images/amber.png)', '![Amber](/academy-images/absent.png)',
    '![Amber](/academy-images/../amber.png)', '![Amber](/academy-images/%2e%2e/amber.png)',
    '![Amber](/academy-images/alias.png)', '![Amber](/academy-images/linked-specimens/amber.png)', '![Amber](https://example.org/amber.png)',
    '![Amber](/academy-images/amber.svg)',
  ]) assert.throws(() => compileArticle(article(image), assets), /Image/);
});
