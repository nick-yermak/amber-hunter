import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ResolveFn } from '@angular/router';
import type { Language } from '../../core/localization/localization';

export interface AcademyArticle<CollectionLanguage extends Language = Language> {
  readonly id: string;
  readonly slug: string;
  readonly lang: CollectionLanguage;
  readonly title: string;
  readonly summary: string;
  readonly html: string;
}

const keyPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const defaultCollection = 'en';
type AvailableCollection = typeof defaultCollection;

export function readAcademyLibrary<CollectionLanguage extends Language>(
  value: unknown,
  language: CollectionLanguage,
): readonly AcademyArticle<CollectionLanguage>[] {
  if (!Array.isArray(value) || !value.length) throw new Error('Academy library is empty or invalid');
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const article of value) {
    if (!article || typeof article !== 'object' || article.lang !== language ||
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
  private readonly pending = new Map<AvailableCollection, Promise<readonly AcademyArticle[]>>();

  load(language: AvailableCollection): Promise<readonly AcademyArticle[]> {
    const pending = this.pending.get(language);
    if (pending) return pending;

    const request = this.fetchArticles(language).finally(() => {
      this.pending.delete(language);
    });
    this.pending.set(language, request);
    return request;
  }

  private async fetchArticles(language: AvailableCollection): Promise<readonly AcademyArticle[]> {
    const url = new URL(`academy-content/${language}.json`, this.document.baseURI);
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) throw new Error('Academy library request failed');
    return readAcademyLibrary(await response.json(), language);
  }
}

export const resolveAcademyLibrary: ResolveFn<readonly AcademyArticle[] | null> = () =>
  inject(AcademyLibrary).load(defaultCollection).catch(() => null);

export const resolveAcademyArticle: ResolveFn<AcademyArticle | null | false> = async (route) => {
  const slug = route.url[1]?.path ?? '';
  if (!keyPattern.test(slug)) return null;
  try {
    return (await inject(AcademyLibrary).load(defaultCollection)).find((article) => article.slug === slug) ?? null;
  } catch {
    return false;
  }
};
