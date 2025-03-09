import { Routes } from '@angular/router';
import { RoleGuard } from '@app/core/guards/role.guard';
import { RoleType } from '@app/core/models/role.enum';

export const USER_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadChildren: () =>
          import('./pages/user-list/user-list.module').then(
            (m) => m.UserListModule
          ),
        canActivate: [RoleGuard],
        data: { roles: [RoleType.MUNICIPALITY_ADMIN] },
      },
      {
        path: 'create',
        loadChildren: () =>
          import('./pages/user-create/user-create.module').then(
            (m) => m.UserCreateModule
          ),
        canActivate: [RoleGuard],
        data: { roles: [RoleType.MUNICIPALITY_ADMIN] },
      },
      {
        path: 'edit/:id',
        loadChildren: () =>
          import('./pages/user-edit/user-edit.module').then(
            (m) => m.UserEditModule
          ),
        canActivate: [RoleGuard],
        data: { roles: [RoleType.MUNICIPALITY_ADMIN] },
      },
    ],
  },
];
