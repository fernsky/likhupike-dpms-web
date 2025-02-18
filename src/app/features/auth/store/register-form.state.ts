export interface RegisterFormState {
  currentStep: number;
  totalSteps: number;
  formData: {
    fullNameNepali: string;
    fullName: string;
    dateOfBirth: Date | null;
    isFromWard: boolean;
    wardNumber: number | null;
    officePost: string;
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
    dateOfBirth: null,
    isFromWard: false,
    wardNumber: null,
    officePost: '',
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
