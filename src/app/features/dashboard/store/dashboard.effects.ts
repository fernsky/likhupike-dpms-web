import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  withLatestFrom,
  debounceTime,
  switchMap,
  tap,
} from 'rxjs/operators';
import * as DashboardActions from './dashboard.actions';
import { DashboardService } from '../services/dashboard.service';
import { AuditLogService } from '@app/core/services/audit-log.service';
import { SecurityService } from '@app/core/services/security';
import { ErrorHandlingService } from '@app/core/services/error-handling.service';
import { selectUserPermissions } from '@app/core/store/auth/auth.selectors';
import {
  SystemHealthStatus,
  SecuritySeverity,
} from '@app/core/services/security/security.types';
import { SystemHealthCheckResponse } from '../models/dashboard.types';

@Injectable()
export class DashboardEffects {
  loadSystemStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadSystemStats),
      withLatestFrom(this.store.select(selectUserPermissions)),
      mergeMap(([_, permissions]) => {
        if (
          !this.securityService.hasRequiredPermissions(
            permissions?.user?.roles || [],
            ['VIEW_SYSTEM_STATS'],
          )
        ) {
          this.auditLogService.logSecurityEvent(
            'ACCESS_DENIED',
            { resource: 'SYSTEM_STATS' },
            'HIGH',
          );
          return of(
            DashboardActions.loadSystemStatsFailure({
              error: 'Insufficient permissions to view system statistics',
            }),
          );
        }

        return this.dashboardService.getSystemStats().pipe(
          map((stats) => DashboardActions.loadSystemStatsSuccess({ stats })),
          catchError((error) => {
            this.errorHandlingService.handleError(error);
            return of(
              DashboardActions.loadSystemStatsFailure({ error: error.message }),
            );
          }),
        );
      }),
    ),
  );

  loadRecentActivities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadRecentActivities),
      debounceTime(300), // Prevent rapid-fire requests
      withLatestFrom(this.store.select(selectUserPermissions)),
      mergeMap(([{ pageSize, pageIndex }, permissions]) => {
        if (
          !this.securityService.hasRequiredPermissions(
            permissions?.user?.roles || [],
            ['VIEW_ACTIVITIES'],
          )
        ) {
          return this.handleSecurityViolation('VIEW_ACTIVITIES');
        }

        return this.dashboardService
          .getRecentActivities(pageSize, pageIndex)
          .pipe(
            map((response) =>
              DashboardActions.loadRecentActivitiesSuccess({
                activities: response.activities,
                totalCount: response.totalCount,
              }),
            ),
            catchError((error) =>
              this.handleError(error, 'loadRecentActivitiesFailure'),
            ),
          );
      }),
    ),
  );

  // System health monitoring with automatic recovery attempts
  checkSystemHealth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.checkSystemHealth),
      mergeMap(() =>
        this.dashboardService.checkSystemHealth().pipe(
          map((healthStatus: SystemHealthCheckResponse) => {
            // Convert CRITICAL to DOWN for status mapping
            const mappedStatus =
              healthStatus.status === 'CRITICAL' ? 'DOWN' : healthStatus.status;

            // Convert complex issue objects to simple strings
            const mappedIssues = healthStatus.issues.map(
              (issue) =>
                `${issue.component}: ${issue.description} (${issue.severity})`,
            );

            return {
              type: '[Dashboard] System Health Status',
              status: mappedStatus as 'HEALTHY' | 'DEGRADED' | 'DOWN',
              issues: mappedIssues,
              timestamp: healthStatus.timestamp,
              metrics: healthStatus.metrics,
            };
          }),
          tap((status) => {
            if (status.status !== 'HEALTHY') {
              this.handleSystemHealthIssues({
                status: status.status === 'DOWN' ? 'CRITICAL' : 'DEGRADED',
                timestamp: new Date(),
                issues: [
                  {
                    id: 'SYSTEM-HEALTH',
                    component: 'System',
                    description:
                      status.issues?.join('; ') || 'System health degraded',
                    severity: status.status === 'DOWN' ? 'CRITICAL' : 'HIGH',
                    timestamp: status.timestamp,
                    status: 'ACTIVE',
                  },
                ],
                metrics: status.metrics,
              });
            }
          }),
          catchError((error) => this.handleError(error, 'systemHealthStatus')),
        ),
      ),
    ),
  );

  private handleError(error: any, actionType: string, actionId?: string) {
    this.errorHandlingService.handleError(error);
    this.auditLogService.logSecurityEvent(
      'ERROR',
      {
        error,
        actionType,
        actionId,
        timestamp: new Date(),
      },
      'HIGH' as SecuritySeverity,
    );

    const securityEvent: {
      eventType: 'ACCESS_DENIED' | 'UNUSUAL_ACTIVITY' | 'SYSTEM_CHANGE';
      details: { [key: string]: any; action: string };
      severity: 'LOW' | 'MEDIUM' | 'HIGH';
    } = {
      eventType: 'SYSTEM_CHANGE',
      details: {
        error: error.message,
        actionType,
        action: actionType,
        ...(actionId && { actionId }),
      },
      severity: 'HIGH',
    };

    return of(DashboardActions.securityEventDetected(securityEvent));
  }

  private handleSecurityViolation(resource: string) {
    const securityEvent = {
      eventType: 'ACCESS_DENIED' as const,
      details: {
        resource,
        action: 'ACCESS_RESOURCE',
      },
      severity: 'HIGH' as const,
    };

    this.auditLogService.logSecurityEvent(
      'ACCESS_DENIED',
      { resource },
      'HIGH' as SecuritySeverity,
    );

    return of(DashboardActions.securityEventDetected(securityEvent));
  }

  private handleSystemHealthIssues(status: SystemHealthStatus) {
    if (status.issues?.length) {
      this.securityService.notifySystemAdministrators({
        type: 'SYSTEM_HEALTH',
        severity: status.issues[0].severity,
        message: `System health issues detected: ${status.issues.length} issues found`,
        timestamp: new Date(),
        data: status,
        requiresAction: status.status === 'CRITICAL',
      });
    }
  }

  constructor(
    private actions$: Actions,
    private store: Store,
    private dashboardService: DashboardService,
    private auditLogService: AuditLogService,
    private securityService: SecurityService,
    private errorHandlingService: ErrorHandlingService,
  ) {}
}
