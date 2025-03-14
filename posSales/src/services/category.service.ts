import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Category } from '../entities/category';
import { Product } from '../entities/product';

const apiUrl = 'https://localhost:44373/api/Categories';
var httpOptions = {headers: new HttpHeaders({
  "Content-Type": "application/json"
})};

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    console.log(httpOptions.headers);
    return this.http.get<Category[]>(
      apiUrl,
      httpOptions
    ).pipe(
      tap(Products => console.log('category received successfully')),
      catchError(this.handleError('getCategories', []))
    );
  }

  getProductsByCategoryId(categoryId: number): Observable<Product[]> {
      const url = apiUrl + '/' + categoryId + '/products';
      return this.http.get<Product[]>(
        url, httpOptions
      ).pipe(
        tap(() => console.log(`product of categoryId = ${categoryId} received successfully`)),
        catchError(this.handleError<Product[]>('getProductByCategoryId id=' + categoryId))
      );
  }

  getCategory(id: number): Observable<Category> {
    const url = apiUrl + '/' + id;
    return this.http.get<Category>(
      url, httpOptions
    ).pipe(
      tap((Product: Category) => console.log('category received successfully')),
      catchError(this.handleError<Category>('getCategory id=' + id))
    );
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
  
}