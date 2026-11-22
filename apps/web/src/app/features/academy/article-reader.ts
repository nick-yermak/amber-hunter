import { afterRenderEffect, Component, ElementRef, input, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AcademyArticle } from './academy-library';

@Component({
  selector: 'app-article-reader',
  imports: [RouterLink],
  template: `
    <div class="mx-auto max-w-3xl px-4 py-8 sm:px-8 md:py-12" lang="en">
      <a routerLink="/academy" class="mb-5 inline-flex min-h-11 items-center text-action underline underline-offset-4">
        Back to Amber Academy
      </a>
      @if (article(); as entry) {
        <article aria-labelledby="article-title">
          <h1 #heading id="article-title" tabindex="-1" class="text-3xl font-semibold tracking-tight sm:text-4xl">
            {{ entry.title }}
          </h1>
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
          {{ article() === false ? 'Article unavailable' : 'Article not found' }}
        </h1>
        <p class="mt-4 text-muted">
          {{ article() === false ? 'Refresh the page to try again.' : 'Choose an article from Amber Academy.' }}
        </p>
      }
    </div>
  `,
})
export class ArticleReader {
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
