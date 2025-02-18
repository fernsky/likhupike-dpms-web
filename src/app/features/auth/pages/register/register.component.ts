import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as AuthActions from '../../../../core/store/auth/auth.actions';
import { selectAuthState } from '../../../../core/store/auth/auth.selectors';
import { RegisterRequest } from '../../../../core/models/auth.interface';
import { nepaliNameValidator } from '../../../../shared/validators/nepali-name.validator';
import { OfficePost } from '../../../../core/models/office-post.enum';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule,
    RouterModule,
  ],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup; // Added ! operator here
  hidePassword = true;
  loading = false;
  maxDate = new Date(); // For date picker
  officePosts = Object.values(OfficePost);
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
          ),
        ],
      ],
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      fullNameNepali: ['', [Validators.required, nepaliNameValidator()]],
      dateOfBirth: ['', [Validators.required]],
      address: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(200),
        ],
      ],
      officePost: ['', [Validators.required]],
      wardNumber: [null],
    });

    // Add ward number validation based on office post
    this.registerForm
      .get('officePost')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((post) => {
        const wardControl = this.registerForm.get('wardNumber');
        if (post !== OfficePost.CHIEF_ADMINISTRATIVE_OFFICER) {
          wardControl?.setValidators([
            Validators.required,
            Validators.min(1),
            Validators.max(50),
          ]);
        } else {
          wardControl?.clearValidators();
        }
        wardControl?.updateValueAndValidity();
      });
  }

  ngOnInit(): void {
    this.store
      .select(selectAuthState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((authState) => {
        this.loading = authState.loading;
        if (authState.error) {
          this.registerForm.setErrors({ serverError: authState.error });
        }
      });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const registerData: RegisterRequest = {
        ...formValue,
        dateOfBirth: formValue.dateOfBirth.toISOString(),
      };
      this.store.dispatch(AuthActions.register({ userData: registerData }));
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
