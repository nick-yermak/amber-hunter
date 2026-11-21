export interface MapSampleForecast {
  readonly index: number;
  readonly confidence: 'Low' | 'Medium' | 'High';
  readonly capturedAt: string;
  readonly freshness: 'Current in scenario' | 'Stale in scenario';
  readonly safety: 'clear' | 'unsafe' | 'restricted' | 'unknown';
}

export const sampleSafetyLabels = {
  clear: 'No restriction in this scenario',
  unsafe: 'Unsafe conditions in this scenario',
  restricted: 'Restricted access in this scenario',
  unknown: 'Safety unknown in this scenario',
} satisfies Record<MapSampleForecast['safety'], string>;

export const mapSampleForecasts: Readonly<Partial<Record<string, MapSampleForecast>>> = {
  sobieszewo: {
    index: 68,
    confidence: 'Medium',
    capturedAt: '2030-10-07T04:00:00Z',
    freshness: 'Current in scenario',
    safety: 'clear',
  },
  mikoszewo: {
    index: 82,
    confidence: 'Low',
    capturedAt: '2030-10-06T16:00:00Z',
    freshness: 'Stale in scenario',
    safety: 'restricted',
  },
};
