import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthFacade } from '../facades/auth.facade';

export const authenticatedGuard = (): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const authFacade = inject(AuthFacade);

  return authFacade.isAuthenticated$.pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        // User is authenticated, redirect to dashboard
        return router.createUrlTree(['/dashboard']);
      }
      // User is not authenticated, allow access to auth routes
      return true;
    })
  );
};
