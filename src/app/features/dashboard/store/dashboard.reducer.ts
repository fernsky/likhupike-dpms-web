import { createReducer, on } from '@ngrx/store';
import { DashboardState, initialDashboardState } from './dashboard.state';
import * as DashboardActions from './dashboard.actions';

export const dashboardReducer = createReducer(
  initialDashboardState,

  // System Stats
  on(DashboardActions.loadSystemStats, (state) => ({
    ...state,
    loading: { ...state.loading, systemStats: true },
    error: { ...state.error, systemStats: null },
  })),

  on(DashboardActions.loadSystemStatsSuccess, (state, { stats }) => ({
    ...state,
    systemStats: stats,
    loading: { ...state.loading, systemStats: false },
  })),

  on(DashboardActions.loadSystemStatsFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, systemStats: false },
    error: { ...state.error, systemStats: error },
  })),

  // Recent Activities
  on(DashboardActions.loadRecentActivities, (state) => ({
    ...state,
    loading: { ...state.loading, recentActivities: true },
    error: { ...state.error, recentActivities: null },
  })),

  on(
    DashboardActions.loadRecentActivitiesSuccess,
    (state, { activities, totalCount }) => ({
      ...state,
      recentActivities: {
        items: activities,
        totalCount,
      },
      loading: { ...state.loading, recentActivities: false },
    }),
  ),

  on(DashboardActions.loadRecentActivitiesFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, recentActivities: false },
    error: { ...state.error, recentActivities: error },
  })),

  // Quick Actions
  on(DashboardActions.loadQuickActions, (state) => ({
    ...state,
    loading: { ...state.loading, quickActions: true },
    error: { ...state.error, quickActions: null },
  })),

  on(DashboardActions.loadQuickActionsSuccess, (state, { actions }) => ({
    ...state,
    quickActions: {
      items: actions,
    },
    loading: { ...state.loading, quickActions: false },
  })),

  on(DashboardActions.loadQuickActionsFailure, (state, { error }) => ({
    ...state,
    loading: { ...state.loading, quickActions: false },
    error: { ...state.error, quickActions: error },
  })),

  // System Health
  on(DashboardActions.checkSystemHealth, (state) => ({
    ...state,
    loading: { ...state.loading, systemHealth: true },
    error: { ...state.error, systemHealth: null },
  })),

  on(DashboardActions.systemHealthStatus, (state, payload) => ({
    ...state,
    systemHealth: {
      status: payload.status,
      issues: payload.issues || [],
      lastChecked: payload.timestamp,
      metrics: payload.metrics,
    },
    loading: { ...state.loading, systemHealth: false },
  })),

  // UI State
  on(
    DashboardActions.securityEventDetected,
    (state, { eventType, details }) => {
      if (
        eventType === 'SYSTEM_CHANGE' &&
        details.action === 'TOGGLE_SIDENAV'
      ) {
        return {
          ...state,
          ui: {
            ...state.ui,
            sidenavOpen: !state.ui.sidenavOpen,
          },
        };
      }
      return state;
    },
  ),

  // Clear State
  on(DashboardActions.clearDashboardState, () => ({
    ...initialDashboardState,
  })),

  // Refresh Dashboard Data
  on(DashboardActions.refreshDashboardData, (state, { force }) => ({
    ...state,
    loading: force
      ? {
          systemStats: true,
          recentActivities: true,
          quickActions: true,
          systemHealth: true,
        }
      : state.loading,
  })),
);

export { DASHBOARD_FEATURE_KEY } from './dashboard.state';
export type { DashboardState } from './dashboard.state';
