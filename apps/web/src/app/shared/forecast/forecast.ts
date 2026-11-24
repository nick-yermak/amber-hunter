import type { BeachId } from '../beaches/pilot-beaches';

export type Safety = 'clear' | 'unsafe' | 'restricted' | 'unknown';
export type Confidence = 'low' | 'medium' | 'high';
// Demo scenario freshness is explicit and does not depend on the current time.
export type Freshness = 'currentScenario' | 'staleScenario';
export type ForecastReason = 'easingWaves' | 'onshoreWind';
type UnavailableReason = 'loading' | 'empty' | 'unavailable';

type CalendarDate = `${number}-${number}-${number}`;
type Instant = `${CalendarDate}T${string}${'Z' | `+${number}:${number}` | `-${number}:${number}`}`;

interface TimeWindow {
  readonly start: Instant;
  readonly end: Instant;
}

interface OutlookDay {
  readonly date: CalendarDate;
  readonly index: number;
  readonly wavesMeters: number;
}

export interface RegionalConditions {
  readonly validDate: CalendarDate;
  readonly reasons: readonly ForecastReason[];
  readonly outlook: readonly OutlookDay[];
}

export interface BeachConditions {
  readonly validDate: CalendarDate;
  readonly window?: TimeWindow;
  readonly marine?: { readonly windKmh: number; readonly waveHeightMeters: number };
}

export type AvailableForecast<Conditions> = Conditions & {
  readonly availability: 'available';
  readonly capturedAt: Instant;
  /** Experimental 0–100 Amber Index. */
  readonly index: number;
  readonly confidence: Confidence;
  readonly freshness: Freshness;
};

export interface ForecastScenario<Conditions> {
  readonly safety: Safety;
  readonly forecast: AvailableForecast<Conditions> | {
    readonly availability: 'unavailable';
    readonly reason: UnavailableReason;
  };
}

export interface DemoForecastDataset {
  readonly regional: ForecastScenario<RegionalConditions>;
  readonly beaches: Readonly<Record<BeachId, ForecastScenario<BeachConditions>>>;
}

export function beachScenario(dataset: DemoForecastDataset, id: BeachId): ForecastScenario<BeachConditions> {
  return dataset.beaches[id];
}

export function displayableForecast<Conditions>(scenario: ForecastScenario<Conditions>) {
  return scenario.forecast.availability === 'available' ? scenario.forecast : undefined;
}

export function canRecommend(scenario: ForecastScenario<unknown>): boolean {
  return scenario.safety === 'clear' && displayableForecast(scenario)?.freshness === 'currentScenario';
}

export function beachPreview(dataset: DemoForecastDataset, id: BeachId) {
  const scenario = beachScenario(dataset, id);
  const forecast = displayableForecast(scenario);
  const regional = displayableForecast(dataset.regional);
  const window = forecast && forecast.validDate === regional?.validDate &&
    canRecommend(dataset.regional) && canRecommend(scenario) ? forecast.window : undefined;
  return { forecast, safety: scenario.safety, window };
}
