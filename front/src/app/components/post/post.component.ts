import { Component, Input, Output, Signal, EventEmitter } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { PostService } from '../../services/post/post.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user.model';
import { firstValueFrom } from 'rxjs';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [NgIf, NgClass, TimeAgoPipe],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  private _post: any;
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
}
