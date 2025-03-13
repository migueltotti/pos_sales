import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { QueryStringParameters } from '../entities/queryStringParameters';
import { OrderInput } from '../entities/orderInput';
import { OrderOutput } from '../entities/orderOutput';

const apiUrl = 'https://localhost:44373/api/Orders';
var httpOptions = {headers: new HttpHeaders({
  "Content-Type": "application/json"
})};
var token: string | null;


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  montarHeaderToken() {
    token = sessionStorage.getItem("jwt");
    console.log('jwt header token ' + token)
    httpOptions = {headers: new HttpHeaders({"Authorization" : "Bearer " + token, "Content-Type": "application/json"})}
  }

  getAllOrdersByDateTimeNow(pageSize: number, status: string): Observable<OrderOutput[]> {
    this.montarHeaderToken();

    var url = apiUrl + '/Products/DateTimeNow?PageSize=' + pageSize + '&Status=' + status;

    return this.http.get<OrderOutput[]>(
      url,
      httpOptions
    ).pipe(
      tap(Products => console.log('orders received successfully')),
      catchError(this.handleError('getAllOrdersByDateTimeNow', []))
    );
  }

  postOrder(order: OrderInput): Observable<OrderOutput> {
    this.montarHeaderToken();

    return this.http.post<OrderOutput>(
      apiUrl, order, httpOptions
    ).pipe(
      tap((Order: any) => console.log('order added successfully')),
      catchError(this.handleError<OrderOutput>('addOrder'))
    );
  }

  completeOrder(orderId: number): Observable<any> {
    this.montarHeaderToken();

    var urlSentOrder = apiUrl + '/sent/' + orderId;
    var urlFinishOrder = apiUrl + '/finish/' + orderId;

    return this.http.post(urlSentOrder, httpOptions).pipe(
      tap(() => console.log('Order sent successfully')),
        switchMap(() => this.http.post(urlFinishOrder, httpOptions)), // Chama o segundo endpoint após o primeiro completar
        tap(() => console.log('Order finished successfully')),
      catchError(this.handleError<any>('completeOrder'))
    );
  }

  updateOrder(id: number, order: OrderInput): Observable<any> {
    const url = apiUrl + '/' + id;

    this.montarHeaderToken();

    return this.http.put<OrderOutput>(
      url, order, httpOptions
    ).pipe(
      tap((Order: OrderOutput) => console.log('order edited successfully with id=' + Order.orderId)),
      catchError(this.handleError<OrderOutput>('updateOrder'))
    );
  }

  deleteOrder(id: number): Observable<any> {
    const url = apiUrl + '/' + id;
    
    this.montarHeaderToken();

    return this.http.delete<OrderOutput>(
      url, httpOptions
    ).pipe(
      tap(_ => console.log('order deleted successfully with id=' + id)),
      catchError(this.handleError<OrderOutput>('deleteOrder'))
    );
  }

  toOrder(form: FormGroup<any>) : OrderInput{
    console.log('Dentro do toOrder');
    console.log(form.value);

    const order = new OrderInput(
      parseInt(form.get('orderId')?.value, 10),
      parseFloat(form.get('totalValue')?.value),
      form.get('orderDate')?.value,
      parseInt(form.get('orderStatus')?.value, 10),
      form.get('holder')?.value,
      form.get('note')?.value,
      parseInt(form.get('userId')?.value, 10),
      form.get('products')?.value
    );

    return order;
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}