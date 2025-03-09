import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

@NgModule({
  imports: [CommonModule, SharedModule, DashboardComponent],
})
export class DashboardModule {}
