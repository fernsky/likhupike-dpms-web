import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, take, map } from 'rxjs/operators';
import * as AuthActions from '@app/core/store/auth/auth.actions';
import { selectAuthState } from '@app/core/store/auth/auth.selectors';
import { RegisterRequest } from '@app/core/models/auth.interface';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { StepOneComponent } from '../../components/register-steps/step-one/step-one.component';
import { StepTwoComponent } from '../../components/register-steps/step-two/step-two.component';
import { StepThreeComponent } from '../../components/register-steps/step-three/step-three.component';
import { StepFourComponent } from '../../components/register-steps/step-four/step-four.component';
import { RegisterFormActions } from '../../store/register-form.actions';
import {
  selectCurrentStep,
  selectFormData,
  selectCanProceedToNextStep,
  selectIsLastStep,
  selectStepValidities,
} from '../../store/register-form.selectors';
import {
  StepIndicatorComponent,
  Step,
} from '@app/shared/components/step-indicator/step-indicator.component';
import { GovBrandingComponent } from '@app/shared/components/gov-branding/gov-branding.component';
import { SystemFeaturesComponent } from '@app/shared/components/system-features/system-features.component';
import { BackgroundParticlesComponent } from '@app/shared/components/background-particles/background-particles.component';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    StepFourComponent,
    StepIndicatorComponent,
    GovBrandingComponent,
    SystemFeaturesComponent,
    BackgroundParticlesComponent,
    MatIcon,
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
    {
      label: 'Personal',
      description: 'Basic Information',
      icon: 'person',
      completed: false,
      current: true,
      valid: false,
    },
    {
      label: 'Role',
      description: 'User Type',
      icon: 'badge',
      completed: false,
      current: false,
      valid: false,
    },
    {
      label: 'Location',
      description: 'Address Details',
      icon: 'location_on',
      completed: false,
      current: false,
      valid: false,
    },
    {
      label: 'Account',
      description: 'Login Credentials',
      icon: 'lock',
      completed: false,
      current: false,
      valid: false,
    },
  ];

  steps$ = combineLatest([
    this.currentStep$,
    this.store.select(selectStepValidities), // Add this selector
  ]).pipe(
    map(([currentStep, validities]) =>
      this.steps.map((step, index) => ({
        ...step,
        completed: index < currentStep - 1,
        current: index === currentStep - 1,
        valid: validities[index],
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
            fullName: formData.fullName,
            fullNameNepali: formData.fullNameNepali,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            password: formData.password,
            userType: formData.userType,
            // Location based on user type
            ...(formData.location && { location: formData.location }),
            ...(formData.employeeInfo && {
              employeeInfo: formData.employeeInfo,
            }),
            ...(formData.electedRepInfo && {
              electedRepInfo: formData.electedRepInfo,
            }),
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
