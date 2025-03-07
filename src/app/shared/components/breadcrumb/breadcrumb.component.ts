import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { filter, Subject, takeUntil } from 'rxjs';
import { Breadcrumb, BreadcrumbConfig } from './breadcrumb.interface';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, TranslocoModule],
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  @Input() config: BreadcrumbConfig = {
    showHomeIcon: true,
    separator: '/',
    showIcons: true,
    maxItems: 4,
    responsive: true,
  };

  breadcrumbs: Breadcrumb[] = [];
  currentLang = 'en';
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.buildBreadcrumbs();
      });

    this.translocoService.langChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        this.currentLang = lang;
      });

    // Initial breadcrumbs
    this.buildBreadcrumbs();
  }

  private buildBreadcrumbs(): void {
    const root: Breadcrumb = {
      label: 'Home',
      labelNp: 'गृह',
      url: '/dashboard',
      icon: 'home',
    };

    const paths = this.router.url.split('/').filter((path) => path);
    const breadcrumbs: Breadcrumb[] = [root];
    let url = '';

    paths.forEach((path) => {
      if (path !== 'dashboard') {
        url += `/${path}`;
        breadcrumbs.push({
          label: this.formatLabel(path),
          url,
          icon: this.getIconForPath(path),
        });
      }
    });

    this.breadcrumbs = this.config.maxItems
      ? breadcrumbs.slice(-this.config.maxItems)
      : breadcrumbs;
  }

  private formatLabel(path: string): string {
    return path
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private getIconForPath(path: string): string {
    const iconMap: { [key: string]: string } = {
      profiles: 'account_box',
      settings: 'settings',
      reports: 'assessment',
      analytics: 'insights',
      help: 'help',
      // Add more mappings as needed
    };
    return iconMap[path] || 'arrow_right';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
