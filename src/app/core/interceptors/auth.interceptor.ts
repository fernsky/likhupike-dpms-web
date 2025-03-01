import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { catchError, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import * as AuthActions from '../store/auth/auth.actions';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const router = inject(Router);
  const store = inject(Store);

  // Skip for auth endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  const token = storageService.getToken();

  if (!token) {
    store.dispatch(AuthActions.logout());
    router.navigate(['/auth/login']);
    return next(req);
  }

  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        storageService.clearAuth();
        store.dispatch(AuthActions.logout());
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};
