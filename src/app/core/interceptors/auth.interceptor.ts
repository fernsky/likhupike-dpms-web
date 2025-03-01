import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, switchMap, throwError } from 'rxjs';
import * as AuthSelectors from '../store/auth/auth.selectors';
import * as AuthActions from '../store/auth/auth.actions';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const router = inject(Router);

  const addToken = (token: string) => {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const isAuthEndpoint = (url: string): boolean => {
    return ['/auth/login', '/auth/register', '/auth/refresh-token'].some(
      (endpoint) => url.includes(endpoint)
    );
  };

  // Skip for auth endpoints
  if (isAuthEndpoint(req.url)) {
    return next(req);
  }

  return store.select(AuthSelectors.selectToken).pipe(
    switchMap((token) => {
      // Add token if exists
      const authReq = token ? addToken(token) : req;

      return next(authReq).pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            // Handle 401 error
            store.dispatch(AuthActions.logout());
            router.navigate(['/auth/login']);
          }
          return throwError(() => error);
        })
      );
    })
  );
};
