import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpRequest, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ApiBaseService } from '../../../../projects/my-lib/src/lib/api-base-service';
// import { getErrorMessage } from '../../../../projects/my-lib/src/lib/helper/basic';
import { CookieService } from '../../../../projects/my-lib/src/lib/cookie.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private apiService: ApiBaseService, private router: Router, private cookieService: CookieService
  ) { }

  login(email: string, password: string): Observable<any> {
    const postData = { email, password };
    return this.apiService.post('auth/sessions', postData);
  }

  getOrgList(): Observable<any> {
    const headers = new HttpHeaders();

    if (localStorage.getItem('iupp')) {
      const session = JSON.parse(localStorage.getItem('iupp') || '{}');
      // headers.append('token', session['token']);
      headers.append('token', this.cookieService.getCookie('t'));
    }
    if (localStorage.getItem('iup')) {
      const session = JSON.parse(localStorage.getItem('iup') || '{}');
      // headers.append('token', session['data']['token']);
      headers.append('token', this.cookieService.getCookie('t'));
    }

    return this.apiService.get('auth/sessions/organizations/v2', headers);
    // let orgList;
    // if (localStorage.getItem("iupp") && JSON.parse(localStorage.getItem("iupp"))['token']) {
    //     orgList = JSON.parse(localStorage.getItem("iupp"))['user']['organizations'];
    // }

    // return orgList;
  }

  getAllOrgList(): Observable<any> {
    const headers = new HttpHeaders();
    if (localStorage.getItem('iupp')) {
      const session = JSON.parse(localStorage.getItem('iupp') || '{}');
      headers.append('token', this.cookieService.getCookie('t'));
    }

    if (localStorage.getItem('iup')) {
      const session = JSON.parse(localStorage.getItem('iup') || '{}');
      headers.append('token', this.cookieService.getCookie('t'));
    }

    return this.apiService.get('organizations', headers);
  }

  selectOrganisation(orgId: string): Observable<any> {
    const postData = { orgId };
    const headers = new HttpHeaders();

    if (localStorage.getItem('iupp') && this.cookieService.getCookie('t') !== null) {
      headers.append(
        'token',
        // JSON.parse(localStorage.getItem('iupp'))['token']
        this.cookieService.getCookie('t')
      );
    }

    if (localStorage.getItem('iupp') === null) {
      headers.append(
        'token',
        // JSON.parse(localStorage.getItem('iup')).data.token
        this.cookieService.getCookie('t')
      );
    }

    return this.apiService.put(
      'auth/sessions/organizations/v2/' + orgId,
      postData,
      headers
    );
  }

  setUserOrganisationOnSession(sessionResponse, selectedOrganization): void {
    const userDataWithoutParsing = localStorage.getItem('iupp');
    let userData = userDataWithoutParsing !== null ? JSON.parse(userDataWithoutParsing)
      : null;

    if (userData === null) {
      const dataWithoutParsing = localStorage.getItem('iup');
      userData = dataWithoutParsing !== null ? JSON.parse(dataWithoutParsing).data : null;
    }
    // delete selectedOrganization.roles.access;
    const organizationSelectedSurveyEnabledValue = selectedOrganization.enableSurvey;
    const organizationSelectedNoOfQuestionsValue = selectedOrganization.noOfQuestions;
    delete selectedOrganization.enableSurvey;
    delete selectedOrganization.noOfQuestions;

    const sessionData = {
      data: {
        user: userData.user,
        // token: this.cookieService.getCookie(),
        organization: selectedOrganization,
        permissions: null
      }
    };
    const token = sessionResponse.data.token;
    this.cookieService.setCookie('t', token);
    localStorage.setItem('iup', JSON.stringify(sessionData));
    localStorage.setItem('surveyEnabled', String(organizationSelectedSurveyEnabledValue));
    localStorage.setItem('noOfQuestions', String(organizationSelectedNoOfQuestionsValue));
    localStorage.removeItem('iupp');
  }

  logout(): void {
    this.apiService.delete('auth/sessions')
      .subscribe((res) => {
        localStorage.removeItem('iup');
        localStorage.removeItem('surveyEnabled');
        localStorage.removeItem('noOfQuestions');
        this.cookieService.removeCookie('t');
        this.router.navigate(['/login']);
      }, (errors) => {
        // console.log(getErrorMessage(errors));
      });
  }

  getPermission(): Observable<any> {
    const headers = new HttpHeaders();
    if (localStorage.getItem('iupp')) {
      const session = JSON.parse(localStorage.getItem('iupp') || '{}');
      headers.append('token', this.cookieService.getCookie('t'));
    }

    if (localStorage.getItem('iup')) {
      const session = JSON.parse(localStorage.getItem('iup') || '{}');
      headers.append('token', this.cookieService.getCookie('t'));
    }

    return this.apiService.get('auth/session/permissions', headers);
  }

  setUserPermissionOnSession(permission): void {
    const sessionData = JSON.parse(localStorage.getItem('iup') || '{}');
    sessionData.data.permissions = permission;

    localStorage.setItem('iup', JSON.stringify(sessionData));
    localStorage.removeItem('iupp');
  }
}
