import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gov-branding',
  templateUrl: './gov-branding.component.html',
  styleUrls: ['./gov-branding.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class GovBrandingComponent {
  @Input() mode: 'vertical' | 'horizontal' = 'vertical';
  @Input() showEnglishTitle = true;
}
