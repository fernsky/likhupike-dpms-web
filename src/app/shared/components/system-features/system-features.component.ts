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
      icon: 'security',
      title: 'Secure Digital Profile',
      description:
        'Your information is protected with enterprise-grade security',
    },
    {
      icon: 'speed',
      title: 'Efficient Processing',
      description: 'Quick and streamlined digital service delivery',
    },
    {
      icon: 'verified_user',
      title: 'Verified Identity',
      description: 'Government-verified digital identity system',
    },
    {
      icon: 'devices',
      title: 'Multi-Platform Access',
      description: 'Access your profile from any device, anywhere',
    },
  ];
}
