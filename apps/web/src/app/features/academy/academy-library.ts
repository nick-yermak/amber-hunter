import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ResolveFn } from '@angular/router';

export interface AcademyArticle {
  readonly id: string;
  readonly slug: string;
  readonly lang: 'en';
  readonly title: string;
  readonly summary: string;
  readonly html: string;
}

const keyPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function readAcademyLibrary(value: unknown): readonly AcademyArticle[] {
  if (!Array.isArray(value) || !value.length) throw new Error('Academy library is empty or invalid');
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const article of value) {
    if (!article || typeof article !== 'object' || article.lang !== 'en' ||
        !['id', 'slug', 'title', 'summary', 'html'].every(
          (key) => typeof article[key] === 'string' && article[key].trim(),
        ) ||
        !keyPattern.test(article.id) || !keyPattern.test(article.slug) ||
        ids.has(article.id) || slugs.has(article.slug)) {
      throw new Error('Invalid or duplicate Academy article');
    }
    ids.add(article.id);
    slugs.add(article.slug);
  }
  return value;
}

@Injectable({ providedIn: 'root' })
export class AcademyLibrary {
  private readonly document = inject(DOCUMENT);
  private pending?: Promise<readonly AcademyArticle[]>;

  load(): Promise<readonly AcademyArticle[]> {
    return this.pending ??= this.fetchArticles().finally(() => {
      this.pending = undefined;
    });
  }

  private async fetchArticles(): Promise<readonly AcademyArticle[]> {
    const response = await fetch(new URL('academy-content/en.json', this.document.baseURI), { cache: 'no-cache' });
    if (!response.ok) throw new Error('Academy library request failed');
    return readAcademyLibrary(await response.json());
  }
}

export const resolveAcademyLibrary: ResolveFn<readonly AcademyArticle[] | null> = () =>
  inject(AcademyLibrary).load().catch(() => null);

export const resolveAcademyArticle: ResolveFn<AcademyArticle | null | false> = async (route) => {
  const slug = route.url[1]?.path ?? '';
  if (!keyPattern.test(slug)) return null;
  try {
    return (await inject(AcademyLibrary).load()).find((article) => article.slug === slug) ?? null;
  } catch {
    return false;
  }
};
