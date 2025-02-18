import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  stagger,
  animateChild,
} from '@angular/animations';

interface QuickAction {
  id: string;
  icon: string;
  label: string;
  description: string;
  route?: string;
  action?: () => void;
  permission?: string;
  badge?: string;
  disabled?: boolean;
}

interface ActionState {
  loading: boolean;
  error: string | null;
  lastAccessed?: Date;
  lastError?: {
    timestamp: Date;
    type: string;
    message: string;
  };
}

@Component({
  selector: 'app-quick-actions',
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  animations: [
    // Container animation
    trigger('containerAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(15px)' }),
        animate(
          '400ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
        query('@cardAnimation', stagger(100, animateChild()), {
          optional: true,
        }),
      ]),
    ]),

    // Individual card animation
    trigger('cardAnimation', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'scale(0.95) translateY(10px)',
        })
      ),
      state(
        '*',
        style({
          opacity: 1,
          transform: 'scale(1) translateY(0)',
        })
      ),
      transition('void => *', [animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')]),
      transition('* => void', [animate('200ms cubic-bezier(0.4, 0, 0.2, 1)')]),
    ]),

    // Badge animation
    trigger('badgeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0)' }),
        animate(
          '200ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'scale(1)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '150ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 0, transform: 'scale(0)' })
        ),
      ]),
    ]),

    // Icon animation
    trigger('iconAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'rotate(-180deg) scale(0)' }),
        animate(
          '300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'rotate(0) scale(1)' })
        ),
      ]),
    ]),

    // Status animation
    trigger('statusAnimation', [
      transition(':enter', [
        style({ opacity: 0, width: 0 }),
        animate(
          '200ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, width: '*' })
        ),
      ]),
    ]),
  ],
})
export class QuickActionsComponent implements OnInit, OnDestroy {
  actions: QuickAction[] = [
    {
      id: 'profile',
      icon: 'account_circle',
      label: 'quickActions.profile.title',
      description: 'quickActions.profile.description',
      route: '/dashboard/profile',
      badge: 'quickActions.profile.badge',
    },
    {
      id: 'documents',
      icon: 'description',
      label: 'quickActions.documents.title',
      description: 'quickActions.documents.description',
      route: '/dashboard/documents',
    },
    {
      id: 'verification',
      icon: 'verified_user',
      label: 'quickActions.verification.title',
      description: 'quickActions.verification.description',
      route: '/dashboard/verification',
    },
    {
      id: 'settings',
      icon: 'settings',
      label: 'quickActions.settings.title',
      description: 'quickActions.settings.description',
      route: '/dashboard/settings',
    },
  ];

  userHasPermission$: Observable<boolean>;
  private actionStates = new Map<string, ActionState>();
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private store: Store
  ) {
    // Check user permissions from store
    this.userHasPermission$ = this.store.select((state) => true); // Replace with actual permission selector
    this.initializeActionStates();
  }

  ngOnInit(): void {
    // Initialize any required data
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Track By function for better performance
  trackByActionId(index: number, action: QuickAction): string {
    return action.id;
  }

  // Accessibility message generator

  // Action state management
  private initializeActionStates(): void {
    this.actions.forEach((action) => {
      this.actionStates.set(action.id, {
        loading: false,
        error: null,
      });
    });
  }

  // Enhanced action click handler with analytics
  async onActionClick(action: QuickAction): Promise<void> {
    if (action.disabled || this.actionStates.get(action.id)?.loading) {
      return;
    }

    const startTime = performance.now();
    let success = false;
    let errorType: string | undefined;

    try {
      this.setActionLoading(action.id, true);

      if (action.action) {
        await action.action();
      } else if (action.route) {
        await this.router.navigate([action.route]);
      }

      success = true;
      this.updateActionLastAccessed(action.id);
    } catch (error) {
      errorType =
        error instanceof Error ? error.constructor.name : 'UnknownError';
      this.handleActionError(action.id, error);
    } finally {
      const duration = performance.now() - startTime;
      this.setActionLoading(action.id, false);
    }
  }

  private setActionLoading(actionId: string, loading: boolean): void {
    const currentState = this.actionStates.get(actionId);
    if (currentState) {
      this.actionStates.set(actionId, { ...currentState, loading });
    }
  }

  private updateActionLastAccessed(actionId: string): void {
    const currentState = this.actionStates.get(actionId);
    if (currentState) {
      this.actionStates.set(actionId, {
        ...currentState,
        lastAccessed: new Date(),
        error: null,
      });
    }
  }

  private handleActionError(actionId: string, error: any): void {
    console.error(`Action ${actionId} failed:`, error);
    const currentState = this.actionStates.get(actionId);
    if (currentState) {
      this.actionStates.set(actionId, {
        ...currentState,
        error: 'errors.actionFailed',
        lastError: {
          timestamp: new Date(),
          type:
            error instanceof Error ? error.constructor.name : 'UnknownError',
          message: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }

  // Track when actions become visible in viewport
  ngAfterViewInit() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const actionId = entry.target.getAttribute('data-action-id');
              if (actionId) {
              }
            }
          });
        },
        { threshold: 0.5 }
      );

      document
        .querySelectorAll('.action-card')
        .forEach((card) => observer.observe(card));
    }
  }

  // Action state getters
  isActionLoading(actionId: string): boolean {
    return this.actionStates.get(actionId)?.loading || false;
  }

  getActionError(actionId: string): string | null {
    return this.actionStates.get(actionId)?.error || null;
  }

  getLastAccessed(actionId: string): Date | undefined {
    return this.actionStates.get(actionId)?.lastAccessed;
  }

  getActionStatus(action: QuickAction): Observable<boolean> {
    return this.userHasPermission$.pipe(
      map(
        (hasPermission) =>
          !action.disabled && (!action.permission || hasPermission)
      )
    );
  }
}
