import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-gov-branding',
  templateUrl: './gov-branding.component.html',
  styleUrls: ['./gov-branding.component.scss'],
  standalone: true,
  imports: [CommonModule, LanguageSwitcherComponent, TranslocoPipe],
})
export class GovBrandingComponent {
  @Input() mode: 'vertical' | 'horizontal' = 'vertical';
}
