import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface Step {
  label: string;
  completed: boolean;
  current: boolean;
}

@Component({
  selector: 'app-step-indicator',
  templateUrl: './step-indicator.component.html',
  styleUrls: ['./step-indicator.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule],
})
export class StepIndicatorComponent {
  @Input() steps: Step[] = [];
  @Input() currentStepIndex: number = 0;

  getStepState(index: number): 'completed' | 'current' | 'upcoming' {
    if (index < this.currentStepIndex) {
      return 'completed';
    } else if (index === this.currentStepIndex) {
      return 'current';
    }
    return 'upcoming';
  }

  // For screen readers
  getAriaLabel(step: Step, index: number): string {
    const status = step.completed
      ? 'completed'
      : step.current
        ? 'current'
        : 'pending';
    return `Step ${index + 1}: ${step.label} - ${status}`;
  }
}
