import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap, switchMap } from 'rxjs/operators';
import { AuthService } from '@app/core/services/auth.service';
import * as AuthActions from './auth.actions';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((response) => AuthActions.loginSuccess({ response })),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message }))
          )
        )
      )
    )
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
          this.authService.logout();
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  requestPasswordReset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.requestPasswordReset),
      switchMap(({ email }) =>
        this.authService.requestPasswordReset(email).pipe(
          map(() => AuthActions.requestPasswordResetSuccess()),
          catchError((error) =>
            of(
              AuthActions.requestPasswordResetFailure({ error: error.message })
            )
          )
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ userData }) =>
        this.authService.register(userData).pipe(
          map((response) => AuthActions.registerSuccess({ response })),
          catchError((error: HttpErrorResponse) =>
            of(AuthActions.registerFailure({ error: this.handleError(error) }))
          )
        )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => this.router.navigate(['/verify-email']))
      ),
    { dispatch: false }
  );

  private handleError(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return error.error.message;
    }
    return (
      error.error?.message || error.message || 'An unexpected error occurred'
    );
  }

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}
