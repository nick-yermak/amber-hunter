import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { en } from './en';
import { languagePreferenceKey, Localization, resolveLanguage } from './localization';
import { pl } from './pl';
import { ru } from './ru';

function browser(saved: string | null, languages: string[]): Window {
  return {
    localStorage: { getItem: () => saved },
    navigator: { languages },
  } as unknown as Window;
}

describe('language resolution', () => {
  it('prefers a saved language to browser preferences', () => {
    expect(resolveLanguage(browser('ru', ['pl-PL']))).toBe('ru');
  });

  it('chooses the first supported valid browser tag regardless of region or case', () => {
    expect(resolveLanguage(browser('de', ['de-DE', 'pl_invalid', 'pL-pl', 'ru-RU']))).toBe('pl');
    expect(resolveLanguage(browser(null, ['ru-Cyrl-RU', 'en-US']))).toBe('ru');
  });

  it('falls back to English when no preference is usable', () => {
    expect(resolveLanguage(browser('INVALID', ['fr-CA']))).toBe('en');
    expect(resolveLanguage(null)).toBe('en');
    expect(resolveLanguage({
      get navigator() { throw new Error('Browser unavailable'); },
    } as unknown as Window)).toBe('en');
  });

  it('uses browser preferences if storage access fails', () => {
    expect(resolveLanguage({
      get localStorage() { throw new Error('Storage blocked'); },
      navigator: { languages: ['ru-RU'] },
    } as unknown as Window)).toBe('ru');
  });
});

describe('Localization', () => {
  afterEach(() => localStorage.removeItem(languagePreferenceKey));

  it('persists explicit choices so a new instance starts in the selected language', () => {
    TestBed.inject(Localization).select('pl');
    expect(localStorage.getItem(languagePreferenceKey)).toBe('pl');

    TestBed.resetTestingModule();
    expect(TestBed.inject(Localization).language()).toBe('pl');
  });

  it('updates language and document even when persistence fails', () => {
    const document = {
      documentElement: { lang: '' },
      defaultView: {
        navigator: { languages: ['en'] },
        localStorage: { setItem() { throw new Error('Storage blocked'); } },
      },
    };
    TestBed.configureTestingModule({ providers: [{ provide: DOCUMENT, useValue: document }] });
    const i18n = TestBed.inject(Localization);
    i18n.select('ru');
    TestBed.tick();
    expect(document.documentElement.lang).toBe('ru');
    expect(i18n.text('detailsLink', { beach: 'Orle' })).toBe('Подробнее о пляже Orle');
    expect(i18n.number(1.2)).toBe('1,2');
    expect(i18n.date('2030-10-07T04:00:00Z', 'utc')).toContain('04:00');
    expect(i18n.date('2030-10-07T04:00:00Z', 'warsaw')).toContain('06:00');
  });

  it.each([pl, ru])('preserves all template placeholders in every nonempty translation', (dictionary) => {
    const placeholders = (message: string) => (message.match(/\{\w+\}/g) ?? []).sort();
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(dictionary[key].trim(), key).not.toBe('');
      expect(placeholders(dictionary[key]), key).toEqual(placeholders(en[key]));
    }
  });
});
