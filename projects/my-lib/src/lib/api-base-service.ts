import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

import { CookieService } from './cookie.service';
import { envConfig } from '../../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ApiBaseService {

  constructor(private httpClient: HttpClient, private cookieService: CookieService) { }

  get(uriPath: string, headers: HttpHeaders | null = null): Observable<any> {
    if (headers == null) {
      headers = this.getHeaders();
    }
    return this.httpClient.get<Observable<any>>(this.buildApiURL(uriPath), { headers }).pipe(
      catchError((error: Response) => throwError(error))
    );
  }

  post(uriPath: string, data: any, headers: HttpHeaders | null = null): Observable<any> {
    if (headers == null) {
      headers = this.getHeaders();
    } else if (!headers.has('token')) {
      headers = this.setSessionToken(headers);
    }

    return this.httpClient.post<Observable<any>>(this.buildApiURL(uriPath), data, { headers }).pipe(
      catchError((error: Response) => throwError(error))
    );
  }

  put(uriPath: string, data: any, headers: HttpHeaders | null = null): Observable<any> {
    if (headers == null) {
      headers = this.getHeaders();
    }

    return this.httpClient.put<Observable<any>>(this.buildApiURL(uriPath), data, { headers }).pipe(
      catchError((error: Response) => throwError(error))
    );
  }

  delete(uriPath: string, headers: HttpHeaders | null = null): Observable<any> {
    if (headers == null) {
      headers = this.getHeaders();
    }

    return this.httpClient.delete<Observable<any>>(this.buildApiURL(uriPath), { headers }).pipe(
      catchError((error: Response) => throwError(error))
    );
  }

  fetch(uriPath: string, headers: HttpHeaders | null = null): Observable<any> {
    if (headers == null) {
      headers = this.getHeaders();
    }

    return this.httpClient.get<Observable<any>>(uriPath, { headers }).pipe(
      catchError((error: Response) => throwError(error))
    );
  }

  private getHeaders(): HttpHeaders {
    return this.setSessionToken(new HttpHeaders({ 'Content-Type': 'application/json' }));
  }

  private buildApiURL(uriPath: string): string {
    return (uriPath.indexOf('http://') !== -1
      || uriPath.indexOf('https://') !== -1
      || uriPath.indexOf('.') === 0
    ) ? uriPath : envConfig.apiDomain + uriPath;
  }

  private setSessionToken(headers: HttpHeaders): HttpHeaders {
    headers.append(
      'token',
      'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1YTI5NTBhMDk5M2M4ZjE1NzBjMjU1MTEiLCJlbWFpbCI6ImFkbWluQGl1LmNvbSIsIm9yZ2FuaXphdGlvbklkIjoiNWEyOTRmODE5OTNjOGYxNTcwYzI1NTBkIiwicm9sZXMiOlt7Im5hbWUiOiJBZG1pbmlzdHJhdG9yIiwiaWQiOiI1OWE5MTJjNTQ2ZTBmYjAwMDE3Y2Y5MWEiLCJzaG9ydF9jb2RlIjoiU0EifV0sImNyZWF0ZWRBdCI6IjE2MTg5OTU3NTc2MTIifQ.ay4-fR66rJUHCBkxY4_Y_bDMUZyENvVCs4wkCT409hbcgjkWC4zEVX_wnfIquInvePXklKwyVT3skmcv4dxNgA'
      // JSON.parse(localStorage.getItem('iup'))['data']['token']
    );
    return headers;
  }
}
