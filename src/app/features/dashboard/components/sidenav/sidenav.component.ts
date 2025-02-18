import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import * as AuthSelectors from '@app/core/store/auth/auth.selectors';
import { filter, takeUntil, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { MatIconModule } from '@angular/material/icon';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import { RoleType } from '@app/core/models/role.enum';

import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';

interface NavItem {
  id: string;
  label: string;
  labelNp: string;
  icon: string;
  route?: string;
  roles?: RoleType[];
  children?: NavItem[];
  badge?: {
    value: number;
    color: 'primary' | 'accent' | 'warn';
  };
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('submenuAnimation', [
      state(
        'collapsed',
        style({
          height: '0',
          overflow: 'hidden',
          opacity: 0,
          visibility: 'hidden',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
          opacity: 1,
          visibility: 'visible',
        })
      ),
      transition('collapsed <=> expanded', [
        animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ]),
    ]),
  ],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatBadgeModule,
    MatDividerModule,
  ],
})
export class SidenavComponent implements OnInit, OnDestroy {
  @Input() collapsed = false;
  isHandset$: Observable<boolean>;
  currentUrl = '';
  expandedItems = new Set<string>();
  private destroy$ = new Subject<void>();

  readonly navigationItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      labelNp: 'ड्यासबोर्ड',
      icon: 'dashboard',
      route: '/dashboard',
    },
    {
      id: 'profiles',
      label: 'Digital Profiles',
      labelNp: 'डिजिटल प्रोफाइल',
      icon: 'account_box',
      children: [
        {
          id: 'profile-list',
          label: 'Profile List',
          labelNp: 'प्रोफाइल सूची',
          icon: 'list',
          route: '/dashboard/profiles',
          roles: [RoleType.MUNICIPALITY_ADMIN, RoleType.MUNICIPALITY_ADMIN],
        },
        {
          id: 'profile-approval',
          label: 'Pending Approvals',
          labelNp: 'स्वीकृति पर्खिएको',
          icon: 'pending_actions',
          route: '/dashboard/profiles/pending',
          roles: [RoleType.MUNICIPALITY_ADMIN],
          badge: {
            value: 5,
            color: 'warn',
          },
        },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      labelNp: 'प्रतिवेदनहरू',
      icon: 'assessment',
      roles: [RoleType.MUNICIPALITY_ADMIN],
      children: [
        {
          id: 'statistics',
          label: 'Statistics',
          labelNp: 'तथ्यांक',
          icon: 'bar_chart',
          route: '/dashboard/reports/statistics',
        },
        {
          id: 'analytics',
          label: 'Analytics',
          labelNp: 'विश्लेषण',
          icon: 'insights',
          route: '/dashboard/reports/analytics',
        },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      labelNp: 'सेटिङ्स',
      icon: 'settings',
      route: '/dashboard/settings',
      roles: [RoleType.MUNICIPALITY_ADMIN],
    },
  ];

  constructor(
    private store: Store,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.isHandset$ = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map((result) => result.matches));
  }

  ngOnInit(): void {
    this.setupRouteListener();
  }

  private setupRouteListener(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        this.currentUrl = event.url;
        this.expandParentItems(this.currentUrl);
        this.announceCurrentPage();
      });
  }

  toggleExpand(itemId: string): void {
    if (this.expandedItems.has(itemId)) {
      this.expandedItems.delete(itemId);
    } else {
      this.expandedItems.add(itemId);
    }
  }

  isExpanded(itemId: string): boolean {
    return this.expandedItems.has(itemId);
  }

  isActive(route: string): boolean {
    return this.currentUrl.startsWith(route);
  }

  private expandParentItems(url: string): void {
    this.navigationItems.forEach((item) => {
      if (item.children?.some((child) => child.route === url)) {
        this.expandedItems.add(item.id);
      }
    });
  }

  private announceCurrentPage(): void {
    const currentItem = this.findCurrentNavigationItem(this.navigationItems);
    if (currentItem) {
      const message = 'Current Page';
    }
  }

  private findCurrentNavigationItem(items: NavItem[]): NavItem | undefined {
    for (const item of items) {
      if (item.route === this.currentUrl) {
        return item;
      }
      if (item.children) {
        const found = this.findCurrentNavigationItem(item.children);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }

  hasRole(requiredRoles?: RoleType[]): Observable<boolean> {
    if (!requiredRoles || requiredRoles.length === 0) return of(true);

    return this.store
      .select(AuthSelectors.selectUserRoles)
      .pipe(
        map((userRoles) =>
          requiredRoles.some((role) => userRoles.includes(role))
        )
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
