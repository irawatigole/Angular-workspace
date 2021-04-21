import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LoginService } from './login.service';
import { CookieService } from '../../../../projects/my-lib/src/lib/cookie.service';
import { queryStringToObject } from '../../../../projects/my-lib/src/lib/helper/basic';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  copyright: any;
  loginState = 1;
  errorMessage!: string;
  returnUrl!: string;
  declare permission: Permissions;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private titleService: Title,
    private cookieService: CookieService) { }

  ngOnInit(): void {

    this.titleService.setTitle('Imagination Unwired');
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/content/manage';
    if (localStorage.getItem('iup')) {
      this.router.navigate([this.returnUrl]);
    }
    if (localStorage.getItem('iupp')) {
      this.loginState = 2;
    }
    const d = new Date();
    this.copyright = d.getFullYear();
  }

  login(): void {
    this.loading = true;
    this.loginService.login(this.model.username, this.model.password)
      .subscribe(
        res => {
          if (res.data && res.data.token) {
            const token = res.data.token;
            this.cookieService.setCookie('t', token);

            const data = res.data;
            delete data.token;
            delete data.user.token;
            localStorage.setItem('iupp', JSON.stringify(data));

            if (res.data.user.organizations.length === 1) {
              this.setOrganisation(res.data.user.organizations[0]);
            } else {
              this.loginState = 2;
            }
          }
        },
        errors => {
          this.loading = false;
        });
  }

  setOrganisation(organization): void {
    this.loginService.selectOrganisation(organization.id)
      .subscribe(
        (res) => {
          this.loginService.setUserOrganisationOnSession(res, organization);
          this.getPermission();
        },
      );
  }

  getPermission(): void {
    this.loginService.getPermission().subscribe((res) => {

      const permissions = {};
      res.permissions.forEach((data: any, index: number) => {
        permissions[data] = index;
      });

      this.loginService.setUserPermissionOnSession(permissions);
      if (this.returnUrl.lastIndexOf('?') !== -1) {
        const queryParams = {
          queryParams: queryStringToObject(this.returnUrl.substring(this.returnUrl.lastIndexOf('?')))
        };
        this.router.navigate([this.returnUrl.substring(0, this.returnUrl.lastIndexOf('?'))], queryParams);
      } else {
        this.router.navigate([this.returnUrl]);
      }
    });
  }
}
