import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { App } from './app';
import { appConfig } from './app.config';

describe('App routes', () => {
  it.each([
    ['/', 'Home'],
    ['/map', 'Explore Map'],
    ['/beaches/example', 'Beach Details'],
    ['/academy', 'Amber Academy'],
    ['/academy/example', 'Article Reader'],
  ])('renders %s through the root router outlet', async (url, heading) => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: appConfig.providers,
    });

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const router = TestBed.inject(Router);
    expect(await router.navigateByUrl(url)).toBe(true);
    await fixture.whenStable();

    const host: HTMLElement = fixture.nativeElement;
    expect(router.url).toBe(url);
    expect(host.querySelector('main h1')?.textContent).toBe(heading);
  });
});
