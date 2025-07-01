import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="modal-backdrop" (click)="onClose()"></div>
    <div class="modal-content">
      <h2 *ngIf="title">{{ title }}</h2>
      <ng-content></ng-content>
      <div *ngIf="message">{{ message }}</div>
      <button (click)="onClose()">Cerrar</button>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.4); z-index: 1000;
    }
    .modal-content {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      background: #fff; padding: 2rem; border-radius: 8px; z-index: 1001;
      min-width: 300px; max-width: 90vw;
    }
    button { margin-top: 1rem; }
  `]
})
export class ModalComponent {
  @Input() title?: string;
  @Input() message?: string;
  @Output() close = new EventEmitter<void>();

  onClose() { this.close.emit(); }
}
