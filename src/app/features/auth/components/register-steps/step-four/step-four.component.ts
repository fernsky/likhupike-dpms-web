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
import { TranslocoPipe } from '@jsverse/transloco';
import { Subject, takeUntil } from 'rxjs';
import { BaseStepComponent } from '../base-step.component';
import { PasswordValidatorService } from '@app/shared/validators/password-validator.service';
import { selectStepFormData } from '../../../store/register-form.selectors';
import { filter } from 'rxjs/operators';

interface StepFourFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register-step-four',
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
    TranslocoPipe,
  ],
})
export class StepFourComponent
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
        validators: this.passwordValidatorService.passwordMatchValidator(
          'password',
          'confirmPassword'
        ),
      }
    );
  }

  ngOnInit(): void {
    this.store
      .select(selectStepFormData(4))
      .pipe(
        filter((data): data is Partial<StepFourFormData> => !!data),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        const { password, ...safeData } = data;
        this.stepForm.patchValue(safeData, { emitEvent: false });
      });

    this.stepForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateStepValidity();
      if (this.stepForm.valid) {
        const formValue = this.stepForm.value as StepFourFormData;
        const { confirmPassword, ...formData } = formValue;
        this.updateStepFormData(formData);
      }
    });
  }

  // Password strength and validation methods
  get showPasswordStrength(): boolean {
    const password = this.stepForm.get('password')?.value;
    return Boolean(password?.length > 0 && !this.isPasswordFullyValid);
  }

  get isPasswordFullyValid(): boolean {
    return (
      this.stepForm.get('password')?.valid &&
      this.getPasswordErrors().length === 0
    );
  }

  getPasswordStrength(): number {
    return this.passwordValidatorService.calculateStrength(
      this.stepForm.get('password')?.value
    );
  }

  getPasswordErrors(): string[] {
    const control = this.stepForm.get('password');
    return control?.errors
      ? this.passwordValidatorService.getPasswordErrorMessages(control.errors)
      : [];
  }

  getPasswordStrengthLabel(): string {
    const strength = this.getPasswordStrength();
    return strength < 50
      ? 'registration.stepFour.fields.password.strength.weak'
      : strength < 75
        ? 'registration.stepFour.fields.password.strength.medium'
        : 'registration.stepFour.fields.password.strength.strong';
  }

  getPasswordIconName(): string {
    const strength = this.getPasswordStrength();
    return strength < 50
      ? 'error_outline'
      : strength < 75
        ? 'security'
        : 'verified';
  }

  getStrengthClass(): string {
    const strength = this.getPasswordStrength();
    return strength < 50 ? 'weak' : strength < 75 ? 'medium' : 'strong';
  }

  override updateFormData(): void {
    if (this.stepForm.valid) {
      const formValue = this.stepForm.value as StepFourFormData;
      const { confirmPassword, ...formData } = formValue;
      this.updateStepFormData(formData);
    }
  }

  private updateStepFormData(
    formData: Omit<StepFourFormData, 'confirmPassword'>
  ): void {
    super.updateFormData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
