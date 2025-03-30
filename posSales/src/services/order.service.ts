import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { QueryStringParameters } from '../entities/queryStringParameters';
import { OrderInput } from '../entities/orderInput';
import { OrderOutput } from '../entities/orderOutput';
import { NumberOfOrderByDate } from '../entities/numberOfOrderByDate';
import { OrderReport } from '../entities/orderReport';

const apiUrl = 'https://localhost:44373/api/Orders';
var httpOptions = {
  headers: new HttpHeaders({
  'Content-Type': 'application/json'
  })
};
var token: string | null;

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  montarHeaderToken() {
    token = sessionStorage.getItem("jwt");
    //console.log('jwt header token ' + token)
    httpOptions = {headers: new HttpHeaders({"Authorization" : "Bearer " + token, "Content-Type": "application/json"})}
  }

  getAllOrdersByDateTimeNow(pageSize: number, status: string): Observable<HttpResponse<OrderOutput[]>> {
    this.montarHeaderToken();

    var url = `${apiUrl}/Products/DateTimeNow?PageSize=${pageSize}&Status=${status}`;

    return this.http.get<OrderOutput[]>(
      url,
      {headers: httpOptions.headers, observe: 'response'}
    ).pipe(
      tap(Products => console.log('orders received successfully')),
      catchError(this.handleError<HttpResponse<OrderOutput[]>>('getAllOrdersByDateTimeNow'))
    );
  }

  getOrdersByDate(pageSize: number, date: string): Observable<HttpResponse<OrderOutput[]>> {
    this.montarHeaderToken();
    var url = `${apiUrl}/Date?From=${date}&To=${date}&PageSize=${pageSize}`;

    return this.http.get<OrderOutput[]>(
      url,
      {headers: httpOptions.headers, observe: 'response'}
    ).pipe(
      tap(Products => console.log('orders by date received successfully')),
      catchError(this.handleError<HttpResponse<OrderOutput[]>>('getOrdersByDate'))
    );
  }

  getNumberOfOrdersFromTodayToLast8Weeks(): Observable<HttpResponse<NumberOfOrderByDate[]>> {
    this.montarHeaderToken();

    var url = `${apiUrl}/NumberOfOrdersBySundays?Since=${8}`

    return this.http.get<NumberOfOrderByDate[]>(
      url,
      {headers: httpOptions.headers, observe: 'response'}
    ).pipe(
      tap(Products => console.log('number of orders received successfully')),
      catchError(this.handleError<HttpResponse<NumberOfOrderByDate[]>>('getNumberOfOrdersFromTodayToLast8Weeks'))
    );
  }

  getOrdersReportByDate(date: string): Observable<HttpResponse<OrderReport>> {
    this.montarHeaderToken();

    var url = `${apiUrl}/ReportByDate?Date=${date}&PageSize=50`

    return this.http.get<OrderReport>(
      url,
      {headers: httpOptions.headers, observe: 'response'}
    ).pipe(
      tap((res) => console.log('order report received successfully')),
      catchError(this.handleError<HttpResponse<OrderReport>>('getOrdersReportByDate'))
    );
  }

  postOrder(order: OrderInput): Observable<HttpResponse<OrderOutput>> {
    this.montarHeaderToken();

    var urlSentOrder = apiUrl + '/sent/';

    return this.http.post(
      apiUrl,
      order,
      {headers: httpOptions.headers, observe: 'response'}
    ).pipe(
      tap((order: any) => console.log('Order created successfully')),
        switchMap((order: HttpResponse<OrderOutput>) => this.http.post(
          urlSentOrder + order.body?.orderId,
          {},
          httpOptions
        )), // Chama o segundo endpoint após o primeiro completar
        tap((any: any) => console.log('Order sent successfully')),
      catchError(this.handleError<HttpResponse<OrderOutput>>('createOrder'))
    );
  }

  completeOrder(orderId: number): Observable<HttpResponse<any>> {
    this.montarHeaderToken();

    var urlFinishOrder = apiUrl + '/finish/' + orderId;

    return this.http.post(
      urlFinishOrder,
      {},
      {headers: httpOptions.headers, observe: 'response'}
    ).pipe(
      tap((res) => console.log('Order finished successfully', res)),
      catchError(this.handleError<HttpResponse<OrderOutput>>('completeOrder'))
    );
  }

  updateOrder(id: number, order: OrderInput): Observable<HttpResponse<any>> {
    const url = apiUrl + '/' + id;

    this.montarHeaderToken();

    return this.http.put<OrderOutput>(
      url, order, {headers: httpOptions.headers, observe: 'response'}
    ).pipe(
      tap((res) => console.log('order edited successfully with id=' + res.body!.orderId)),
      catchError(this.handleError<HttpResponse<OrderOutput>>('updateOrder'))
    );
  }

  deleteOrder(id: number): Observable<HttpResponse<any>> {
    const url = apiUrl + '/' + id;
    
    this.montarHeaderToken();

    return this.http.delete<OrderOutput>(
      url, {headers: httpOptions.headers, observe: 'response'}
    ).pipe(
      tap(_ => console.log('order deleted successfully with id=' + id)),
      catchError(this.handleError<HttpResponse<OrderOutput>>('deleteOrder'))
    );
  }

  toOrder(form: FormGroup<any>) : OrderInput{
    console.log('Dentro do toOrder');
    console.log(form.value);

    const order = new OrderInput(
      parseFloat(form.get('totalValue')?.value),
      form.get('orderDate')?.value,
      parseInt(form.get('orderStatus')?.value, 10),
      form.get('holder')?.value,
      form.get('note')?.value,
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