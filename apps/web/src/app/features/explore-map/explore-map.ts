import {
  afterNextRender, Component, computed, DestroyRef, ElementRef, inject, input, signal, viewChild,
} from '@angular/core';
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

  private readonly intro = viewChild.required<ElementRef<HTMLElement>>('intro');
  private readonly mapHost = viewChild.required('mapHost', { read: ElementRef<HTMLElement> });
  private readonly destroyRef = inject(DestroyRef);

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
