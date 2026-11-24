import { Component } from '@angular/core';
import { LanguageSelector } from '../localization/language-selector';
import { PrimaryNavigation } from '../primary-navigation/primary-navigation';

@Component({
  selector: 'app-header',
  imports: [PrimaryNavigation, LanguageSelector],
  host: { class: 'block' },
  template: `
    <header class="border-b border-divider bg-surface">
      <div
        class="safe-page-gutters mx-auto flex min-h-14 max-w-300 items-center gap-3 lg:gap-8 py-2
               pt-[max(0.5rem,env(safe-area-inset-top))] md:min-h-16"
      >
        <span class="font-semibold tracking-tight text-action-strong">Amber Hunter</span>
        <app-primary-navigation class="hidden md:block" />
        <app-language-selector class="ms-auto" />
      </div>
    </header>
  `,
})
export class Header {}
