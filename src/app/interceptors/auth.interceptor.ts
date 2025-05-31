import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRefreshToken } from '../../entities/loginRefreshToken';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const http = inject(HttpClient);

  let authReq = req;
  const token = authService.getToken();

  // Adiciona o token ao header, se existir
  if (token) {
    authReq = addToken(req, token);
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(authReq, next, authService, router);
      }
      return throwError(() => error);
    })
  );
};

// Função para tratar erro 401 (token expirado)
const handle401Error = (req: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService, router: Router): Observable<any> => {
  if (!isRefreshing) {
    isRefreshing = true;
    
    const refreshToken = authService.getRefreshToken();
    const token = authService.getToken();

    if (refreshToken) {
      const login = new LoginRefreshToken(token!, refreshToken);

      return authService.loginWithRefreshToken(login).pipe(
        switchMap((data) => {
          isRefreshing = false;

          // Salva os novos tokens
          authService.setJwtTokenToStorage(data.body?.token!);
          authService.setRefreshToken(data.body?.refreshToken!);
          authService.setJwtRefreshTokenExpirationTimeToStorage(data.body?.expiration!);

          // Reenvia a requisição original com o novo token
          return next(addToken(req, data.body?.token!));
        }),
        catchError((err) => {
          isRefreshing = false;
          authService.logoutUser();
          router.navigate(['/login']); // Redireciona para login
          return throwError(() => err);
        })
      );
    } else {
      authService.logoutUser();
      router.navigate(['/login']); // Redireciona para login
    }
  }
  return throwError(() => new Error('Refresh token inválido'));
};

// Função para adicionar o token ao cabeçalho da requisição
const addToken = (req: HttpRequest<any>, token: string) => {
  return req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });
};
