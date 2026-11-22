import type { MessageKey } from '../../core/localization/en';
export type Safety = 'clear' | 'unsafe' | 'restricted' | 'unknown';

export const safetyNotes = {
  clear: 'clearNote',
  unsafe: 'unsafeNote',
  restricted: 'restrictedNote',
  unknown: 'unknownNote',
} as const satisfies Record<Safety, MessageKey>;

export interface BeachPreview {
  readonly name: 'duneBeach' | 'breakwaterBeach' | 'reedBay';
  readonly safety: Safety;
  readonly window: { readonly start: string; readonly end: string; readonly zone: string };
}

export interface OutlookDay {
  readonly date: string;
  readonly index: number;
  readonly wavesMeters: number;
}

export type Forecast =
  | { readonly state: 'loading' | 'unavailable' | 'empty' }
  | {
      readonly state: 'ready' | 'stale';
      readonly date: string;
      readonly capturedAt: string;
      readonly index: number;
      readonly confidence: 'low' | 'medium' | 'high';
      readonly reasons: readonly ('easingWaves' | 'onshoreWind')[];
      readonly safety: Safety;
      readonly beaches: readonly BeachPreview[];
      readonly outlook: readonly OutlookDay[];
    };

export const sampleForecast = {
  state: 'ready',
  date: '2030-10-07',
  capturedAt: '2030-10-07T06:00:00+02:00',
  index: 71,
  confidence: 'medium',
  reasons: [
    'easingWaves',
    'onshoreWind',
  ],
  safety: 'clear',
  beaches: [
    { name: 'duneBeach', safety: 'clear', window: { start: '07:00', end: '10:00', zone: 'CEST' } },
    { name: 'breakwaterBeach', safety: 'restricted', window: { start: '10:00', end: '13:00', zone: 'CEST' } },
    { name: 'reedBay', safety: 'unknown', window: { start: '13:00', end: '16:00', zone: 'CEST' } },
  ],
  outlook: [
    { date: '2030-10-07', index: 71, wavesMeters: 1.2 },
    { date: '2030-10-08', index: 65, wavesMeters: 1.0 },
    { date: '2030-10-09', index: 52, wavesMeters: 0.8 },
    { date: '2030-10-10', index: 46, wavesMeters: 0.7 },
    { date: '2030-10-11', index: 59, wavesMeters: 0.9 },
    { date: '2030-10-12', index: 68, wavesMeters: 1.3 },
    { date: '2030-10-13', index: 62, wavesMeters: 1.1 },
  ],
} as const satisfies Forecast;
