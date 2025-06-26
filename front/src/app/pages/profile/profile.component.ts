import { Component } from '@angular/core';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { PostComponent } from '../../components/post/post.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { PostService } from '../../services/post/post.service';
import { Post } from '../../models/post.model';
import { PostInteractionsComponent } from '../../components/post-interactions/post-interactions.component';



@Component({
  selector: 'app-profile',
  imports: [ProfileHeaderComponent, PostComponent, NgFor, NgIf, PostInteractionsComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  posts: Post[] = [];
  commentsByPost: { [postId: string]: any[] } = {};
  commentsPageByPost: { [postId: string]: number } = {};
  commentsLimit = 3;
  totalCommentsByPost: { [postId: string]: number } = {};
  selectedPost: any = null;
  username = localStorage.getItem('username') || '';
  firstName = localStorage.getItem('firstName') || '';
  lastName = localStorage.getItem('lastName') || '';
  profileImage = localStorage.getItem('profileImage') || '';

  constructor(private postService: PostService) {
  }

  openPostInteractions(post: any): void {
    this.selectedPost = post;
  }

  closePostInteractions(): void {
    this.selectedPost = null;
  }

  private formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffSec < 60) return 'hace unos segundos';
    if (diffMin < 60) return `${diffMin} min`;
    if (diffHrs < 24) return `${diffHrs} h`;
    if (diffDays === 1) return 'ayer';
    if (diffDays < 7) return `hace ${diffDays} días`;

    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  onPostLiked(): void {
    this.loadPosts();
  }

  loadCommentsForPost(postId: string) {
    this.commentsPageByPost[postId] = 1;
    this.postService.getComments(postId, 1, this.commentsLimit).subscribe(res => {
      this.commentsByPost[postId] = res.comments;
      this.totalCommentsByPost[postId] = res.total;
    });
  }

  loadMoreCommentsForPost(postId: string) {
    this.commentsPageByPost[postId] = (this.commentsPageByPost[postId] || 1) + 1;
    this.postService.getComments(postId, this.commentsPageByPost[postId], this.commentsLimit).subscribe(res => {
      this.commentsByPost[postId] = [...(this.commentsByPost[postId] || []), ...res.comments];
    });
  }

  ngOnInit(): void {
    this.loadPosts();

  }

  private loadPosts(): void {
    this.postService.getPostsByUsername(this.username).subscribe((data) => {
      this.posts = data.filter(post => !!post._id).map(post => {
        post.date = this.formatTimeAgo(post.date);
        this.loadCommentsForPost(post._id!);
        return post;
      });
    });
  }

}
