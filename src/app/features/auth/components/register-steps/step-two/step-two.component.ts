import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Subject, takeUntil } from 'rxjs';
import { BaseStepComponent } from '../base-step.component';
import { OfficePost } from '../../../../../core/models/office-post.enum';
import { RegisterFormActions } from '@app/features/auth/store/register-form.actions';
import { selectStepFormData } from '../../../store/register-form.selectors';
import { filter, distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-register-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
})
export class StepTwoComponent
  extends BaseStepComponent
  implements OnInit, OnDestroy
{
  override stepForm!: FormGroup;
  override stepNumber = 2;
  private destroy$ = new Subject<void>();
  officePosts = Object.values(OfficePost);
  wardNumbers = Array.from({ length: 5 }, (_, i) => i + 1);

  constructor(
    private fb: FormBuilder,
    public cdr: ChangeDetectorRef
  ) {
    super();
    this.initForm();
  }

  private initForm(): void {
    this.stepForm = this.fb.group({
      isFromWard: [false],
      wardNumber: [{ value: null, disabled: true }],
      officePost: ['', [Validators.required]],
    });

    // Optimize ward checkbox changes
    this.stepForm
      .get('isFromWard')
      ?.valueChanges.pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged() // Add this operator
      )
      .subscribe((isFromWard: boolean) => {
        const wardControl = this.stepForm.get('wardNumber');
        if (isFromWard) {
          wardControl?.enable();
          wardControl?.setValidators([Validators.required]);
        } else {
          wardControl?.disable();
          wardControl?.clearValidators();
          wardControl?.setValue(null);
        }
        wardControl?.updateValueAndValidity({ emitEvent: false });
      });
  }

  // Add a dedicated method for ward number change
  onWardNumberChange(): void {
    this.cdr.detectChanges();
    // Defer the form update to avoid change detection cycles
    setTimeout(() => {
      this.updateFormData();
    });
  }

  // Add this method
  onWardCheckboxChange(): void {
    this.cdr.detectChanges();
    // Defer the form update to avoid change detection cycles
    setTimeout(() => {
      const formValue = this.stepForm.getRawValue();
      this.updateFormData();
    });
  }

  ngOnInit(): void {
    this.store
      .select(selectStepFormData(2))
      .pipe(
        filter((data) => !!data),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        if (data) {
          if (data.isFromWard) {
            this.stepForm.get('wardNumber')?.enable();
          }
          this.stepForm.patchValue(data, { emitEvent: false });
          this.cdr.markForCheck();
        }
      });

    // Optimize form value changes
    this.stepForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(100) // Add debounce time
      )
      .subscribe(() => {
        this.updateStepValidity();
        if (this.stepForm.valid) {
          const formValue = this.stepForm.getRawValue();
          const dataToUpdate = {
            isFromWard: formValue.isFromWard,
            officePost: formValue.officePost,
            wardNumber: formValue.isFromWard ? formValue.wardNumber : null,
          };
          this.store.dispatch(
            RegisterFormActions.updateFormData({ formData: dataToUpdate })
          );
        }
      });
  }

  trackByValue(index: number, value: any): any {
    return value;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
