import { demoForecasts } from './demo-forecasts';
import { beachPreview, beachScenario, canRecommend, displayableForecast } from './forecast';

const { regional, beaches } = demoForecasts;
const clear = beaches.sobieszewo;

describe('demo forecast selectors', () => {
  it('looks up a pilot beach scenario and exposes only eligible preview windows', () => {
    expect(beachScenario(demoForecasts, 'sobieszewo')).toBe(clear);
    expect(beachPreview(demoForecasts, 'sobieszewo').window).toBe(clear.forecast.window);
    expect(beachPreview(demoForecasts, 'mikoszewo').window).toBeUndefined();
    expect(regional.forecast.index).toBe(71);
  });

  it.each(['unsafe', 'restricted', 'unknown'] as const)('blocks a high current score when safety is %s', (safety) => {
    const scenario = { safety, forecast: { ...clear.forecast, index: 100 } };
    expect(displayableForecast(scenario)?.index).toBe(100);
    expect(canRecommend(scenario)).toBe(false);
  });

  it('blocks stale and unavailable forecasts even with clear safety', () => {
    const stale = { ...clear, forecast: { ...clear.forecast, freshness: 'staleScenario' as const } };
    const missing = { ...beaches.orle, safety: 'clear' as const };
    expect(displayableForecast(stale)).toBe(stale.forecast);
    expect(canRecommend(stale)).toBe(false);
    expect(canRecommend(missing)).toBe(false);
    expect(beachPreview(demoForecasts, 'orle')).toEqual({
      safety: 'unknown',
      forecast: undefined,
      window: undefined,
    });
  });

  it('never exposes a window for a different regional forecast day', () => {
    const dataset = {
      ...demoForecasts,
      regional: { ...regional, forecast: { ...regional.forecast, validDate: '2030-10-08' as const } },
    };
    expect(beachPreview(dataset, 'sobieszewo').window).toBeUndefined();
  });
});
