import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  currentUser = signal<User | null>(this.getUserFromLocalStorage());
  followers: number = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
  following: number = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  register(formData: FormData) {
    return this.http.post<User>(this.apiUrl + '/register', formData);
  }

  async login(usernameOrEmail: string, password: string): Promise<User> {
    try {
      const response = this.http.post<{ accessToken: string; user: User }>(`${this.apiUrl}/login`, {
        usernameOrEmail,
        password,
      });
      const { accessToken, user } = await firstValueFrom(response);

      user.accessToken = accessToken;
      this.saveUserToLocalStorage(user);
      this.currentUser.set(user);

      await this.router.navigate(['/home']);
      return user;

    } catch (error) {
      console.error('Error en AuthService.login:', error);
      throw new Error('Credenciales inválidas o error en el servidor.');
    }
  }


  logout(): void {
    localStorage.clear();
    this.currentUser.set(null);
    this.router.navigate(['/auth']);
  }

  private saveUserToLocalStorage(user: User): void {
    localStorage.setItem('_id', user._id);
    localStorage.setItem('username', user.username);
    localStorage.setItem('firstName', user.firstName);
    localStorage.setItem('lastName', user.lastName);
    localStorage.setItem('accessToken', user.accessToken);
    localStorage.setItem('role', user.role);
    localStorage.setItem('profileImage', user.profileImage || '');
    localStorage.setItem('description', user.description || '');
    localStorage.setItem('birthDate', user.birthDate);
    localStorage.setItem('following', this.following.toString());
    localStorage.setItem('followers', this.followers.toString());
    localStorage.setItem('createdAt', user.createdAt.toString());
    localStorage.setItem('show', user.show.toString());
  }

  private getUserFromLocalStorage(): User | null {
    const username = localStorage.getItem('username');
    if (!username) return null;
    return {
      _id: localStorage.getItem('_id') || '',
      username,
      firstName: localStorage.getItem('firstName') || '',
      lastName: localStorage.getItem('lastName') || '',
      accessToken: localStorage.getItem('accessToken') || '',
      role: localStorage.getItem('role') || 'user',
      profileImage: localStorage.getItem('profileImage') || '',
      description: localStorage.getItem('description') || '',
      birthDate: localStorage.getItem('birthDate') || '',
      createdAt: localStorage.getItem('createdAt') || '',
      show: localStorage.getItem('show') === 'true',
    } as User;
  }

  getCurrentUser(): Promise<User | null> {
    return Promise.resolve(this.getUserFromLocalStorage());
  }

  async authorize(): Promise<boolean> {
    try {
      const response = this.http.get<{ valid: boolean }>(`${this.apiUrl}/authorize`);
      const result = await firstValueFrom(response);
      return result.valid;
    } catch {
      this.logout();
      return false;
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const response = this.http.post<{ accessToken: string }>(`${this.apiUrl}/refresh`, {});
      const result = await firstValueFrom(response);
      if (result.accessToken) {
        localStorage.setItem('accessToken', result.accessToken);
        return result.accessToken;
      }
      return null;
    } catch {
      this.logout();
      return null;
    }
  }

  // Session timer logic (skeleton, to be used in app.component or a dedicated service)
  sessionTimeout: any;
  startSessionTimer(durationMs: number, onTimeout: () => void) {
    if (this.sessionTimeout) clearTimeout(this.sessionTimeout);
    this.sessionTimeout = setTimeout(onTimeout, durationMs);
  }
  clearSessionTimer() {
    if (this.sessionTimeout) clearTimeout(this.sessionTimeout);
  }
}
