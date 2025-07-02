import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Importe as funções corretas
import { routes } from './app.routes'; // Suas rotas
import { authInterceptor } from './interceptors/auth.interceptor'; // Seu interceptor funcional

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Provê o roteador com suas rotas
    provideHttpClient(withInterceptors([authInterceptor])) // Provê o HttpClient e registra o interceptor
  ]
};