import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Product } from '../entities/product';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
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
    apiPagUrl: string | null = null) : Observable<HttpResponse<Product[]>> 
  {

    if(apiPagUrl == null){
      apiPagUrl = apiUrl;
    }

    return this.http.get<HttpResponse<Product[]>>(
      apiPagUrl,
      { headers: httpOptions.headers, observe: 'response' }
    ).pipe(
      tap((Products: any) => console.log('products received successfully')),
      catchError(this.handleError<HttpResponse<Product[]>>('getProducts'))
    );
  }

  getProduct(id: number): Observable<HttpResponse<Product[]>> {
    const url = apiUrl + '/' + id;
    return this.http.get<HttpResponse<Product[]>>(
      url, 
      { headers: httpOptions.headers, observe: 'response' }
    ).pipe(
      tap((Product: any) => console.log('product received successfully')),
      catchError(this.handleError<HttpResponse<Product[]>>('getProduct id=' + id))
    );
  }

  getProductsByName(productName: string) : Observable<HttpResponse<Product[]>>{
    const url = apiUrl + '/name' + '?Name=' + productName;

    return this.http.get<HttpResponse<Product[]>>(
      url, 
      { headers: httpOptions.headers, observe: 'response' }
    ).pipe(
      tap((data: any) => console.log('products by name received successfully')),
      catchError(this.handleError<HttpResponse<Product[]>>('getProductByName  name=' + productName))
    );
  }

  get5BestSellingProducts(): Observable<HttpResponse<NumberOfProduct[]>>{

    var url = apiUrl + '/ProductsBestSellingCount?Months_Count=2'

    return this.http.get<HttpResponse<NumberOfProduct[]>>(
      url, 
      { headers: httpOptions.headers, observe: 'response' }
    ).pipe(
      tap((data: any) => console.log('number of best selling products received successfully')),
      catchError(this.handleError<HttpResponse<NumberOfProduct[]>>('get5BestSellingProducts'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}
