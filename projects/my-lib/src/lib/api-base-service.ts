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
    headers.append(
      'token',
      this.cookieService.getCookie('t')
      // JSON.parse(localStorage.getItem('iup'))['data']['token']
    );
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

  postFile(uriPath: string, data: any, headers: HttpHeaders | null = null): Observable<any> {
    // if (this.isSessionExpired()) {
    //   this.logoutSession();
    //   return Observable.throw(this.createExpiryResponse());
    // } else {
    if (headers == null) {
      headers = this.getHttpFileHeaders();
    } else if (!headers.has('token')) {
      headers = this.setHttpFileSessionToken(headers);
    }

    const req = new HttpRequest('POST', this.buildApiURL(uriPath), data, {
      headers,
      reportProgress: true
    });

    return this.httpClient.request(req).pipe(map(event => {
      return event;
    }), catchError((error: HttpErrorResponse) => {
      return of(error);
    }));
    // }
  }

  private getHttpFileHeaders(): HttpHeaders {
    return this.setHttpFileSessionToken(new HttpHeaders({ 'Content-Type': 'application/json', encoding: 'binary' }));
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

  private setHttpFileSessionToken(headers: HttpHeaders): HttpHeaders {
    if (localStorage.getItem('iup') && this.cookieService.getCookie('t') !== null) {
      headers.append(
        'token',
        this.cookieService.getCookie('t')
        // JSON.parse(localStorage.getItem('iup'))['data']['token']
      );
    }
    return headers;
  }

  private setSessionToken(headers: HttpHeaders): HttpHeaders {
    if (localStorage.getItem('iup') && this.cookieService.getCookie('t') !== null) {
      headers.append(
        'token',
        this.cookieService.getCookie('t')
        // JSON.parse(localStorage.getItem('iup'))['data']['token']
      );
    }
    return headers;
  }
}
