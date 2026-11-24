import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { sampleSafetyLabels } from '../../core/localization/forecast-labels';
import { Localization } from '../../core/localization/localization';
import { pilotBeaches } from '../../shared/beaches/pilot-beaches';
import { DEMO_FORECASTS } from '../../shared/forecast/demo-forecasts';
import { beachPreview, displayableForecast } from '../../shared/forecast/forecast';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
})
export class Home {
  protected readonly i18n = inject(Localization);
  private readonly dataset = inject(DEMO_FORECASTS);
  protected readonly regional = this.dataset.regional;
  protected readonly regionalForecast = displayableForecast(this.regional);
  protected readonly beaches = pilotBeaches.map((beach) => ({
    id: beach.id,
    name: beach.name,
    ...beachPreview(this.dataset, beach.id),
  }));
  protected readonly safetyLabels = sampleSafetyLabels;
  protected readonly safetyNotes = {
    clear: 'clearNote',
    unsafe: 'unsafeNote',
    restricted: 'restrictedNote',
    unknown: 'unknownNote',
  } as const;
}
