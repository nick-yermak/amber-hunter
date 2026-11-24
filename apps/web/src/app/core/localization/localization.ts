import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';
import { TitleStrategy, RouterStateSnapshot } from '@angular/router';
import { en, MessageKey, Messages } from './en';
import { pl } from './pl';
import { ru } from './ru';

export type Language = 'en' | 'pl' | 'ru';
export const languagePreferenceKey = 'amber-hunter-language';

const messages: Record<Language, Messages> = { en, pl, ru };
const locales: Record<Language, string> = { en: 'en-GB', pl: 'pl-PL', ru: 'ru-RU' };
const dateOptions = {
  full: { dateStyle: 'full', timeZone: 'UTC' },
  outlook: { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' },
  warsaw: {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    timeZone: 'Europe/Warsaw', timeZoneName: 'short',
  },
  utc: { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' },
  localTime: { timeStyle: 'short', timeZone: 'UTC' },
} satisfies Record<string, Intl.DateTimeFormatOptions>;

export function isLanguage(value: unknown): value is Language {
  return value === 'en' || value === 'pl' || value === 'ru';
}

export function resolveLanguage(browser: Window | null): Language {
  try {
    const stored = browser?.localStorage.getItem(languagePreferenceKey);
    if (isLanguage(stored)) return stored;
  } catch {
    // Storage can be unavailable even when the browser provides preferences.
  }

  try {
    for (const tag of browser?.navigator.languages ?? []) {
      try {
        const language = new Intl.Locale(tag).language;
        if (isLanguage(language)) return language;
      } catch {
        // Skip malformed tags and continue to lower-priority preferences.
      }
    }
  } catch {
    // An inaccessible browser preference list is equivalent to no preference.
  }
  return 'en';
}

type Placeholders<Text extends string> =
  Text extends `${string}{${infer Name}}${infer Rest}` ? Name | Placeholders<Rest> : never;

@Injectable({ providedIn: 'root' })
export class Localization {
  private readonly document = inject(DOCUMENT);
  private readonly current = signal(resolveLanguage(this.document.defaultView));
  readonly language = this.current.asReadonly();

  constructor() {
    effect(() => { this.document.documentElement.lang = this.language(); });
  }

  select(language: Language): void {
    this.current.set(language);
    try {
      this.document.defaultView?.localStorage.setItem(languagePreferenceKey, language);
    } catch {
      // The session can still use the selected language.
    }
  }

  text<Key extends MessageKey>(
    key: Key,
    ...args: Placeholders<(typeof en)[Key]> extends never
      ? []
      : [Record<Placeholders<(typeof en)[Key]>, string>]
  ): string {
    const message = messages[this.language()][key];
    const values: Record<string, string> | undefined = args[0];
    return values ? message.replace(/\{(\w+)\}/g, (_, name: string) => values[name]) : message;
  }

  number(value: number, minimumFractionDigits = 0): string {
    return new Intl.NumberFormat(locales[this.language()], { minimumFractionDigits }).format(value);
  }

  date(value: string, format: keyof typeof dateOptions): string {
    return new Intl.DateTimeFormat(locales[this.language()], dateOptions[format]).format(new Date(value));
  }

  timeWindow(start: string, end: string, zone: string): string {
    const clock = (time: string) => this.date(`2000-01-01T${time}:00Z`, 'localTime');
    return `${clock(start)}–${clock(end)} ${zone}`;
  }
}

@Injectable()
export class LocalizedTitleStrategy extends TitleStrategy {
  private readonly document = inject(DOCUMENT);
  private readonly i18n = inject(Localization);
  private readonly titleKey = signal<RouteTitle | undefined>(undefined);

  constructor() {
    super();
    effect(() => {
      const key = this.titleKey();
      if (key) this.document.title = this.i18n.text(key);
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const key = this.buildTitle(snapshot);
    this.titleKey.set(routeTitles.find((title) => title === key));
  }
}

const routeTitles = ['home', 'mapTitle', 'beachDetails', 'academy', 'articleReader'] as const satisfies readonly MessageKey[];
export type RouteTitle = (typeof routeTitles)[number];
