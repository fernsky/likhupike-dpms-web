import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as AuthActions from '@app/core/store/auth/auth.actions';
import { selectAuthState } from '@app/core/store/auth/auth.selectors';
import { PasswordValidatorService } from '@app/shared/validators/password-validator.service';
import {
  PASSWORD_STRENGTH_LEVELS,
  PASSWORD_VALIDATION_MESSAGES,
} from '@app/core/constants/validation.constants';
import {
  authAnimations,
  combineAnimations,
} from '@app/shared/animations/auth.animations';

interface PasswordStrength {
  text: string;
  color: string;
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatFormFieldModule,
  ],
  animations: combineAnimations(
    authAnimations.fadeSlideInOut,
    authAnimations.formControls,
    authAnimations.successState,
    authAnimations.brandingAnimation,
    authAnimations.errorShake,
    authAnimations.loadingState
  ),
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetPasswordForm: FormGroup;
  loading = false;
  resetSuccess = false;
  hidePassword = true;
  hideConfirmPassword = true;
  validationMessages = PASSWORD_VALIDATION_MESSAGES;
  strengthLevels = PASSWORD_STRENGTH_LEVELS;
  currentStrength = 0;
  private token: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private passwordValidator: PasswordValidatorService
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.resetPasswordForm = this.fb.group(
      {
        password: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(8),
              this.passwordValidator.validatePassword.bind(
                this.passwordValidator
              ),
            ],
            updateOn: 'change',
          },
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );

    // Subscribe to password changes to update strength
    this.resetPasswordForm
      .get('password')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((password) => {
        this.currentStrength = this.calculatePasswordStrength(password);
      });
  }

  getPasswordStrength(): PasswordStrength {
    const score = this.currentStrength;
    if (score >= 80) {
      return { text: 'Very Strong', color: 'var(--success-color)' };
    } else if (score >= 60) {
      return { text: 'Strong', color: 'var(--success-light-color)' };
    } else if (score >= 40) {
      return { text: 'Medium', color: 'var(--warning-color)' };
    } else if (score >= 20) {
      return { text: 'Weak', color: 'var(--warning-dark-color)' };
    }
    return { text: 'Very Weak', color: 'var(--error-color)' };
  }

  calculatePasswordStrength(password: string): number {
    if (!password) return 0;
    return this.passwordValidator.calculateStrength(password);
  }

  getPasswordStrengthInfo() {
    if (this.currentStrength >= 80) return this.strengthLevels.VERY_STRONG;
    if (this.currentStrength >= 60) return this.strengthLevels.STRONG;
    if (this.currentStrength >= 40) return this.strengthLevels.MEDIUM;
    if (this.currentStrength >= 20) return this.strengthLevels.WEAK;
    return this.strengthLevels.VERY_WEAK;
  }

  getValidationMessage(error: string): string {
    return `validation.password.${error}`;
  }

  getValidationErrors(): string[] {
    const control = this.resetPasswordForm.get('password');
    if (!control?.errors) return [];

    return Object.keys(control.errors).map((key) => {
      switch (key) {
        case 'required':
          return 'validation.password.required';
        case 'minlength':
          return 'validation.password.minLength';
        case 'pattern':
          return 'validation.password.pattern';
        case 'uppercase':
          return 'validation.password.uppercase';
        case 'lowercase':
          return 'validation.password.lowercase';
        case 'number':
          return 'validation.password.number';
        case 'specialChar':
          return 'validation.password.specialChar';
        default:
          return 'validation.password.invalid';
      }
    });
  }

  getActiveValidationErrors(): string[] {
    const control = this.resetPasswordForm.get('password');
    if (!control?.errors) return [];

    return Object.keys(control.errors)
      .filter((key) => control.errors?.[key])
      .map((key) => this.getValidationMessage(key));
  }

  passwordMatchValidator(group: FormGroup): null | { passwordMismatch: true } {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  ngOnInit(): void {
    // Get token from route params
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.token = params['token'];
        if (!this.token) {
          this.router.navigate(['/auth/forgot-password']);
        }
      });

    // Subscribe to auth state
    this.store
      .select(selectAuthState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((authState) => {
        this.loading = authState.loading;
        if (authState.error) {
          this.resetPasswordForm.setErrors({ serverError: authState.error });
        }
        // Check if password reset was successful
        if (
          !authState.loading &&
          !authState.error &&
          this.resetPasswordForm.dirty
        ) {
          this.resetSuccess = true;
        }
      });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && this.token) {
      const { password } = this.resetPasswordForm.value;
      this.store.dispatch(
        AuthActions.resetPassword({
          resetData: {
            token: this.token,
            newPassword: password,
          },
        })
      );
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
