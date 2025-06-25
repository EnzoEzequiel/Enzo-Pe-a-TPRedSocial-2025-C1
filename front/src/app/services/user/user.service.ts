import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

export type { User };
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }


  getUsersForAside(username: string): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, {
      params: { username }
    });
  }


  listUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }


  disableUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }


  enableUser(userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/enable`, {});
  }


  createUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    role: 'usuario' | 'administrador';
  }): Observable<User> {
    return this.http.post<User>(this.apiUrl, data);
  }


  getFriends(userId: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/friends/${userId}`);
  }

}
