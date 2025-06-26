import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    const user = localStorage.getItem('username');
    console.log('[AuthGuard] canActivate, username en localStorage:', user);
    if (user) {
      return true;
    }
    console.warn('[AuthGuard] Usuario no autenticado, redirigiendo a /auth');
    this.router.navigate(['/auth']);
    return false;
  }
}
