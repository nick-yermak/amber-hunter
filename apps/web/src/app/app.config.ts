import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, TitleStrategy, withComponentInputBinding } from '@angular/router';
import { LocalizedTitleStrategy } from './core/localization/localization';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: TitleStrategy, useClass: LocalizedTitleStrategy },
    provideRouter(routes, withComponentInputBinding({ queryParams: false })),
  ],
};
