import { Routes } from '@angular/router';
import { RoleType } from './core/models/role.enum';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',

    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(
        (m) => m.DASHBOARD_ROUTES
      ),
  },
  {
    path: 'admin',
    data: {
      roles: [RoleType.SUPER_ADMIN, RoleType.MUNICIPALITY_ADMIN],
    },
    loadComponent: () =>
      import('./features/admin/admin.component').then((m) => m.AdminComponent),
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
