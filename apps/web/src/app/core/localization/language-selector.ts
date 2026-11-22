import { Component, inject } from '@angular/core';
import { isLanguage, Localization } from './localization';

@Component({
  selector: 'app-language-selector',
  template: `
    <label class="flex items-center gap-2">
      <span class="sr-only">{{ i18n.text('language') }}</span>
      <select
        class="min-h-11 min-w-11 max-w-full rounded-control border border-divider bg-surface px-2 text-sm text-ink"
        [value]="i18n.language()"
        (change)="selectLanguage($event)"
      >
        <option value="en" lang="en">English</option>
        <option value="pl" lang="pl">Polski</option>
        <option value="ru" lang="ru">Русский</option>
      </select>
    </label>
  `,
})
export class LanguageSelector {
  protected readonly i18n = inject(Localization);

  protected selectLanguage(event: Event): void {
    const language = (event.target as HTMLSelectElement).value;
    if (isLanguage(language)) this.i18n.select(language);
  }
}
