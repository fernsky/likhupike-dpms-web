import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-system-features',
  templateUrl: './system-features.component.html',
  styleUrls: ['./system-features.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule],
})
export class SystemFeaturesComponent {
  features = [
    {
      icon: 'account_balance',
      title: 'Municipal Services',
      description: 'Access all municipal services from one platform',
    },
    {
      icon: 'speed',
      title: 'Quick Processing',
      description: 'Fast and efficient municipal service delivery',
    },
    {
      icon: 'analytics',
      title: 'Data Integration',
      description: 'Integrated municipal data management system',
    },
    {
      icon: 'public',
      title: 'Citizen Portal',
      description: 'Easy access to municipal services for citizens',
    },
  ];
}
