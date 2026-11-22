import { Localization } from '../../core/localization/localization';
import { inject, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Forecast, safetyNotes, sampleForecast } from './sample-forecast';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home {
  protected readonly i18n = inject(Localization);
  readonly forecast = input<Forecast>();
  protected readonly currentForecast = computed(() => this.forecast() ?? sampleForecast);
  protected readonly safetyNotes = safetyNotes;
}
