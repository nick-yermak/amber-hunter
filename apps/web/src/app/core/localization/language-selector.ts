import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Language, Localization } from './localization';

@Component({
  selector: 'app-language-selector',
  host: {
    class: 'relative block',
    '(document:pointerdown)': 'dismissOutside($event.target)',
    '(focusout)': 'dismissOutside($event.relatedTarget)',
    '(keydown.escape)': 'dismissOnEscape($event)',
  },
  template: `
    <button
      #trigger
      type="button"
      class="flex min-h-11 min-w-28 items-center justify-between gap-3 rounded-full border border-divider
             bg-surface px-4 text-sm font-semibold text-action-strong hover:bg-surface-cool"
      [attr.aria-expanded]="open()"
      [attr.aria-controls]="open() ? 'language-options' : null"
      (click)="toggle()"
    >
      <span class="sr-only">{{ i18n.text('language') }}: </span>
      <span [attr.lang]="i18n.language()">{{ labels[i18n.language()] }}</span>
      <span aria-hidden="true" class="-mt-1 size-2 shrink-0 rotate-45 border-e-2 border-b-2"></span>
    </button>

    @if (open()) {
      <div
        id="language-options"
        role="group"
        [attr.aria-label]="i18n.text('language')"
        class="absolute end-0 top-full z-20 mt-2 w-40 rounded-control border border-divider bg-surface p-1 shadow-lg"
      >
        @for (language of languages; track language) {
          <button
            type="button"
            class="flex min-h-11 w-full items-center justify-between gap-3 rounded-control px-3 text-start
                   text-sm text-ink hover:bg-surface-cool aria-pressed:bg-surface-cool aria-pressed:font-semibold"
            [attr.lang]="language"
            [attr.aria-pressed]="i18n.language() === language"
            (click)="selectLanguage(language)"
          >
            {{ labels[language] }}
            @if (i18n.language() === language) {
              <span aria-hidden="true" class="-mt-1 h-2 w-3 -rotate-45 border-s-2 border-b-2 text-action-strong"></span>
            }
          </button>
        }
      </div>
    }
  `,
})
export class LanguageSelector {
  protected readonly i18n = inject(Localization);
  protected readonly open = signal(false);
  protected readonly labels = { en: 'English', pl: 'Polski', ru: 'Русский' } satisfies Record<Language, string>;
  protected readonly languages: readonly Language[] = ['en', 'pl', 'ru'];

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');

  protected toggle(): void {
    this.open.update((value) => !value);
  }

  protected selectLanguage(language: Language): void {
    this.i18n.select(language);
    this.closeAndFocus();
  }

  protected dismissOutside(target: EventTarget | null): void {
    if (this.open() && (!(target instanceof Node) || !this.host.nativeElement.contains(target))) {
      this.open.set(false);
    }
  }

  protected dismissOnEscape(event: Event): void {
    if (!this.open()) return;
    event.preventDefault();
    this.closeAndFocus();
  }

  private closeAndFocus(): void {
    this.trigger().nativeElement.focus();
    this.open.set(false);
  }
}
