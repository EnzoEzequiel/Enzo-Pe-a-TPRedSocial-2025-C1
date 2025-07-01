import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


export interface PostsByUser { _id: string; count: number; }
export interface CommentsByDate  { count: number; }
export interface CommentsByPost  { _id: string; count: number; }
@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private readonly baseUrl = `${environment.apiUrl}/statistics`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene estadísticas según el tipo de gráfico/tab y el rango temporal.
   * @param tab (1 = publicaciones por usuario, 2 = total comentarios, 3 = comentarios por post)
   * @param range ('day', 'week', 'month')
   */
  getStatistics(tab: number, range: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?tab=${tab}&range=${range}`);
  }

  getPostsByUser(from: string, to: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/posts-by-user`, { params: { from, to } });
  }
  getCommentsByDate(from: string, to: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/comments-by-date`, { params: { from, to } });
  }
  getCommentsByPost(from: string, to: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/comments-by-post`, { params: { from, to } });
  }
}
