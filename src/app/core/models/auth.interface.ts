import { RoleType } from './role.enum';
import { User } from './user.interface';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  fullNameNepali: string;
  dateOfBirth: string; // Will be sent as ISO string
  address: string;
  officePost: string;
  wardNumber?: number;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
