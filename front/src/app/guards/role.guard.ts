import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'] as string;
    const userRole = localStorage.getItem('role');
    if (userRole === expectedRole) {
      return true;
    }
    this.router.navigate(['/home']);
    return false;
  }
}
