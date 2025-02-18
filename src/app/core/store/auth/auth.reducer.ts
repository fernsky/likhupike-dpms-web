import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthState, initialAuthState } from './auth.types';

export const authReducer = createReducer(
  initialAuthState,
  on(
    AuthActions.login,
    (state): AuthState => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),
  on(
    AuthActions.loginSuccess,
    (state, { response }): AuthState => ({
      ...state,
      user: response.user,
      token: response.token,
      refreshToken: response.refreshToken,
      loading: false,
      error: null,
    }),
  ),
  on(
    AuthActions.loginFailure,
    (state, { error }): AuthState => ({
      ...state,
      loading: false,
      error,
    }),
  ),
  on(AuthActions.logout, (): AuthState => initialAuthState),
  on(
    AuthActions.requestPasswordReset,
    (state): AuthState => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),
  on(
    AuthActions.requestPasswordResetSuccess,
    (state): AuthState => ({
      ...state,
      loading: false,
      error: null,
    }),
  ),
  on(
    AuthActions.requestPasswordResetFailure,
    (state, { error }): AuthState => ({
      ...state,
      loading: false,
      error,
    }),
  ),
);
