import { ActionReducer } from '@ngrx/store';
import { AuthState } from './auth.types';

const AUTH_STORAGE_KEY = 'auth_state';

export function hydrationMetaReducer(
  reducer: ActionReducer<AuthState>
): ActionReducer<AuthState> {
  return (state, action) => {
    if (state === undefined) {
      const persistedState = localStorage.getItem(AUTH_STORAGE_KEY);
      return persistedState
        ? JSON.parse(persistedState)
        : reducer(state, action);
    }

    const nextState = reducer(state, action);

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));
    return nextState;
  };
}
