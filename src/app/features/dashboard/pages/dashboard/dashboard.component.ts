import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import * as DashboardActions from '../../store/dashboard.actions';
import * as AuthActions from '@app/core/store/auth/auth.actions';
import { SharedModule } from '@shared/shared.module';
import {
  selectSystemStats,
  selectRecentActivities,
  selectQuickActions,
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
import { QuickActionsComponent } from '../../components/quick-actions/quick-actions.component';
import { HeaderComponent } from '../../components/header/header.component';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';

// Import additional Angular Material modules
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslocoModule } from '@jsverse/transloco';

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
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatBadgeModule,
    TranslocoModule,

    QuickActionsComponent,
    HeaderComponent,
    SidenavComponent,
  ],
})
export class DashboardComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  currentYear = new Date().getFullYear();

  isMobileOpen = false;

  // Layout observables
  sidenavMode$: Observable<MatDrawerMode> = this.breakpointObserver
    .observe([Breakpoints.Handset, '(max-width: 1199px)'])
    .pipe(map((result) => (result.matches ? 'over' : 'side')));

  // Update sidenavOpened$ to be more responsive
  sidenavOpened$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset, '(max-width: 1199px)'])
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
    private router: Router,
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
    this.isMobileOpen = !this.isMobileOpen;
    if (this.sidenav) {
      this.sidenav.toggle();
      // Dispatch security event after successful toggle
      this.store.dispatch(
        DashboardActions.securityEventDetected({
          eventType: 'SYSTEM_CHANGE',
          details: {
            action: 'TOGGLE_SIDENAV',
            state: this.sidenav.opened ? 'OPENED' : 'CLOSED',
          },
          severity: 'LOW',
        })
      );
    }
  }

  onMobileClose(): void {
    this.isMobileOpen = false;
    if (this.sidenav) {
      this.sidenav.close();
    }
  }

  onRefreshData(): void {
    this.loadDashboardData();
  }

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
