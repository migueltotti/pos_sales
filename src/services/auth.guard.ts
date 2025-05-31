import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): boolean {
    const isRefreshTokenExpirired = this.authService.isRefreshTokenExpirired()

    if (isRefreshTokenExpirired) {
      this.router.navigate(['/login']); // Redireciona para login se não estiver autenticado
      return false;
    }

    return true; // Permite o acesso se estiver autenticado
  }
}
