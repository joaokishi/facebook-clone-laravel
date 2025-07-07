import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guards';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register-page/register-page.component').then(m => m.RegisterPageComponent)
  },
  {
    path: '',
    canActivate: [authGuard], 
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/home-page/home-page.component').then(m => m.HomePageComponent)
      },
      {
        path: 'friends',
        loadComponent: () => import('./pages/friends-page/friends-page.component').then(m => m.FriendsPageComponent)
      },
      {
        path: 'profile/:userId',
        loadComponent: () => import('./pages/profile-page/profile-page.component').then(m => m.ProfilePageComponent)
      }
    ]
  },

  { path: '**', redirectTo: '', pathMatch: 'full' }
];