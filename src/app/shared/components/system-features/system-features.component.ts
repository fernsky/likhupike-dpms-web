import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

interface Feature {
  icon: string;
  translationKey: string;
}

@Component({
  selector: 'app-system-features',
  templateUrl: './system-features.component.html',
  styleUrls: ['./system-features.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslocoPipe],
})
export class SystemFeaturesComponent {
  features: Feature[] = [
    {
      icon: 'account_balance',
      translationKey: 'municipalServices',
    },
    {
      icon: 'speed',
      translationKey: 'quickProcessing',
    },
    {
      icon: 'analytics',
      translationKey: 'dataIntegration',
    },
    {
      icon: 'public',
      translationKey: 'citizenPortal',
    },
  ];
}
