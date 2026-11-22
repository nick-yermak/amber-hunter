import { Localization } from '../../core/localization/localization';
import { inject, afterNextRender, Component, ElementRef, input, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AcademyArticle } from './academy-library';

@Component({
  selector: 'app-academy-index',
  imports: [RouterLink],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8 sm:px-8 md:py-12">
      <h1 #heading tabindex="-1" class="text-3xl font-semibold tracking-tight sm:text-4xl">{{ i18n.text('academy') }}</h1>
      <p class="mt-3 max-w-xl text-muted">{{ i18n.text('academyIntro') }}</p>
      @if (articles(); as library) {
        @if (i18n.language() !== 'en') {
          <p class="mt-3 text-sm text-muted">{{ i18n.text('academyFallback') }}</p>
        }
        <ul class="mt-8 grid gap-4 sm:grid-cols-2">
          @for (article of library; track article.id) {
            <li [attr.lang]="article.lang" class="rounded-card border border-divider bg-surface p-5">
              <h2 class="text-xl font-semibold">
                <a class="inline-flex min-h-11 items-center text-action-strong underline underline-offset-4"
                   [routerLink]="['/academy', article.slug]">{{ article.title }}</a>
              </h2>
              <p class="mt-1 leading-relaxed text-muted">{{ article.summary }}</p>
            </li>
          }
        </ul>
      } @else {
        <p class="mt-8 text-muted">{{ i18n.text('academyUnavailable') }}</p>
      }
    </section>
  `,
})
export class AcademyIndex {
  protected readonly i18n = inject(Localization);
  readonly articles = input.required<readonly AcademyArticle[] | null>();
  private readonly heading = viewChild.required<ElementRef<HTMLHeadingElement>>('heading');

  constructor() {
    afterNextRender(() => this.heading().nativeElement.focus());
  }
}
