import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-menu-toggle',
  template: `
    <button
      mat-icon-button
      class="menu-toggle-button"
      (click)="toggleMenu.emit()"
      aria-label="Toggle menu"
    >
      <mat-icon>menu</mat-icon>
    </button>
  `,
  styles: [
    `
      :host {
        position: fixed;
        top: 16px;
        left: 16px;
        z-index: 1000;
      }

      .menu-toggle-button {
        background-color: #1a2942;
        color: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

        &:hover {
          background-color: #233b72;
        }
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
})
export class MenuToggleComponent {
  @Output() toggleMenu = new EventEmitter<void>();
}
