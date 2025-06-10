import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-post-interactions',
  imports: [NgIf, NgFor, NgClass],
  templateUrl: './post-interactions.component.html',
  styleUrls: ['./post-interactions.component.css']
})
export class PostInteractionsComponent {
  @Input() likes: { id: number, username: string, firstName: string, lastName: string, profileImage: string }[] = [];
  @Input() comments: { id: number, username: string, comment: string }[] = [];

  @Output() onClose = new EventEmitter<void>();

  activeTab: 'likes' | 'comments' = 'likes';

  close() {
    this.onClose.emit(); // Permite al componente padre cerrar el popup
  }
}
