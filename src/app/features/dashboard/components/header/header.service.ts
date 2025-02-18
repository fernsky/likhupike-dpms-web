import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import {
  HeaderNotification,
  HeaderState,
  QuickSearchResult,
  SearchParams,
  HeaderConfig,
  HeaderAnalytics,
} from './header.interface';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private state = new BehaviorSubject<HeaderState>({
    notifications: [],
    unreadCount: 0,
    searchExpanded: false,
    isSearching: false,
  });

  private config: HeaderConfig = {
    enableSearch: true,
    enableNotifications: true,
    enableLanguageSwitch: true,
    enableAccessibilityMenu: true,
    showClock: true,
    clockFormat: '24h',
    showNepaliDate: true,
    profileMenuItems: [],
    searchDebounceTime: 300,
    notificationPollInterval: 30000,
    maxNotifications: 50,
    searchResultsLimit: 10,
    defaultSearchTypes: [],
  };

  constructor(private http: HttpClient) {
    this.initializeNotificationPolling();
  }

  getState(): Observable<HeaderState> {
    return this.state.asObservable();
  }

  getConfig(): HeaderConfig {
    return this.config;
  }

  updateConfig(config: Partial<HeaderConfig>): void {
    this.config = { ...this.config, ...config };
  }

  searchGlobal(params: SearchParams): Observable<QuickSearchResult[]> {
    return this.http.post<QuickSearchResult[]>(
      `${environment.apiUrl}/search`,
      params
    );
  }

  getNotifications(): Observable<HeaderNotification[]> {
    return this.http.get<HeaderNotification[]>(
      `${environment.apiUrl}/notifications`
    );
  }

  markNotificationAsRead(id: string): Observable<void> {
    return this.http.patch<void>(
      `${environment.apiUrl}/notifications/${id}/read`,
      {}
    );
  }

  markAllNotificationsAsRead(): Observable<void> {
    return this.http.patch<void>(
      `${environment.apiUrl}/notifications/read-all`,
      {}
    );
  }

  trackAnalytics(data: Partial<HeaderAnalytics>): void {
    // Implement analytics tracking
    console.log('Analytics tracked:', data);
  }

  private initializeNotificationPolling(): void {
    if (this.config.enableNotifications) {
      setInterval(() => {
        this.fetchNotifications();
      }, this.config.notificationPollInterval);
    }
  }

  private fetchNotifications(): void {
    this.getNotifications().subscribe((notifications) => {
      const unreadCount = notifications.filter((n) => !n.read).length;
      this.state.next({
        ...this.state.value,
        notifications,
        unreadCount,
      });
    });
  }
}
