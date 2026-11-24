import { Localization } from '../../core/localization/localization';
import { Component, computed, inject, InjectionToken } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { pilotBeaches } from './pilot-beaches';
import { sampleBeachForecasts, sampleSafetyLabels } from './sample-beach-forecasts';

export const BEACH_DETAILS_SAMPLE_FORECASTS = new InjectionToken<typeof sampleBeachForecasts>(
  'Beach Details sample forecasts',
  { factory: () => sampleBeachForecasts },
);

@Component({
  selector: 'app-beach-details',
  imports: [RouterLink],
  templateUrl: './beach-details.html',
})
export class BeachDetails {
  protected readonly i18n = inject(Localization);
  private readonly segments = toSignal(inject(ActivatedRoute).url);

  private readonly forecasts = inject(BEACH_DETAILS_SAMPLE_FORECASTS);

  protected readonly beach = computed(() => {
    // Matrix parameters are separate from the path of the final route segment.
    const slug = this.segments()?.at(-1)?.path;
    return pilotBeaches.find((beach) => beach.id === slug);
  });
  protected readonly forecast = computed(() => {
    const beach = this.beach();
    return beach && this.forecasts[beach.id];
  });
  protected readonly safetyLabels = sampleSafetyLabels;
}
