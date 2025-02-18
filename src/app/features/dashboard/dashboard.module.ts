import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {
  DASHBOARD_FEATURE_KEY,
  dashboardReducer,
} from './store/dashboard.reducer';
import { DashboardEffects } from './store/dashboard.effects';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DashboardComponent,
    StoreModule.forFeature(DASHBOARD_FEATURE_KEY, dashboardReducer),
    EffectsModule.forFeature([DashboardEffects]),
  ],
})
export class DashboardModule {}
