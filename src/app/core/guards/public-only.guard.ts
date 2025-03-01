import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { selectAuthLoadingState } from '../store/auth/auth.selectors';

export const publicOnlyGuard = (): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select(selectAuthLoadingState).pipe(
    take(1),
    map((state) => {
      if (state.isAuthenticated) {
        console.log('User is authenticated, redirecting to dashboard');
        return router.createUrlTree(['/dashboard']);
      }
      console.log('User is not authenticated, allowing access');
      return true;
    })
  );
};
