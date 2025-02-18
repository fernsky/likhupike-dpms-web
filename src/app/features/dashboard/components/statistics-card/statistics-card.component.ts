import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics-card',
  template: `
    <div class="statistics-card">
      <h3>{{ title }}</h3>
      <div class="value">{{ value }}</div>
      <div class="trend" *ngIf="trend">
        {{ trend > 0 ? '+' : '' }}{{ trend }}%
      </div>
    </div>
  `,
  styles: [
    `
      .statistics-card {
        padding: 1rem;
        border-radius: 8px;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class StatisticsCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() trend?: number;
}
