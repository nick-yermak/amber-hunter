export type Safety = 'clear' | 'unsafe' | 'restricted' | 'unknown';

export const safetyDetails = {
  clear: { label: 'No sample restriction', explanation: 'This scenario contains no modeled warning. Real conditions are unverified.' },
  unsafe: { label: 'Unsafe conditions', explanation: 'The sample hazard takes precedence over the index and any time window.' },
  restricted: { label: 'Access restricted', explanation: 'The sample closure takes precedence over the index and any time window.' },
  unknown: { label: 'Safety unknown', explanation: 'Safety information is missing. No favorable window is shown.' },
} satisfies Record<Safety, { label: string; explanation: string }>;

export interface BeachPreview {
  readonly name: string;
  readonly safety: Safety;
  readonly window: string;
}

export interface OutlookDay {
  readonly date: string;
  readonly label: string;
  readonly index: number;
  readonly wavesMeters: number;
}

export type Forecast =
  | { readonly state: 'loading' | 'unavailable' | 'empty' }
  | {
      readonly state: 'ready' | 'stale';
      readonly date: string;
      readonly label: string;
      readonly capturedAt: string;
      readonly freshness: string;
      readonly index: number;
      readonly confidence: 'Low' | 'Medium' | 'High';
      readonly reasons: readonly string[];
      readonly safety: Safety;
      readonly beaches: readonly BeachPreview[];
      readonly outlook: readonly OutlookDay[];
    };

export const sampleForecast = {
  state: 'ready',
  date: '2030-10-07',
  label: 'Monday, 7 October 2030',
  capturedAt: '2030-10-07T06:00:00+02:00',
  freshness: '7 Oct 2030, 06:00 CEST',
  index: 71,
  confidence: 'Medium',
  reasons: [
    'Waves are easing after a period of rough water in this example.',
    'Onshore wind is one factor illustrated in the sample.',
  ],
  safety: 'clear',
  beaches: [
    { name: 'Dune Beach', safety: 'clear', window: '07:00–10:00 CEST' },
    { name: 'Breakwater Beach', safety: 'restricted', window: '10:00–13:00 CEST' },
    { name: 'Reed Bay', safety: 'unknown', window: '13:00–16:00 CEST' },
  ],
  outlook: [
    { date: '2030-10-07', label: 'Mon, 7 Oct', index: 71, wavesMeters: 1.2 },
    { date: '2030-10-08', label: 'Tue, 8 Oct', index: 65, wavesMeters: 1.0 },
    { date: '2030-10-09', label: 'Wed, 9 Oct', index: 52, wavesMeters: 0.8 },
    { date: '2030-10-10', label: 'Thu, 10 Oct', index: 46, wavesMeters: 0.7 },
    { date: '2030-10-11', label: 'Fri, 11 Oct', index: 59, wavesMeters: 0.9 },
    { date: '2030-10-12', label: 'Sat, 12 Oct', index: 68, wavesMeters: 1.3 },
    { date: '2030-10-13', label: 'Sun, 13 Oct', index: 62, wavesMeters: 1.1 },
  ],
} as const satisfies Forecast;
