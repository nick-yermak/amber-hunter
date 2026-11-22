import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { appConfig } from '../../app.config';
import { Home } from './home';
import { Forecast, sampleForecast } from './sample-forecast';

describe('Home route', () => {
  it.each(['/', '/?extra=kept', '/?forecast=unexpected'])('renders the sample forecast at %s', async (url) => {
    TestBed.configureTestingModule({ providers: appConfig.providers });
    const harness = await RouterTestingHarness.create(url);
    const home: Home = harness.routeDebugElement!.componentInstance;

    expect(home.forecast()).toBeUndefined();
    expect(harness.routeNativeElement?.querySelector('[role="img"]')?.getAttribute('aria-label'))
      .toBe('Experimental Amber Index: 71 out of 100, sample data');
  });
});

describe('Home forecast', () => {
  async function render(forecast?: Forecast) {
    TestBed.configureTestingModule({ imports: [Home], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Home);
    if (forecast) {
      fixture.componentRef.setInput('forecast', forecast);
    }
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('labels the sample index, its explanation, confidence and freshness independently', async () => {
    const host = await render();
    expect(host.querySelector('[role="img"]')?.getAttribute('aria-label'))
      .toBe('Experimental Amber Index: 71 out of 100, sample data');
    expect(host.textContent).toContain('does not measure the chance of finding amber');
    expect(host.textContent).toContain('Waves are easing');
    expect(host.textContent).toContain('Medium · describes the sample inputs');
    expect(host.querySelector('time[datetime="2030-10-07T06:00:00+02:00"]')?.textContent)
      .toBe('7 Oct 2030, 06:00 CEST');
    expect(host.textContent).toContain('Real conditions are unverified');
    expect(host.querySelector('#safety-warning-heading')).toBeNull();
  });

  it('renders seven dated outlook entries, the eligible example window and only general navigation', async () => {
    const host = await render();
    expect(host.querySelectorAll('ol > li')).toHaveLength(7);
    expect(host.querySelector('ol time[datetime="2030-10-13"]')?.textContent).toBe('Sun, 13 Oct');
    expect(host.querySelector('ol')?.textContent).toContain('1.2 m');
    expect(host.textContent).toContain('07:00–10:00 CEST');
    expect(host.textContent).not.toContain('10:00–13:00 CEST');
    expect(host.textContent).not.toContain('13:00–16:00 CEST');
    expect(Array.from(host.querySelectorAll('a'), (link) => link.getAttribute('href')))
      .toEqual(['/map', '/academy']);
  });

  it.each([
    ['unsafe', 'Unsafe conditions'],
    ['restricted', 'Access restricted'],
    ['unknown', 'Safety unknown'],
  ] as const)('hides all windows when overall safety is %s, even with a high index', async (safety, label) => {
    const host = await render({ ...sampleForecast, index: 99, safety });
    expect(host.querySelector('aside')?.textContent).toContain(label);
    expect(host.textContent).not.toContain('07:00–10:00');
    expect(host.querySelectorAll('section ul a')).toHaveLength(0);
  });

  it.each([
    ['unsafe', 'Unsafe conditions'],
    ['restricted', 'Access restricted'],
    ['unknown', 'Safety unknown'],
  ] as const)('presents one labeled %s warning before the Amber Index', async (safety, label) => {
    const host = await render({ ...sampleForecast, safety });
    const warning = host.querySelector('aside[aria-labelledby="safety-warning-heading"]');
    const index = host.querySelector('[role="img"]');

    expect(host.querySelectorAll('aside')).toHaveLength(1);
    expect(warning?.querySelector('h2')?.textContent?.trim()).toBe('Sample safety · ' + label);
    expect(index).not.toBeNull();
    expect(warning && index && (warning.compareDocumentPosition(index) & Node.DOCUMENT_POSITION_FOLLOWING))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(host.querySelector('h1')?.previousElementSibling?.textContent?.trim()).toBe('SAMPLE DATA');
  });

  it('hides a time window for an unsafe beach even when overall safety has no restriction', async () => {
    const host = await render({
      ...sampleForecast,
      beaches: [{ ...sampleForecast.beaches[0], safety: 'unsafe' }],
    });
    expect(host.textContent).toContain('Unsafe conditions');
    expect(host.textContent).toContain('Favorable window withheld');
    expect(host.textContent).not.toContain('07:00–10:00');
  });

  it('identifies stale data and withholds windows while retaining the timestamp', async () => {
    const host = await render({ ...sampleForecast, state: 'stale' });
    expect(host.querySelector('[role="status"]')?.textContent).toContain('Stale sample forecast');
    expect(host.textContent).toContain('outside the sample update window');
    expect(host.querySelector('time[datetime="2030-10-07T06:00:00+02:00"]')).not.toBeNull();
    expect(host.textContent).not.toContain('07:00–10:00');
  });

  it.each([
    ['loading', 'Loading sample forecast'],
    ['unavailable', 'Sample forecast unavailable'],
    ['empty', 'No sample forecast'],
  ] as const)('presents %s accessibly with unknown safety and no index', async (state, label) => {
    const host = await render({ state });
    expect(host.querySelector('[role="status"]')?.textContent).toContain(label);
    expect(host.querySelector('aside')?.textContent).toContain('Safety unknown');
    expect(host.querySelector('[role="img"], #previews-heading, #outlook-heading')).toBeNull();
  });

  it('describes empty preview and outlook lists', async () => {
    const host = await render({ ...sampleForecast, beaches: [], outlook: [] });
    expect(host.textContent).toContain('No sample beach previews available.');
    expect(host.textContent).toContain('No sample outlook available.');
  });
});
