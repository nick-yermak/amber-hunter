import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { filter, firstValueFrom } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { AcademyLibrary } from './features/academy/academy-library';
import { App } from './app';
import { appConfig } from './app.config';
import { languagePreferenceKey } from './core/localization/localization';

const academyArticles = [
  { id: 'amber', slug: 'amber', lang: 'en', title: 'Baltic amber', summary: 'About amber.',
    html: '<h2>Sources</h2><ul><li><a href="https://example.org">Reference</a></li></ul>' },
  { id: 'waves', slug: 'waves', lang: 'en', title: 'Wind and waves', summary: 'About waves.',
    html: '<h2>Wave basics</h2><p>Wind generates waves.</p>' },
];

describe('App shell', () => {
  afterEach(() => localStorage.removeItem(languagePreferenceKey));

  function createShell() {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [
        ...appConfig.providers,
        provideLocationMocks(),
        { provide: AcademyLibrary, useValue: { load: async () => academyArticles } },
      ],
    });

    const fixture = TestBed.createComponent(App);
    const host: HTMLElement = fixture.nativeElement;

    return { fixture, host, router: TestBed.inject(Router) };
  }

  it.each([
    ['/', 'Coastal forecast', 'Overview', 'page'],
    ['/map', 'Explore Map', 'Map', 'page'],
    ['/beaches/example', 'Beach not found', 'Map', 'location'],
    ['/academy', 'Amber Academy', 'Academy', 'page'],
    ['/academy/example?source=overview#intro', 'Article not found', 'Academy', 'location'],
  ])('renders %s and marks the current destination in both layouts', async (url, heading, label, current) => {
    const { fixture, host, router } = createShell();

    expect(await router.navigateByUrl(url)).toBe(true);
    await fixture.whenStable();

    expect(router.url).toBe(url);
    expect(host.querySelectorAll('router-outlet')).toHaveLength(1);
    expect(host.querySelector('main h1')?.textContent?.trim()).toBe(heading);

    for (const selector of ['header nav', 'app-mobile-navigation nav']) {
      const activeLinks = host.querySelectorAll(`${selector} a[aria-current]`);
      expect(activeLinks).toHaveLength(1);
      expect(activeLinks[0].textContent?.trim()).toBe(label);
      expect(activeLinks[0].getAttribute('aria-current')).toBe(current);
    }
  });

  it('lists the articles and renders a deep link using only the path slug', async () => {
    const { fixture, host, router } = createShell();
    await router.navigateByUrl('/academy');
    await fixture.whenStable();
    expect(host.querySelector('main ul')?.textContent).toContain('About waves.');
    expect(host.querySelector('main a')?.getAttribute('href')).toBe('/academy/amber');

    await router.navigateByUrl('/academy/amber;slug=waves?slug=waves&article=invalid');
    await fixture.whenStable();
    const article = host.querySelector('main article')!;
    expect(article.querySelector('h1')?.textContent?.trim()).toBe('Baltic amber');
    expect(host.querySelector('main a')?.textContent?.trim()).toBe('Back to Amber Academy');
    expect(article.querySelector('h2')?.textContent).toBe('Sources');
    expect(article.querySelector('li a')?.textContent).toBe('Reference');
    expect(host.querySelector('main a')?.getAttribute('href')).toBe('/academy');

    const reader = host.querySelector('app-article-reader');
    await router.navigateByUrl('/academy/waves');
    await fixture.whenStable();
    expect(host.querySelector('main h1')?.textContent?.trim()).toBe('Wind and waves');
    expect(host.querySelector('app-article-reader')).toBe(reader);

    router.setUpLocationChangeListener();
    const location = TestBed.inject(Location);
    for (const [direction, title] of [['back', 'Baltic amber'], ['forward', 'Wind and waves']] as const) {
      const navigation = firstValueFrom(router.events.pipe(filter((event) => event instanceof NavigationEnd)));
      location[direction]();
      await navigation;
      await fixture.whenStable();
      expect(host.querySelector('main h1')?.textContent?.trim()).toBe(title);
    }

    await router.navigateByUrl('/academy/missing;slug=amber?slug=amber');
    await fixture.whenStable();
    expect(host.querySelector('main h1')?.textContent?.trim()).toBe('Article not found');
    expect(host.querySelector('main h1 + a')?.textContent?.trim()).toBe('Back to Amber Academy');
  });

  it('switches the whole shell without navigation and preserves map and reader history', async () => {
    const { fixture, host, router } = createShell();
    const mapUrl = '/map?beach=mikoszewo&source=overview#preview';
    const articleUrl = '/academy/amber?source=map#sources';
    await router.navigateByUrl(mapUrl);
    await fixture.whenStable();

    const selector = host.querySelector<HTMLSelectElement>('header select')!;
    const selected = host.querySelector('aside [aria-pressed="true"]');
    const choose = async (language: string) => {
      selector.value = language;
      selector.dispatchEvent(new Event('change'));
      await fixture.whenStable();
    };

    await choose('pl');
    expect(selector.labels?.[0].textContent).toContain('Język');
    expect(document.documentElement.lang).toBe('pl');
    expect(document.title).toBe('Mapa wybrzeża');
    expect(host.querySelector('main h1')?.textContent).toBe('Mapa wybrzeża');
    expect(host.querySelector('aside [aria-pressed="true"]')).toBe(selected);
    expect(host.textContent).toContain('Ograniczony dostęp w tym scenariuszu');
    expect(host.textContent).toContain('DANE PRZYKŁADOWE');
    expect(router.url).toBe(mapUrl);

    await router.navigateByUrl(articleUrl);
    await fixture.whenStable();
    const article = host.querySelector('main article');
    await choose('ru');
    expect(document.documentElement.lang).toBe('ru');
    expect(document.title).toBe('Чтение статьи');
    expect(host.textContent).toContain('Статьи пока доступны только на английском языке.');
    expect(article?.getAttribute('lang')).toBe('en');
    expect(article?.querySelector('h1')?.textContent?.trim()).toBe('Baltic amber');
    expect(host.querySelector('main article')).toBe(article);
    expect(router.url).toBe(articleUrl);

    router.setUpLocationChangeListener();
    const navigation = firstValueFrom(router.events.pipe(filter((event) => event instanceof NavigationEnd)));
    TestBed.inject(Location).back();
    await navigation;
    await fixture.whenStable();
    expect(router.url).toBe(mapUrl);
    expect(document.title).toBe('Карта побережья');
    expect(host.querySelector('aside [aria-pressed="true"]')?.textContent).toContain('Mikoszewo');
  });

  it('keeps beach identity and sample forecasts independent of query parameters', async () => {
    const { fixture, host, router } = createShell();

    for (const query of ['forecasts=preview', 'forecasts=preview&slug=orle&extra=unknown']) {
      await router.navigateByUrl('/beaches/mikoszewo?' + query);
      await fixture.whenStable();

      const page = host.querySelector('main')!;
      expect(page.querySelector('h1')?.textContent).toBe('Mikoszewo');
      expect(page.textContent).toContain('Restricted access in this scenario');
      expect(page.textContent).toContain('Stale in scenario');
      expect(page.textContent).toContain('82 / 100');
    }

    await router.navigateByUrl('/beaches/unknown?slug=mikoszewo&forecasts=preview');
    await fixture.whenStable();
    expect(host.querySelector('main h1')?.textContent).toBe('Beach not found');
    expect(host.querySelector('main a')?.getAttribute('href')).toBe('/map');
  });

  it('uses the beach path segment even when a matrix parameter has the same name', async () => {
    const { fixture, host, router } = createShell();
    await router.navigateByUrl('/beaches/mikoszewo;slug=orle');
    await fixture.whenStable();

    const page = host.querySelector('main')!;
    expect(page.querySelector('h1')?.textContent).toBe('Mikoszewo');
    expect(page.textContent).toContain('Restricted access in this scenario');
    expect(page.textContent).toContain('Stale in scenario');
    expect(page.querySelector('a')?.getAttribute('href')).toBe('/map?beach=mikoszewo');
  });

  it('keeps an unknown beach path unknown despite a valid matrix slug', async () => {
    const { fixture, host, router } = createShell();
    await router.navigateByUrl('/beaches/unknown;slug=mikoszewo');
    await fixture.whenStable();

    const page = host.querySelector('main')!;
    expect(page.querySelector('h1')?.textContent).toBe('Beach not found');
    expect(page.querySelector('a')?.getAttribute('href')).toBe('/map');
    expect(page.querySelector('time')).toBeNull();
  });

  it.each(['beaches=preview', 'forecasts=preview', 'beaches=preview&forecasts=preview'])(
    'keeps Map identities and forecast intact with %s',
    async (query) => {
      const { fixture, host, router } = createShell();
      await router.navigateByUrl('/map?beach=mikoszewo&extra=unknown&' + query);
      await fixture.whenStable();

      const list = Array.from(host.querySelectorAll('aside li button span:first-child'));
      expect(list.map((name) => name.textContent?.trim())).toEqual(['Sobieszewo', 'Mikoszewo', 'Orle']);
      expect(host.querySelector('aside [aria-pressed="true"]')?.textContent).toContain('Mikoszewo');
      const preview = host.querySelector('[aria-labelledby="beach-preview-heading"]')!;
      for (const text of ['SAMPLE DATA', 'Restricted access in this scenario', 'Stale in scenario', '82 / 100']) {
        expect(preview.textContent).toContain(text);
      }
    },
  );

  it('navigates from the map preview to details and restores selection on return', async () => {
    const { fixture, host, router } = createShell();

    for (const url of ['/map?beach=', '/map?beach=invalid']) {
      await router.navigateByUrl(url);
      await fixture.whenStable();
      expect(host.querySelector('aside [aria-pressed="true"]')).toBeNull();
      expect(host.querySelector('[aria-labelledby="beach-preview-heading"] a')).toBeNull();
    }

    host.querySelector<HTMLButtonElement>('aside button')!.click();
    await fixture.whenStable();
    const details = host.querySelector<HTMLAnchorElement>('a[href="/beaches/sobieszewo"]')!;
    details.click();
    await fixture.whenStable();
    expect(router.url).toBe('/beaches/sobieszewo');
    expect(host.querySelector('main h1')?.textContent).toContain('Sobieszewo');

    host.querySelector<HTMLAnchorElement>('a[href="/map?beach=sobieszewo"]')!.click();
    await fixture.whenStable();
    expect(router.url).toBe('/map?beach=sobieszewo');
    expect(host.querySelector('aside [aria-pressed="true"]')?.textContent).toContain('Sobieszewo');
  });

  it.each(['header nav', 'app-mobile-navigation nav'])('navigates between destinations from %s', async (selector) => {
    const { fixture, host, router } = createShell();

    await router.navigateByUrl('/beaches/example');
    await fixture.whenStable();

    const links = Array.from(host.querySelectorAll<HTMLAnchorElement>(`${selector} a`));
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/', '/map', '/academy']);

    for (const link of [links[2], links[1], links[0]]) {
      link.click();
      await fixture.whenStable();

      expect(router.url).toBe(link.getAttribute('href'));
      expect(link.getAttribute('aria-current')).toBe('page');
      expect(host.querySelectorAll(`${selector} a[aria-current]`)).toHaveLength(1);
    }
  });
});
