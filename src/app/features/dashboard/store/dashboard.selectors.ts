import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from './dashboard.state';

// Feature selector
export const selectDashboardState =
  createFeatureSelector<DashboardState>('dashboard');

// System Stats selectors
export const selectSystemStats = createSelector(
  selectDashboardState,
  (state) => state.systemStats,
);

export const selectSystemStatsLoading = createSelector(
  selectDashboardState,
  (state) => state.loading.systemStats,
);

export const selectSystemStatsError = createSelector(
  selectDashboardState,
  (state) => state.error.systemStats,
);

// Recent Activities selectors
export const selectRecentActivities = createSelector(
  selectDashboardState,
  (state) => state.recentActivities.items,
);

export const selectRecentActivitiesLoading = createSelector(
  selectDashboardState,
  (state) => state.loading.recentActivities,
);

export const selectRecentActivitiesTotalCount = createSelector(
  selectDashboardState,
  (state) => state.recentActivities.totalCount,
);

export const selectRecentActivitiesError = createSelector(
  selectDashboardState,
  (state) => state.error.recentActivities,
);

// Quick Actions selectors
export const selectQuickActions = createSelector(
  selectDashboardState,
  (state) => state.quickActions.items,
);

export const selectQuickActionsLoading = createSelector(
  selectDashboardState,
  (state) => state.loading.quickActions,
);

export const selectQuickActionsError = createSelector(
  selectDashboardState,
  (state) => state.error.quickActions,
);

// System Health selectors
export const selectSystemHealth = createSelector(
  selectDashboardState,
  (state) => state.systemHealth,
);

export const selectSystemHealthStatus = createSelector(
  selectSystemHealth,
  (health) => health.status,
);

export const selectSystemHealthIssues = createSelector(
  selectSystemHealth,
  (health) => health.issues,
);

// UI State selectors
export const selectSidenavState = createSelector(
  selectDashboardState,
  (state) => state.ui.sidenavOpen,
);

export const selectCurrentView = createSelector(
  selectDashboardState,
  (state) => state.ui.currentView,
);

// Combined selectors
export const selectDashboardLoading = createSelector(
  selectDashboardState,
  (state) =>
    state.loading.systemStats ||
    state.loading.recentActivities ||
    state.loading.quickActions,
);

export const selectDashboardErrors = createSelector(
  selectDashboardState,
  (state) => state.error,
);

// Utility selectors
export const selectHasActiveAlerts = createSelector(
  selectSystemHealth,
  (health) => health.status !== 'HEALTHY' && health.issues.length > 0,
);

export const selectDashboardSummary = createSelector(
  selectSystemStats,
  selectRecentActivities,
  selectSystemHealthStatus,
  (stats, activities, healthStatus) => ({
    stats,
    latestActivities: activities.slice(0, 5),
    systemStatus: healthStatus,
  }),
);
