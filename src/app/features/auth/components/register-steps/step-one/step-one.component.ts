import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Subject, takeUntil } from 'rxjs';
import { BaseStepComponent } from '../base-step.component';
import { nepaliNameValidator } from '../../../../../shared/validators/nepali-name.validator';
import { selectStepFormData } from '../../../store/register-form.selectors';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-register-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class StepOneComponent
  extends BaseStepComponent
  implements OnInit, OnDestroy
{
  override stepForm!: FormGroup;
  override stepNumber = 1;
  private destroy$ = new Subject<void>();
  maxDate = new Date();

  constructor(private fb: FormBuilder) {
    super();
    this.initForm();
  }

  private initForm(): void {
    this.stepForm = this.fb.group({
      fullNameNepali: ['', [Validators.required, nepaliNameValidator()]],
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      dateOfBirth: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Load saved form data
    this.store
      .select(selectStepFormData(1))
      .pipe(
        filter((data) => !!data),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        if (data) {
          this.stepForm.patchValue(data, { emitEvent: false });
        }
      });

    // Monitor form changes
    this.stepForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateStepValidity();
      if (this.stepForm.valid) {
        this.updateFormData();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
