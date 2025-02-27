import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import { BaseStepComponent } from '../base-step.component';
import { PasswordValidatorService } from '@app/shared/validators/password-validator.service';
import { selectStepFormData } from '../../../store/register-form.selectors';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-register-step-three',
  templateUrl: './step-four.component.html',
  styleUrls: ['./step-four.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class StepThreeComponent
  extends BaseStepComponent
  implements OnInit, OnDestroy
{
  override stepForm!: FormGroup;
  override stepNumber = 4;
  private destroy$ = new Subject<void>();
  hidePassword = true;
  hideConfirmPassword = true;
  private passwordValidatorService = inject(PasswordValidatorService);

  constructor(private fb: FormBuilder) {
    super();
    this.initForm();
  }

  private initForm(): void {
    this.stepForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            (control) =>
              this.passwordValidatorService.validatePassword(control),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  ngOnInit(): void {
    // Load saved form data
    this.store
      .select(selectStepFormData(3))
      .pipe(
        filter((data) => !!data),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        if (data) {
          // Don't include password in persistence for security
          const { password, ...safeData } = data;
          this.stepForm.patchValue(safeData, { emitEvent: false });
        }
      });

    // Form changes subscription
    this.stepForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateStepValidity();
      if (this.stepForm.valid) {
        const { confirmPassword, ...formData } = this.stepForm.value;
        this.updateFormData();
      }
    });
  }

  get showPasswordStrength(): boolean {
    const password = this.stepForm.get('password')?.value;
    return password && password.length > 0 && !this.isPasswordFullyValid;
  }

  get isPasswordFullyValid(): boolean {
    return (
      this.stepForm.get('password')?.valid &&
      this.getPasswordErrors().length === 0
    );
  }

  getPasswordStrength(): number {
    const password = this.stepForm.get('password')?.value;
    return this.passwordValidatorService.calculateStrength(password);
  }

  getPasswordErrors(): string[] {
    const control = this.stepForm.get('password');
    if (!control?.errors) return [];

    const errors: string[] = [];
    const errorMap = {
      minLength: 'Password must be at least 12 characters',
      uppercase: 'Include at least one uppercase letter',
      lowercase: 'Include at least one lowercase letter',
      number: 'Include at least one number',
      specialChar: 'Include at least one special character',
      commonWord: 'Password contains common words',
      sequential: 'Password contains sequential patterns',
      repeating: 'Password contains repeating characters',
    };

    Object.keys(control.errors).forEach((key) => {
      if (errorMap[key as keyof typeof errorMap]) {
        errors.push(errorMap[key as keyof typeof errorMap]);
      }
    });

    return errors;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
