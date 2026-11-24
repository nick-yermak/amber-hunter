import { Localization } from '../../core/localization/localization';
import { inject, afterRenderEffect, Component, ElementRef, input, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AcademyArticle } from './academy-library';

@Component({
  selector: 'app-article-reader',
  imports: [RouterLink],
  template: `
    <div class="mx-auto max-w-3xl px-4 py-8 sm:px-8 md:py-12">
      @if (article(); as entry) {
        @if (i18n.language() !== entry.lang) {
          <p id="article-language" class="mb-4 text-sm text-muted">{{ i18n.text('academyFallback') }}</p>
        }
        <article aria-labelledby="article-title" [attr.lang]="entry.lang">
          <h1 #heading id="article-title" tabindex="-1" class="text-3xl font-semibold tracking-tight sm:text-4xl"
              [attr.aria-describedby]="i18n.language() !== entry.lang ? 'article-language' : null">
            {{ entry.title }}
          </h1>
          <a routerLink="/academy" [attr.lang]="i18n.language()"
             class="mt-2 inline-flex min-h-11 items-center text-action underline underline-offset-4">
            {{ i18n.text('academyBack') }}
          </a>
          <p class="mt-4 text-lg leading-relaxed text-muted">{{ entry.summary }}</p>
          <div
            class="mt-7 leading-relaxed wrap-break-word
                   [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold
                   [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:ps-6
                   [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:ps-6 [&_li]:mb-2
                   [&_a]:text-action [&_a]:underline [&_a]:underline-offset-4 [&_img]:h-auto [&_img]:max-w-full"
            [innerHTML]="entry.html"
          ></div>
        </article>
      } @else {
        <h1 #heading tabindex="-1" class="text-3xl font-semibold">
          {{ i18n.text(article() === false ? 'articleUnavailable' : 'articleMissing') }}
        </h1>
        <a routerLink="/academy" class="mt-2 inline-flex min-h-11 items-center text-action underline underline-offset-4">
          {{ i18n.text('academyBack') }}
        </a>
        <p class="mt-4 text-muted">
          {{ i18n.text(article() === false ? 'articleRetry' : 'articleChoose') }}
        </p>
      }
    </div>
  `,
})
export class ArticleReader {
  protected readonly i18n = inject(Localization);
  readonly article = input.required<AcademyArticle | null | false>();
  private readonly heading = viewChild<ElementRef<HTMLHeadingElement>>('heading');

  constructor() {
    afterRenderEffect({
      write: () => {
        this.article();
        this.heading()?.nativeElement.focus();
      },
    });
  }
}
