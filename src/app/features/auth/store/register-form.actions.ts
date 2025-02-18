import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { RegisterFormState } from './register-form.state';

export const RegisterFormActions = createActionGroup({
  source: 'Register Form',
  events: {
    'Next Step': props<{ currentStep: number }>(),
    'Previous Step': props<{ currentStep: number }>(),
    'Update Form Data': props<{
      formData: Partial<RegisterFormState['formData']>;
    }>(),
    'Update Step Validity': props<{ step: number; isValid: boolean }>(),
    'Reset Form': emptyProps(),
  },
});
