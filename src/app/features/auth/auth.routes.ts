import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { registerFormReducer } from './store/register-form.reducer';
import { provideNativeDateAdapter } from '@angular/material/core';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    providers: [
      provideState({ name: 'registerForm', reducer: registerFormReducer }),
      provideNativeDateAdapter(),
    ],
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },
];
