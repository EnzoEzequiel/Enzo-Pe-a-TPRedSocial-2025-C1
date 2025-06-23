import { Component, Input, Output, Signal, EventEmitter } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { PostService } from '../../services/post/post.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user.model';
import { firstValueFrom } from 'rxjs';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { CommentCreatorComponent } from '../comment-creator/comment-creator.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule,NgIf, NgClass, TimeAgoPipe,CommentCreatorComponent],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  private _post: any;
  comments: any[] = [];
  commentsPage = 1;
  commentsLimit = 5;
  totalComments = 0;
  showComments = false;
  loadingComments = false;
  addingComment = false;


  @Output() postLiked = new EventEmitter<void>();
  // @Input() post: any;
  @Input() set post(value: any) {
    if (value && typeof value.createdAt === 'string') {
      value.createdAt = new Date(value.createdAt);
    }
    this._post = value;
  }

  get post(): any {
    return this._post;
  }
  loading = false;
  userSignal!: Signal<User | null>;
  @Output() interactionsRequested = new EventEmitter<void>();

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {
    this.userSignal = this.authService.currentUser;
  }

  onClick() {
    this.interactionsRequested.emit();
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
      });
  }

  // usuario envia comentario
  onCommentCreated(commentText: string) {
    this.addingComment = true;
    const user = {
      username: localStorage.getItem('username'),
      firstName: localStorage.getItem('firstName'),
      lastName: localStorage.getItem('lastName'),
      profileImage: localStorage.getItem('profileImage')
    };
    const newComment = {
      ...user,
      content: commentText
    };
    this.postService.addComment(this.post._id, newComment)
      .subscribe(() => {
        this.addingComment = false;
        this.loadComments(true); // Recarga comentarios desde el principio
      }, () => this.addingComment = false);
  }

  // Mostrar mas comentarios
  loadMoreComments() {
    this.commentsPage++;
    this.loadComments();
  }

  async likePost(post: any): Promise<void> {
    this.loading = true;
    const user = this.userSignal();

    if (!user) return;

    try {
      const response = await firstValueFrom(this.postService.likePost(post._id, user));
      console.log('Like exitoso:', response);
      this.postLiked.emit();
    } catch (error) {
      console.error('Error al hacer like:', error);
    } finally {
      this.loading = false;
    }
  }

  hasUserLiked(post: any): boolean {
    const user = this.userSignal();
    if (!user || !post.likes) return false;
    return post.likes.some((like: { username: string }) => like.username === user.username);
  }

  toggleComments() {
    this.showComments = !this.showComments;
    if (this.showComments) {
      this.loadComments(true);
    }
  }

}
