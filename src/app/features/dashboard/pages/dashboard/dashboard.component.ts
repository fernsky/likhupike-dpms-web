import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatDrawerMode } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import * as DashboardActions from '../../store/dashboard.actions';
import { SharedModule } from '@shared/shared.module';
import {
  selectSystemStats,
  selectRecentActivities,
  selectQuickActions,
  selectSystemHealth,
  selectDashboardLoading,
  selectDashboardErrors,
  selectSidenavState,
  selectCurrentView,
} from '../../store/dashboard.selectors';
import {
  SystemStats,
  RecentActivity,
  QuickAction,
} from '../../store/dashboard.state';
import { StatisticsCardComponent } from '../../components/statistics-card/statistics-card.component';
import { QuickActionsComponent } from '../../components/quick-actions/quick-actions.component';
import { HeaderComponent } from '../../components/header/header.component';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MatSidenavModule,

    QuickActionsComponent,
    HeaderComponent,
    SidenavComponent,
  ],
})
export class DashboardComponent implements OnInit {
  currentYear = new Date().getFullYear();

  // Layout observables
  sidenavMode$: Observable<MatDrawerMode> = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(map((result) => (result.matches ? 'over' : 'side')));

  sidenavOpened$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(map((result) => !result.matches));

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(map((result) => result.matches));

  // Dashboard data observables
  systemStats$: Observable<SystemStats | null> =
    this.store.select(selectSystemStats);
  recentActivities$: Observable<RecentActivity[]> = this.store.select(
    selectRecentActivities
  );
  quickActions$: Observable<QuickAction[]> =
    this.store.select(selectQuickActions);
  isLoading$: Observable<boolean> = this.store.select(selectDashboardLoading);
  errors$: Observable<Record<string, string | null>> = this.store.select(
    selectDashboardErrors
  );
  sidenavState$: Observable<boolean> = this.store.select(selectSidenavState);
  currentView$: Observable<string> = this.store.select(selectCurrentView);

  constructor(
    private store: Store,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.store.dispatch(DashboardActions.loadSystemStats());
    this.store.dispatch(
      DashboardActions.loadRecentActivities({ pageSize: 10, pageIndex: 0 })
    );
    this.store.dispatch(DashboardActions.loadQuickActions());
    this.store.dispatch(DashboardActions.checkSystemHealth());
  }

  onSidenavToggle(): void {
    this.store.dispatch(
      DashboardActions.securityEventDetected({
        eventType: 'SYSTEM_CHANGE',
        details: { action: 'TOGGLE_SIDENAV' },
        severity: 'LOW',
      })
    );
  }

  onRefreshData(): void {
    this.loadDashboardData();
  }
}
