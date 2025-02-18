import { createReducer, on } from '@ngrx/store';
import { RegisterFormActions } from './register-form.actions';
import {
  RegisterFormState,
  initialRegisterFormState,
} from './register-form.state';

export const registerFormReducer = createReducer(
  initialRegisterFormState,

  on(
    RegisterFormActions.nextStep,
    (state, { currentStep }): RegisterFormState => ({
      ...state,
      currentStep: Math.min(state.totalSteps, currentStep + 1),
    })
  ),

  on(
    RegisterFormActions.previousStep,
    (state, { currentStep }): RegisterFormState => ({
      ...state,
      currentStep: Math.max(1, currentStep - 1),
    })
  ),

  on(
    RegisterFormActions.updateFormData,
    (state, { formData }): RegisterFormState => ({
      ...state,
      formData: {
        ...state.formData,
        ...formData,
      },
    })
  ),

  on(
    RegisterFormActions.updateStepValidity,
    (state, { step, isValid }): RegisterFormState => ({
      ...state,
      isValid: {
        ...state.isValid,
        [`step${step}`]: isValid,
      },
    })
  ),

  on(
    RegisterFormActions.resetForm,
    (): RegisterFormState => ({
      ...initialRegisterFormState,
    })
  )
);
