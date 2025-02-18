import {
  Component,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

interface StrengthSegment {
  active: boolean;
  color: string;
}

interface StrengthLevel {
  color: string;
  label: string;
}

@Component({
  selector: 'app-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  animations: [
    trigger('strengthAnimation', [
      state(
        'void',
        style({
          transform: 'scaleX(0)',
          opacity: 0,
        }),
      ),
      state(
        '*',
        style({
          transform: 'scaleX(1)',
          opacity: 1,
        }),
      ),
      transition('void => *', animate('400ms cubic-bezier(0.4, 0, 0.2, 1)')),
      transition('* => void', animate('200ms cubic-bezier(0.4, 0, 0.2, 1)')),
    ]),
  ],
})
export class PasswordStrengthComponent implements OnInit, OnChanges, OnDestroy {
  @Input() password = '';
  @Input() showDetails = true;
  @Input() showLabel = true;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  strength = 0;
  strengthText = '';
  strengthColor = '';
  keyboardMode = false;

  private strengthLevels: Record<string, StrengthLevel> = {
    veryWeak: { color: 'var(--color-weak)', label: 'Very Weak' },
    weak: { color: 'var(--color-weak)', label: 'Weak' },
    medium: { color: 'var(--color-medium)', label: 'Medium' },
    strong: { color: 'var(--color-strong)', label: 'Strong' },
    veryStrong: { color: 'var(--color-very-strong)', label: 'Very Strong' },
  };

  segments: StrengthSegment[] = Array(5).fill({ active: false, color: '' });
  requirements = {
    length: false,
    lowercase: false,
    uppercase: false,
    numbers: false,
    special: false,
  };

  private destroy$ = new Subject<void>();

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.setupAccessibility();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['password']) {
      this.checkStrength(this.password);
    }
  }

  getAriaAnnouncement(): string {
    return `Password strength is ${this.strengthText} at ${this.strength}%`;
  }

  getAriaValueText(): string {
    return `Password strength: ${this.strengthText}, ${this.strength}%`;
  }

  getIconAriaLabel(): string {
    return `Password strength indicator: ${this.strengthText}`;
  }

  getStrengthIcon(): string {
    if (this.strength >= 80) return 'verified';
    if (this.strength >= 60) return 'check_circle';
    return 'info';
  }

  private updateStrengthLevel(): void {
    if (this.strength >= 80) {
      this.strengthText = this.strengthLevels.veryStrong.label;
      this.strengthColor = this.strengthLevels.veryStrong.color;
    } else if (this.strength >= 60) {
      this.strengthText = this.strengthLevels.strong.label;
      this.strengthColor = this.strengthLevels.strong.color;
    } else if (this.strength >= 40) {
      this.strengthText = this.strengthLevels.medium.label;
      this.strengthColor = this.strengthLevels.medium.color;
    } else if (this.strength >= 20) {
      this.strengthText = this.strengthLevels.weak.label;
      this.strengthColor = this.strengthLevels.weak.color;
    } else {
      this.strengthText = this.strengthLevels.veryWeak.label;
      this.strengthColor = this.strengthLevels.veryWeak.color;
    }
  }

  private checkStrength(password: string): void {
    // Reset requirements
    this.requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    // Calculate strength
    const metRequirements = Object.values(this.requirements).filter(
      Boolean,
    ).length;
    this.strength = (metRequirements / 5) * 100;

    this.updateStrengthLevel();
    this.updateSegments();
  }

  private updateSegments(): void {
    const activeSegments = Math.ceil((this.strength / 100) * 5);

    this.segments = Array(5)
      .fill(null)
      .map((_, index) => ({
        active: index < activeSegments,
        color: this.getSegmentColor(index, activeSegments),
      }));
  }

  private getSegmentColor(index: number, activeSegments: number): string {
    if (!this.segments[index].active) return 'var(--border-color)';

    if (activeSegments <= 2) return 'var(--color-weak)';
    if (activeSegments <= 3) return 'var(--color-medium)';
    if (activeSegments <= 4) return 'var(--color-strong)';
    return 'var(--color-very-strong)';
  }

  private setupAccessibility(): void {
    this.elementRef.nativeElement.setAttribute('role', 'meter');
    this.elementRef.nativeElement.setAttribute(
      'aria-label',
      'Password strength meter',
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
