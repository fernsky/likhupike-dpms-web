import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatError } from '@angular/material/form-field';
import { TranslocoPipe } from '@jsverse/transloco';
import { BaseStepComponent } from '../base-step.component';
import {
  UserType,
  USER_TYPE_TRANSLATION_KEYS,
} from '@app/core/models/user-type.enum';
import { Subject, takeUntil } from 'rxjs';
import { filter } from 'rxjs/operators';
import { selectStepFormData } from '../../../store/register-form.selectors';

@Component({
  selector: 'app-register-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatIconModule,
    MatError,
    TranslocoPipe,
  ],
})
export class StepTwoComponent
  extends BaseStepComponent
  implements OnInit, OnDestroy
{
  override stepForm!: FormGroup;
  override stepNumber = 2;

  readonly userTypes = Object.values(UserType);
  readonly userTypeTranslationKeys = USER_TYPE_TRANSLATION_KEYS;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    super();
    this.initForm();
  }

  private initForm(): void {
    this.stepForm = this.fb.group({
      userType: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Load saved form data
    this.store
      .select(selectStepFormData(2))
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
