import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideClientHydration } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { provideTranslocoConfig } from './core/config/transloco.config';

const FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideStore(),
    provideEffects(),
    provideClientHydration(),
    importProvidersFrom(MatIconModule),
    {
      provide: 'MAT_DEFAULT_OPTIONS',
      useValue: {
        typography: {
          fontFamily: FONT_FAMILY,
        },
      },
    },
    ...provideTranslocoConfig(), // Add Transloco configuration
  ],
};
