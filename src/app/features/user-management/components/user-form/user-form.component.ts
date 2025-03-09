import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoleType } from '@app/core/models/role.enum';
import { CreateUserRequest, UserResponse } from '../../models/user.interface';
import { passwordValidator } from '@app/shared/validators/password.validator';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit, OnDestroy {
  @Input() loading = false;
  @Input() errors: Record<string, string[]> | null = null;
  @Input() user: UserResponse | null = null;
  @Input() isEdit = false;

  @Output() submitForm = new EventEmitter<CreateUserRequest>();
  @Output() cancel = new EventEmitter<void>();

  userForm: FormGroup;
  roleTypes = Object.values(RoleType);
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator()]],
      fullName: ['', [Validators.required]],
      fullNameNepali: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      address: ['', [Validators.required]],
      officePost: ['', [Validators.required]],
      wardNumber: [null],
      isMunicipalityLevel: [false],
      roles: [[], [Validators.required]],
      profilePicture: [null],
    });

    if (this.isEdit) {
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  ngOnInit(): void {
    if (this.user) {
      this.userForm.patchValue({
        ...this.user,
        password: '',
      });
      this.previewUrl = this.user.profilePictureUrl || null;
    }

    // Watch for municipality level changes
    this.userForm
      .get('isMunicipalityLevel')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((isMunicipal) => {
        const wardControl = this.userForm.get('wardNumber');
        if (isMunicipal) {
          wardControl?.setValue(null);
          wardControl?.disable();
        } else {
          wardControl?.enable();
        }
      });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.userForm.patchValue({ profilePicture: null });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData: CreateUserRequest = {
        ...this.userForm.value,
        profilePicture: this.selectedFile,
      };
      this.submitForm.emit(formData);
    } else {
      this.markFormGroupTouched(this.userForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
