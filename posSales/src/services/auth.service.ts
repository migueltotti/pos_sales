import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { LoginModel } from '../entities/loginModel';

const apiLoginUrl = 'https://localhost:44373/api/Auth/Login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  login (loginModel: any) : Observable<LoginModel>{
    return this.http.post<LoginModel>(apiLoginUrl, loginModel).pipe(
      tap(() => console.log('Login usuario com email =' + loginModel.email)),
      catchError(this.handleError<LoginModel>('Login'))
    );
  }

  getToken(): string | null {
    if(typeof sessionStorage !== "undefined"){
      return sessionStorage.getItem('jwt');
    }
    
    return null;
  }

  setJwtTokenToStorage(token: string) {
    sessionStorage.setItem('jwt', token);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
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
    sessionStorage.removeItem('email');
  }


  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}
