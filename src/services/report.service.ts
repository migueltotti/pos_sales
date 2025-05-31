import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReportType } from '../entities/reportType';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../environments/environment';

const apiUrl = `${environment.apiUrl}/Orders`;
var httpOptions = {
  headers: new HttpHeaders({
  'Content-Type': 'application/json'
  })
};
var token: string | null;

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  montarHeaderToken() {
    token = sessionStorage.getItem("jwt");
    //console.log('jwt header token ' + token)
    httpOptions = {headers: new HttpHeaders({"Authorization" : "Bearer " + token, "Content-Type": "application/json"})}
  }

  sendReportTo(reportDate: string, emailDest: string, type: ReportType) : Observable<HttpResponse<object>>{
    const url = `${apiUrl}/GenerateReport/${reportDate}?reportType=${type}&destination=${emailDest}`;

    this.montarHeaderToken();

    return this.http.post(
      url,
      {headers: httpOptions.headers, observe: 'response'}
    ).pipe(
      tap((report: any) => console.log('Order Report created successfully')),
      catchError(err => {
        console.error('Erro capturado no serviço:', err);
        return throwError(() => err);
      })
    );
  }
}
