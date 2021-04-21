import { Component, OnInit,  ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var jQuery: any;
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.sass']
})
export class NavigationComponent implements OnInit {

  userManagementFlag = false;
  createCampaignFlag = false;
  campaignManageFlag = false;
  clusterManageFlag = false;
  contentViewFlag = false;
  analyticsViewFlag = false;
  newClusterFlag = false;
  readOrgFlag = false;
  readOrgOwnFlag = false;
  updateOrgFlag = false;
  permissions!: Permissions;
  orgName = '';
  orgLogoImagePath = '';
  checkReports = false;
  preloadBoxViewFlag = false;
  preloadProfileFlag = false;
  preloadChannelFlag = false;
  preloadAppFlag = false;
  preloadDeviceFlag = false;
  preloadAnalyticsFlag = false;
  ilRulesetManageFlag = false;
  readSysReportFlag = false;
  readSurvey = false;
  readQuestion = false;
  readSurveyFeature = false;

  constructor(private router: Router, private ref: ChangeDetectorRef) {
    const sessionData = JSON.parse(localStorage.getItem('iup') || '{}').data;
    this.orgName = sessionData?.organization?.name;
    this.orgLogoImagePath = sessionData?.organization?.logoFullPath || '/assets/img/default-logo.png';
    this.permissions = sessionData?.permissions;

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ref.markForCheck();
      }
    });
  }

  ngOnInit(): void {
    if ((this.permissions?.hasOwnProperty('C_USER'))
      || (this.permissions?.hasOwnProperty('R_USER'))
      || (this.permissions?.hasOwnProperty('U_USER'))
      || (this.permissions?.hasOwnProperty('C_USER_OWN_ORG'))
      || (this.permissions?.hasOwnProperty('R_USER_OWN_ORG'))
      || (this.permissions?.hasOwnProperty('U_USER_OWN_ORG'))
    ) {
      this.userManagementFlag = true;
    }
    // if (((this.permissions?.hasOwnProperty('C_CAMPAIGN'))
    //   || (this.permissions?.hasOwnProperty('C_CAMPAIGN_OWN_ORG')))
    //   && (isMobile() === false)
    // ) {
    //     this.createCampaignFlag = true;
    // }
    if ((this.permissions?.hasOwnProperty('R_CAMPAIGN'))
      || (this.permissions?.hasOwnProperty('R_CAMPAIGN_OWN_ORG'))
      || (this.permissions?.hasOwnProperty('R_CAMPAIGN_OWN'))
    ) {
        this.campaignManageFlag = true;
    }

    if ((this.permissions?.hasOwnProperty('R_AC'))
    || (this.permissions?.hasOwnProperty('R_AC_OWN_ORG'))
    ) {
        this.clusterManageFlag = true;
    }

    if ((this.permissions?.hasOwnProperty('C_AC'))
      || (this.permissions?.hasOwnProperty('C_AC_OWN_ORG'))
    ) {
        this.newClusterFlag = true;
    }

    if (this.permissions?.hasOwnProperty('R_ORGANIZATION_OWN_ORG')) {
        this.readOrgOwnFlag = true;
    }

    if (this.permissions?.hasOwnProperty('R_ORGANIZATION')) {
        this.readOrgFlag = true;
    }

    if ((this.permissions?.hasOwnProperty('U_ORGANIZATION'))
      || (this.permissions?.hasOwnProperty('U_ORGANIZATION_OWN_ORG'))
    ) {
        this.updateOrgFlag = true;
    }

    if ((this.permissions?.hasOwnProperty('R_ANALYTICS'))
      || (this.permissions?.hasOwnProperty('R_ANALYTICS_OWN_ORG'))
    ) {
        this.analyticsViewFlag = true;
    }

    if ((this.permissions?.hasOwnProperty('SUPER_ADMIN'))
    ) {
        this.checkReports = true;
    }

    if ((this.permissions?.hasOwnProperty('R_IC'))
      || (this.permissions?.hasOwnProperty('R_IC_OWN'))
      || (this.permissions?.hasOwnProperty('R_IC_OWN_ORG'))
      || (this.permissions?.hasOwnProperty('R_VC'))
      || (this.permissions?.hasOwnProperty('R_VC_OWN'))
      || (this.permissions?.hasOwnProperty('R_VC_OWN_ORG'))
    ) {
        this.contentViewFlag = true;
    }

    if ((this.permissions?.hasOwnProperty('C_PRELOAD_CHANNEL'))
      || (this.permissions?.hasOwnProperty('C_PRELOAD_CHANNEL_OWN_ORG'))
      || (this.permissions?.hasOwnProperty('R_PRELOAD_CHANNEL'))
      || (this.permissions?.hasOwnProperty('R_PRELOAD_CHANNEL_OWN'))
      || (this.permissions?.hasOwnProperty('R_PRELOAD_CHANNEL_OWN_ORG'))
    ) {
        this.preloadChannelFlag = true;
    }

    if ((this.permissions?.hasOwnProperty('C_PRELOAD_SUPPORTED_APP'))
      || (this.permissions?.hasOwnProperty('C_PRELOAD_SUPPORTED_APP_OWN_ORG'))
      || (this.permissions?.hasOwnProperty('R_PRELOAD_SUPPORTED_APP'))
      || (this.permissions?.hasOwnProperty('R_PRELOAD_SUPPORTED_APP_OWN'))
      || (this.permissions?.hasOwnProperty('R_PRELOAD_SUPPORTED_APP_OWN_ORG'))
    ) {
        this.preloadAppFlag = true;
    }

    if ((this.permissions?.hasOwnProperty('C_PRELOAD_SUPPORTED_DEVICE'))
      || (this.permissions?.hasOwnProperty('C_PRELOAD_SUPPORTED_DEVICE_OWN_ORG'))
      || (this.permissions?.hasOwnProperty('R_PRELOAD_SUPPORTED_DEVICE'))
      || (this.permissions?.hasOwnProperty('R_PRELOAD_SUPPORTED_DEVICE_OWN'))
      || (this.permissions?.hasOwnProperty('R_PRELOAD_SUPPORTED_DEVICE_OWN_ORG'))
    ) {
        this.preloadDeviceFlag = true;
    }

    if (((this.permissions?.hasOwnProperty('C_PRELOAD_PROFILE'))
      || (this.permissions?.hasOwnProperty('C_PRELOAD_PROFILE_OWN_ORG'))
      || (this.permissions?.hasOwnProperty('R_PRELOAD_PROFILE'))
      || (this.permissions?.hasOwnProperty('R_PRELOAD_PROFILE_OWN'))
      || (this.permissions?.hasOwnProperty('R_PRELOAD_PROFILE_OWN_ORG')))

      && ((this.permissions?.hasOwnProperty('R_PRELOAD_CHANNEL'))
        || (this.permissions?.hasOwnProperty('R_PRELOAD_CHANNEL_OWN'))
        || (this.permissions?.hasOwnProperty('R_PRELOAD_CHANNEL_OWN_ORG'))
      )

      && ((this.permissions?.hasOwnProperty('R_PRELOAD_SUPPORTED_APP'))
        || (this.permissions?.hasOwnProperty('R_PRELOAD_SUPPORTED_APP_OWN'))
        || (this.permissions?.hasOwnProperty('R_PRELOAD_SUPPORTED_APP_OWN_ORG'))
      )

      && ((this.permissions?.hasOwnProperty('R_PRELOAD_SUPPORTED_DEVICE'))
        || (this.permissions?.hasOwnProperty('R_PRELOAD_SUPPORTED_DEVICE_OWN'))
        || (this.permissions?.hasOwnProperty('R_PRELOAD_SUPPORTED_DEVICE_OWN_ORG'))
      )
    ) {
        this.preloadProfileFlag = true;
    }

    if (this.preloadProfileFlag || this.preloadDeviceFlag
      || this.preloadAppFlag || this.preloadChannelFlag
    ) {
        this.preloadBoxViewFlag = true;
    }

    if ((this.permissions?.hasOwnProperty('R_PRELOAD_ANALYTICS_OWN'))
      || (this.permissions?.hasOwnProperty('R_PRELOAD_ANALYTICS_OWN_ORG'))
    ) {
        this.preloadAnalyticsFlag = true;
    }

    if ((this.permissions?.hasOwnProperty('R_ILRS'))
    || (this.permissions?.hasOwnProperty('R_ILRS_OWN_ORG'))
    ) {
      this.ilRulesetManageFlag = true;
    }

    if ((this.permissions?.hasOwnProperty('R_SPR'))
      || (this.permissions?.hasOwnProperty('R_SPR_OWN'))
      || (this.permissions?.hasOwnProperty('R_SPR_OWN_ORG'))
    ) {
      this.readSysReportFlag = true;
    }

    if (((this.permissions?.hasOwnProperty('R_SURVEY'))
    || (this.permissions?.hasOwnProperty('R_SURVEY_OWN'))
    || (this.permissions?.hasOwnProperty('R_SURVEY_OWN_ORG')))
    && ((this.permissions?.hasOwnProperty('R_QUESTION'))
    || (this.permissions?.hasOwnProperty('R_QUESTION_OWN'))
    || (this.permissions?.hasOwnProperty('R_QUESTION_OWN_ORG')))
    ) {
      this.readSurvey = true;
    }

    if ((this.permissions?.hasOwnProperty('R_QUESTION'))
      || (this.permissions?.hasOwnProperty('R_QUESTION_OWN'))
      || (this.permissions?.hasOwnProperty('R_QUESTION_OWN_ORG'))
    ) {
      this.readQuestion = true;
    }

    if (JSON.parse(localStorage.getItem('surveyEnabled') || '{}') === false) {
      this.readSurveyFeature = false;
    } else {
      if (this.readSurvey || this.readQuestion) {
        this.readSurveyFeature = true;
      }
    }
  }

  ngAfterViewInit(): void {
    jQuery('#side-menu').metisMenu();
  }

  activeRoute(routename: string): boolean {
    return this.router.url.indexOf(routename) === 1;
  }

}
