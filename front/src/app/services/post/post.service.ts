import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../../models/post.model';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';



@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = environment.apiUrl + '/posts';

  constructor(private http: HttpClient) { }

  createPost(formData: FormData): Observable<Post> {
    return this.http.post<Post>(this.apiUrl + '/create', formData);
  }

  getPostsByUsername(username: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}`, {
      params: { username: username }
    });
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}` + '/all');
  }

  likePost(postId: string, user: User | null): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/like/${postId}`, {
      username: user?.username,
      firstName: user?.firstName,
      lastName: user?.lastName,
      profileImage: user?.profileImage
    });
  }

  addComment(postId: string, comment: any) {
    return this.http.post(`${this.apiUrl}/${postId}/comment`, comment);
  }
  getComments(postId: string, page = 1, limit = 10) {
    return this.http.get(`${this.apiUrl}/${postId}/comments`, { params: { page, limit } });
  }

  // deleteComment(postId: string, commentId: string) {
  //   return this.http.delete(`${this.apiUrl}/${postId}/comments/${commentId}`);
  // }
  deleteComment(postId: string, commentId: string, username: string, role: string) {
    return this.http.delete(
      `${this.apiUrl}/posts/${postId}/comments/${commentId}?username=${username}&role=${role}`
    );
}

}
