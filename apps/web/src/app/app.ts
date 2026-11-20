import { Component } from '@angular/core';
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
      class="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-20
             focus:rounded-control focus:bg-surface focus:px-4 focus:py-3 focus:text-action-strong"
      (click)="mainContent.focus()"
    >Skip to content</button>
    <app-header />
    <main
      #mainContent
      tabindex="-1"
      class="min-w-0 flex-1
             ps-[env(safe-area-inset-left)] pe-[env(safe-area-inset-right)]"
    >
      <router-outlet />
    </main>
    <app-mobile-navigation />
  `,
})
export class App {}
