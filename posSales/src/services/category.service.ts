import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Category } from '../entities/category';
import { Product } from '../entities/product';

const apiUrl = 'https://localhost:44373/api/Categories';
var httpOptions = {
  headers: new HttpHeaders({
  'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<HttpResponse<Category[]>> {
    
    return this.http.get<HttpResponse<Category[]>>(
      apiUrl,
      { headers: httpOptions.headers, observe: 'response' }
    ).pipe(
      tap((data: any) => console.log('category received successfully')),
      catchError(this.handleError<HttpResponse<Category[]>>('getCategories'))
    );
  }

  getProductsByCategoryId(categoryId: number): Observable<HttpResponse<Product[]>> {
      const url = apiUrl + '/' + categoryId + '/products';
      return this.http.get<Product[]>(
        url, 
        { headers: httpOptions.headers, observe: 'response' }
      ).pipe(
        tap((data: any) => console.log(`product of categoryId = ${categoryId} received successfully`)),
        catchError(this.handleError<HttpResponse<Product[]>>('getProductByCategoryId id=' + categoryId))
      );
  }

  getCategory(id: number): Observable<HttpResponse<Category>> {
    const url = apiUrl + '/' + id;
    return this.http.get<HttpResponse<Category>>(
      url, 
      { headers: httpOptions.headers, observe: 'response' }
    ).pipe(
      tap((Product: any) => console.log('category received successfully')),
      catchError(this.handleError<HttpResponse<Category>>('getCategory id=' + id))
    );
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
  
}