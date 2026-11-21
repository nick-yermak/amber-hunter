import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { BEACH_DETAILS_SAMPLE_FORECASTS, BeachDetails } from './beach-details';
import { pilotBeaches } from './pilot-beaches';
import { sampleBeachForecasts, sampleSafetyLabels } from './sample-beach-forecasts';

describe('Beach Details', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter(routes)] }));

  it.each(pilotBeaches)('deep-links to $name with the shared geographic reference', async (beach) => {
    const harness = await RouterTestingHarness.create('/beaches/' + beach.id);
    const page = harness.routeNativeElement!;
    expect(page.querySelector('h1')?.textContent).toBe(beach.name);
    expect(page.textContent).toContain(beach.locality);
    expect(page.textContent).toContain(beach.source.reference);
    expect(page.querySelector('[aria-labelledby="source-heading"] a')?.getAttribute('href')).toBe(beach.source.url);
    expect(page.querySelector('a')?.getAttribute('href')).toBe('/map?beach=' + beach.id);
  });

  it('shows independent sample metrics and explicit wind and wave units', async () => {
    const harness = await RouterTestingHarness.create('/beaches/sobieszewo');
    const page = harness.routeNativeElement!;
    for (const text of ['SAMPLE DATA', '68 / 100', 'Medium', 'Current in scenario', '18 km/h', '0.8 m',
      'fictional pilot beach sample fixture', 'does not represent the probability of finding amber',
      'Real-world safety and access are unverified']) {
      expect(page.textContent).toContain(text);
    }
    expect(page.querySelector('time')?.getAttribute('datetime')).toBe('2030-10-07T04:00:00Z');
  });

  it('updates reused routes and handles stale, missing and unknown beaches', async () => {
    const harness = await RouterTestingHarness.create('/beaches/mikoszewo');
    expect(harness.routeNativeElement?.textContent).toContain('Stale in scenario');
    expect(harness.routeNativeElement?.textContent).toContain('Restricted access');
    expect(harness.routeNativeElement?.textContent).toContain('No sample wind or wave values');

    await harness.navigateByUrl('/beaches/orle', BeachDetails);
    expect(harness.routeNativeElement?.textContent).toContain('No sample forecast');
    expect(harness.routeNativeElement?.textContent).toContain('Safety unknown');
    expect(harness.routeNativeElement?.querySelector('time')).toBeNull();

    await harness.navigateByUrl('/beaches/unknown', BeachDetails);
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe('Beach not found');
    expect(harness.routeNativeElement?.querySelector('a')?.getAttribute('href')).toBe('/map');
  });

  it.each(['unsafe', 'restricted', 'unknown'] as const)('puts %s sample safety before forecast metrics', (safety) => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { paramMap: of(convertToParamMap({ slug: 'sobieszewo' })) },
    });
    TestBed.overrideProvider(BEACH_DETAILS_SAMPLE_FORECASTS, {
      useValue: { sobieszewo: { ...sampleBeachForecasts['sobieszewo']!, index: 100, safety } },
    });
    const fixture = TestBed.createComponent(BeachDetails);
    fixture.detectChanges();
    const page: HTMLElement = fixture.nativeElement;
    const sampleSection = page.querySelector('[aria-labelledby="sample-heading"]')!;
    const text = sampleSection.textContent!;
    expect(text).toContain(sampleSafetyLabels[safety]);
    expect(text).toContain('100 / 100');
    expect(text.indexOf(sampleSafetyLabels[safety])).toBeLessThan(text.indexOf('100 / 100'));
    expect(sampleSection.querySelector('a, button')).toBeNull();
  });
});
