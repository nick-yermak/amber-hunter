import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-route-placeholder',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <div class="rounded-card border border-divider bg-surface p-5 sm:p-8">
        <h1 class="text-3xl font-semibold">{{ heading() }}</h1>
        <p class="mt-2 text-muted">This page is a placeholder.</p>
        <a
          class="mt-4 inline-flex min-h-11 items-center rounded-control px-2 font-medium text-action underline hover:text-action-strong"
          routerLink="/"
        >
          Go to home
        </a>
      </div>
    </section>
  `,
})
export class RoutePlaceholder {
  readonly heading = input.required<string>();
}
