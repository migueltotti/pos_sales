import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { WorkDay } from '../entities/workDay';

const apiUrl = 'https://localhost:44373/api/WorkDays';
var httpOptions = {
  headers: new HttpHeaders({
  'Content-Type': 'application/json'
  })
};
var token: string | null;

@Injectable({
  providedIn: 'root'
})
export class WorkDayService {

  constructor(private http: HttpClient) { }
  
  montarHeaderToken() {
    token = sessionStorage.getItem("jwt");
    //console.log('jwt header token ' + token)
    httpOptions = {headers: new HttpHeaders({"Authorization" : "Bearer " + token, "Content-Type": "application/json"})}
  }

  getWorkDayById(workDayId: number): Observable<HttpResponse<WorkDay>>{
    this.montarHeaderToken();

    const url = `${apiUrl}/${workDayId}`;

    return this.http.get<WorkDay>(
      url,
      { headers: httpOptions.headers, observe: 'response'}
    ).pipe(
      tap(() => console.log('WorkDay received successfully')),
      catchError(this.handleError<HttpResponse<WorkDay>>('getWorkDayById'))
    )
  }

  getWorkDayByDate(date: string): Observable<HttpResponse<WorkDay>>{
    this.montarHeaderToken();

    const [day, month, year] = date.split('/').map(Number);
    const localDate = new Date(year, month - 1, day); // Mês no Date começa do 0 (Janeiro = 0)
    //const isoDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();

    const url = `${apiUrl}/Date?date=${date}`;

    return this.http.get<WorkDay>(
      url,
      { headers: httpOptions.headers, observe: 'response'}
    ).pipe(
      tap(() => console.log('WorkDay received successfully')),
      catchError(this.handleError<HttpResponse<WorkDay>>('getWorkDayByDate'))
    )
  }

  startWokDay(employeeId: string): Observable<HttpResponse<WorkDay>>{
    this.montarHeaderToken();

    const url = `${apiUrl}/StartWorkDay?employeeId=${employeeId}`;

    var startDay = { employeeId: employeeId }

    return this.http.post<WorkDay>(
      url,
      startDay,
      { headers: httpOptions.headers, observe: 'response' }
    ).pipe(
      tap((wd: HttpResponse<WorkDay>) => {
        console.log('WorkDay started successfully')
        this.setWorkDayIdInStorage(wd.body?.workDayId!);
      }),
      catchError(this.handleError<HttpResponse<WorkDay>>('startWokDay'))
    )
  }

  finishWokDay(workDayId: string): Observable<HttpResponse<WorkDay>>{
    this.montarHeaderToken();

    const url = `${apiUrl}/FinishWorkDay/${workDayId}`;

    return this.http.post(
      url,
      { headers: httpOptions.headers, observe: 'response' }
    ).pipe(
      tap((wd: any) => console.log('WorkDay finished successfully')),
      catchError(this.handleError<HttpResponse<WorkDay>>('finishWokDay'))
    )
  }
  
  getWorkDayIdIFromStorage(workDayId: number) : number{
    return parseInt(sessionStorage.getItem('workDayId')!, 10)
  }

  setWorkDayIdInStorage(workDayId: number){
    sessionStorage.setItem('workDayId', workDayId.toString());
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}
