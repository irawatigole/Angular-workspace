export class Permissions {
    permissions: any;

    constructor() { }

    setUserPermission() {
      this.permissions = JSON.parse(localStorage.getItem('iup') || '{}')['data']['permissions'];
    }

    getUserPermission() {
      if (!this.permissions) {
        this.setUserPermission();
      }

      return this.permissions;
    }

    checkACL(activeURL: string): boolean {
      let hasPermission = false;
      activeURL = (activeURL.indexOf('/invite-user;e=') === -1) ? activeURL : activeURL.slice(0, 15);
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
        default:
          hasPermission = true;
          break;
      }
      return hasPermission;
    }
  }
