import { createAction, props } from '@ngrx/store';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
} from '../../models/auth.interface';

export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginRequest }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ response: AuthResponse }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const register = createAction(
  '[Auth] Register',
  props<{ userData: RegisterRequest }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ response: AuthResponse }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');

export const refreshToken = createAction(
  '[Auth] Refresh Token',
  props<{ refreshToken: string }>()
);

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ response: AuthResponse }>()
);

export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: string }>()
);

export const requestPasswordReset = createAction(
  '[Auth] Request Password Reset',
  props<{ email: RequestPasswordResetRequest }>()
);

export const requestPasswordResetSuccess = createAction(
  '[Auth] Request Password Reset Success'
);

export const requestPasswordResetFailure = createAction(
  '[Auth] Request Password Reset Failure',
  props<{ error: string }>()
);

export const terminateSession = createAction(
  '[Auth] Terminate Session',
  props<{ reason: string }>()
);

export const terminateSessionSuccess = createAction(
  '[Auth] Terminate Session Success'
);

export const terminateSessionFailure = createAction(
  '[Auth] Terminate Session Failure',
  props<{ error: string }>()
);

export const resetPassword = createAction(
  '[Auth] Reset Password',
  props<{ resetData: ResetPasswordRequest }>()
);

export const resetPasswordSuccess = createAction(
  '[Auth] Reset Password Success'
);

export const resetPasswordFailure = createAction(
  '[Auth] Reset Password Failure',
  props<{ error: string }>()
);
