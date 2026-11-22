import { Localization } from './core/localization/localization';
import { inject, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './core/header/header';
import { MobileNavigation } from './core/mobile-navigation/mobile-navigation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, MobileNavigation],
  host: { class: 'flex min-h-dvh flex-col' },
  template: `
    <button
      type="button"
      class="sr-only focus:not-sr-only focus:fixed focus:z-20
             focus:start-[max(1rem,calc(env(safe-area-inset-left)+0.5rem))]
             focus:top-[max(1rem,calc(env(safe-area-inset-top)+0.5rem))]
             rtl:focus:start-[max(1rem,calc(env(safe-area-inset-right)+0.5rem))]
             focus:rounded-control focus:bg-surface focus:px-4 focus:py-3 focus:text-action-strong"
      (click)="mainContent.focus()"
    >{{ i18n.text('skip') }}</button>
    <app-header />
    <main
      #mainContent
      tabindex="-1"
      class="min-w-0 flex-1"
    >
      <router-outlet />
    </main>
    <app-mobile-navigation />
  `,
})
export class App {
  protected readonly i18n = inject(Localization);
}
