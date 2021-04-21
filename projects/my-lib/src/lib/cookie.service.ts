import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor() { }
  getCookie(name: string): string {
    const cname = name + '=';
    const cookieList = document.cookie.split(';');
    for (let cookieString of cookieList) {
      while (cookieString.charAt(0) === ' ') {
        cookieString = cookieString.substring(1);
      }
      if (cookieString.indexOf(cname) === 0) {
        return cookieString.substring(cname.length, cookieString.length);
      }
    }
    return '';
  }

  setCookie(name: string, value: string): void {
    const time = new Date();
    time.setTime(time.getTime() + 8 * 3600 * 1000);
    document.cookie = name + '=' + value + '; expires=' + time.toUTCString() + '; path=/;';
  }

  removeCookie(name: string): void {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - 1);
    document.cookie = name + '=; expires=' + dateObj + ';';
  }
}
