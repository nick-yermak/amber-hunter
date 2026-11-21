import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { RoutePlaceholder } from './route-placeholder';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Home, title: 'Home' },
  {
    path: 'map',
    loadComponent: () => import('./features/explore-map/explore-map').then((feature) => feature.ExploreMap),
    title: 'Explore Map',
  },
  {
    path: 'beaches/:slug',
    loadComponent: () => import('./features/beaches/beach-details').then((feature) => feature.BeachDetails),
    title: 'Beach Details',
  },
  { path: 'academy', component: RoutePlaceholder, title: 'Amber Academy', data: { heading: 'Amber Academy' } },
  { path: 'academy/:slug', component: RoutePlaceholder, title: 'Article Reader', data: { heading: 'Article Reader' } },
];
