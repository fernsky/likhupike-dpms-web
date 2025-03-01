import { RoleType } from './role.enum';
import { User } from './user.interface';
import { UserType } from './user-type.enum';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  fullNameNepali: string;
  phoneNumber: string;
  userType: UserType;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  email: string;
  roles: RoleType[];
  userId: string;
  expiresIn: number;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
