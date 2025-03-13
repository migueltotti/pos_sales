import { Injectable } from '@angular/core';
import { catchError, of, tap, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../entities/user';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

const apiUrl = 'https://localhost:44373/api/Users';
var httpOptions = {headers: new HttpHeaders({
  "Content-Type": "application/json"
})};
var token: string | null;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  montarHeaderToken() {
    token = sessionStorage.getItem("jwt");
    console.log('jwt header token ' + token)
    httpOptions = {headers: new HttpHeaders({"Authorization" : "Bearer " + token, "Content-Type": "application/json"})}
  }

  getUserByEmail(email: string): Observable<User> {
    const url = apiUrl + '/email/' + email;
    this.montarHeaderToken();
    return this.http.get<User>(
      url, httpOptions
    ).pipe(
      tap((Product: User) => console.log('user received successfully')),
      catchError(this.handleError<User>('getUser'))
    );
  }

  getUserById(id: number): Observable<User> {
    const url = `${apiUrl}/${id}`;
    this.montarHeaderToken();
    return this.http.get<User>(
      url, httpOptions
    ).pipe(
      tap((User: User) => console.log('user received successfully')),
      catchError(this.handleError<User>('getUser'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}