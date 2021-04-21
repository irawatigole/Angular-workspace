import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../login/login.service';
import { Observable, of } from 'rxjs';
import { queryStringToObject } from '../../../../projects/my-lib/src/lib/helper/basic';

@Component({
  selector: 'app-org-selection',
  templateUrl: './org-selection.component.html',
  styleUrls: ['./org-selection.component.sass']
})
export class OrgSelectionComponent implements OnInit {
  data: any;
  selectedRoles;
  selectedOrg;
  selectedOrgName!: string;
  selectedOrgId!: string;
  orgList: any;
  message!: string;
  returnUrl!: string;
  loading = false;
  initLoading = true;
  errorMessage!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService
  ) {
    this.loginService.getOrgList().subscribe((res) => {
      this.orgList = of(res.data.sort((a, b) => a.name.localeCompare(b.name)));

      this.message = '';
      this.selectedRoles = res.data[0].roles;
      this.selectedOrgName = res.data[0].name;
      this.selectedOrg = res.data[0];
      this.initLoading = false;

    });
   }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/campaign/manage';
    if (localStorage.getItem('iup')) {
      this.router.navigate([this.returnUrl]);
    }
  }

  changeOrg(event: any): void {
    this.selectedOrgId = event.target.value;
    this.orgList.subscribe((result) => {

      const index = result.map((obj: any) => obj.id).indexOf(this.selectedOrgId);
      this.selectedOrg = result[index];
      this.selectedRoles = result[index].roles;
      this.selectedOrgName = result[index].name;
    });
  }

  selectOrg(): void{
    this.setOrganisation(this.selectedOrg);
  }

  setOrganisation(organization): void {
    this.loading = true;
    this.loginService.selectOrganisation(organization.id).subscribe((res) => {
      this.loginService.setUserOrganisationOnSession(res, organization);
      this.getPermission();
    },
    (errors) => {
      this.loading = false;
    });
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
      this.loading = false;
    }, (errors) => {
      this.loading = false;
    });
  }

}
