import { RoleType } from '@app/core/models/role.enum';

export interface HeaderNotification {
  id: string;
  title: string;
  titleNepali?: string;
  message: string;
  messageNepali?: string;
  type: NotificationType;
  createdAt: string;
  read: boolean;
  actionType?: NotificationActionType;
  actionPayload?: unknown;
  priority: NotificationPriority;
}

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  TASK = 'TASK',
  ALERT = 'ALERT',
  INFO = 'INFO',
  WARNING = 'WARNING',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum NotificationActionType {
  NAVIGATE = 'NAVIGATE',
  DOWNLOAD = 'DOWNLOAD',
  EXTERNAL_LINK = 'EXTERNAL_LINK',
  CUSTOM_ACTION = 'CUSTOM_ACTION',
}

export interface HeaderUser {
  fullName: string;
  fullNameNepali: string;
  officePost: string;
  profilePictureUrl?: string;
  roles: Set<RoleType>;
}

export interface QuickSearchResult {
  id: string;
  title: string;
  titleNepali?: string;
  type: QuickSearchResultType;
  path: string;
  metadata?: {
    icon?: string;
    description?: string;
    tags?: string[];
    permissions?: RoleType[];
  };
}

export enum QuickSearchResultType {
  PAGE = 'PAGE',
  DOCUMENT = 'DOCUMENT',
  PROFILE = 'PROFILE',
  SETTING = 'SETTING',
  ACTION = 'ACTION',
}

export interface HeaderState {
  notifications: HeaderNotification[];
  unreadCount: number;
  searchExpanded: boolean;
  lastSearchQuery?: string;
  searchResults?: QuickSearchResult[];
  isSearching: boolean;
  currentUser?: HeaderUser;
  error?: string;
}

export interface HeaderConfig {
  enableSearch: boolean;
  enableNotifications: boolean;
  enableLanguageSwitch: boolean;
  enableAccessibilityMenu: boolean;
  showClock: boolean;
  clockFormat: '12h' | '24h' | string;
  showNepaliDate: boolean;
  profileMenuItems: ProfileMenuItem[];
  searchDebounceTime?: number;
  notificationPollInterval?: number;
  maxNotifications?: number;
  searchResultsLimit: number;
  defaultSearchTypes: string[];
}

export interface ProfileMenuItem {
  id: string;
  label: string;
  labelNepali?: string;
  icon?: string;
  route?: string;
  action?: () => void;
  requiredRoles?: RoleType[];
  divider?: boolean;
  children?: ProfileMenuItem[];
}

export interface SearchParams {
  query: string;
  filters?: {
    type?: QuickSearchResultType[];
    dateRange?: {
      start: Date;
      end: Date;
    };
    tags?: string[];
    roles?: RoleType[];
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

export type HeaderThemeMode = 'light' | 'dark' | 'system';

export interface HeaderAccessibilityOptions {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  textSpacing: boolean;
  focusIndicators: boolean;
}

export interface ClockDisplayOptions {
  showSeconds: boolean;
  showDate: boolean;
  showNepaliDate: boolean;
  use24Hour: boolean;
}

export interface HeaderAnalytics {
  searchUsage: {
    query: string;
    timestamp: number;
    resultsCount: number;
    selectedResult?: QuickSearchResult;
  };
  notificationInteractions: {
    notificationId: string;
    action: 'view' | 'click' | 'dismiss';
    timestamp: number;
  };
  menuUsage: {
    menuItem: string;
    timestamp: number;
  };
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface NotificationMetrics {
  total: number;
  unread: number;
  highPriority: number;
}

export interface HeaderViewModel {
  notifications: HeaderNotification[];
  unreadCount: number;
  searchResults: QuickSearchResult[];
  isSearching: boolean;
  currentUser: HeaderUser | null;
  config: HeaderConfig;
  error: string | null;
  isLoading: boolean;
}
