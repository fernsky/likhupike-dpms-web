import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslocoPipe } from '@jsverse/transloco';
import { BaseStepComponent } from '../base-step.component';
import { LocationService } from '@app/core/services/location.service';
import { locationFormValidator } from '@app/shared/validators/location-form.validator';
import { UserType } from '@app/core/models/user-type.enum';
import {
  OfficeSection,
  ElectedPosition,
  OFFICE_SECTION_TRANSLATION_KEYS,
  ELECTED_POSITION_TRANSLATION_KEYS,
} from '@app/core/models/office.enum';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, startWith, takeUntil, switchMap, filter } from 'rxjs/operators';
import {
  selectStepFormData,
  selectUserType,
} from '../../../store/register-form.selectors';
import {
  Province,
  District,
  Municipality,
  Ward,
} from '@app/core/models/location.model';

@Component({
  selector: 'app-register-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    TranslocoPipe,
  ],
})
export class StepThreeComponent
  extends BaseStepComponent
  implements OnInit, OnDestroy
{
  override stepForm!: FormGroup;
  override stepNumber = 3;

  provinces$!: Observable<Province[]>;
  districts$!: Observable<District[]>;
  municipalities$!: Observable<Municipality[]>;
  wards$!: Observable<Ward[]>;

  showWardSelection$!: Observable<boolean>;
  showOfficeSection$!: Observable<boolean>;
  showPosition$!: Observable<boolean>;

  readonly officeSections = Object.values(OfficeSection);
  readonly electedPositions = Object.values(ElectedPosition);
  readonly officeSectionTranslationKeys = OFFICE_SECTION_TRANSLATION_KEYS;
  readonly electedPositionTranslationKeys = ELECTED_POSITION_TRANSLATION_KEYS;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService
  ) {
    super();
    this.initForm();
    this.setupLocationCascading();
  }

  private initForm(): void {
    this.stepForm = this.fb.group(
      {
        provinceCode: ['', Validators.required],
        districtCode: ['', Validators.required],
        municipalityCode: ['', Validators.required],
        wardNumber: [''],
        officeSection: [''],
        isWardOffice: [false],
        position: [''],
      },
      { validators: locationFormValidator() }
    );

    // Update this section to use the correct selector
    const userType$ = this.store.select(selectUserType);

    // Rest remains the same
    this.showWardSelection$ = combineLatest([
      userType$,
      this.stepForm.get('position')!.valueChanges.pipe(startWith('')),
    ]).pipe(
      map(
        ([userType, position]) =>
          userType === UserType.CITIZEN ||
          position === ElectedPosition.WARD_CHAIRPERSON ||
          position === ElectedPosition.WARD_MEMBER
      )
    );

    this.showOfficeSection$ = userType$.pipe(
      map((userType) => userType === UserType.LOCAL_LEVEL_EMPLOYEE)
    );

    this.showPosition$ = userType$.pipe(
      map((userType) => userType === UserType.ELECTED_REPRESENTATIVE)
    );
  }

  private setupLocationCascading(): void {
    // Load initial provinces
    this.provinces$ = this.locationService.getProvinces({
      fields: ['CODE', 'NAME'],
      limit: 100,
    });

    // Districts based on selected province
    this.districts$ = this.stepForm.get('provinceCode')!.valueChanges.pipe(
      filter((provinceCode) => !!provinceCode),
      switchMap((provinceCode) =>
        this.locationService.getDistricts({
          fields: ['CODE', 'NAME'],
          provinceCode,
          limit: 100,
        })
      )
    );

    // Municipalities based on selected district
    this.municipalities$ = this.stepForm.get('districtCode')!.valueChanges.pipe(
      filter((districtCode) => !!districtCode),
      switchMap((districtCode) =>
        this.locationService.getMunicipalities({
          fields: ['CODE', 'NAME'],
          districtCode,
          limit: 100,
        })
      )
    );

    // Wards based on selected municipality
    this.wards$ = this.stepForm.get('municipalityCode')!.valueChanges.pipe(
      filter((municipalityCode) => !!municipalityCode),
      switchMap((municipalityCode) =>
        this.locationService.getWards({
          fields: ['NUMBER'],
          municipalityCode,
          limit: 100,
        })
      )
    );
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
