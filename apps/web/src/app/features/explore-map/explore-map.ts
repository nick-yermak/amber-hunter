import { sampleSafetyLabels } from '../../core/localization/forecast-labels';
import { Localization } from '../../core/localization/localization';
import {
  afterNextRender, Component, computed, DestroyRef, ElementRef, inject, InjectionToken, viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BeachMap } from './beach-map';
import { BeachId, pilotBeaches } from '../../shared/beaches/pilot-beaches';
import { DEMO_FORECASTS } from '../../shared/forecast/demo-forecasts';
import { beachScenario, displayableForecast } from '../../shared/forecast/forecast';

export const EXPLORE_MAP_BEACHES = new InjectionToken<typeof pilotBeaches>('Explore Map beaches', {
  factory: () => pilotBeaches,
});

@Component({
  selector: 'app-explore-map',
  standalone: true,
  imports: [BeachMap, RouterLink],
  templateUrl: './explore-map.html',
})
export class ExploreMap {
  protected readonly i18n = inject(Localization);
  private readonly dataset = inject(DEMO_FORECASTS);
  protected readonly beaches = inject(EXPLORE_MAP_BEACHES);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly queryParams = toSignal(this.route.queryParamMap);
  private readonly selectedId = computed(() => this.queryParams()?.get('beach'));
  protected readonly selectedBeach = computed(() =>
    this.beaches.find((beach) => beach.id === this.selectedId()),
  );
  private readonly scenario = computed(() => {
    const beach = this.selectedBeach();
    return beach && beachScenario(this.dataset, beach.id);
  });
  protected readonly forecast = computed(() => {
    const scenario = this.scenario();
    return scenario && displayableForecast(scenario);
  });
  protected readonly safety = computed(() => this.scenario()?.safety ?? 'unknown');
  protected readonly safetyLabels = sampleSafetyLabels;

  private readonly intro = viewChild.required<ElementRef<HTMLElement>>('intro');
  private readonly mapHost = viewChild.required('mapHost', { read: ElementRef<HTMLElement> });
  private readonly destroyRef = inject(DestroyRef);

  protected selectBeach(id: BeachId): void {
    if (id === this.selectedId() || !this.beaches.some((beach) => beach.id === id)) return;

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { beach: id },
      queryParamsHandling: 'merge',
      preserveFragment: true,
    });
  }

  constructor() {
    afterNextRender(() => {
      const map = this.mapHost().nativeElement;
      const shell = map.closest('app-root');
      const header = shell?.querySelector('app-header');
      const navigation = shell?.querySelector('app-mobile-navigation');
      const window = map.ownerDocument.defaultView;
      if (!header || !navigation || !window || typeof ResizeObserver === 'undefined') return;

      const measure = () => {
        // Use the map's document position so scrolling does not change its height.
        const mapTop = map.getBoundingClientRect().top + window.scrollY;
        const occupiedHeight = mapTop + navigation.getBoundingClientRect().height;
        map.style.setProperty('--map-occupied-height', `${occupiedHeight}px`);
      };

      const observer = new ResizeObserver(measure);
      observer.observe(header);
      observer.observe(this.intro().nativeElement);
      observer.observe(navigation);
      measure();
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
