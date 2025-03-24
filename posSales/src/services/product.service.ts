import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Product } from '../entities/product';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NumberOfProduct } from '../entities/numberOfProduct ';

const apiUrl = 'https://localhost:44373/api/Products';
var httpOptions = {headers: new HttpHeaders({
  "Content-Type": "application/json"
})};

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(
    httpOp: {headers: HttpHeaders} = httpOptions,
    apiPagUrl: string | null = null) : Observable<Product[]> 
  {

    if(apiPagUrl == null){
      apiPagUrl = apiUrl;
    }

    return this.http.get<Product[]>(
      apiPagUrl,
      httpOp
    ).pipe(
      tap(Products => console.log('products received successfully')),
      catchError(err => {
        console.log(err);
        return throwError(err);
      })
    );
  }

  getProduct(id: number): Observable<Product> {
    const url = apiUrl + '/' + id;
    return this.http.get<Product>(
      url, httpOptions
    ).pipe(
      tap((Product: Product) => console.log('product received successfully')),
      catchError(this.handleError<Product>('getProduct id=' + id))
    );
  }

  getProductsByName(productName: string) : Observable<Product[]>{
    const url = apiUrl + '/name' + '?Name=' + productName;

    return this.http.get<Product[]>(
      url, httpOptions
    ).pipe(
      tap(() => console.log('products by name received successfully')),
      catchError(this.handleError<Product[]>('getProductByName  name=' + productName))
    );
  }

  get5BestSellingProducts(): Observable<NumberOfProduct[]>{

    var url = apiUrl + '/ProductsBestSellingCount?Months_Count=2'

    return this.http.get<NumberOfProduct[]>(
      url,
      httpOptions
    ).pipe(
      tap(Products => console.log('number of best selling products received successfully')),
      catchError(this.handleError('get5BestSellingProducts', []))
    );
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}
