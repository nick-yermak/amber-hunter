import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { pilotBeaches } from './pilot-beaches';
import { sampleBeachForecasts, sampleSafetyLabels } from './sample-beach-forecasts';

@Component({
  selector: 'app-beach-details',
  imports: [DatePipe, RouterLink],
  templateUrl: './beach-details.html',
})
export class BeachDetails {
  private readonly params = toSignal(inject(ActivatedRoute).paramMap);

  readonly forecasts = input(sampleBeachForecasts, {
    transform: (forecasts: typeof sampleBeachForecasts | undefined) => forecasts ?? sampleBeachForecasts,
  });

  protected readonly beach = computed(() => pilotBeaches.find((beach) => beach.id === this.params()?.get('slug')));
  protected readonly forecast = computed(() => {
    const beach = this.beach();
    return beach && this.forecasts()[beach.id];
  });
  protected readonly safetyLabels = sampleSafetyLabels;
}
