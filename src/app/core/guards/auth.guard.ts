import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { selectIsAuthenticated } from '../store/auth/auth.selectors';

export const authGuard = (): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map((isAuthenticated) => {
      console.log('Auth Guard - isAuthenticated:', isAuthenticated);
      if (!isAuthenticated) {
        return router.createUrlTree(['/auth/login']);
      }
      return true;
    })
  );
};
