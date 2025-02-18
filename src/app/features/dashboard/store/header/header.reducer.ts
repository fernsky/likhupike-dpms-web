import { createReducer, on } from '@ngrx/store';
import {
  HeaderState,
  initialHeaderState,
  headerNotificationsAdapter,
} from './header.state';
import { HeaderActions } from './header.actions';

export const headerReducer = createReducer(
  initialHeaderState,

  // Notifications
  on(HeaderActions.loadNotifications, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(HeaderActions.loadNotificationsSuccess, (state, { notifications }) => ({
    ...state,
    notifications: headerNotificationsAdapter.setAll(
      notifications,
      state.notifications,
    ),
    unreadCount: notifications.filter((n) => !n.read).length,
    isLoading: false,
    error: null,
  })),

  on(HeaderActions.loadNotificationsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(HeaderActions.markNotificationReadSuccess, (state, { notificationId }) => {
    const updatedNotifications = headerNotificationsAdapter.updateOne(
      {
        id: notificationId,
        changes: { read: true },
      },
      state.notifications,
    );

    return {
      ...state,
      notifications: updatedNotifications,
      unreadCount: state.unreadCount - 1,
    };
  }),

  on(HeaderActions.markAllNotificationsReadSuccess, (state) => ({
    ...state,
    notifications: headerNotificationsAdapter.updateMany(
      Object.values(state.notifications.entities)
        .filter((n) => n && !n.read)
        .map((n) => ({ id: n!.id, changes: { read: true } })),
      state.notifications,
    ),
    unreadCount: 0,
  })),

  // Search
  on(HeaderActions.search, (state, { params }) => ({
    ...state,
    isSearching: true,
    searchQuery: params.query,
    error: null,
  })),

  on(HeaderActions.searchSuccess, (state, { results }) => ({
    ...state,
    searchResults: results,
    isSearching: false,
    error: null,
  })),

  on(HeaderActions.searchFailure, (state, { error }) => ({
    ...state,
    isSearching: false,
    error,
  })),

  on(HeaderActions.clearSearchResults, (state) => ({
    ...state,
    searchResults: [],
    searchQuery: '',
    isSearching: false,
  })),

  // Config
  on(HeaderActions.updateConfigSuccess, (state, { config }) => ({
    ...state,
    config: { ...state.config, ...config },
  })),

  on(HeaderActions.resetConfig, (state) => ({
    ...state,
    config: initialHeaderState.config,
  })),

  // Error Handling
  on(HeaderActions.clearError, (state) => ({
    ...state,
    error: null,
  })),

  // Loading State
  on(HeaderActions.setLoading, (state, { isLoading }) => ({
    ...state,
    isLoading,
  })),
);

export const {
  selectAll: selectAllNotifications,
  selectEntities: selectNotificationEntities,
  selectIds: selectNotificationIds,
  selectTotal: selectTotalNotifications,
} = headerNotificationsAdapter.getSelectors();
