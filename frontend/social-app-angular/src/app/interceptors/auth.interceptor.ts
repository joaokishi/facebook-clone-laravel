import { HttpInterceptorFn } from '@angular/common/http';

// Este é um interceptor funcional, não uma classe.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem('authToken');

  if (authToken) {
    // Clona a requisição e adiciona o cabeçalho de autorização.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });
    return next(authReq);
  }

  // Se não houver token, passa a requisição original.
  return next(req);
};