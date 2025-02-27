import { Component, OnInit } from '@angular/core';
import { ProvinceService } from '@app/core/services/province.service';
import { Province } from '@app/core/models/location.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register-step-three',
  template: `
    <ng-container *ngIf="provinces$ | async as provinces">
      <mat-form-field>
        <mat-select formControlName="provinceCode">
          <mat-option
            *ngFor="let province of provinces"
            [value]="province.CODE"
          >
            {{ province.NAME }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </ng-container>
  `,
})
export class StepThreeComponent implements OnInit {
  provinces$!: Observable<Province[]>;

  constructor(private provinceService: ProvinceService) {}

  ngOnInit() {
    this.provinces$ = this.provinceService.searchProvinces({
      fields: ['CODE', 'NAME'],
      limit: 100,
    });
  }
}
