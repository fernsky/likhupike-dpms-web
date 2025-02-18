import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  SystemStats,
  RecentActivity,
  QuickAction,
} from '../store/dashboard.state';
import { SystemHealthCheckResponse } from '../models/dashboard.types';
import { EncryptionService } from '@app/core/services/encryption.service';
import { CacheService } from '../../../core/services/cache.service';
import { LoggingService } from '../../../core/services/logging.service';
import { LogContext } from '@app/core/types/logging.types';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly SENSITIVE_HEADERS = {
    'X-Government-Access-Level': 'restricted',
    'X-Audit-Trail': 'enabled',
  };

  constructor(
    private http: HttpClient,
    private encryptionService: EncryptionService,
    private cacheService: CacheService,
    private loggingService: LoggingService,
  ) {}

  getSystemStats(): Observable<SystemStats> {
    const cachedStats = this.cacheService.get<SystemStats>('system-stats');
    if (cachedStats) {
      return from(this.encryptionService.decryptSensitiveData(cachedStats));
    }

    return this.http
      .get<SystemStats>(`${this.apiUrl}/stats`, {
        headers: this.getSecureHeaders(),
      })
      .pipe(
        tap((stats) =>
          this.cacheService.set('system-stats', stats, this.CACHE_DURATION),
        ),
        switchMap((stats) =>
          this.encryptionService.decryptSensitiveData(stats),
        ),
        catchError(this.handleError('getSystemStats')),
      );
  }

  getRecentActivities(
    pageSize: number,
    pageIndex: number,
  ): Observable<{ activities: RecentActivity[]; totalCount: number }> {
    const params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('pageIndex', pageIndex.toString())
      .set('sort', 'timestamp')
      .set('order', 'desc');

    return this.http
      .get<{ activities: RecentActivity[]; totalCount: number }>(
        `${this.apiUrl}/activities`,
        {
          params,
          headers: this.getSecureHeaders(),
        },
      )
      .pipe(
        map((response) => ({
          activities: response.activities.map((activity) => ({
            ...activity,
            timestamp: new Date(activity.timestamp),
          })),
          totalCount: response.totalCount,
        })),
        catchError(this.handleError('getRecentActivities')),
      );
  }

  executeQuickAction(
    actionId: string,
    payload?: Record<string, unknown>,
  ): Observable<any> {
    const actionContext: LogContext = {
      actionId,
      actionType: 'USER_ACTION',
      timestamp: new Date().toISOString(),
      resource: 'quick-action',
      payload,
    };

    this.loggingService.logAudit('QUICK_ACTION_EXECUTED', actionContext);

    return from(this.encryptionService.encryptPayload(payload)).pipe(
      switchMap((encryptedPayload) =>
        this.http.post(
          `${this.apiUrl}/actions/${actionId}/execute`,
          encryptedPayload,
          { headers: this.getSecureHeaders() },
        ),
      ),
      switchMap((response) =>
        this.encryptionService.decryptSensitiveData(response),
      ),
      catchError(this.handleError('executeQuickAction')),
    );
  }

  checkSystemHealth(): Observable<SystemHealthCheckResponse> {
    return this.http.get<SystemHealthCheckResponse>(
      `${this.apiUrl}/system/health`,
    );
  }

  exportActivitiesReport(
    startDate: Date,
    endDate: Date,
    format: 'PDF' | 'EXCEL',
  ): Observable<Blob> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString())
      .set('format', format);

    const auditContext: LogContext = {
      actionType: 'USER_ACTION',
      resource: 'activities-report',
      details: { startDate, endDate, format },
    };

    this.loggingService.logAudit('EXPORT_REPORT', auditContext);

    return this.http
      .get(`${this.apiUrl}/activities/export`, {
        params,
        responseType: 'blob',
        headers: this.getSecureHeaders(),
      })
      .pipe(catchError(this.handleError('exportActivitiesReport')));
  }

  private getSecureHeaders(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-Request-ID', this.generateRequestId())
      .set('X-Transaction-Time', new Date().toISOString());

    Object.entries(this.SENSITIVE_HEADERS).forEach(([key, value]) => {
      headers.set(key, value);
    });

    return headers;
  }

  private generateRequestId(): string {
    return `GOV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private handleError(operation: string) {
    return (error: any): Observable<any> => {
      if (error instanceof HttpErrorResponse) {
        this.loggingService.logError(`${operation} failed`, error);

        if (error.status === 403) {
          this.loggingService.logSecurity('Unauthorized access attempt', {
            operation,
            status: error.status,
            timestamp: new Date(),
            path: error.url,
          });
        }
      }

      return throwError(() => ({
        message: `Operation ${operation} failed: ${error.message}`,
        code: error.status,
        timestamp: new Date(),
      }));
    };
  }
}
