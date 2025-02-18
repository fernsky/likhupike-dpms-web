import { createActionGroup, props, emptyProps } from '@ngrx/store';
import {
  HeaderNotification,
  QuickSearchResult,
  HeaderConfig,
  SearchParams,
} from '../../components/header/header.interface';

export const HeaderActions = createActionGroup({
  source: 'Header',
  events: {
    // Notification Actions
    'Load Notifications': emptyProps(),
    'Load Notifications Success': props<{
      notifications: HeaderNotification[];
    }>(),
    'Load Notifications Failure': props<{ error: string }>(),
    'Mark Notification Read': props<{ notificationId: string }>(),
    'Mark Notification Read Success': props<{ notificationId: string }>(),
    'Mark Notification Read Failure': props<{ error: string }>(),
    'Mark All Notifications Read': emptyProps(),
    'Mark All Notifications Read Success': emptyProps(),
    'Mark All Notifications Read Failure': props<{ error: string }>(),

    // Search Actions
    Search: props<{ params: SearchParams }>(),
    'Search Success': props<{ results: QuickSearchResult[] }>(),
    'Search Failure': props<{ error: string }>(),
    'Clear Search Results': emptyProps(),

    // Config Actions
    'Update Config': props<{ config: Partial<HeaderConfig> }>(),
    'Update Config Success': props<{ config: HeaderConfig }>(),
    'Reset Config': emptyProps(),

    // Error Handling
    'Clear Error': emptyProps(),

    // Loading State
    'Set Loading': props<{ isLoading: boolean }>(),
  },
});

// Export each action individually for better type inference
export const {
  loadNotifications,
  loadNotificationsSuccess,
  loadNotificationsFailure,
  markNotificationRead,
  markNotificationReadSuccess,
  markNotificationReadFailure,
  markAllNotificationsRead,
  markAllNotificationsReadSuccess,
  markAllNotificationsReadFailure,
  search,
  searchSuccess,
  searchFailure,
  clearSearchResults,
  updateConfig,
  updateConfigSuccess,
  resetConfig,
  clearError,
  setLoading,
} = HeaderActions;
