import { AuthEffects } from './auth/auth.effects';
import { DashboardEffects } from '@app/features/dashboard/store/dashboard.effects';

export const effects = [AuthEffects, DashboardEffects];
