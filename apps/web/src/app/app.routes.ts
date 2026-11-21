import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { RoutePlaceholder } from './route-placeholder';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Home, title: 'Home' },
  { path: 'map', component: RoutePlaceholder, title: 'Explore Map', data: { heading: 'Explore Map' } },
  { path: 'beaches/:slug', component: RoutePlaceholder, title: 'Beach Details', data: { heading: 'Beach Details' } },
  { path: 'academy', component: RoutePlaceholder, title: 'Amber Academy', data: { heading: 'Amber Academy' } },
  { path: 'academy/:slug', component: RoutePlaceholder, title: 'Article Reader', data: { heading: 'Article Reader' } },
];
