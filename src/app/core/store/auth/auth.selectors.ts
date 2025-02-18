import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.types'; // Changed from auth.reducer
import { RoleType } from '../../models/role.enum';

// Feature selector
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Basic selectors
export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user,
);

export const selectToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token,
);

export const selectRefreshToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.refreshToken,
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading,
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error,
);

// Derived selectors
export const selectIsAuthenticated = createSelector(
  selectToken,
  (token): boolean => !!token,
);

export const selectUserRoles = createSelector(
  selectUser,
  (user) => user?.roles || ([] as RoleType[]),
);

// Role-based selectors
export const selectIsSuperAdmin = createSelector(
  selectUserRoles,
  (roles): boolean => roles.includes(RoleType.SUPER_ADMIN),
);

export const selectIsMunicipalityAdmin = createSelector(
  selectUserRoles,
  (roles): boolean => roles.includes(RoleType.MUNICIPALITY_ADMIN),
);

export const selectIsWardAdmin = createSelector(
  selectUserRoles,
  (roles): boolean => roles.includes(RoleType.WARD_ADMIN),
);

export const selectIsEditor = createSelector(
  selectUserRoles,
  (roles): boolean => roles.includes(RoleType.EDITOR),
);

export const selectIsViewer = createSelector(
  selectUserRoles,
  (roles): boolean => roles.includes(RoleType.VIEWER),
);

// Combined selectors
export const selectAuthStatus = createSelector(
  // Renamed from selectAuthState to avoid duplicate
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  (isAuthenticated, loading, error) => ({
    isAuthenticated,
    loading,
    error,
  }),
);

export const selectUserPermissions = createSelector(
  selectUser,
  selectIsSuperAdmin,
  selectIsMunicipalityAdmin,
  selectIsWardAdmin,
  (user, isSuperAdmin, isMunicipalityAdmin, isWardAdmin) => ({
    user,
    isSuperAdmin,
    isMunicipalityAdmin,
    isWardAdmin,
    canManageUsers: isSuperAdmin || isMunicipalityAdmin || isWardAdmin,
    canViewReports: true, // All authenticated users can view reports
    canEditData: isSuperAdmin || isMunicipalityAdmin || isWardAdmin,
  }),
);
