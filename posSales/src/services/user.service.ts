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
    //console.log('jwt header token ' + token)
    httpOptions = {headers: new HttpHeaders({"Authorization" : "Bearer " + token, "Content-Type": "application/json"})}
  }

  getUserByEmail(email: string): Observable<HttpResponse<User>> {
    const url = `${apiUrl}/email/${email}`;
    this.montarHeaderToken();
    
    return this.http.get<HttpResponse<User>>(
      url,
      { headers: httpOptions.headers, observe: 'response' }
    ).pipe(
      tap((user: any) => {
        console.log('user received successfully')
      }),
      catchError(this.handleError<HttpResponse<User>>('getUser'))
    );
  }

  getUserById(id: number): Observable<HttpResponse<User>> {
    const url = `${apiUrl}/${id}`;
    this.montarHeaderToken();

    return this.http.get<HttpResponse<User>>(
      url,
      { headers: httpOptions.headers, observe: 'response' }
    ).pipe(
      tap((User: any) => console.log('user received successfully')),
      catchError(this.handleError<HttpResponse<User>>('getUser'))
    );
  }

  getAllUsers(): Observable<HttpResponse<User[]>> {
    const url = `${apiUrl}/getUsers?PageNumber=${1}&PageSize=${50}` 

    this.montarHeaderToken();

    return this.http.get<HttpResponse<User[]>>(
      url,
      { headers: httpOptions.headers, observe: 'response' }
    ).pipe(
      tap((User: any) => console.log('users received successfully')),
      catchError(this.handleError<HttpResponse<User[]>>('getAllUsers'))
    );
  }

  createUser(user: User): Observable<HttpResponse<User>>{
    this.montarHeaderToken();

    return this.http.post<User>(
      apiUrl,
      user,
      { headers: httpOptions.headers, observe: 'response' }
    ).pipe(
      tap((User: any) => console.log('user created successfully')),
      catchError(err => {
        console.error('Erro capturado no serviço:', err);
        return throwError(() => err);
      })
    )
  }

  updateUser(user: User): Observable<HttpResponse<User>>{
    const url = `${apiUrl}/${user.userId}`

    this.montarHeaderToken();

    return this.http.put<User>(
      url,
      user,
      { headers: httpOptions.headers, observe: 'response' }
    ).pipe(
      tap((User: any) => console.log('user created successfully')),
      catchError(err => {
        console.error('Erro capturado no serviço:', err);
        return throwError(() => err);
      })
    )
  }

  deleteUser(userId: number): Observable<HttpResponse<User>>{
    const url = `${apiUrl}/${userId}`

    this.montarHeaderToken();

    return this.http.delete(
      apiUrl,
      { headers: httpOptions.headers, observe: 'response' }
    ).pipe(
      tap((User: any) => console.log('user created successfully')),
      catchError(this.handleError<HttpResponse<User>>('getUcreateUserser'))
    )
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}