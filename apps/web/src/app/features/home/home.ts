import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Forecast, safetyDetails, sampleForecast } from './sample-forecast';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home {
  readonly forecast = input<Forecast>();
  protected readonly currentForecast = computed(() => this.forecast() ?? sampleForecast);
  protected readonly safetyDetails = safetyDetails;
}
