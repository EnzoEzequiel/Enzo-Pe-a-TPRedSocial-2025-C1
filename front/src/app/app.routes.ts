import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';
import { AdminGuard } from './guards/admin/admin.guard';

export const routes: Routes = [
    {
        path: 'home',
        canActivate: [AuthGuard],
        loadComponent: () =>
            import('./pages/home/home.component').then((m) => m.HomeComponent),
    },
    {
        path: 'auth',
        loadComponent: () =>
            import('./pages/auth/auth.component').then((m) => m.AuthComponent),
    },
    {
        path: 'profile',
        canActivate: [AuthGuard],
        loadComponent: () =>
            import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
    },
    {
        path: 'dashboard-statistics',
        canActivate: [AuthGuard, AdminGuard],

        loadComponent: () =>
            import('./pages/dashboard-statistics/dashboard-statistics.component').then((m) => m.DashboardStatisticsComponent),
    },
    {
        path: 'dashboard-users',
        canActivate: [AuthGuard, AdminGuard],
        loadComponent: () =>
            import('./pages/dashboard-users/dashboard-users.component').then((m) => m.DashboardUsersComponent),
    },

    { path: '', redirectTo: '/auth', pathMatch: 'full' },
    { path: '**', redirectTo: '/auth' }
];