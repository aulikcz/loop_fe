import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth.interceptor';
import { AuthService } from './core/auth.service';
import { catchError, map, of } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), 
    provideHttpClient(withInterceptors([authInterceptor])), 
    provideRouter(routes),
    provideAppInitializer(() => {
      const auth = inject(AuthService);

      return auth.refresh().pipe(
        map(() => undefined),
        catchError(() => of(undefined)),
      );
    }),
  ]
};
