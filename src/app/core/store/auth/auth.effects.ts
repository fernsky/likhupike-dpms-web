import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import * as AuthActions from './auth.actions';
import { AuthUser } from './auth.types';

@Injectable()
export class AuthEffects {
  initializeAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initializeAuth),
      map(() => {
        if (this.storageService.hasStoredAuth()) {
          const token = this.storageService.getToken();
          const user = this.storageService.getUser();

          if (token && user) {
            return AuthActions.authInitialized({ token, user });
          }
        }
        return AuthActions.authInitialized({ token: null, user: null });
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((response) => {
            // Ensure response has required properties
            if (!response.token || !response.userId) {
              throw new Error('Invalid login response');
            }

            const { token, userId, email, roles } = response;
            // Ensure user has required properties for AuthUser
            const authUser: AuthUser = {
              id: userId,
              email: email,
              name: '',
              roles: roles || [],
            };

            this.storageService.setToken(token);
            this.storageService.setUser(authUser);
            return AuthActions.loginSuccess({ token, user: authUser });
          }),
          catchError((error) => {
            const errorMessage = error.message || 'Login failed';
            return of(AuthActions.loginFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ userData }) =>
        this.authService.register(userData).pipe(
          map((response) => {
            if (!response.token || !response.userId) {
              throw new Error('Invalid registration response');
            }

            const authUser: AuthUser = {
              id: response.userId,
              email: response.email,
              name: userData.fullName,
              roles: response.roles || [],
            };

            this.storageService.setToken(response.token);
            this.storageService.setUser(authUser);

            return AuthActions.registerSuccess({ response });
          }),
          catchError((error) => {
            console.error('Registration error:', error);
            return of(
              AuthActions.registerFailure({
                error: error.error?.message || 'Registration failed',
              })
            );
          })
        )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(({ response }) => {
          // Auto login after successful registration
          const authUser: AuthUser = {
            id: response.userId,
            email: response.email,
            name: '',
            roles: response.roles || [],
          };
          this.store.dispatch(
            AuthActions.loginSuccess({
              token: response.token,
              user: authUser,
            })
          );
        })
      ),
    { dispatch: false }
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/dashboard']))
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.storageService.clearAuth();
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private store: Store
  ) {}
}
