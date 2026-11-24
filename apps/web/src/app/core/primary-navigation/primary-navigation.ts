import { Localization } from '../localization/localization';
import { Component, computed, inject } from '@angular/core';
import { isActive, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-primary-navigation',
  imports: [RouterLink],
  template: `
    <nav [attr.aria-label]="i18n.text('primary')">
      <ul class="grid grid-cols-3 gap-1 md:flex md:gap-2">
        @for (destination of destinations; track destination.path) {
          <li>
            <a
              class="flex min-h-11 min-w-11 items-center justify-center rounded-control px-2 py-2
                     text-center text-sm text-muted hover:bg-surface-cool hover:text-action-strong
                     aria-[current]:bg-surface-cool aria-[current]:font-semibold
                     aria-[current]:text-action-strong aria-[current]:underline
                     aria-[current]:decoration-2 aria-[current]:underline-offset-4 md:px-4"
              [routerLink]="destination.path"
              [attr.aria-current]="destination.current()"
            >{{ i18n.text(destination.label) }}</a>
          </li>
        }
      </ul>
    </nav>
  `,
})
export class PrimaryNavigation {
  protected readonly i18n = inject(Localization);
  private readonly router = inject(Router);

  protected readonly destinations = [
    this.destination('overview', '/'),
    this.destination('map', '/map', '/beaches'),
    this.destination('academyNav', '/academy', '/academy'),
  ];

  private destination(label: 'overview' | 'map' | 'academyNav', path: string, sectionPath?: string) {
    const page = isActive(path, this.router, { paths: 'exact' });
    const section = sectionPath && isActive(sectionPath, this.router, { paths: 'subset' });

    return {
      label,
      path,
      current: computed(() => page() ? 'page' : section && section() ? 'location' : null),
    };
  }
}
