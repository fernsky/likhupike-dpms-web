import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ProvinceService } from '@app/core/services/province.service';
import { MunicipalityService } from '@app/core/services/municipality.service';
import { WardService } from '@app/core/services/ward.service';
import { Province, Municipality, Ward } from '@app/core/models/location.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-location-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  template: `
    <form [formGroup]="locationForm">
      <mat-form-field>
        <mat-label>Province</mat-label>
        <mat-select formControlName="provinceCode">
          <mat-option
            *ngFor="let province of provinces$ | async"
            [value]="province.code"
          >
            {{ province.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <!-- Add similar selects for municipality and ward -->
    </form>
  `,
})
export class LocationSelectorComponent implements OnInit {
  locationForm: FormGroup;
  provinces$: Observable<Province[]>;

  constructor(
    private fb: FormBuilder,
    private provinceService: ProvinceService,
    private municipalityService: MunicipalityService,
    private wardService: WardService
  ) {
    this.locationForm = this.fb.group({
      provinceCode: [''],
      municipalityCode: [''],
      wardNumber: [''],
    });
  }

  ngOnInit() {
    this.loadProvinces();

    // Subscribe to province changes to load municipalities
    this.locationForm.get('provinceCode')?.valueChanges.subscribe((code) => {
      if (code) {
        this.loadMunicipalities(code);
      }
    });
  }

  loadProvinces() {
    this.provinces$ = this.provinceService.searchProvinces({
      fields: ['code', 'name', 'nameNepali'],
      limit: 50,
    });
  }

  loadMunicipalities(provinceCode: string) {
    this.municipalityService
      .searchMunicipalities({
        fields: ['code', 'name', 'nameNepali'],
        provinceCode,
        limit: 100,
      })
      .subscribe((municipalities) => {
        // Handle municipalities
      });
  }

  // Force refresh if data is stale
  refreshProvinces() {
    this.provinceService.clearProvinceCache();
    this.loadProvinces();
  }
}
