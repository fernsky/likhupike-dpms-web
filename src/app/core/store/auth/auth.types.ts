import { User } from '@app/core/models/user.interface';

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  lastAuthTime: Date | null;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
  lastAuthTime: null,
};
