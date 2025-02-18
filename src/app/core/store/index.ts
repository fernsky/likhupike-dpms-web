import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { isDevMode } from '@angular/core';
import { authReducer } from './auth/auth.reducer';
import { AuthState } from './auth/auth.types';
import {
  DASHBOARD_FEATURE_KEY,
  DashboardState,
  dashboardReducer,
} from '@app/features/dashboard/store/dashboard.reducer';

export interface AppState {
  auth: AuthState;
  [DASHBOARD_FEATURE_KEY]: DashboardState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  [DASHBOARD_FEATURE_KEY]: dashboardReducer,
};

export const metaReducers: MetaReducer<AppState>[] = isDevMode() ? [] : [];
