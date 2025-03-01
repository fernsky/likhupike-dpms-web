import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { routes } from './app.routes';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      provide: 'SERVER_ROUTES',
      useValue: { clientRoutes: routes, serverRoutes },
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
