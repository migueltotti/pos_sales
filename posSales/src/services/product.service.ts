import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Product } from '../entities/product';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { NumberOfProduct } from '../entities/numberOfProduct ';

const apiUrl = 'https://localhost:44373/api/Products';
var httpOptions = {headers: new HttpHeaders({
  "Content-Type": "application/json"
})};
var token: string | null;

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  constructor(private http: HttpClient) { }

  montarHeaderToken() {
    token = sessionStorage.getItem("jwt");
    //console.log('jwt header token ' + token)
    httpOptions = {headers: new HttpHeaders({"Authorization" : "Bearer " + token, "Content-Type": "application/json"})}
  }

  getProducts(
    httpOp: {headers: HttpHeaders} = httpOptions,
    apiPagUrl: string | null = null) : Observable<HttpResponse<Product[]>> 
  {

    if(apiPagUrl == null){
      apiPagUrl = `${apiUrl}?PageSize=50`;
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
    const url = `${apiUrl}/name?Name=${productName}&PageSize=50`;
    console.log(url);

    return this.http.get<HttpResponse<Product[]>>(
      url, 
      { headers: httpOptions.headers, observe: 'response' }
    ).pipe(
      tap((data: any) => console.log('products by name received successfully')),
      catchError(this.handleError<HttpResponse<Product[]>>('getProductByName  name=' + productName))
    );
  }

  get5BestSellingProducts(months_count: number): Observable<HttpResponse<NumberOfProduct[]>>{

    var url = `${apiUrl}/ProductsBestSellingCount?Months_Count=${months_count}`

    return this.http.get<HttpResponse<NumberOfProduct[]>>(
      url, 
      { headers: httpOptions.headers, observe: 'response' }
    ).pipe(
      tap((data: any) => console.log('number of best selling products received successfully')),
      catchError(this.handleError<HttpResponse<NumberOfProduct[]>>('get5BestSellingProducts'))
    );
  }

  createProduct(product: Product): Observable<HttpResponse<Product>> {
    const url = apiUrl;

    this.montarHeaderToken();

    return this.http.post(
      url, 
      product, 
      { headers: httpOptions.headers, observe: 'response' }
    ).pipe(
      tap((data: HttpResponse<any>) => console.log('product edited successfully with id=' + product.productId)),
      catchError(this.handleError<HttpResponse<Product>>('updateProduct'))
    );
  }

  updateProduct(id: number, product: Product): Observable<HttpResponse<any>> {
    const url = apiUrl + '/' + id;

    this.montarHeaderToken();

    return this.http.put(
      url, 
      product, 
      { headers: httpOptions.headers, observe: 'response' }
    ).pipe(
      tap((data) => console.log('product edited successfully with id=' + product.productId)),
      catchError(this.handleError<HttpResponse<any>>('updateProduct'))
    );
  }

  deleteProduct(id: number): Observable<HttpResponse<any>> {
    const url = apiUrl + '/' + id;

    this.montarHeaderToken();

    return this.http.delete(
      url,
      { headers: httpOptions.headers, observe: 'response' }
    ).pipe(
      tap((data) => console.log('product deleted successfully with id=' + id)),
      catchError(this.handleError<HttpResponse<any>>('deleteProdutc'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}
