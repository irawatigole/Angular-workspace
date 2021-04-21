import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { isMobile } from '../../../projects/my-lib/src/lib/helper/basic';

@Injectable()
export class AuthGuard implements CanActivate {
  permissions: any;

  constructor(private router: Router) {
    console.log('hi')
    this.setPermission();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (localStorage.getItem('iup')) {
      if (this.permissions === null) {
        this.setPermission();
      }
      const hasPermission = this.checkACL(state.url);
      console.log(hasPermission)
      if (! hasPermission) {
        this.router.navigate(['/content/manage']);
        return false;
      } else {
        return hasPermission;
      }
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }

  checkACL(activeURL: string): boolean {
    let hasPermission = false;
    activeURL = (activeURL.indexOf('/invite-user;e=') === -1) ? activeURL : activeURL.slice(0, 15);
    activeURL = (activeURL.indexOf('/campaign/edit/') === -1) ? activeURL : activeURL.slice(0, 15);
    activeURL = (activeURL.indexOf('/organization/edit/') === -1) ? activeURL : activeURL.slice(0, 19);
    switch (activeURL) {
      case '/user/management':
        if ((this.permissions.hasOwnProperty('C_USER'))
          || (this.permissions.hasOwnProperty('R_USER'))
          || (this.permissions.hasOwnProperty('U_USER'))
          || (this.permissions.hasOwnProperty('C_USER_OWN_ORG'))
          || (this.permissions.hasOwnProperty('R_USER_OWN_ORG'))
          || (this.permissions.hasOwnProperty('U_USER_OWN_ORG'))
        ) {
          hasPermission = true;
        }
        break;
      case '/invite-user':
        if ((this.permissions.hasOwnProperty('C_USER'))
          || (this.permissions.hasOwnProperty('C_USER_OWN_ORG'))
        ) {
          hasPermission = true;
        }
        break;
      case '/invite-user;e=':
        if ((this.permissions.hasOwnProperty('U_USER'))
          || (this.permissions.hasOwnProperty('U_USER_OWN_ORG'))
        ) {
          hasPermission = true;
        }
        break;
      case '/campaign/new':
      case '/campaign/objective':
        if (((this.permissions.hasOwnProperty('C_CAMPAIGN'))
          || (this.permissions.hasOwnProperty('C_CAMPAIGN_OWN_ORG')))
          && (isMobile() === false)
        ) {
          hasPermission = true;
        }
        break;
      case '/campaign/edit/':
        if (((this.permissions.hasOwnProperty('U_CAMPAIGN'))
          || (this.permissions.hasOwnProperty('U_CAMPAIGN_OWN_ORG'))
          || (this.permissions.hasOwnProperty('U_CAMPAIGN_OWN')))
          && (isMobile() === false)
        ) {
          hasPermission = true;
        }
        break;
      case '/cluster/manage':
      case '/places/config/manage':
        if ((this.permissions.hasOwnProperty('R_AC'))
          || (this.permissions.hasOwnProperty('R_AC_OWN_ORG'))
        ) {
          hasPermission = true;
        }
        break;
      case '/audience/analysis':
      case '/campaign/analysis':
        if ((this.permissions.hasOwnProperty('R_ANALYTICS'))
          || (this.permissions.hasOwnProperty('R_ANALYTICS_OWN_ORG'))
        ) {
          hasPermission = true;
        }
        break;
      case '/organization/settings':
        if ((this.permissions.hasOwnProperty('U_ORGANIZATION'))
          || (this.permissions.hasOwnProperty('U_ORGANIZATION_OWN_ORG'))
        ) {
          hasPermission = true;
        }
        break;
      case '/organization/manage':
        if (this.permissions.hasOwnProperty('R_ORGANIZATION')) {
          hasPermission = true;
        }
        break;
      case '/organization/edit/':
        if (this.permissions.hasOwnProperty('U_ORGANIZATION')) {
          hasPermission = true;
        }
        break;

      case '/content/manage':
        if ((this.permissions.hasOwnProperty('R_IC'))
          || (this.permissions.hasOwnProperty('R_IC_OWN'))
          || (this.permissions.hasOwnProperty('R_IC_OWN_ORG'))
          || (this.permissions.hasOwnProperty('R_VC'))
          || (this.permissions.hasOwnProperty('R_VC_OWN'))
          || (this.permissions.hasOwnProperty('R_VC_OWN_ORG'))
        ) {
          hasPermission = true;
        }
        break;
      case '/preload/profile':
        if (((this.permissions.hasOwnProperty('C_PRELOAD_PROFILE'))
          || (this.permissions.hasOwnProperty('C_PRELOAD_PROFILE_OWN_ORG'))
          || (this.permissions.hasOwnProperty('R_PRELOAD_PROFILE'))
          || (this.permissions.hasOwnProperty('R_PRELOAD_PROFILE_OWN'))
          || (this.permissions.hasOwnProperty('R_PRELOAD_PROFILE_OWN_ORG')))

          && ((this.permissions.hasOwnProperty('R_PRELOAD_CHANNEL'))
            || (this.permissions.hasOwnProperty('R_PRELOAD_CHANNEL_OWN'))
            || (this.permissions.hasOwnProperty('R_PRELOAD_CHANNEL_OWN_ORG'))
          )

          && ((this.permissions.hasOwnProperty('R_PRELOAD_SUPPORTED_APP'))
            || (this.permissions.hasOwnProperty('R_PRELOAD_SUPPORTED_APP_OWN'))
            || (this.permissions.hasOwnProperty('R_PRELOAD_SUPPORTED_APP_OWN_ORG'))
          )

          && ((this.permissions.hasOwnProperty('R_PRELOAD_SUPPORTED_DEVICE'))
            || (this.permissions.hasOwnProperty('R_PRELOAD_SUPPORTED_DEVICE_OWN'))
            || (this.permissions.hasOwnProperty('R_PRELOAD_SUPPORTED_DEVICE_OWN_ORG'))
          )
        ) {
          hasPermission = true;
        }
        break;
      case '/preload/app':
        if ((this.permissions.hasOwnProperty('C_PRELOAD_SUPPORTED_APP'))
          || (this.permissions.hasOwnProperty('C_PRELOAD_SUPPORTED_APP_OWN_ORG'))
          || (this.permissions.hasOwnProperty('R_PRELOAD_SUPPORTED_APP'))
          || (this.permissions.hasOwnProperty('R_PRELOAD_SUPPORTED_APP_OWN'))
          || (this.permissions.hasOwnProperty('R_PRELOAD_SUPPORTED_APP_OWN_ORG'))
        ) {
          hasPermission = true;
        }
        break;
      case '/preload/device':
        if ((this.permissions.hasOwnProperty('C_PRELOAD_SUPPORTED_DEVICE'))
          || (this.permissions.hasOwnProperty('C_PRELOAD_SUPPORTED_DEVICE_OWN_ORG'))
          || (this.permissions.hasOwnProperty('R_PRELOAD_SUPPORTED_DEVICE'))
          || (this.permissions.hasOwnProperty('R_PRELOAD_SUPPORTED_DEVICE_OWN'))
          || (this.permissions.hasOwnProperty('R_PRELOAD_SUPPORTED_DEVICE_OWN_ORG'))
        ) {
          hasPermission = true;
        }
        break;
      case '/preload/channel':
        if ((this.permissions.hasOwnProperty('C_PRELOAD_CHANNEL'))
          || (this.permissions.hasOwnProperty('C_PRELOAD_CHANNEL_OWN_ORG'))
          || (this.permissions.hasOwnProperty('R_PRELOAD_CHANNEL'))
          || (this.permissions.hasOwnProperty('R_PRELOAD_CHANNEL_OWN'))
          || (this.permissions.hasOwnProperty('R_PRELOAD_CHANNEL_OWN_ORG'))
        ) {
          hasPermission = true;
        }
        break;
      case '/preload/analysis':
        if ((this.permissions.hasOwnProperty('R_PRELOAD_ANALYTICS_OWN'))
          || (this.permissions.hasOwnProperty('R_PRELOAD_ANALYTICS_OWN_ORG'))
        ) {
          hasPermission = true;
        }
        break;
      case '/places/activity-rule/manage':
        if ((this.permissions.hasOwnProperty('R_ILRS'))
          || (this.permissions.hasOwnProperty('R_ILRS_OWN_ORG'))
        ) {
          hasPermission = true;
        }
        break;
      case '/report/system-performance':
        if ((this.permissions.hasOwnProperty('R_SPR'))
          || (this.permissions.hasOwnProperty('R_SPR_OWN'))
          || (this.permissions.hasOwnProperty('R_SPR_OWN_ORG'))
        ) {
          hasPermission = true;
        }
        break;
      default:
        hasPermission = true;
        break;
    }
    return hasPermission;
  }

  setPermission(): void {
    if (localStorage.getItem('iup')) {
      this.permissions = JSON.parse(localStorage.getItem('iup') || '{}').data.permissions ;
    } else {
      this.permissions = '';
    }
  }
}
