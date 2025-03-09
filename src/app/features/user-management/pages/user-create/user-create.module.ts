import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserFormModule } from '../../components/user-form/user-form.module';
import { UserCreateComponent } from './user-create.component';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const routes = [
  {
    path: '',
    component: UserCreateComponent,
  },
];

@NgModule({
  declarations: [UserCreateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    UserFormModule,
    TranslocoModule,
    MatProgressBarModule,
    provideTranslocoScope({
      scope: 'user-management',
    }),
  ],
})
export class UserCreateModule {}
