import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { LoginResponse } from '../entities/loginResponse';
import { LoginRefreshToken } from '../entities/loginRefreshToken';
import { Router } from '@angular/router';

const apiLoginUrl = 'https://localhost:44373/api/Auth/Login';
var httpOptions = {
  headers: new HttpHeaders({
  'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login (loginModel: any) : Observable<HttpResponse<LoginResponse>>{
    return this.http.post<LoginResponse>(
      apiLoginUrl,
      loginModel,
      { headers: httpOptions.headers, observe: 'response' }
    ).pipe(
      tap((data: HttpResponse<LoginResponse>) => {
        console.log('Login usuario com email =' + loginModel.email)
        if(data.ok){
          this.setJwtTokenToStorage(data.body?.token!);
          this.setRefreshToken(data.body?.refreshToken!);
          this.setJwtRefreshTokenExpirationTimeToStorage(data.body?.expiration!);
        }
        else
          console.error(data.body);
      }),
      catchError(this.handleError<HttpResponse<LoginResponse>>('Login'))
    );
  }

  loginWithRefreshToken (loginRefreshToken: LoginRefreshToken) : Observable<HttpResponse<LoginResponse>>{
    return this.http.post<LoginResponse>(
      apiLoginUrl,
      loginRefreshToken,
      { headers: httpOptions.headers, observe: 'response' }
    ).pipe(
      tap((data: HttpResponse<LoginResponse>) => {
        console.log('Login usuario com refreshToken')
        if(data.ok){
          this.setJwtTokenToStorage(data.body?.token!);
          this.setRefreshToken(data.body?.refreshToken!);
          this.setJwtRefreshTokenExpirationTimeToStorage(data.body?.expiration!);
        }
        else
          console.error(data.body);
      }),
      catchError(this.handleError<HttpResponse<LoginResponse>>('Login'))
    );
  }

  getToken(): string | null {
    if(typeof sessionStorage !== "undefined"){
      return sessionStorage.getItem('jwt');
    }
    
    return null;
  }

  getRefreshToken(): string | null {
    if(typeof sessionStorage !== "undefined"){
      return sessionStorage.getItem('jwt');
    }
    
    return null;
  }

  getRefreshTokenExpirationTime(): string | null {
    if(typeof sessionStorage !== "undefined"){
      return sessionStorage.getItem('rToken');
    }
    
    return null;
  }

  setJwtTokenToStorage(token: string) {
    sessionStorage.setItem('jwt', token);
  }

  setRefreshToken(refreshToken: string) {
    sessionStorage.setItem('rToken', refreshToken);
  }

  setJwtRefreshTokenExpirationTimeToStorage(refreshTokenExpiration: string) {
    sessionStorage.setItem('rtExpiration', refreshTokenExpiration);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
    // se nao estiver autenticado devemos tentar fazer o login pelo refreshToken
  }

  isRefreshTokenExpirired(): boolean {
    const expirationTime = this.getRefreshTokenExpirationTime();
    var expirationTimeToDateTime;
    var isExpired = true;

    if(expirationTime != null){
      expirationTimeToDateTime = new Date(expirationTime);
      isExpired = expirationTimeToDateTime >= new Date()
    }
    
    return isExpired;
  }

  isEmployeeOrAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken?.role === 'Employee' || decodedToken?.role === 'Admin';
  }

  setUserEmailToStorage(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decodedToken = this.jwtHelper.decodeToken(token);
    sessionStorage.setItem('email', decodedToken?.email);
    
    return true;
  }

  setUserIdToStorage(userId: number): boolean {
    const token = this.getToken();
    if (!token) return false;

    const userIdString = userId.toString();
    sessionStorage.setItem('userId', userIdString);
    
    return true;
  }

  getUserIdFromStorage(): number | null {
    const token = this.getToken();
    if (!token) return null;

    const userId = parseInt(sessionStorage.getItem('userId')!, 10);
    
    return userId;
  }

  logoutUser(){
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('rtExpiration');
    sessionStorage.removeItem('rToken');
    sessionStorage.removeItem('email');
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}
