import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient) { }

  getUsersForAside(username: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`, {
      params: { username: username }
    });
  }
  // async getFriends(userId: string): Observable<User[]> {
  //   const user = await this.User.findById(userId).populate('friends', '-password');
  //   if (!user) {
  //     throw new NotFoundException('Usuario no encontrado');
  //   }
  //   return user.friends;
  // }
  getFriends(userId: string) {
    return this.http.get<User[]>(`${this.apiUrl}/users/friends/${userId}`);
  }


}
