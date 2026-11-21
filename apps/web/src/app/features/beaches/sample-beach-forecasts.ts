export interface BeachSampleForecast {
  readonly index: number;
  readonly confidence: 'Low' | 'Medium' | 'High';
  readonly capturedAt: string;
  readonly freshness: 'Current in scenario' | 'Stale in scenario';
  readonly marine?: { readonly windKmh: number; readonly waveHeightMeters: number };
  readonly safety: 'clear' | 'unsafe' | 'restricted' | 'unknown';
}

export const sampleSafetyLabels = {
  clear: 'No restriction in this scenario',
  unsafe: 'Unsafe conditions in this scenario',
  restricted: 'Restricted access in this scenario',
  unknown: 'Safety unknown in this scenario',
} satisfies Record<BeachSampleForecast['safety'], string>;

export const sampleBeachForecasts: Readonly<Partial<Record<string, BeachSampleForecast>>> = {
  sobieszewo: {
    index: 68,
    confidence: 'Medium',
    capturedAt: '2030-10-07T04:00:00Z',
    freshness: 'Current in scenario',
    safety: 'clear',
    marine: { windKmh: 18, waveHeightMeters: 0.8 },
  },
  mikoszewo: {
    index: 82,
    confidence: 'Low',
    capturedAt: '2030-10-06T16:00:00Z',
    freshness: 'Stale in scenario',
    safety: 'restricted',
  },
};
