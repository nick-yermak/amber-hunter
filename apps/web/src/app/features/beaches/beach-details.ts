import { sampleSafetyLabels } from '../../core/localization/forecast-labels';
import { Localization } from '../../core/localization/localization';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { pilotBeaches } from '../../shared/beaches/pilot-beaches';
import { DEMO_FORECASTS } from '../../shared/forecast/demo-forecasts';
import { beachScenario, displayableForecast } from '../../shared/forecast/forecast';

@Component({
  selector: 'app-beach-details',
  imports: [RouterLink],
  templateUrl: './beach-details.html',
})
export class BeachDetails {
  protected readonly i18n = inject(Localization);
  private readonly segments = toSignal(inject(ActivatedRoute).url);

  private readonly dataset = inject(DEMO_FORECASTS);

  protected readonly beach = computed(() => {
    // Matrix parameters are separate from the path of the final route segment.
    const slug = this.segments()?.at(-1)?.path;
    return pilotBeaches.find((beach) => beach.id === slug);
  });
  private readonly scenario = computed(() => {
    const beach = this.beach();
    return beach && beachScenario(this.dataset, beach.id);
  });
  protected readonly forecast = computed(() => {
    const scenario = this.scenario();
    return scenario && displayableForecast(scenario);
  });
  protected readonly safety = computed(() => this.scenario()?.safety ?? 'unknown');
  protected readonly safetyLabels = sampleSafetyLabels;
}
