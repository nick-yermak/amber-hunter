import type { RouteTitle } from './core/localization/localization';
import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { resolveAcademyArticle, resolveAcademyLibrary } from './features/academy/academy-library';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Home, title: 'home' satisfies RouteTitle },
  {
    path: 'map',
    loadComponent: () => import('./features/explore-map/explore-map').then((feature) => feature.ExploreMap),
    title: 'mapTitle' satisfies RouteTitle,
  },
  {
    path: 'beaches/:slug',
    loadComponent: () => import('./features/beaches/beach-details').then((feature) => feature.BeachDetails),
    title: 'beachDetails' satisfies RouteTitle,
  },
  {
    path: 'academy',
    pathMatch: 'full',
    loadComponent: () => import('./features/academy/academy-index').then((feature) => feature.AcademyIndex),
    title: 'academy' satisfies RouteTitle,
    resolve: { articles: resolveAcademyLibrary },
  },
  {
    path: 'academy/:slug',
    loadComponent: () => import('./features/academy/article-reader').then((feature) => feature.ArticleReader),
    title: 'articleReader' satisfies RouteTitle,
    resolve: { article: resolveAcademyArticle },
  },
];
