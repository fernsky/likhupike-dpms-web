import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RegisterFormState } from './register-form.state';

export const selectRegisterFormState =
  createFeatureSelector<RegisterFormState>('registerForm');

export const selectCurrentStep = createSelector(
  selectRegisterFormState,
  (state: RegisterFormState) => state.currentStep
);

export const selectFormData = createSelector(
  selectRegisterFormState,
  (state: RegisterFormState) => state.formData
);

export const selectStepValidity = createSelector(
  selectRegisterFormState,
  (state: RegisterFormState) => state.isValid
);

export const selectCanProceedToNextStep = createSelector(
  selectRegisterFormState,
  (state: RegisterFormState) => {
    const currentStepKey =
      `step${state.currentStep}` as keyof typeof state.isValid;
    return state.isValid[currentStepKey];
  }
);

export const selectIsLastStep = createSelector(
  selectRegisterFormState,
  (state: RegisterFormState) => state.currentStep === state.totalSteps
);

export const selectStepFormData = (step: number) =>
  createSelector(selectFormData, (formData) => {
    switch (step) {
      case 1:
        return {
          fullNameNepali: formData.fullNameNepali,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
        };
      case 2:
        return {
          userType: formData.userType,
        };
      case 4:
        return {
          email: formData.email,
          password: formData.password,
        };
      default:
        return {};
    }
  });

export const selectStepValidities = createSelector(
  selectRegisterFormState,
  (state: RegisterFormState) => [
    state.isValid.step1,
    state.isValid.step2,
    state.isValid.step3,
  ]
);
