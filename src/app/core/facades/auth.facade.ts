import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectAuthLoadingState,
  selectIsAuthenticated,
  selectUserPermissions,
} from '../store/auth/auth.selectors';
import * as AuthActions from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  isAuthenticated$: Observable<boolean> = this.store.select(
    selectIsAuthenticated
  );
  authState$ = this.store.select(selectAuthLoadingState);
  userPermissions$ = this.store.select(selectUserPermissions);

  constructor(private store: Store) {}

  initializeAuth(): void {
    this.store.dispatch(AuthActions.initializeAuth());
  }

  login(credentials: { email: string; password: string }): void {
    this.store.dispatch(AuthActions.login({ credentials }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
