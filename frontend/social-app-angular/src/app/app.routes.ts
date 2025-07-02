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
    canActivate: [authGuard], // Protege a rota e suas filhas
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
  // Rota coringa para redirecionar para a home
  { path: '**', redirectTo: '', pathMatch: 'full' }
];