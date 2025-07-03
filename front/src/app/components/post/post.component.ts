import { Component, Input, Output, Signal, EventEmitter } from '@angular/core';
import { CommonModule, NgIf, NgClass } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { CommentCreatorComponent } from '../comment-creator/comment-creator.component';
import { ModalComponent } from '../modal/modal.component';

import { PostService } from '../../services/post/post.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [ CommonModule, NgIf, NgClass, TimeAgoPipe, CommentCreatorComponent, ModalComponent ],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  private _post!: any;

  @Input()
  set post(value: any) {
    // Asegura fecha como Date
    if (value && value.createdAt && !(value.createdAt instanceof Date)) {
      value.createdAt = new Date(value.createdAt);
    }
    this._post = value;
  }
  get post(): any {
    return this._post;
  }

  @Output() postLiked = new EventEmitter<void>();
  @Output() postDeleted = new EventEmitter<string>();
  @Output() interactionsRequested = new EventEmitter<void>();

  comments: any[] = [];
  commentsPage = 1;
  commentsLimit = 5;
  totalComments = 0;
  showComments = false;
  loadingComments = false;
  addingComment = false;
  showCommentModal = false;
  loading = false;

  isAdmin: boolean;
  userSignal!: Signal<User | null>;

  modalMessage: string = '';
  showModal: boolean = false;

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {
    this.isAdmin = this.authService.isAdmin();
    this.userSignal = this.authService.currentUser;
  }

  // — Likes —
  async likePost(post: any): Promise<void> {
    this.loading = true;
    const user = this.userSignal();
    if (!user) {
      this.modalMessage = 'Debes iniciar sesión para dar like.';
      this.showModal = true;
      this.loading = false;
      return;
    }
    try {

      const updatedPost = await firstValueFrom(this.postService.likePost(post._id, user));

      post.likes = updatedPost.likes;
    } catch (err) {
      this.modalMessage = 'Error al dar like.';
      this.showModal = true;
    } finally {
      this.loading = false;
    }
  }

  hasUserLiked(post: any): boolean {
    const user = this.userSignal();
    return !!user && Array.isArray(post.likes) && post.likes.some((l: any) => l.username === user.username);
  }

  // — Comentarios —
  toggleComments() {
    this.showComments = !this.showComments;
    if (this.showComments) this.loadComments(true);
    this.showCommentModal = true;
  }

  loadComments(reset: boolean = false) {
    if (reset) {
      this.commentsPage = 1;
      this.comments = [];
    }
    this.loadingComments = true;
    this.postService.getComments(this.post._id, this.commentsPage, this.commentsLimit)
      .subscribe((res: any) => {
        this.comments = reset ? res.comments : [...this.comments, ...res.comments];
        this.totalComments = res.total;
        this.loadingComments = false;
      }, () => this.loadingComments = false);
  }

  onCommentCreated(text: string) {
    this.addingComment = true;
    const user = this.userSignal();
    const newComment = {
      username: user?.username || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      profileImage: user?.profileImage || '',
      content: text
    };
    this.postService.addComment(this.post._id, newComment)
      .subscribe(() => {
        this.addingComment = false;
        this.loadComments(true);
      }, () => this.addingComment = false);
  }

  loadMoreComments() {
    this.commentsPage++;
    this.loadComments();
  }

  commentToDelete: string | null = null;
  eliminateComment(commentId: string) {
    this.commentToDelete = commentId;
    this.modalMessage = '¿Seguro que deseas eliminar este comentario?';
    this.showModal = true;
  }
  confirmDeleteComment() {
    if (!this.commentToDelete) return;
    const user = this.userSignal();
    const username = user?.username || '';
    const role = this.isAdmin ? 'admin' : 'user';
    this.postService.deleteComment(this.post._id, this.commentToDelete, username, role)
      .subscribe(() => {
        this.comments = this.comments.filter(c => c._id !== this.commentToDelete);
        this.totalComments--;
        this.closeModal();
        this.commentToDelete = null;
      }, err => {
        this.modalMessage = 'Error al eliminar comentario.';
        this.commentToDelete = null;
      });
  }
  closeModal() { this.showModal = false; this.commentToDelete = null; }

  // — Soft-delete de post —
  postToDelete: boolean = false;
  async eliminatePost(): Promise<void> {
    this.postToDelete = true;
    this.modalMessage = '¿Seguro que deseas eliminar este post?';
    this.showModal = true;
  }
  async confirmDeletePost(): Promise<void> {
    const user = this.userSignal();
    const username = user?.username || '';
    const role = this.isAdmin ? 'admin' : 'user';
    try {
      await firstValueFrom(this.postService.softDeletePost(this.post._id, username, role));
      this.postDeleted.emit(this.post._id);
      this.closeModal();
      this.postToDelete = false;
    } catch (err) {
      this.modalMessage = 'Error al eliminar post.';
      this.postToDelete = false;
    }
  }
}
