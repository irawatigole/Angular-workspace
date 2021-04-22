import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { OrgFilterPipe } from '../../../../projects/my-lib/src/lib/helper/org-filter.pipe';
import { smoothlyMenu } from '../../app.helper';
import { LoginService } from '../../../../src/app/auth/login/login.service';
import { timeZonesDetails } from '../../../../projects/my-lib/src/lib/helper/time-zone';
import { getErrorMessage } from '../../../../projects/my-lib/src/lib/helper/errors';
declare var jQuery: any;

@Component({
  selector: 'app-topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.sass'],
  providers: [LoginService, OrgFilterPipe]
})
export class TopnavbarComponent implements OnInit {
  currentDate!: string;
  currentTimeZoneAbbr!: string;
  activeRoute = '';
  currentOrg: any;
  orgList: any;
  searchText!: string;
  currentUser: any;
  clockInterval: any;
  constructor(
    private router: Router,
    private loginService: LoginService,
    private orgFilter: OrgFilterPipe
  ) {
    this.searchText = '';
    this.currentOrg = JSON.parse(localStorage.getItem('iup') || '{}')?.data?.organization;
    this.currentUser = JSON.parse(localStorage.getItem('iup') || '{}')?.data?.user;
    this.orgList = JSON.parse(localStorage.getItem('iup') || '{}')?.data?.user?.organizations;
    this.setTimezoneAbbr(this.currentOrg?.timeZone);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = this.router.url.slice(1);
        if (this.activeRoute.lastIndexOf('?') !== -1) {
          this.activeRoute = this.activeRoute.substring(0, this.activeRoute.lastIndexOf('?'));
        }
        if (this.activeRoute.indexOf('invite-user;e=') === 0) {
          this.activeRoute = 'invite-user;e=';
        } else if (this.activeRoute.indexOf('campaign/edit') === 0) {
          this.activeRoute = 'campaign/edit';
        } else if (this.activeRoute.indexOf('organization/edit') === 0) {
          this.activeRoute = 'organization/edit';
        }
      }
    });
  }

  ngOnInit(): void {
    this.clockInterval = setInterval(() => {
      this.currentDate = (new Date()).toLocaleString(
        'en-US',
        {
          timeZone: this.currentOrg?.timeZone,
          day: 'numeric', year: 'numeric', month: 'short',
          hour: 'numeric', minute: 'numeric', hour12: true
        }
      );
    }, 1000);

    jQuery('div.fadeMe').click((event: any) => {
      event.preventDefault();
      this.closeNav();
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.clockInterval);
  }

  toggleNavigation(): void {
    jQuery('body').toggleClass('mini-navbar');
    // jQuery('#navbar').toggleClass("custom-nav-top");
    smoothlyMenu();
  }

  logout(): void {
    document.getElementById('mySidenav')!.style.width = '0';
    document.getElementsByClassName('fadeMe')[0].children[0].classList.toggle('hide');
    this.loginService.logout();
  }

  changeLanguage(selectedLanguage: string): void {
    (document as { [key: string]: any }).locale = selectedLanguage;
  }

  changeSessionByOrg(organization): void {
    document.getElementById('mySidenav')!.style.width = '0';
    document.getElementsByClassName('fadeMe')[0].children[0].classList.toggle('hide');

    this.loginService.selectOrganisation(organization.id)
      .subscribe(
        (res) => {
          this.loginService.setUserOrganisationOnSession(res, organization);
          this.getPermission();
        },
        (error) => console.log(getErrorMessage(error))
      );
  }

  getPermission(): void {
    this.loginService.getPermission()
      .subscribe((res) => {
        const permissions = {};
        res.permissions.forEach((data: any, index: number) => {
          permissions[data] = index;
        });
        this.loginService.setUserPermissionOnSession(permissions);
        window.location.href = '/content/manage';
      },
        (errors) => console.log(errors)
      );
  }

  openNav(): void {
    document.getElementById('mySidenav')!.style.width = '250px';
    document.getElementsByClassName('fadeMe')[0].classList.toggle('hide');
  }

  closeNav(): void {
    document.getElementById('mySidenav')!.style.width = '0';
    document.getElementsByClassName('fadeMe')[0].classList.toggle('hide');
  }

  setTimezoneAbbr(timezone: string): void {
    for (const country of timeZonesDetails) {
      for (const zone of country.zones) {
        if (zone.java_code === timezone) {
          this.currentTimeZoneAbbr = zone.abbr;
          break;
        }
      }
      if (this.currentTimeZoneAbbr !== undefined) {
        break;
      }
    }
  }

}
