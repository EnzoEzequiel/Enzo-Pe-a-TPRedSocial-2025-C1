import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-comment-creator',
  imports: [FormsModule, NgClass],
  templateUrl: './comment-creator.component.html',
  styleUrls: ['./comment-creator.component.css']
})
export class CommentCreatorComponent {
  commentText: string = '';

  @Output() commentCreated = new EventEmitter<string>();
  @Output() closeModal = new EventEmitter<void>();

  submitComment() {
    const trimmed = this.commentText.trim();
    if (trimmed.length > 0) {
      this.commentCreated.emit(trimmed);
      this.commentText = '';
    }
  }

  countCharacters(text: string): number {
    return text.length;
  }

  close() {
    this.closeModal.emit();
  }
}