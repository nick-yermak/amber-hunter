import { Component, computed, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BeachMap } from './beach-map';
import { Beach, pilotBeaches } from './beaches';
import { MapSampleForecast, mapSampleForecasts, sampleSafetyLabels } from './map-sample-forecasts';

@Component({
  selector: 'app-explore-map',
  standalone: true,
  imports: [BeachMap, DatePipe],
  templateUrl: './explore-map.html',
})
export class ExploreMap {
  readonly beaches = input(pilotBeaches, {
    transform: (beaches: readonly Beach[] | undefined) => beaches ?? pilotBeaches,
  });
  readonly forecasts = input(mapSampleForecasts, {
    transform: (forecasts: Readonly<Partial<Record<string, MapSampleForecast>>> | undefined) =>
      forecasts ?? mapSampleForecasts,
  });

  protected readonly selectedId = signal<string | null>(null);
  protected readonly selectedBeach = computed(() =>
    this.beaches().find((beach) => beach.id === this.selectedId()),
  );
  protected readonly forecast = computed(() => {
    const beach = this.selectedBeach();
    return beach && this.forecasts()[beach.id];
  });
  protected readonly safetyLabels = sampleSafetyLabels;
}
