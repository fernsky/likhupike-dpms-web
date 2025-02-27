import { UserType } from '@app/core/models/user-type.enum';

export interface RegisterFormState {
  currentStep: number;
  totalSteps: number;
  formData: {
    fullNameNepali: string;
    fullName: string;
    phoneNumber: string;
    isFromWard: boolean;
    userType: UserType;
    email: string;
    password: string;
  };
  isValid: {
    step1: boolean;
    step2: boolean;
    step3: boolean;
  };
  security: {
    persistSensitiveData: boolean;
    lastActivity: number;
    sessionTimeout: number;
  };
}

export const initialRegisterFormState: RegisterFormState = {
  currentStep: 1,
  totalSteps: 3,
  formData: {
    fullNameNepali: '',
    fullName: '',
    phoneNumber: '',
    isFromWard: false,
    userType: UserType.CITIZEN,
    email: '',
    password: '',
  },
  isValid: {
    step1: false,
    step2: false,
    step3: false,
  },
  security: {
    persistSensitiveData: false,
    lastActivity: Date.now(),
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
  },
};
