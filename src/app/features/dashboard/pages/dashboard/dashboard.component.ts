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
  sidenavMode$: Observable<MatDrawerMode>;
  sidenavOpened$: Observable<boolean>;
  isHandset$: Observable<boolean>;

  // Dashboard data observables
  systemStats$: Observable<SystemStats | null>;
  recentActivities$: Observable<RecentActivity[]>;
  quickActions$: Observable<QuickAction[]>;
  isLoading$: Observable<boolean>;
  errors$: Observable<Record<string, string | null>>;
  sidenavState$: Observable<boolean>;
  currentView$: Observable<string>;

  constructor(
    private store: Store,
    private breakpointObserver: BreakpointObserver
  ) {
    // Initialize all observables in constructor
    this.setupResponsiveLayout();
    this.setupDashboardData();
  }

  private setupResponsiveLayout(): void {
    this.isHandset$ = this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(map((result) => result.matches));

    this.sidenavMode$ = this.isHandset$.pipe(
      map((isHandset) => (isHandset ? 'over' : 'side'))
    );

    this.sidenavOpened$ = this.isHandset$.pipe(map((isHandset) => !isHandset));
  }

  private setupDashboardData(): void {
    this.systemStats$ = this.store.select(selectSystemStats);
    this.recentActivities$ = this.store.select(selectRecentActivities);
    this.quickActions$ = this.store.select(selectQuickActions);
    this.isLoading$ = this.store.select(selectDashboardLoading);
    this.errors$ = this.store.select(selectDashboardErrors);
    this.sidenavState$ = this.store.select(selectSidenavState);
    this.currentView$ = this.store.select(selectCurrentView);
  }

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
