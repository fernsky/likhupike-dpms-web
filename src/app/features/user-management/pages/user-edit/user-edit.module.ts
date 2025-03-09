import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserFormModule } from '../../components/user-form/user-form.module';
import { UserEditComponent } from './user-edit.component';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SharedModule } from '@app/shared/shared.module';

const routes = [
  {
    path: '',
    component: UserEditComponent,
  },
];

@NgModule({
  declarations: [UserEditComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    UserFormModule,
    TranslocoModule,
    MatProgressBarModule,
    SharedModule,
    provideTranslocoScope({
      scope: 'user-management',
    }),
  ],
})
export class UserEditModule {}
