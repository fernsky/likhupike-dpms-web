import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';
import { UserFormComponent } from './user-form.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [UserFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    TranslocoModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    provideTranslocoScope({
      scope: 'user-management',
    }),
  ],
  exports: [UserFormComponent],
})
export class UserFormModule {}
