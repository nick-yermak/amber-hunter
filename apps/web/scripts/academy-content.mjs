import { randomUUID } from 'node:crypto';
import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked } from 'marked';

export const webRoot = fileURLToPath(new URL('../', import.meta.url));
export const contentRoot = resolve(webRoot, 'content/academy');
export const publicRoot = resolve(webRoot, 'public');
const output = resolve(publicRoot, 'academy-content/en.json');
const fields = ['id', 'slug', 'lang', 'title', 'summary'];
const keyPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const allowedTokens = new Set([
  'space', 'heading', 'paragraph', 'text', 'escape', 'strong', 'em',
  'list', 'list_item', 'link', 'image',
]);
const markdown = new Marked({ gfm: true });

function validateLink(href) {
  if (!/^https:\/\//.test(href) || /[\s\p{Cc}\\<>]/u.test(href)) {
    throw new Error('Links must use literal https:// URLs');
  }
  const url = new URL(href);
  if (url.username || url.password) throw new Error('Link credentials are forbidden');
}

function validateImage(token, assets) {
  if (!token.text.trim() || !/^\/academy-images\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.(?:png|jpe?g|webp|avif)$/.test(token.href)) {
    throw new Error('Images require alt text and a local /academy-images/ raster path');
  }
  const segments = token.href.slice(1).split('/');
  const filename = segments.pop();
  let directory = assets;
  for (const segment of segments) {
    directory = resolve(directory, segment);
    if (!lstatSync(directory, { throwIfNoEntry: false })?.isDirectory()) {
      throw new Error('Image directories must exist and cannot be symbolic links');
    }
  }
  if (!lstatSync(resolve(directory, filename), { throwIfNoEntry: false })?.isFile()) {
    throw new Error('Image must be a regular file inside public');
  }
}

export function compileArticle(source, assets = publicRoot) {
  const match = /^---\n([^]*?)\n---\n([^]+)$/.exec(source.replaceAll('\r\n', '\n'));
  if (!match) throw new Error('Expected delimited frontmatter and a Markdown body');
  const metadata = {};
  for (const line of match[1].split('\n')) {
    const entry = /^(id|slug|lang|title|summary): (\S(?:.*\S)?)$/u.exec(line);
    if (!entry || Object.hasOwn(metadata, entry[1]) || /[\p{Cc}<>]/u.test(entry[2])) {
      throw new Error('Invalid or duplicate frontmatter field');
    }
    metadata[entry[1]] = entry[2];
  }
  if (fields.some((field) => !Object.hasOwn(metadata, field)) || metadata.lang !== 'en' ||
      !keyPattern.test(metadata.id) || !keyPattern.test(metadata.slug)) {
    throw new Error('Required frontmatter: id, slug, lang: en, title and summary');
  }

  const body = match[2];
  // Exclude angle-bracket syntax before lexing, including constructs consumed as link destinations.
  if (/[<>]/.test(body)) throw new Error('Raw HTML and angle-bracket syntax are forbidden');
  const tokens = markdown.lexer(body);
  if (!tokens.some((token) => token.type !== 'space') || Object.keys(tokens.links).length) {
    throw new Error('Expected article content with inline links only');
  }
  markdown.walkTokens(tokens, (token) => {
    if (!allowedTokens.has(token.type)) throw new Error(`Unsupported Markdown: ${token.type}`);
    if (token.type === 'list_item' && token.task) throw new Error('Task lists are unsupported');
    if (token.type === 'heading' && token.depth !== 2) throw new Error('Use level-two section headings');
    if (token.type === 'link') validateLink(token.href);
    if (token.type === 'image') validateImage(token, assets);
  });
  return { ...Object.fromEntries(fields.map((field) => [field, metadata[field]])), html: markdown.parser(tokens) };
}

export function compileLibrary(sources, assets = publicRoot) {
  const ids = new Set();
  const slugs = new Set();
  return [...sources].sort(([left], [right]) => left < right ? -1 : Number(left > right)).map(([name, source]) => {
    try {
      const article = compileArticle(source, assets);
      if (ids.has(article.id) || slugs.has(article.slug)) throw new Error('Duplicate article ID or slug');
      ids.add(article.id);
      slugs.add(article.slug);
      return article;
    } catch (error) {
      throw new Error(`${name}: ${error.message}`, { cause: error });
    }
  });
}

export function generateAcademy() {
  const english = resolve(contentRoot, 'en');
  mkdirSync(resolve(output, '..'), { recursive: true });
  const scratch = resolve(webRoot, '.angular');
  mkdirSync(scratch, { recursive: true });
  const temporary = resolve(scratch, `academy-${randomUUID()}.tmp`);
  try {
    const sources = readdirSync(english).filter((name) => name.endsWith('.md'))
      .map((name) => [name, readFileSync(resolve(english, name), 'utf8')]);
    if (!sources.length) throw new Error('No English Academy articles found');
    const json = JSON.stringify(compileLibrary(sources), null, 2) + '\n';
    if (existsSync(output) && readFileSync(output, 'utf8') === json) return;
    writeFileSync(temporary, json);
    renameSync(temporary, output);
  } catch (error) {
    rmSync(temporary, { force: true });
    rmSync(output, { force: true });
    throw error;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) generateAcademy();
