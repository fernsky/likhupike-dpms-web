import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, take, map } from 'rxjs/operators';
import * as AuthActions from '@app/core/store/auth/auth.actions';
import { selectAuthState } from '@app/core/store/auth/auth.selectors';
import { RegisterRequest } from '@app/core/models/auth.interface';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { StepOneComponent } from '../../components/register-steps/step-one/step-one.component';
import { StepTwoComponent } from '../../components/register-steps/step-two/step-two.component';
import { StepThreeComponent } from '../../components/register-steps/step-three/step-three.component';
import { RegisterFormActions } from '../../store/register-form.actions';
import {
  selectCurrentStep,
  selectFormData,
  selectCanProceedToNextStep,
  selectIsLastStep,
} from '../../store/register-form.selectors';
import {
  StepIndicatorComponent,
  Step,
} from '@app/shared/components/step-indicator/step-indicator.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    StepIndicatorComponent,
  ],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  currentStep$ = this.store.select(selectCurrentStep).pipe(
    map((step) => step || 1) // Provide default value
  );
  canProceedToNextStep$ = this.store.select(selectCanProceedToNextStep);
  isLastStep$ = this.store.select(selectIsLastStep);
  loading = false;

  steps: Step[] = [
    { label: 'Personal Info', completed: false, current: true },
    { label: 'Office Details', completed: false, current: false },
    { label: 'Account Setup', completed: false, current: false },
  ];

  steps$ = this.currentStep$.pipe(
    map((currentStep) =>
      this.steps.map((step, index) => ({
        ...step,
        completed: index < currentStep - 1,
        current: index === currentStep - 1,
      }))
    )
  );

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Reset form state when component initializes
    this.store.dispatch(RegisterFormActions.resetForm());

    // Monitor auth state for loading and errors
    this.store
      .select(selectAuthState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((authState) => {
        if (authState) {
          this.loading = authState.loading;
        }
      });
  }

  handlePreviousStep(): void {
    this.currentStep$
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((step) => {
        this.store.dispatch(
          RegisterFormActions.previousStep({ currentStep: step })
        );
      });
  }

  handleNextStep(): void {
    this.currentStep$
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((step) => {
        this.store.dispatch(
          RegisterFormActions.nextStep({ currentStep: step })
        );
      });
  }

  onNextStep(currentStep: number): void {
    this.store.dispatch(RegisterFormActions.nextStep({ currentStep }));
  }

  onPreviousStep(currentStep: number): void {
    this.store.dispatch(RegisterFormActions.previousStep({ currentStep }));
  }

  onSubmit(): void {
    this.store
      .select(selectFormData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((formData) => {
        if (formData) {
          const registerData: RegisterRequest = {
            ...formData,
            dateOfBirth: formData.dateOfBirth?.toISOString(),
          };
          this.store.dispatch(AuthActions.register({ userData: registerData }));
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
