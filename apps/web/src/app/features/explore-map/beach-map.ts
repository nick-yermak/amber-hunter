import { Localization } from '../../core/localization/localization';
import {
  afterNextRender, Component, DestroyRef, effect, ElementRef, inject, input, output,
  signal, viewChild,
} from '@angular/core';
import { AttributionControl, Map, Marker, NavigationControl, setWorkerUrl } from 'maplibre-gl';
import { Beach } from '../beaches/pilot-beaches';

@Component({
  selector: 'app-beach-map',
  standalone: true,
  templateUrl: './beach-map.html',
  styleUrl: './beach-map.css',
})
export class BeachMap {
  protected readonly i18n = inject(Localization);
  readonly beaches = input.required<readonly Beach[]>();
  readonly selectedId = input.required<string | null>();
  readonly beachSelected = output<string>();
  protected readonly state = signal<'loading' | 'ready' | 'error'>('loading');

  private readonly container = viewChild.required<ElementRef<HTMLElement>>('canvas');
  private readonly destroyRef = inject(DestroyRef);
  private readonly map = signal<Map | undefined>(undefined);
  private readonly markers = signal<{ marker: Marker; button: HTMLButtonElement; id: string }[]>([]);
  private observer?: ResizeObserver;

  constructor() {
    afterNextRender(() => this.start());
    this.destroyRef.onDestroy(() => this.stop());

    effect((onCleanup) => {
      const map = this.map();
      const beaches = this.beaches();
      if (!map) {
        this.markers.set([]);
        return;
      }

      const markers = beaches.map((beach) => {
        const button = this.container().nativeElement.ownerDocument.createElement('button');
        button.type = 'button';
        button.className = 'beach-map-marker';
        button.setAttribute('aria-label', beach.name);
        button.title = beach.name;
        button.addEventListener('click', () => this.beachSelected.emit(beach.id));
        const marker = new Marker({ element: button })
          .setLngLat([...beach.position])
          .addTo(map);
        return { marker, button, id: beach.id };
      });
      this.markers.set(markers);
      onCleanup(() => markers.forEach(({ marker }) => marker.remove()));
    });

    effect(() => this.updateMarkers(this.selectedId()));

    effect(() => {
      if (!this.map()) return;

      const container = this.container().nativeElement;
      container.querySelector('canvas')?.setAttribute('aria-label', this.i18n.text('map'));
      // MapLibre applies its locale when creating controls. Relabel the existing
      // controls so that switching language preserves focus, camera and markers.
      const controls = [
        ['.maplibregl-ctrl-zoom-in', this.i18n.text('zoomIn')],
        ['.maplibregl-ctrl-zoom-out', this.i18n.text('zoomOut')],
        ['.maplibregl-ctrl-attrib-button', this.i18n.text('attribution')],
      ];
      for (const [selector, label] of controls) {
        const control = container.querySelector<HTMLElement>(selector);
        if (!control) continue;
        control.setAttribute('aria-label', label);
        control.title = label;
      }
    });
  }

  protected start(): void {
    this.stop();
    this.state.set('loading');
    const container = this.container().nativeElement;

    if (typeof WebGL2RenderingContext === 'undefined') {
      this.state.set('error');
      return;
    }

    try {
      setWorkerUrl(new URL('maplibre/maplibre-gl-worker.mjs', container.ownerDocument.baseURI).href);
      const map = new Map({
        container,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [18.905, 54.36],
        zoom: 10.3,
        maxZoom: 17,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
      });
      this.map.set(map);
      map.touchZoomRotate.disableRotation();
      map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
      map.addControl(new AttributionControl({ compact: false }), 'bottom-right');
      map.on('load', () => this.state.set('ready'));
      map.on('error', () => {
        if (this.state() === 'loading') this.state.set('error');
      });
      this.observer = new ResizeObserver(() => map.resize());
      this.observer.observe(container);
    } catch {
      this.stop();
      this.state.set('error');
    }
  }

  private stop(): void {
    this.observer?.disconnect();
    this.observer = undefined;
    this.map()?.remove();
    this.map.set(undefined);
  }

  private updateMarkers(selectedId: string | null): void {
    for (const { button, id } of this.markers()) {
      button.setAttribute('aria-pressed', String(id === selectedId));
    }
  }
}
