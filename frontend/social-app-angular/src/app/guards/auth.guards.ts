import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Injeta o serviço
  const router = inject(Router); // Injeta o roteador

  if (authService.isAuthenticated) {
    return true;
  }

  // Redireciona para a página de login se não estiver autenticado
  return router.createUrlTree(['/login']);
};