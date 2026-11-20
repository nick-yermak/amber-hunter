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
    ['/', 'Home', 'Overview', 'page'],
    ['/map', 'Explore Map', 'Map', 'page'],
    ['/beaches/example', 'Beach Details', 'Map', 'location'],
    ['/academy', 'Amber Academy', 'Academy', 'page'],
    ['/academy/example?source=overview#intro', 'Article Reader', 'Academy', 'location'],
  ])('renders %s and marks the current destination in both layouts', async (url, heading, label, current) => {
    const { fixture, host, router } = createShell();

    expect(await router.navigateByUrl(url)).toBe(true);
    await fixture.whenStable();

    expect(router.url).toBe(url);
    expect(host.querySelectorAll('router-outlet')).toHaveLength(1);
    expect(host.querySelector('main h1')?.textContent).toBe(heading);

    for (const selector of ['header nav', 'app-mobile-navigation nav']) {
      const activeLinks = host.querySelectorAll(`${selector} a[aria-current]`);
      expect(activeLinks).toHaveLength(1);
      expect(activeLinks[0].textContent?.trim()).toBe(label);
      expect(activeLinks[0].getAttribute('aria-current')).toBe(current);
    }
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
