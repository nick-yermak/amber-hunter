export interface BeachSampleForecast {
  readonly index: number;
  readonly confidence: 'low' | 'medium' | 'high';
  readonly capturedAt: string;
  readonly freshness: 'currentScenario' | 'staleScenario';
  readonly marine?: { readonly windKmh: number; readonly waveHeightMeters: number };
  readonly safety: 'clear' | 'unsafe' | 'restricted' | 'unknown';
}

export const sampleSafetyLabels = {
  clear: 'clearScenario',
  unsafe: 'unsafeScenario',
  restricted: 'restrictedScenario',
  unknown: 'unknownScenario',
} as const satisfies Record<BeachSampleForecast['safety'], string>;

export const sampleBeachForecasts: Readonly<Partial<Record<string, BeachSampleForecast>>> = {
  sobieszewo: {
    index: 68,
    confidence: 'medium',
    capturedAt: '2030-10-07T04:00:00Z',
    freshness: 'currentScenario',
    safety: 'clear',
    marine: { windKmh: 18, waveHeightMeters: 0.8 },
  },
  mikoszewo: {
    index: 82,
    confidence: 'low',
    capturedAt: '2030-10-06T16:00:00Z',
    freshness: 'staleScenario',
    safety: 'restricted',
  },
};
