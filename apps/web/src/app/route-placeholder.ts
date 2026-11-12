import { Component, input } from '@angular/core';

@Component({
  selector: 'app-route-placeholder',
  standalone: true,
  template: '<h1>{{ heading() }}</h1>',
})
export class RoutePlaceholder {
  readonly heading = input.required<string>();
}
