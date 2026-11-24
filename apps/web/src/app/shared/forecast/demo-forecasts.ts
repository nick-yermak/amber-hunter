import { InjectionToken } from '@angular/core';
import type { DemoForecastDataset } from './forecast';

export const demoForecasts = {
  regional: {
    safety: 'clear',
    forecast: {
      availability: 'available',
      validDate: '2030-10-07',
      capturedAt: '2030-10-07T06:00:00+02:00',
      index: 71,
      confidence: 'medium',
      freshness: 'currentScenario',
      reasons: ['easingWaves', 'onshoreWind'],
      outlook: [
        { date: '2030-10-07', index: 71, wavesMeters: 1.2 },
        { date: '2030-10-08', index: 65, wavesMeters: 1.0 },
        { date: '2030-10-09', index: 52, wavesMeters: 0.8 },
        { date: '2030-10-10', index: 46, wavesMeters: 0.7 },
        { date: '2030-10-11', index: 59, wavesMeters: 0.9 },
        { date: '2030-10-12', index: 68, wavesMeters: 1.3 },
        { date: '2030-10-13', index: 62, wavesMeters: 1.1 },
      ],
    },
  },
  beaches: {
    sobieszewo: {
      safety: 'clear',
      forecast: {
        availability: 'available',
        validDate: '2030-10-07',
        capturedAt: '2030-10-07T04:00:00Z',
        index: 68,
        confidence: 'medium',
        freshness: 'currentScenario',
        window: { start: '2030-10-07T07:00:00+02:00', end: '2030-10-07T10:00:00+02:00' },
        marine: { windKmh: 18, waveHeightMeters: 0.8 },
      },
    },
    mikoszewo: {
      safety: 'restricted',
      forecast: {
        availability: 'available',
        validDate: '2030-10-07',
        capturedAt: '2030-10-06T16:00:00Z',
        index: 82,
        confidence: 'low',
        freshness: 'staleScenario',
        window: { start: '2030-10-07T10:00:00+02:00', end: '2030-10-07T13:00:00+02:00' },
      },
    },
    orle: {
      safety: 'unknown',
      forecast: { availability: 'unavailable', reason: 'empty' },
    },
  },
} as const satisfies DemoForecastDataset;

export const DEMO_FORECASTS = new InjectionToken<DemoForecastDataset>('Demo forecasts', {
  factory: () => demoForecasts,
});
