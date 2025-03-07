import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import {
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  withLatestFrom,
  take,
  tap,
} from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  provideTranslocoScope,
  TranslocoModule,
  TranslocoService,
} from '@jsverse/transloco';

import * as HeaderSelectors from '../../store/header/header.selectors';
import * as HeaderActions from '../../store/header/header.actions';
import * as AuthActions from '@app/core/store/auth/auth.actions';
import {
  HeaderViewModel,
  NotificationPriority,
  NotificationType,
  SearchParams,
} from './header.interface';
import { LanguageSwitcherComponent } from '@app/shared/components/language-switcher/language-switcher.component';
import { HeaderService } from './header.service';
import { LanguageService } from '@app/core/services/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatBadgeModule,
    MatDividerModule,
    MatTooltipModule,
    TranslocoModule,
    LanguageSwitcherComponent,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'header',
      alias: 'header',
    }),
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() menuToggled = new EventEmitter<void>();
  @Input() isSidenavOpen = false;

  // User info (can be replaced with actual user from auth store)
  userName = 'Administrator';
  userRole = 'Municipality Admin';
  currentLang = 'en';

  // View Model combining multiple selectors
  readonly vm$: Observable<HeaderViewModel> = this.store.select(
    HeaderSelectors.selectHeaderViewModel
  );

  // Additional Observables for specific features
  readonly highPriorityNotifications$ = this.store.select(
    HeaderSelectors.selectNotificationsByPriority(NotificationPriority.HIGH)
  );
  readonly isHandset$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));
  readonly searchMetrics$ = this.store.select(
    HeaderSelectors.selectSearchResultsCount
  );
  readonly notificationMetrics$ = this.store.select(
    HeaderSelectors.selectNotificationMetrics
  );

  // Form Groups
  searchForm: FormGroup = this.fb.group({
    query: [''],
    filters: this.fb.group({
      type: [[]],
      dateRange: [null],
      tags: [[]],
    }),
  });

  // Component State
  readonly NotificationType = NotificationType;
  currentDateTime = new Date();
  private clockInterval?: number;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private router: Router,
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private headerService: HeaderService,
    private translocoService: TranslocoService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.setupSearchListener();
    this.setupNotificationsPolling();
    this.setupErrorHandling();
    this.setupLanguageListener();
    this.startClock();
  }

  private setupLanguageListener(): void {
    this.translocoService.langChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        this.currentLang = lang;
      });
  }

  private setupSearchListener(): void {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        ),
        filter(
          (value) => value.query?.length >= 2 || value.filters?.type?.length > 0
        ),
        withLatestFrom(this.store.select(HeaderSelectors.selectHeaderConfig)),
        takeUntil(this.destroy$)
      )
      .subscribe(([formValue, config]) => {
        const searchParams: SearchParams = {
          query: formValue.query,
          filters: formValue.filters,
          pagination: {
            page: 1,
            limit: config.searchResultsLimit || 10,
          },
        };

        this.store.dispatch(HeaderActions.search({ params: searchParams }));
      });
  }

  private setupNotificationsPolling(): void {
    this.store
      .select(HeaderSelectors.selectHeaderConfig)
      .pipe(
        take(1),
        tap((config) => {
          if (config.enableNotifications) {
            const interval = setInterval(() => {
              this.store.dispatch(HeaderActions.loadNotifications());
            }, config.notificationPollInterval || 30000);

            this.destroy$.subscribe(() => clearInterval(interval));
          }
        })
      )
      .subscribe();
  }

  private setupErrorHandling(): void {
    this.store
      .select(HeaderSelectors.selectError)
      .pipe(
        filter((error) => !!error),
        takeUntil(this.destroy$)
      )
      .subscribe((error) => {
        if (error) {
          console.error('Header error:', error);
        }
      });
  }

  markAllNotificationsAsRead(): void {
    this.store.dispatch(HeaderActions.markAllNotificationsRead());
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  // Utility Methods
  getNotificationIcon(type: NotificationType): string {
    const iconMap: Record<NotificationType, string> = {
      SYSTEM: 'computer',
      TASK: 'assignment',
      ALERT: 'warning',
      INFO: 'info',
      WARNING: 'error_outline',
    };
    return iconMap[type] || 'notifications';
  }

  private startClock(): void {
    this.clockInterval = window.setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);
  }

  // Cleanup
  ngOnDestroy(): void {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
