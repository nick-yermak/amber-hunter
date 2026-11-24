import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { NavigationEnd, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { filter, firstValueFrom } from 'rxjs';
import { vi } from 'vitest';
import { appConfig } from '../../app.config';
import { BeachDetails } from '../beaches/beach-details';
import { EXPLORE_MAP_BEACHES, ExploreMap } from './explore-map';
import { DEMO_FORECASTS, demoForecasts } from '../../shared/forecast/demo-forecasts';
import { en } from '../../core/localization/en';
import { languagePreferenceKey, Localization } from '../../core/localization/localization';
import { pl } from '../../core/localization/pl';
import { ru } from '../../core/localization/ru';

const engine = vi.hoisted(() => ({
  fail: false,
  eventHandlers: new Map<string, () => void>(),
  resize: vi.fn(),
  remove: vi.fn(),
}));

vi.mock('maplibre-gl', () => ({
  setWorkerUrl: vi.fn(),
  Map: class {
    readonly touchZoomRotate = { disableRotation: vi.fn() };
    readonly resize = engine.resize;
    readonly remove = engine.remove;
    constructor(readonly options: { container: HTMLElement }) {
      if (engine.fail) throw new Error('WebGL initialization failed');
    }
    addControl() {}
    on(event: string, handler: () => void) {
      engine.eventHandlers.set(event, handler);
    }
  },
  AttributionControl: class {},
  NavigationControl: class {},
  Marker: class {
    constructor(readonly options: { element: HTMLElement }) {}
    setLngLat() { return this; }
    addTo(map: { options: { container: HTMLElement } }) {
      map.options.container.append(this.options.element);
      return this;
    }
    remove() { this.options.element.remove(); }
  },
}));

describe('Explore Map', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...appConfig.providers, provideLocationMocks()] });
    engine.fail = false;
    engine.eventHandlers.clear();
    engine.remove.mockClear();
    vi.stubGlobal('WebGL2RenderingContext', class {});
    vi.stubGlobal('ResizeObserver', class {
      observe() {}
      disconnect() {}
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.removeItem(languagePreferenceKey);
  });

  function createMap() {
    const fixture = TestBed.createComponent(ExploreMap);
    fixture.detectChanges();
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;
    const preview = () => host.querySelector('[aria-labelledby="beach-preview-heading"]')?.textContent ?? '';
    const beach = (name: string) =>
      Array.from(host.querySelectorAll<HTMLButtonElement>('aside li button'))
        .find((button) => button.textContent?.includes(name))!;
    return { fixture, host, preview, beach };
  }

  it('uses one selection for HTML controls, map markers and the preview', async () => {
    const { fixture, host, beach, preview } = createMap();
    expect(preview()).toContain('Select a beach');

    beach('Sobieszewo').click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(host.querySelector('[aria-label="Sobieszewo"]')?.getAttribute('aria-pressed')).toBe('true');
    expect(preview()).toContain('SAMPLE DATA');
    expect(preview()).toContain('68');
    expect(preview()).toContain('Medium');
    expect(preview()).toContain('7 Oct 2030');

    host.querySelector<HTMLButtonElement>('button[aria-label="Mikoszewo"]')!.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(beach('Sobieszewo').getAttribute('aria-pressed')).toBe('false');
    expect(beach('Mikoszewo').getAttribute('aria-pressed')).toBe('true');
    expect(preview()).toContain('82');
    expect(preview()).toContain('Stale in scenario');
    expect(preview()).toContain('Restricted access');
    expect(host.querySelector('[aria-labelledby="beach-preview-heading"] button')).toBeNull();
  });

  it('uses the URL for direct selection, list and marker clicks, and Back/Forward', async () => {
    const harness = await RouterTestingHarness.create('/map');
    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);
    router.setUpLocationChangeListener();

    const page = harness.routeNativeElement!;
    const marker = (name: string) => page.querySelector<HTMLButtonElement>(`button[aria-label="${name}"]`)!;
    const list = (name: string) => Array.from(page.querySelectorAll<HTMLButtonElement>('aside button'))
      .find((button) => button.textContent?.includes(name))!;
    const expectSelected = (name: string) => {
      expect(marker(name).getAttribute('aria-pressed')).toBe('true');
      expect(list(name).getAttribute('aria-pressed')).toBe('true');
      expect(page.querySelector('#beach-preview-heading')?.textContent).toBe(name);
    };

    expect(page.querySelector('[aria-pressed="true"]')).toBeNull();
    await harness.navigateByUrl('/map?beach=invalid&extra=kept');
    expect(page.querySelector('[aria-pressed="true"]')).toBeNull();
    await harness.navigateByUrl('/map?beach=sobieszewo&extra=kept');
    expectSelected('Sobieszewo');

    list('Mikoszewo').click();
    await harness.fixture.whenStable();
    expect(router.url).toBe('/map?beach=mikoszewo&extra=kept');
    expectSelected('Mikoszewo');

    marker('Orle').click();
    await harness.fixture.whenStable();
    expect(router.url).toBe('/map?beach=orle&extra=kept');
    expectSelected('Orle');
    marker('Orle').click();
    await harness.fixture.whenStable();

    async function moveInHistory(direction: 'back' | 'forward') {
      const navigation = firstValueFrom(router.events.pipe(filter((event) => event instanceof NavigationEnd)));
      location[direction]();
      await navigation;
      await harness.fixture.whenStable();
    }

    await moveInHistory('back');
    expect(router.url).toBe('/map?beach=mikoszewo&extra=kept');
    expectSelected('Mikoszewo');
    await moveInHistory('forward');
    expect(router.url).toBe('/map?beach=orle&extra=kept');
    expectSelected('Orle');
  });

  it.each(['unsafe', 'restricted', 'unknown'] as const)('shows independent %s safety even for a high current index', async (safety) => {
    TestBed.overrideProvider(DEMO_FORECASTS, {
      useValue: {
        ...demoForecasts,
        beaches: {
          ...demoForecasts.beaches,
          sobieszewo: { safety, forecast: { ...demoForecasts.beaches.sobieszewo.forecast, index: 100 } },
        },
      },
    });
    const { fixture, host, beach, preview } = createMap();
    beach('Sobieszewo').click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(preview().toLowerCase()).toContain(safety);
    expect(preview()).toContain('SAMPLE DATA');
    expect(preview()).toContain('100 / 100');
    const actions = host.querySelectorAll('[aria-labelledby="beach-preview-heading"] :is(button, a)');
    expect(actions).toHaveLength(1);
    expect(actions[0].getAttribute('href')).toBe('/beaches/sobieszewo');
  });

  it('keeps missing forecasts explicit', async () => {
    const { fixture, beach, preview } = createMap();
    beach('Orle').click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(preview()).toContain('Orle');
    expect(preview()).toContain('SAMPLE DATA');
    expect(preview()).toContain('Safety unknown');
    expect(preview()).toContain('No sample forecast is available');
  });

  it('keeps empty pilot data explicit', () => {
    TestBed.overrideProvider(EXPLORE_MAP_BEACHES, { useValue: [] });
    const { host, preview } = createMap();
    expect(host.textContent).toContain('No pilot beaches are available');
    expect(preview()).toContain('A preview will appear when pilot beaches are available');
    expect(host.querySelector('.beach-map-marker')).toBeNull();
  });

  it.each([['en', en], ['pl', pl], ['ru', ru]] as const)(
    'presents the same current, stale and missing beach scenarios across routes in %s',
    async (language, messages) => {
      TestBed.inject(Localization).select(language);
      const harness = await RouterTestingHarness.create('/');
      const home = new Map<string, Element>(Array.from(
        harness.routeNativeElement!.querySelectorAll('#previews-heading ~ ul > li'),
        (card) => [card.querySelector('h3')!.textContent!.trim(), card],
      ));
      expect(harness.routeNativeElement!.textContent).toContain(messages.regionalIndex);

      const cases = [
        ['sobieszewo', 'Sobieszewo', ['68 / 100', messages.medium, messages.currentScenario, messages.clearScenario], '2030-10-07T04:00:00Z', '06:00'],
        ['mikoszewo', 'Mikoszewo', ['82 / 100', messages.low, messages.staleScenario, messages.restrictedScenario], '2030-10-06T16:00:00Z', '18:00'],
        ['orle', 'Orle', [messages.noBeachForecast, messages.unknownScenario], undefined, undefined],
      ] as const;

      for (const [id, name, expected, capturedAt, localTime] of cases) {
        await harness.navigateByUrl('/map?beach=' + id, ExploreMap);
        const map = harness.routeNativeElement!;
        const preview = map.querySelector('[aria-labelledby="beach-preview-heading"]')!;
        await harness.navigateByUrl('/beaches/' + id, BeachDetails);
        const details = harness.routeNativeElement!;
        const sample = details.querySelector('[aria-labelledby="sample-heading"]')!;
        expect(map.textContent).toContain(messages.sample);
        expect(details.textContent).toContain(messages.sample);

        for (const surface of [home.get(name)!, preview, sample]) {
          for (const text of expected) expect(surface.textContent).toContain(text);
          const timestamp = surface.querySelector('time');
          if (capturedAt && localTime) {
            expect(timestamp?.getAttribute('datetime')).toBe(capturedAt);
            expect(timestamp?.textContent).toContain(localTime);
          } else {
            expect(timestamp).toBeNull();
            expect(surface.querySelector('dl')).toBeNull();
            expect(surface.querySelector('[role="status"]')?.textContent).toContain(messages.noBeachForecast);
          }
        }
      }
    },
  );

  it('handles map load errors, retry, and teardown', () => {
    const { fixture, host } = createMap();
    expect(host.textContent).toContain('Loading the coastal map');
    engine.eventHandlers.get('error')!();
    fixture.detectChanges();
    expect(host.textContent).toContain('You can still select a beach');
    const retry = Array.from(host.querySelectorAll('button')).find((button) => button.textContent?.includes('Retry map'))!;
    retry.click();
    fixture.detectChanges();
    expect(host.textContent).toContain('Loading the coastal map');
    engine.eventHandlers.get('load')!();
    fixture.detectChanges();
    expect(host.querySelector('[role="status"]')).toBeNull();
    fixture.destroy();
    expect(engine.remove).toHaveBeenCalledTimes(2);
  });

  it('keeps the list usable when WebGL initialization fails', async () => {
    engine.fail = true;
    const { fixture, beach, preview, host } = createMap();
    expect(host.textContent).toContain('The coastal map could not load');
    beach('Sobieszewo').click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(preview()).toContain('Sobieszewo');
  });
});
