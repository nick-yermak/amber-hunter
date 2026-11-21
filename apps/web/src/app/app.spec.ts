import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { App } from './app';
import { appConfig } from './app.config';

describe('App shell', () => {
  function createShell() {
    TestBed.configureTestingModule({
      imports: [App],
      providers: appConfig.providers,
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
    ['/academy/example?source=overview#intro', 'Article Reader', 'Academy', 'location'],
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
