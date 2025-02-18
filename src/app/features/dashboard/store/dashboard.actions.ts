import { createAction, props } from '@ngrx/store';
import { SystemStats, RecentActivity, QuickAction } from './dashboard.state';

// System Stats
export const loadSystemStats = createAction('[Dashboard] Load System Stats');
export const loadSystemStatsSuccess = createAction(
  '[Dashboard] Load System Stats Success',
  props<{ stats: SystemStats }>(),
);
export const loadSystemStatsFailure = createAction(
  '[Dashboard] Load System Stats Failure',
  props<{ error: string }>(),
);

// Recent Activities
export const loadRecentActivities = createAction(
  '[Dashboard] Load Recent Activities',
  props<{ pageSize: number; pageIndex: number }>(),
);
export const loadRecentActivitiesSuccess = createAction(
  '[Dashboard] Load Recent Activities Success',
  props<{ activities: RecentActivity[]; totalCount: number }>(),
);
export const loadRecentActivitiesFailure = createAction(
  '[Dashboard] Load Recent Activities Failure',
  props<{ error: string }>(),
);

// Quick Actions
export const loadQuickActions = createAction('[Dashboard] Load Quick Actions');
export const loadQuickActionsSuccess = createAction(
  '[Dashboard] Load Quick Actions Success',
  props<{ actions: QuickAction[] }>(),
);
export const loadQuickActionsFailure = createAction(
  '[Dashboard] Load Quick Actions Failure',
  props<{ error: string }>(),
);

// System Health
export const checkSystemHealth = createAction(
  '[Dashboard] Check System Health',
);
export const systemHealthStatus = createAction(
  '[Dashboard] System Health Status',
  props<{
    status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
    issues: string[];
    timestamp: Date;
    metrics: Record<string, any>;
  }>(),
);

// Security Events
export const securityEventDetected = createAction(
  '[Dashboard] Security Event Detected',
  props<{
    eventType: 'ACCESS_DENIED' | 'UNUSUAL_ACTIVITY' | 'SYSTEM_CHANGE';
    details: { action: string; [key: string]: any };
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
  }>(),
);

// Dashboard State Management
export const clearDashboardState = createAction(
  '[Dashboard] Clear Dashboard State',
);
export const refreshDashboardData = createAction(
  '[Dashboard] Refresh Dashboard Data',
  props<{ force?: boolean }>(),
);
