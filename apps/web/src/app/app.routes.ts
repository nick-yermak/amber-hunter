import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { resolveAcademyArticle, resolveAcademyLibrary } from './features/academy/academy-library';

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
  {
    path: 'academy',
    pathMatch: 'full',
    loadComponent: () => import('./features/academy/academy-index').then((feature) => feature.AcademyIndex),
    title: 'Amber Academy',
    resolve: { articles: resolveAcademyLibrary },
  },
  {
    path: 'academy/:slug',
    loadComponent: () => import('./features/academy/article-reader').then((feature) => feature.ArticleReader),
    title: 'Article Reader',
    resolve: { article: resolveAcademyArticle },
  },
];
