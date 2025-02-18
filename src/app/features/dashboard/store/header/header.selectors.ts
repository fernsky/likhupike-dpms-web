import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HeaderState } from './header.state';
import {
  selectAllNotifications,
  selectNotificationEntities,
  selectNotificationIds,
  selectTotalNotifications,
} from './header.reducer';
import {
  NotificationPriority,
  NotificationType,
} from '../../components/header/header.interface';

// Feature selector
export const selectHeaderState = createFeatureSelector<HeaderState>('header');

// Notifications selectors
export const selectNotificationsState = createSelector(
  selectHeaderState,
  (state) => state.notifications,
);

export const selectAllHeaderNotifications = createSelector(
  selectNotificationsState,
  selectAllNotifications,
);

export const selectNotificationsByPriority = (priority: NotificationPriority) =>
  createSelector(selectAllHeaderNotifications, (notifications) =>
    notifications.filter((notification) => notification.priority === priority),
  );

export const selectNotificationsByType = (type: NotificationType) =>
  createSelector(selectAllHeaderNotifications, (notifications) =>
    notifications.filter((notification) => notification.type === type),
  );

export const selectUnreadNotifications = createSelector(
  selectAllHeaderNotifications,
  (notifications) => notifications.filter((notification) => !notification.read),
);

export const selectUnreadCount = createSelector(
  selectHeaderState,
  (state) => state.unreadCount,
);

export const selectNotificationById = (id: string) =>
  createSelector(selectNotificationEntities, (entities) => entities[id]);

// Search selectors
export const selectSearchResults = createSelector(
  selectHeaderState,
  (state) => state.searchResults,
);

export const selectSearchQuery = createSelector(
  selectHeaderState,
  (state) => state.searchQuery,
);

export const selectIsSearching = createSelector(
  selectHeaderState,
  (state) => state.isSearching,
);

export const selectSearchResultsCount = createSelector(
  selectSearchResults,
  (results) => results.length,
);

// Config selectors
export const selectHeaderConfig = createSelector(
  selectHeaderState,
  (state) => state.config,
);

export const selectIsSearchEnabled = createSelector(
  selectHeaderConfig,
  (config) => config.enableSearch,
);

export const selectAreNotificationsEnabled = createSelector(
  selectHeaderConfig,
  (config) => config.enableNotifications,
);

export const selectIsLanguageSwitchEnabled = createSelector(
  selectHeaderConfig,
  (config) => config.enableLanguageSwitch,
);

// Current user selectors
export const selectCurrentUser = createSelector(
  selectHeaderState,
  (state) => state.currentUser,
);

export const selectUserFullName = createSelector(
  selectCurrentUser,
  (user) => user?.fullName,
);

export const selectUserFullNameNepali = createSelector(
  selectCurrentUser,
  (user) => user?.fullNameNepali,
);

// Status selectors
export const selectIsLoading = createSelector(
  selectHeaderState,
  (state) => state.isLoading,
);

export const selectError = createSelector(
  selectHeaderState,
  (state) => state.error,
);

// Combined selectors
export const selectHeaderViewModel = createSelector(
  selectAllHeaderNotifications,
  selectUnreadCount,
  selectSearchResults,
  selectIsSearching,
  selectCurrentUser,
  selectHeaderConfig,
  selectError,
  selectIsLoading,
  (
    notifications,
    unreadCount,
    searchResults,
    isSearching,
    currentUser,
    config,
    error,
    isLoading,
  ) => ({
    notifications,
    unreadCount,
    searchResults,
    isSearching,
    currentUser,
    config,
    error,
    isLoading,
  }),
);

// Performance optimized selectors
export const selectNotificationMetrics = createSelector(
  selectAllHeaderNotifications,
  (notifications) => ({
    total: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    highPriority: notifications.filter(
      (n) => n.priority === NotificationPriority.HIGH,
    ).length,
    byType: notifications.reduce(
      (acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      },
      {} as Record<NotificationType, number>,
    ),
  }),
);

// Pagination support
export const selectPaginatedNotifications = (page: number, pageSize: number) =>
  createSelector(selectAllHeaderNotifications, (notifications) =>
    notifications.slice((page - 1) * pageSize, page * pageSize),
  );
