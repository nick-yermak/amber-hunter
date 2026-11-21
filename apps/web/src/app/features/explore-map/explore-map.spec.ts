import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ExploreMap } from './explore-map';
import { sampleBeachForecasts } from '../beaches/sample-beach-forecasts';

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
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    engine.fail = false;
    engine.eventHandlers.clear();
    engine.remove.mockClear();
    vi.stubGlobal('WebGL2RenderingContext', class {});
    vi.stubGlobal('ResizeObserver', class {
      observe() {}
      disconnect() {}
    });
  });

  afterEach(() => vi.unstubAllGlobals());

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

  it('uses one selection for HTML controls, map markers and the preview', () => {
    const { fixture, host, beach, preview } = createMap();
    expect(preview()).toContain('Select a beach');

    beach('Sobieszewo').click();
    fixture.detectChanges();
    expect(host.querySelector('[aria-label="Sobieszewo"]')?.getAttribute('aria-pressed')).toBe('true');
    expect(preview()).toContain('SAMPLE DATA');
    expect(preview()).toContain('68');
    expect(preview()).toContain('Medium');
    expect(preview()).toContain('7 Oct 2030');

    host.querySelector<HTMLButtonElement>('button[aria-label="Mikoszewo"]')!.click();
    fixture.detectChanges();
    expect(beach('Sobieszewo').getAttribute('aria-pressed')).toBe('false');
    expect(beach('Mikoszewo').getAttribute('aria-pressed')).toBe('true');
    expect(preview()).toContain('82');
    expect(preview()).toContain('Stale in scenario');
    expect(preview()).toContain('Restricted access');
    expect(host.querySelector('[aria-labelledby="beach-preview-heading"] button')).toBeNull();
  });

  it.each(['unsafe', 'restricted', 'unknown'] as const)('shows independent %s safety even for a high current index', (safety) => {
    const { fixture, host, beach, preview } = createMap();
    fixture.componentRef.setInput('forecasts', {
      sobieszewo: { ...sampleBeachForecasts['sobieszewo']!, index: 100, safety },
    });
    beach('Sobieszewo').click();
    fixture.detectChanges();
    expect(preview().toLowerCase()).toContain(safety);
    expect(preview()).toContain('SAMPLE DATA');
    expect(preview()).toContain('100 / 100');
    const actions = host.querySelectorAll('[aria-labelledby="beach-preview-heading"] :is(button, a)');
    expect(actions).toHaveLength(1);
    expect(actions[0].getAttribute('href')).toBe('/beaches/sobieszewo');
  });

  it('keeps missing forecasts and empty pilot data explicit', () => {
    const { fixture, host, beach, preview } = createMap();
    beach('Orle').click();
    fixture.detectChanges();
    expect(preview()).toContain('Orle');
    expect(preview()).toContain('SAMPLE DATA');
    expect(preview()).toContain('Safety unknown');
    expect(preview()).toContain('No sample forecast is available');

    fixture.componentRef.setInput('beaches', []);
    fixture.detectChanges();
    expect(host.textContent).toContain('No pilot beaches are available');
    expect(preview()).toContain('A preview will appear when pilot beaches are available');
    expect(host.querySelector('.beach-map-marker')).toBeNull();
  });

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

  it('keeps the list usable when WebGL initialization fails', () => {
    engine.fail = true;
    const { fixture, beach, preview, host } = createMap();
    expect(host.textContent).toContain('The coastal map could not load');
    beach('Sobieszewo').click();
    fixture.detectChanges();
    expect(preview()).toContain('Sobieszewo');
  });
});
