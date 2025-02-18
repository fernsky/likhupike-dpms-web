import { createEntityAdapter, EntityState } from '@ngrx/entity';
import {
  HeaderNotification,
  QuickSearchResult,
  HeaderUser,
  HeaderConfig,
} from '../../components/header/header.interface';

export interface HeaderState {
  notifications: EntityState<HeaderNotification>;
  unreadCount: number;
  searchResults: QuickSearchResult[];
  isSearching: boolean;
  searchQuery: string;
  currentUser: HeaderUser | null;
  config: HeaderConfig;
  error: string | null;
  isLoading: boolean;
}

export const headerNotificationsAdapter =
  createEntityAdapter<HeaderNotification>({
    selectId: (notification) => notification.id,
    sortComparer: (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  });

export const initialHeaderState: HeaderState = {
  notifications: headerNotificationsAdapter.getInitialState(),
  unreadCount: 0,
  searchResults: [],
  isSearching: false,
  searchQuery: '',
  currentUser: null,
  config: {
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
    searchResultsLimit: 0,
    defaultSearchTypes: [],
  },
  error: null,
  isLoading: false,
};
