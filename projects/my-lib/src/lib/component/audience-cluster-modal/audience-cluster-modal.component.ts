import {
  Component, OnInit, ViewChild, Output, EventEmitter, Input, ElementRef, OnDestroy, QueryList, ViewChildren, Renderer2, OnChanges
} from '@angular/core';
import { FormControl, NgForm, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';

import { Subject, of } from 'rxjs';
import { takeUntil, debounceTime, switchMap } from 'rxjs/operators';
import { ApiBaseService } from '../../api-base-service';
import { getErrorMessage } from '../../helper/errors';
import { trimString, getEmptyClusterFilterObject, convertDateByTimeZone, multiFieldSort } from '../../helper/basic';
import { AudienceClusterService } from '../../../../../app1/src/app/cluster/audience-cluster.service';
import { isoIsdCodes } from '../../../../../../src/isd-codes';
declare var jQuery: any;

@Component({
  selector: 'lib-audience-cluster-modal',
  templateUrl: './audience-cluster-modal.component.html',
  styleUrls: ['./audience-cluster-modal.component.scss']
})
export class AudienceClusterModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() clusterDetails: any;
  @Input() isPlaceConfig = false;
  @Input() isExternalCluster = false;
  @Output() selectedAudienceClusterEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() modalClosing: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('clientTargetFile') clientTargetFile!: ElementRef;
  @ViewChild('phoneTargetFile') phoneTargetFile!: ElementRef;
  @ViewChildren('clusterType') clusterTypeListElm!: QueryList<ElementRef>;

  private unsubscribe: Subject<any> = new Subject<any>();
  public selected?: boolean;

  filteredFieldData: any;
  filteredLocations: any;
  filteredApps: any;
  filteredMakersData: any;
  filteredCampaign: any;
  filteredPlaceConfig: any;
  filteredExternalCampaign: any;
  selectedPlaceConfig: any;
  selectedExternalCampaign: any;
  locationSelectionData: any;
  appSelectionData: any;
  campaignSelectionData: any;
  selectionData: any;
  makersSelectionData: any;
  osSelectionData: any;
  osList!: any[];
  wlOperatorSelectionData: any;
  wlOperatorList!: any[];
  sourcePackageSelectionData: any;
  sourcePackageList!: any[];
  acForm!: FormGroup;
  genders = ['ALL', 'MALE', 'FEMALE'];
  fieldFilter = ['include', 'exclude'];
  fieldFilterCondition = [{ id: 'all', name: 'AND' }, { id: 'any', name: 'OR' }];
  clusterTypeList = [
    { id: 'CAMPAIGN', name: 'Campaign' },
    { id: 'CLIENTID', name: 'Client Ids' },
    { id: 'PERMISSION', name: 'Permissions' },
    { id: 'PHONENUMBER', name: 'Phone Number' },
    { id: 'ILCAMPAIGNCLUSTER', name: 'Places' },
    { id: 'RULE', name: 'Rules' },
  ];
  ageFromArray!: any[];
  ageToArray!: any[];
  isUniqueName = true;
  uniqueNameLoading = true;
  selectionError: any;
  selectedAudienceCluster: any;
  clusterName = '';
  loading = false;
  errorMessage = '';
  isAgeFilterError!: boolean;
  isEdit = false;
  cid = '';
  progress: any;
  editInstalledAppRuleIndex = -1;
  editLocationRuleIndex = -1;
  allowedFileType!: string[];
  isFileUploadProgress = false;
  isFileUploadError = false;
  fileUploadErrorTxt = '';
  uploadedPercentage = 0;
  fileUploadSubscription: any = null;
  uploadedFileDetails: any = null;
  locale = 'en';
  clusterStartDate!: Date;
  warningMessage = '';
  timeSlots: any = [];
  timeSlotErrorFlag = false;

  permissionList: Array<any> = [
    { id: 'phonePermission', name: 'Phone', value: 'YES' },
    { id: 'locationPermission', name: 'Location', value: 'YES' },
    { id: 'disclosureAccepted', name: 'Disclosure', value: 'YES' },
    { id: 'storagePermission', name: 'Storage', value: 'YES' }
  ];

  actionList: Array<any> = [
    { id: 'isClicked', name: 'Clicked', value: 'YES' }
  ];
  orgSettings: any;
  isoIsdCodes: any;
  isFileSanitationProgress = false;
  fileSanitationData: any = null;
  fileSanitationTimeout: any;
  fileSanitationError!: string;
  fileSanitationErrorCount = 0;

  deviceTierSelectionData: any;
  deviceTierList!: any[];

  constructor(
    private apiService: ApiBaseService,
    private audienceClusterService: AudienceClusterService,
    private renderer: Renderer2
  ) {
    this.getAllOSList();
    this.getAllWLOperatorList();
    this.getSourcePackageList();
    this.getOrgSettings();
    this.getDeviceTierList();
    this.ageFromArray = Array(108).fill(1).map((x, i) => i + 13);
    this.ageToArray = this.ageFromArray;
    this.isAgeFilterError = false;
    this.selectedAudienceCluster = null;
    this.selectionError = {
      locations: '',
      installedApps: '',
      makers: '',
      os: '',
      wlOperator: '',
      sourcePackage: '',
      deviceTier: ''
    };

    // if (selected === undefined) selected = false;
    this.progress = this.getAllProgressFlagObject();
    this.selectionData = { include: [{ id: 1, name: 'All' }], exclude: [{ id: 2, name: 'Ohio' }] };
    this.selectedPlaceConfig = null;
    this.selectedExternalCampaign = null;
    this.locationSelectionData = getEmptyClusterFilterObject();
    this.appSelectionData = getEmptyClusterFilterObject();
    this.campaignSelectionData = [];
    this.makersSelectionData = getEmptyClusterFilterObject();
    this.osSelectionData = getEmptyClusterFilterObject();
    this.wlOperatorSelectionData = getEmptyClusterFilterObject();
    this.sourcePackageSelectionData = getEmptyClusterFilterObject();
    this.deviceTierSelectionData = getEmptyClusterFilterObject();
    this.allowedFileType = [
      'text/plain', 'text/csv', 'application/csv', 'text/x-comma-separated-values',
      'text/comma-separated-values', 'application/octet-stream', 'application/vnd.ms-excel',
      'application/excel', 'application/vnd.msexcel'
    ];
    this.clusterStartDate = convertDateByTimeZone(
      JSON.parse(localStorage.getItem('iup') || '{}').data.organization.timeZone
    );

    this.acForm = new FormGroup({
      location: new FormControl(null),
      location_filter: new FormControl('include'),
      location_filter_condition: new FormControl('any'),
      location_filter_top_condition: new FormControl(true),
      installed_apps: new FormControl(),
      installed_apps_filter: new FormControl('include'),
      installed_apps_filter_condition: new FormControl('any'),
      installed_apps_filter_top_condition: new FormControl(true),
      business: new FormControl(null),
      business_filter: new FormControl('include'),
      makers: new FormControl(null),
      makers_filter: new FormControl('include'),
      operating_system: new FormControl(null),
      operating_system_filter: new FormControl('include'),
      wireless: new FormControl(null),
      wireless_filter: new FormControl('include'),
      web_history: new FormControl(null),
      web_history_filter: new FormControl('include'),
      gender: new FormControl('ALL'),
      age_from: new FormControl('13'),
      age_to: new FormControl('65'),
      name: new FormControl('', [Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]),
      cluster_type: new FormControl('RULE', Validators.required),
      cluster_file: new FormControl(''),
      clusterFileObj: new FormControl(null),
      // 'permissions': new FormArray({location})
      phonePermission: new FormControl('YES'),
      locationPermission: new FormControl('YES'),
      disclosureAccepted: new FormControl('YES'),
      storagePermission: new FormControl('YES'),
      campaign: new FormControl(''),
      isClicked: new FormControl('YES'),
      sourcePackages: new FormControl(null),
      sourcePackage_filter: new FormControl('include'),
      interestingLocationsType: new FormControl('FILE'),
      geoRadius: new FormControl(100, [Validators.required, Validators.min(0), Validators.max(10000), Validators.pattern(/^[0-9]*$/)]),
      geoLocations: new FormControl(''),
      placeConfig: new FormControl('', Validators.required),
      startDate: new FormControl(this.clusterStartDate),
      endDate: new FormControl(this.clusterStartDate),
      exteralCampaign: new FormControl('', Validators.required),
      executionTime: new FormControl(new Date(0, 0, 0, 0, 0, 0), Validators.required),
      deviceTier: new FormControl(null),
      deviceTier_filter: new FormControl('include'),
      campaign_top_condition: new FormControl('all')
    });

    this.isoIsdCodes = isoIsdCodes;

  }

  ngOnInit(): void {
    this.acForm.controls.location.valueChanges
      .pipe(debounceTime(500),
        takeUntil(this.unsubscribe))
      .subscribe((data: any) => {
        data = trimString(data);
        if (data != null && data.length > 2) {
          this.progress.locationSearchFlag = true;
          this.progress.noLocationFlag = false;
          this.apiService.get('locations/?filter=' + data + '&limit=20')
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(
              (list: any) => {
                this.progress.locationSearchFlag = false;
                this.filteredLocations = of(list.data);
              },
              (errors: any) => {
                console.log(errors.status);
                this.filteredLocations = of([]);
                if (errors.status === 404 && getErrorMessage(errors) === 'No matching Locations found') {
                  this.progress.noLocationFlag = true;
                }
                this.progress.locationSearchFlag = false;
                console.log(getErrorMessage(errors));
              }
            );
        } else {
          this.filteredLocations = of([]);
        }
      });

    this.acForm.controls.location_filter.valueChanges.subscribe(data => {
      this.acForm.get('location')?.setValue('');
      this.filteredLocations = of([]);
    });

    this.acForm.controls.location_filter_condition.valueChanges.subscribe(data => {
      this.acForm.get('location')?.setValue('');
      this.filteredLocations = of([]);
    });

    this.acForm.controls.location_filter_top_condition.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((condition: any) => {
        if (condition) {
          this.locationSelectionData.condition = 'ANY';
        } else {
          this.locationSelectionData.condition = 'ALL';
        }
        this.filteredLocations = of([]);
      });

    this.acForm.controls.makers_filter.valueChanges.subscribe(data => {
      this.acForm.get('makers')?.setValue('');
      this.filteredMakersData = of([]);
    });

    this.acForm.controls.installed_apps_filter.valueChanges.subscribe(data => {
      this.acForm.get('installed_apps')?.setValue('');
      this.filteredApps = of([]);
    });

    this.acForm.controls.installed_apps_filter_condition.valueChanges.subscribe(data => {
      this.acForm.get('installed_apps')?.setValue('');
      this.filteredApps = of([]);
    });

    this.acForm.controls.installed_apps.valueChanges
      .pipe(debounceTime(500),
        takeUntil(this.unsubscribe))
      .subscribe((data: any) => {
        data = trimString(data);
        if (data != null && data.length > 2) {
          this.progress.installAppSearchFlag = true;
          this.progress.noInstallAppFlag = false;
          this.apiService.get('installedapps/?filter=' + data + '&limit=20').subscribe(
            (list: any) => {
              this.progress.installAppSearchFlag = false;
              this.filteredApps = of(list.data);
            },
            (errors) => {
              this.filteredApps = of([]);
              if (errors.status === 404 && getErrorMessage(errors) === 'No matching Installed Apps found') {
                this.progress.noInstallAppFlag = true;
              }
              this.progress.installAppSearchFlag = false;
              console.log(getErrorMessage(errors));
            }
          );
        } else {
          this.filteredApps = of([]);
        }
      });

    this.acForm.controls.makers.valueChanges
      .pipe(debounceTime(500),
        takeUntil(this.unsubscribe))
      .subscribe(data => {
        data = trimString(data);
        if (data != null && data.length > 2) {
          this.progress.modelSearchFlag = true;
          this.progress.noModelFlag = false;
          this.apiService.get('makers/?filter=' + data + '&sort=weight' + '&limit=20').subscribe(
            (list: any) => {
              this.progress.modelSearchFlag = false;
              this.filteredMakersData = of(list.data);
            },
            (errors) => {
              this.filteredMakersData = of([]);
              if (errors.status === 404 && getErrorMessage(errors) === 'No matching Makers found') {
                this.progress.noModelFlag = true;
              }
              this.progress.modelSearchFlag = false;
              console.log(getErrorMessage(errors));
            }
          );
        } else {
          this.filteredMakersData = of([]);
        }
      });

    this.acForm.controls.name.valueChanges
      .pipe(
        debounceTime(400),
        switchMap((term: any) => {
          this.progress.nameSearchFlag = false;
          if (term.trim().length > 2) {
            this.progress.nameSearchFlag = true;
            this.uniqueNameLoading = true;
            this.clusterName = term.trim();
            return this.apiService.get('audienceclusters/name?name=' + term.trim());
          } else {
            return of(null);
          }
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe((res: any) => {
        if (res !== null) {
          this.uniqueNameLoading = false;
          this.progress.nameSearchFlag = false;
          if (res.message === 'false') {
            this.isUniqueName = true;
          } else {
            this.clusterName = '';
            this.isUniqueName = false;
          }
        }
      }, (errors: any) => {
        this.uniqueNameLoading = false;
        this.progress.nameSearchFlag = false;
        console.log(getErrorMessage(errors));
      });

    this.acForm.controls.age_from.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(ageFrom => {
        this.isAgeFilterError = (ageFrom > this.acForm.controls.age_to.value) ? true : false;
      });

    this.acForm.controls.age_to.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(ageTo => {
        this.isAgeFilterError = (ageTo < this.acForm.controls.age_from.value) ? true : false;
      });

    this.acForm.controls.installed_apps_filter_top_condition.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((condition) => {
        if (condition) {
          this.appSelectionData.condition = 'ANY';
        } else {
          this.appSelectionData.condition = 'ALL';
        }

        this.isFileUploadError = false;
        this.fileUploadErrorTxt = '';
        this.acForm.get('clusterFileObj')?.setValue(null);
        // this.appSelectionData.condition = condition.toUpperCase();

        this.acForm.get('installed_apps')?.setValue('');
        this.filteredApps = of([]);
      });

    this.acForm.controls.campaign.valueChanges
      .pipe(debounceTime(500)
        , takeUntil(this.unsubscribe))
      .subscribe(data => {
        data = trimString(data);
        if (data != null && data.length > 2) {
          this.progress.campaignSearchFlag = true;
          this.progress.noCampaignFlag = false;
          this.apiService.get('campaigns?filter=' + data + '&limit=20&status=COMPLETED&status=STOPPED&status=APPROVED').subscribe(
            (list: any) => {
              // enable previous select option, if any
              if (this.campaignSelectionData.length > 0) {
                const selectedIds = this.campaignSelectionData.map((i: any) => i.campaignId);
                for (const campaign of list.data.content) {
                  if (selectedIds.indexOf(campaign.id) !== -1) {
                    campaign.selected = true;
                  }
                }
              }
              this.progress.campaignSearchFlag = false;
              this.filteredCampaign = of(list.data.content);
            },
            (errors) => {
              this.filteredCampaign = of([]);
              if (errors.status === 404 && getErrorMessage(errors) === 'No matching Campaigns found') {
                this.progress.noCampaignFlag = true;
              }
              this.progress.campaignSearchFlag = false;
              console.log(getErrorMessage(errors));
            }
          );
        } else {
          this.filteredCampaign = of([]);
        }
      });


    this.acForm.controls.startDate.valueChanges
      .pipe(debounceTime(500)
        , takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.clusterStartDate = data;
      });

    this.acForm.controls.placeConfig.valueChanges
      .pipe(debounceTime(500)
        , takeUntil(this.unsubscribe))
      .subscribe(data => {
        data = trimString(data);
        if (data != null && data.length > 2) {
          this.progress.placeConfigSearchFlag = true;
          this.progress.noPlaceConfigFlag = false;
          this.apiService.get('audienceclusters?filter=' + data + '&limit=20&placesConfig=true')
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(
              (list: any) => {
                this.progress.placeConfigSearchFlag = false;
                this.filteredPlaceConfig = of(list.data.content);
                if (this.isEdit && this.warningMessage.length === 0) {
                  this.warningMessage = 'Previously identified devices will not be affected';
                }
              },
              (errors) => {
                this.filteredPlaceConfig = of([]);
                if (errors.status === 404
                  && getErrorMessage(errors) === 'No matching Audience Clusters found'
                ) {
                  this.progress.noPlaceConfigFlag = true;
                }
                this.progress.placeConfigSearchFlag = false;
                console.log(getErrorMessage(errors));
              }
            );
        } else {
          this.filteredPlaceConfig = of([]);
        }
      });

    this.acForm.controls.geoRadius.valueChanges
      .subscribe(data => {
        if (this.isEdit && this.warningMessage.length === 0) {
          this.warningMessage = 'Previously identified devices will not be affected';
        }
      });

    this.acForm.controls.exteralCampaign.valueChanges
      .pipe(debounceTime(500)
        , takeUntil(this.unsubscribe))
      .subscribe((data: any) => {
        data = trimString(data);
        if (data != null && data.length > 2) {
          this.progress.externalCampaignSearchFlag = true;
          this.progress.noExternalCampaignFlag = false;
          this.apiService.get('campaigns?filter=' + data + '&limit=20&status=APPROVED&audienceClusterScope=EXTERNAL')
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(
              (list: any) => {
                this.progress.externalCampaignSearchFlag = false;
                this.filteredExternalCampaign = of(list.data.content);
              },
              (errors: any) => {
                this.filteredExternalCampaign = of([]);
                if (errors.status === 404
                  && getErrorMessage(errors) === 'No matching Campaigns found'
                ) {
                  this.progress.noExternalCampaignFlag = true;
                }
                this.progress.externalCampaignSearchFlag = false;
                console.log(getErrorMessage(errors));
              }
            );
        } else {
          this.filteredExternalCampaign = of([]);
        }
      });


    jQuery('#customAudienceClusterModal').on('hide.bs.modal', () => {
      this.modalClosing.emit(true);
      this.resetForm();
    });

    jQuery('#customAudienceClusterModal').on('shown.bs.modal', () => {
      if (this.acForm.controls.cluster_type.value !== 'EXTERNAL_CLUSTER') {
        const selectedOptionTag: any = this.clusterTypeListElm.find(optionTag => optionTag.nativeElement.value === 'PHONENUMBER');
        if (typeof this.orgSettings === 'undefined') {
          this.renderer.setProperty(selectedOptionTag.nativeElement, 'disabled', true);
        }
      } else {
        if (typeof this.orgSettings === 'undefined') {
          this.renderer.setProperty(this.clientTargetFile.nativeElement, 'disabled', true);
        }
      }
    });
  }

  ngOnChanges(): void {
    this.resetForm();
    this.isEdit = (typeof this.clusterDetails !== 'undefined' && this.clusterDetails !== null) ? true : false;

    if (this.isEdit) {
      this.uniqueNameLoading = false;
      this.cid = this.clusterDetails.id;
      this.isUniqueName = true;
      this.clusterName = this.clusterDetails.name;
      this.acForm.get('name')?.setValue(this.clusterDetails.name);
      this.acForm.get('name')?.disable();
      this.acForm.get('cluster_type')?.setValue(this.clusterDetails.clusterType);

      if (this.clusterDetails.clusterType === 'RULE') {
        if (this.clusterDetails.locations !== null) {
          this.locationSelectionData = this.clusterDetails.locations;
          this.acForm.get('location_filter_top_condition')?.setValue(
            this.locationSelectionData.condition === 'ANY'
          );
        }

        if (this.clusterDetails.installedApps !== null) {
          this.appSelectionData = this.clusterDetails.installedApps;
          this.acForm.get('installed_apps_filter_top_condition')?.setValue(
            this.appSelectionData.condition === 'ANY'
          );
        }

        if (this.clusterDetails.makers !== null) {
          this.makersSelectionData = this.clusterDetails.makers;
        }

        if (this.clusterDetails.wirelessOperators !== null) {
          this.wlOperatorSelectionData = this.clusterDetails.wirelessOperators;
        }

        if (this.clusterDetails.osVersions !== null) {
          this.osSelectionData = this.clusterDetails.osVersions;
        }

        if (this.clusterDetails.sourcePackages !== null) {
          this.sourcePackageSelectionData = this.clusterDetails.sourcePackages;
        }

        if (this.clusterDetails.deviceTier !== null) {
          this.deviceTierSelectionData = this.clusterDetails.deviceTier;
        }

        if (this.clusterDetails.clusterType) {
          this.acForm.get('cluster_type')?.setValue(this.clusterDetails.clusterType);
        }

        this.acForm.get('age_from')?.setValue(this.clusterDetails.supplementary.ageFrom);
        this.acForm.get('age_to')?.setValue(this.clusterDetails.supplementary.ageTo);
        this.acForm.get('gender')?.setValue(this.clusterDetails.supplementary.gender);
      } else if (this.clusterDetails.clusterType === 'PERMISSION') {

        this.permissionList.map((p) => p.value = this.clusterDetails[p.id]);

        this.acForm.get('phonePermission')?.setValue(this.clusterDetails.phonePermission);
        this.acForm.get('locationPermission')?.setValue(this.clusterDetails.locationPermission);
        this.acForm.get('disclosureAccepted')?.setValue(this.clusterDetails.disclosureAccepted);
        this.acForm.get('storagePermission')?.setValue(this.clusterDetails.storagePermission);
      } else if (this.clusterDetails.clusterType === 'CAMPAIGN') {
        this.actionList.map((a) => a.value = this.clusterDetails.campaignCluster.campaignClusterData[0][a.id]);
        this.campaignSelectionData = this.clusterDetails.campaignCluster.campaignClusterData;
        this.acForm.get('isClicked')?.setValue(this.campaignSelectionData[0].isClicked);
        this.permissionList.map((p) => p.value = this.clusterDetails[p.id]);
        this.acForm.get('campaign_top_condition')?.setValue(
          this.clusterDetails.campaignCluster.condition === 'OR' ? 'any' : 'all'
        );
      } else if (this.clusterDetails.clusterType === 'INTERESTINGLOCATIONS') {
        this.acForm.get('geoRadius')?.setValue(this.clusterDetails.geoRadius);
        this.acForm.get('interestingLocationsType')?.setValue(
          this.clusterDetails.interestingLocationsType
        );
        if (this.clusterDetails.interestingLocationsType === 'LIST') {
          this.acForm.get('geoLocations')?.setValue(this.clusterDetails.geoLocations);
        } else {
          this.getFileDetails(this.clusterDetails.clusterFileId);
        }
      } else if (this.clusterDetails.clusterType === 'EXTERNAL_CLUSTER') {
        this.getFileDetails(this.clusterDetails.clusterFileId);
        const hours = (this.clusterDetails.executionTime > 0) ? this.clusterDetails.executionTime / 60 : 0;
        const rhours = Math.floor(hours);
        const minutes = (hours - rhours) * 60;
        const rminutes = Math.round(minutes);
        // this.acForm.get('executionTime')!.setValue(new Date(0, 0, 0, rhours, rminutes, 0));
        this.selectedExternalCampaign = {
          id: this.clusterDetails.campaignId,
          name: this.clusterDetails.campaignName
        };
      }

      this.acForm.updateValueAndValidity();
    }

    if (this.isPlaceConfig) {
      this.acForm.get('cluster_type')?.setValue('INTERESTINGLOCATIONS');
      this.acForm.updateValueAndValidity();
    }

    if (this.isExternalCluster) {
      this.acForm.get('cluster_type')?.setValue('EXTERNAL_CLUSTER');
      this.acForm.updateValueAndValidity();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
    this.cancelFileUpload();
    this.cancelFileSanitation();
  }

  getAllOSList(): void {
    this.apiService.get('osversions')
      .subscribe(
        (res) => {
          this.osList = res.data.filter((os: any) => os.name !== '').sort((a: any, b: any) => a.name.localeCompare(b.name));
        },
        (errors) => console.log(getErrorMessage(errors))
      );
  }

  toggleLocationSelection(event: any, location: any): void {
    if (event.checked) {
      this.locationSelection({ isUserInput: true }, location);
    } else {
      const locationIndex = this.locationSelectionData.list.findIndex((item: any) =>
        item.operation === this.acForm.controls.location_filter.value.toUpperCase()
        && item.list.findIndex((loc: any) => loc.id === location.id) !== -1
        && item.condition === this.acForm.controls.location_filter_condition.value.toUpperCase()
      );
      this.removeLocationSelection(location.id, locationIndex);
    }
  }

  toggleAppSelection(event: any, installedApp: any): void {
    if (event.checked) {
      this.appSelection({ isUserInput: true }, installedApp);
    } else {
      const appIndex = this.appSelectionData.list.findIndex((item: any) =>
        item.operation === this.acForm.controls.installed_apps_filter.value.toUpperCase()
        && item.list.findIndex((app: any) => app.id === installedApp.id) !== -1
        && item.condition === this.acForm.controls.installed_apps_filter_condition.value.toUpperCase()
      );
      this.removeAppSelection(installedApp.id, appIndex);
    }
  }

  toggleMakersSelection(event: any, make: any): void {
    if (event.checked) {
      this.makersSelection({ isUserInput: true }, make);
    } else {
      const makeIndex = this.makersSelectionData.list.findIndex(
        (item: any) => item.operation === this.acForm.controls.makers_filter.value.toUpperCase() && item.list[0].id === make.id
      );
      this.removeMakerSelection(make.id, makeIndex);
    }
  }

  toggleCampaignSelection(event: any, campaign: any): void {
    if (event.checked) {
      this.campaignSelection({ isUserInput: true }, campaign);
    } else {
      this.removeCampaignSelection(campaign.id);
    }
  }

  getAllWLOperatorList(): void {
    this.apiService.get('wirelessoperators')
      .subscribe(
        (res) => {
          // sort list by count descendig order
          this.wlOperatorList = res.data.filter((wp: any) => wp.name !== '').sort((a: any, b: any) => {
            return b.count - a.count;
          });
        },
        (errors) => console.log(getErrorMessage(errors))
      );
  }

  getSourcePackageList(): void {
    this.apiService.get('sourcepackages')
      .subscribe(
        (res: any) => {
          this.sourcePackageList = res?.data?.sort(multiFieldSort(['-count', 'name']));
        },
        (errors) => console.log(getErrorMessage(errors))
      );
  }

  onSubmit(): void {
    const clusterPostData: any = {
      clusterType: this.acForm.value.cluster_type,
      name: trimString(this.acForm.value.name),
    };

    if (this.acForm.value.cluster_type === 'RULE') {
      clusterPostData.locations = JSON.stringify(this.buildClusterConditionCriteria(this.locationSelectionData));
      clusterPostData.installedApps = JSON.stringify(this.buildClusterConditionCriteria(this.appSelectionData));
      clusterPostData.makers = JSON.stringify(this.buildClusterConditionCriteria(this.makersSelectionData));
      clusterPostData.osVersions = JSON.stringify(this.buildClusterConditionCriteria(this.osSelectionData));
      clusterPostData.wirelessOperators = JSON.stringify(this.buildClusterConditionCriteria(this.wlOperatorSelectionData));
      clusterPostData.sourcePackages = JSON.stringify(this.buildClusterConditionCriteria(this.sourcePackageSelectionData));
      clusterPostData.deviceTier = JSON.stringify(this.buildClusterConditionCriteria(this.deviceTierSelectionData));
      clusterPostData.supplementary = {
        ageFrom: this.acForm.value.age_from,
        ageTo: this.acForm.value.age_to,
        gender: this.acForm.value.gender
      };
    } else if (['PHONENUMBER', 'CLIENTID'].indexOf(this.acForm.value.cluster_type) !== -1) {
      clusterPostData.clusterFileId = this.acForm.value.clusterFileObj !== null ? this.acForm.value.clusterFileObj.id : null;
    } else if (this.acForm.value.cluster_type === 'PERMISSION') {
      clusterPostData.phonePermission = this.acForm.value.phonePermission;
      clusterPostData.locationPermission = this.acForm.value.locationPermission;
      clusterPostData.disclosureAccepted = this.acForm.value.disclosureAccepted;
      clusterPostData.storagePermission = this.acForm.value.storagePermission;
    } else if (this.acForm.value.cluster_type === 'CAMPAIGN') {
      clusterPostData.campaignCluster = {};
      clusterPostData.campaignCluster.campaignClusterData = [];
      clusterPostData.campaignCluster.condition = (this.acForm.value.campaign_top_condition) ? 'OR' : 'AND';
      this.campaignSelectionData.forEach((item: any) => {
        clusterPostData.campaignCluster.campaignClusterData.push({
          campaignId: item.campaignId,
          isClicked: this.acForm.value.isClicked
        });
      });
    } else if (this.acForm.value.cluster_type === 'INTERESTINGLOCATIONS') {
      if (this.acForm.value.interestingLocationsType === 'FILE') {
        clusterPostData.clusterFileId = this.acForm.value.clusterFileObj !== null ? this.acForm.value.clusterFileObj.id : null;
      } else {
        clusterPostData.geoLocations = JSON.stringify(this.acForm.value.geoLocations);
      }
      clusterPostData.interestingLocationsType = this.acForm.value.interestingLocationsType;
      clusterPostData.geoRadius = this.acForm.value.geoRadius;
    } else if (this.acForm.value.cluster_type === 'ILCAMPAIGNCLUSTER') {
      clusterPostData.ilClusterId = this.selectedPlaceConfig.id;
      clusterPostData.ilClusterName = this.selectedPlaceConfig.name;
      clusterPostData.endDate = this.toStandardDate(this.acForm.value.endDate);
      clusterPostData.startDate = this.toStandardDate(this.acForm.value.startDate);
      clusterPostData.times = this.timeSlots;
    }
    if (this.acForm.value.cluster_type === 'EXTERNAL_CLUSTER') {
      clusterPostData.clusterFileId = this.acForm.value.clusterFileObj !== null ? this.acForm.value.clusterFileObj.id : null;
      clusterPostData.campaignId = this.selectedExternalCampaign.id;
      clusterPostData.executionTime = (this.acForm.value.executionTime.getHours() * 60) + this.acForm.value.executionTime.getMinutes();
    }

    this.loading = true;

    if (this.isEdit) {
      delete clusterPostData.name;
      this.apiService.put(`audienceclusters/${this.cid}`, clusterPostData)
        .subscribe(
          (res: any) => {
            this.loading = false;
            jQuery('#customAudienceClusterModal').modal('hide');
            if (res.data.clusterType === 'RULE') {
              res.data.locations = JSON.parse(res.data.locations);
              res.data.installedApps = JSON.parse(res.data.installedApps);
              res.data.makers = JSON.parse(res.data.makers);
              res.data.osVersions = JSON.parse(res.data.osVersions);
              res.data.wirelessOperators = JSON.parse(res.data.wirelessOperators);
              res.data.deviceTier = JSON.parse(res.data.deviceTier);
            }
            this.selectedAudienceClusterEmit.emit(res.data);
            this.resetForm();
          },
          (errors) => {
            this.errorMessage = getErrorMessage(errors);
            this.loading = false;
          }
        );
    } else {
      this.apiService.post('audienceclusters', clusterPostData)
        .subscribe(
          (res: any) => {
            this.loading = false;
            jQuery('#customAudienceClusterModal').modal('hide');
            this.selectedAudienceCluster = res.data;
            if (this.selectedAudienceCluster.clusterType === 'RULE') {
              this.selectedAudienceCluster.locations = JSON.parse(this.selectedAudienceCluster.locations);
              this.selectedAudienceCluster.installedApps = JSON.parse(this.selectedAudienceCluster.installedApps);
              this.selectedAudienceCluster.makers = JSON.parse(this.selectedAudienceCluster.makers);
              this.selectedAudienceCluster.osVersions = JSON.parse(this.selectedAudienceCluster.osVersions);
              this.selectedAudienceCluster.wirelessOperators = JSON.parse(this.selectedAudienceCluster.wirelessOperators);
              this.selectedAudienceCluster.deviceTier = JSON.parse(this.selectedAudienceCluster.deviceTier);
            }
            this.selectedAudienceClusterEmit.emit(this.selectedAudienceCluster);
            this.resetForm();
          },
          (errors) => {
            this.errorMessage = getErrorMessage(errors);
            this.loading = false;
          }
        );
    }
  }

  intersectCriteria(criteriaFirst: any, criteriaSecond: any, filter: any): any {
    const map: any = {};
    criteriaFirst.forEach((data: any) => { map[data.id] = data; });

    return criteriaSecond.filter((data: any) => filter(map[data.id]));
  }

  addItemToSelection(collection: any, selectedItem: any, operation: string): void {
    let newItemFlag = true;

    for (const item of collection) {
      if ((item.operation === operation)
        && item.list[0].id === selectedItem.id
      ) {
        newItemFlag = false;
        break;
      }
    }

    if (newItemFlag) {
      const obj: any = {
        condition: 'ANY',
        operation,
        list: []
      };
      obj.list.push(selectedItem);
      collection.push(obj);
    }
  }

  locationSelection(event: any, location: any): void {
    if (event.isUserInput) {
      if (this.editLocationRuleIndex > -1) {
        const index = this.locationSelectionData.list[this.editLocationRuleIndex].list.findIndex((obj: any) => obj.id === location.id);
        if (index === -1) {
          this.locationSelectionData.list[this.editLocationRuleIndex].operation
            = this.acForm.controls.location_filter.value.toUpperCase();
          this.locationSelectionData.list[this.editLocationRuleIndex].condition
            = this.acForm.controls.location_filter_condition.value.toUpperCase();
          this.locationSelectionData.list[this.editLocationRuleIndex].list.push(location);
        }
      } else {
        const obj: any = {
          operation: this.acForm.controls.location_filter.value.toUpperCase(),
          condition: this.acForm.controls.location_filter_condition.value.toUpperCase(),
          list: []
        };
        obj.list.push(location);
        this.locationSelectionData.list.push(obj);
      }
      this.progress.noLocationFlag = false;
    }
  }

  editLocationSelection(i: any): void {
    this.editLocationRuleIndex = i;
    this.acForm.controls.location_filter.setValue(this.locationSelectionData.list[i].operation.toLowerCase());
    this.acForm.controls.location_filter_condition.setValue(this.locationSelectionData.list[i].condition.toLowerCase());
    this.acForm.controls.location_filter.updateValueAndValidity();
    this.acForm.controls.location_filter_condition.updateValueAndValidity();
  }

  validateLocationSelectionCriteria(): void {
    let locationCollection: any = { INCLUDE: [], EXCLUDE: [] };

    for (const item of this.locationSelectionData.list) {
      locationCollection[item.operation].push(item.list[0]);
    }

    if (locationCollection.INCLUDE.length > 0
      && locationCollection.EXCLUDE.length > 0
    ) {
      const commonCriteria = this.intersectCriteria(
        locationCollection.INCLUDE,
        locationCollection.EXCLUDE,
        (e: any) => e
      );

      if (commonCriteria.length > 0) {
        this.selectionError.locations = 'Invalid Selection Criteria';
        locationCollection = { INCLUDE: [], EXCLUDE: [] };
      } else {
        this.selectionError.locations = '';
        locationCollection = { INCLUDE: [], EXCLUDE: [] };
      }
    } else {
      this.selectionError.locations = '';
      locationCollection = { INCLUDE: [], EXCLUDE: [] };
    }
  }

  appSelection(event: any, app: any): void {
    if (event.isUserInput) {
      if (this.editInstalledAppRuleIndex > -1) {
        const index = this.appSelectionData.list[this.editInstalledAppRuleIndex].list.findIndex((obj: any) => obj.id === app.id);
        if (index === -1) {
          this.appSelectionData.list[this.editInstalledAppRuleIndex].operation
            = this.acForm.controls.installed_apps_filter.value.toUpperCase();
          this.appSelectionData.list[this.editInstalledAppRuleIndex].condition
            = this.acForm.controls.installed_apps_filter_condition.value.toUpperCase();
          this.appSelectionData.list[this.editInstalledAppRuleIndex].list.push(app);
        }
      } else {
        const obj: any = {
          operation: this.acForm.controls.installed_apps_filter.value.toUpperCase(),
          condition: this.acForm.controls.installed_apps_filter_condition.value.toUpperCase(),
          list: []
        };
        obj.list.push(app);
        this.appSelectionData.list.push(obj);
      }
      this.progress.noInstallAppFlag = false;
      // this.acForm.get('installed_apps').setValue('');
      // this.filteredApps = Observable.of([]);
      // this.validateInstalledAppSelectionCriteria();
    }
  }

  editAppSelection(i: any): void {
    this.editInstalledAppRuleIndex = i;
    this.acForm.controls.installed_apps_filter.setValue(this.appSelectionData.list[i].operation.toLowerCase());
    this.acForm.controls.installed_apps_filter_condition.setValue(this.appSelectionData.list[i].condition.toLowerCase());
    this.acForm.controls.installed_apps_filter.updateValueAndValidity();
    this.acForm.controls.installed_apps_filter_condition.updateValueAndValidity();
  }

  validateInstalledAppSelectionCriteria(): void {
    if (this.appSelectionData.include.length > 0
      && this.appSelectionData.exclude.length > 0
    ) {
      const commonCriteria = this.intersectCriteria(
        this.appSelectionData.include,
        this.appSelectionData.exclude,
        (e: any) => e
      );

      if (commonCriteria.length > 0) {
        this.selectionError.installedApps = 'Invalid Selection Criteria';
      } else {
        this.selectionError.installedApps = '';
      }
    } else {
      this.selectionError.installedApps = '';
    }
  }

  makersSelection(event: any, make: any): void {
    if (event.isUserInput) {
      this.addItemToSelection(
        this.makersSelectionData.list,
        make,
        this.acForm.controls.makers_filter.value.toUpperCase()
      );

      this.progress.noModelFlag = false;
      // this.acForm.get('makers').setValue('');
      // this.filteredMakersData = Observable.of([]);
      this.validateMakersSelectionCriteria();
    }
  }

  validateMakersSelectionCriteria(): void {
    let makersCollection: any = this.getEmptyFilterObject();

    for (const item of this.makersSelectionData.list) {
      makersCollection[item.operation].push(item.list[0]);
    }

    if (makersCollection.INCLUDE.length > 0
      && makersCollection.EXCLUDE.length > 0
    ) {
      const commonCriteria = this.intersectCriteria(
        makersCollection.INCLUDE,
        makersCollection.EXCLUDE,
        (e: any) => e
      );

      if (commonCriteria.length > 0) {
        this.selectionError.makers = 'Invalid Selection Criteria';
        makersCollection = this.getEmptyFilterObject();
      } else {
        this.selectionError.makers = '';
        makersCollection = this.getEmptyFilterObject();
      }
    } else {
      this.selectionError.makers = '';
      makersCollection = this.getEmptyFilterObject();
    }
  }

  osSelection(event: any, os: any): void {
    if (event.isUserInput) {
      if (event.source.selected) {
        this.addItemToSelection(
          this.osSelectionData.list,
          os,
          this.acForm.controls.operating_system_filter.value.toUpperCase()
        );
      }
      setTimeout(() => {
        this.acForm.get('operating_system')?.setValue('5a548ebed608473f29a15abf');
        this.acForm.updateValueAndValidity();
      }, 0);
      this.validateOSSelectionCriteria();
    }
  }

  validateOSSelectionCriteria(): void {
    let osCollection: any = this.getEmptyFilterObject();

    for (const item of this.osSelectionData.list) {
      osCollection[item.operation].push(item.list[0]);
    }

    if (osCollection.INCLUDE.length > 0
      && osCollection.EXCLUDE.length > 0
    ) {
      const commonCriteria = this.intersectCriteria(
        osCollection.INCLUDE,
        osCollection.EXCLUDE,
        (e: any) => e
      );

      if (commonCriteria.length > 0) {
        this.selectionError.os = 'Invalid Selection Criteria';
        osCollection = this.getEmptyFilterObject();
      } else {
        this.selectionError.os = '';
        osCollection = this.getEmptyFilterObject();
      }
    } else {
      this.selectionError.os = '';
      osCollection = this.getEmptyFilterObject();
    }
  }

  wlOperatorSelection(event: any, operator: any): void {
    if (event.isUserInput) {
      if (event.source.selected) {
        this.addItemToSelection(
          this.wlOperatorSelectionData.list,
          operator,
          this.acForm.controls.wireless_filter.value.toUpperCase()
        );
      }
      setTimeout(() => {
        this.acForm.get('wireless')?.setValue('5a1d57b63976838402208d37');
        this.acForm.updateValueAndValidity();
      }, 0);
      this.validateWOSelectionCriteria();
    }
  }

  validateWOSelectionCriteria(): void {
    let wlOperatorCollection: any = this.getEmptyFilterObject();

    for (const item of this.wlOperatorSelectionData.list) {
      wlOperatorCollection[item.operation].push(item.list[0]);
    }

    if (wlOperatorCollection.INCLUDE.length > 0
      && wlOperatorCollection.EXCLUDE.length > 0
    ) {
      const commonCriteria = this.intersectCriteria(
        wlOperatorCollection.INCLUDE,
        wlOperatorCollection.EXCLUDE,
        (e: any) => e
      );

      if (commonCriteria.length > 0) {
        this.selectionError.wlOperator = 'Invalid Selection Criteria';
        wlOperatorCollection = this.getEmptyFilterObject();
      } else {
        this.selectionError.wlOperator = '';
        wlOperatorCollection = this.getEmptyFilterObject();
      }
    } else {
      this.selectionError.wlOperator = '';
      wlOperatorCollection = this.getEmptyFilterObject();
    }
  }

  sourcePackageSelection(event: any, sourcePackage: any): void {
    if (event.isUserInput) {
      if (event.source.selected) {
        this.addItemToSelection(
          this.sourcePackageSelectionData.list,
          sourcePackage,
          this.acForm.controls.sourcePackage_filter.value.toUpperCase()
        );
      }
      setTimeout(() => {
        this.acForm.get('sourcePackages')?.setValue('5a1d57b63976838402208d37');
        this.acForm.updateValueAndValidity();
      }, 0);
      this.validateSourcePackageSelectionCriteria();
    }
  }

  validateSourcePackageSelectionCriteria(): void {
    let sourcePackageCollection: any = this.getEmptyFilterObject();

    for (const item of this.sourcePackageSelectionData.list) {
      sourcePackageCollection[item.operation].push(item.list[0]);
    }

    if (sourcePackageCollection.INCLUDE.length > 0
      && sourcePackageCollection.EXCLUDE.length > 0
    ) {
      const commonCriteria = this.intersectCriteria(
        sourcePackageCollection.INCLUDE,
        sourcePackageCollection.EXCLUDE,
        (e: any) => e
      );

      if (commonCriteria.length > 0) {
        this.selectionError.sourcePackage = 'Invalid Selection Criteria';
        sourcePackageCollection = this.getEmptyFilterObject();
      } else {
        this.selectionError.sourcePackage = '';
        sourcePackageCollection = this.getEmptyFilterObject();
      }
    } else {
      this.selectionError.sourcePackage = '';
      sourcePackageCollection = this.getEmptyFilterObject();
    }
  }

  displayLocation(loc: any): string {
    if (loc) {
      return loc.location;
    }

    return '';
  }

  //  displayLocation(value: location[] | any): any | undefined {
  //   let displayValue: string;
  //   if (Array.isArray(value)) {
  //     value.forEach((location, index) => {
  //       if (index === 0) {
  //         displayValue = loc.location;
  //       } else {
  //         displayValue += "";
  //       }
  //     });
  //   } else {
  //     displayValue = value;
  //   }
  //   return displayValue;
  // }

  // displayApp(app: any) {
  //   if (app) {
  //     return `${app.appName} - ${app.packageName}`;
  //   }

  //   return "";
  // }

  displayMaker(make: any): string {
    if (make) {
      return make.name;
    }

    return '';
  }

  removeLocationSelection(id: string, listIndex: number): void {
    const index = this.locationSelectionData.list[listIndex].list.findIndex((obj: any) => obj.id === id);
    this.locationSelectionData.list[listIndex].list.splice(index, 1);
    if (this.locationSelectionData.list[listIndex].list.length === 0) {
      this.locationSelectionData.list.splice(listIndex, 1);
    }
    if (this.editLocationRuleIndex !== -1
      && this.locationSelectionData.list[this.editLocationRuleIndex] === undefined
    ) {
      this.editLocationRuleIndex = -1;
    }
  }

  removeLocationRule(listIndex: number): void {
    this.locationSelectionData.list.splice(listIndex, 1);
    this.editLocationRuleIndex = -1;
  }

  removeAppSelection(id: string, listIndex: number): void {
    const index = this.appSelectionData.list[listIndex].list.findIndex((obj: any) => obj.id === id);
    this.appSelectionData.list[listIndex].list.splice(index, 1);
    if (this.appSelectionData.list[listIndex].list.length === 0) {
      this.appSelectionData.list.splice(listIndex, 1);
    }
    if (this.editInstalledAppRuleIndex !== -1
      && this.appSelectionData.list[this.editInstalledAppRuleIndex] === undefined
    ) {
      this.editInstalledAppRuleIndex = -1;
    }
    // this.validateInstalledAppSelectionCriteria();
  }

  removeAppRule(listIndex: number): void {
    this.appSelectionData.list.splice(listIndex, 1);
    // this.validateInstalledAppSelectionCriteria();
    this.editInstalledAppRuleIndex = -1;
  }

  removeMakerSelection(id: string, listIndex: number): void {
    const index = this.makersSelectionData.list[listIndex].list.findIndex((obj: any) => obj.id === id);
    this.makersSelectionData.list[listIndex].list.splice(index, 1);
    if (this.makersSelectionData.list[listIndex].list.length === 0) {
      this.makersSelectionData.list.splice(listIndex, 1);
    }
    this.validateMakersSelectionCriteria();
  }

  removeOSSelection(id: string, listIndex: number): void {
    const index = this.osSelectionData.list[listIndex].list.findIndex((obj: any) => obj.id === id);
    this.osSelectionData.list[listIndex].list.splice(index, 1);
    if (this.osSelectionData.list[listIndex].list.length === 0) {
      this.osSelectionData.list.splice(listIndex, 1);
    }
    this.validateOSSelectionCriteria();
  }

  removeWOSelection(id: string, listIndex: number): void {
    const index = this.wlOperatorSelectionData.list[listIndex].list.findIndex((obj: any) => obj.id === id);
    this.wlOperatorSelectionData.list[listIndex].list.splice(index, 1);
    if (this.wlOperatorSelectionData.list[listIndex].list.length === 0) {
      this.wlOperatorSelectionData.list.splice(listIndex, 1);
    }
    this.validateWOSelectionCriteria();
  }

  removeSourcePackageSelection(id: string, listIndex: number): void {
    const index = this.sourcePackageSelectionData.list[listIndex].list.findIndex((obj: any) => obj.id === id);
    this.sourcePackageSelectionData.list[listIndex].list.splice(index, 1);
    if (this.sourcePackageSelectionData.list[listIndex].list.length === 0) {
      this.sourcePackageSelectionData.list.splice(listIndex, 1);
    }
    this.validateSourcePackageSelectionCriteria();
  }



  getEmptyFilterObject(): any {
    return { INCLUDE: [], EXCLUDE: [] };
  }

  getAllProgressFlagObject(): any {
    return {
      locationSearchFlag: false,
      noLocationFlag: false,
      installAppSearchFlag: false,
      noInstallAppFlag: false,
      runnnigAppSearchFlag: false,
      noRunnnigAppFlag: false,
      modelSearchFlag: false,
      noModeFlag: false,
      nameSearchFlag: false,
      campaignSearchFlag: false,
      noCampaignFlag: false,
      placeConfigSearchFlag: false,
      noPlaceConfigFlag: false,
      externalCampaignSearchFlag: false,
      noExternalCampaignFlag: false
    };
  }

  buildClusterCriteria(criteria: any): any {
    const criteriaData = [];

    for (const item of criteria.include) {
      criteriaData.push({
        operation: 'INCLUDE',
        reference: item.id,
        name: (item.name) ? item.name : (item.appName) ? item.appName : item.location
      });
    }

    for (const item of criteria.exclude) {
      criteriaData.push({
        operation: 'EXCLUDE',
        reference: item.id,
        name: (item.name) ? item.name : (item.appName) ? item.appName : item.location
      });
    }

    return criteriaData;
  }

  buildClusterConditionCriteria(criteria: any): any {
    const criteriaData: any = {
      condition: criteria.condition,
      list: []
    };

    if (criteria.list.length > 0) {
      for (const appsList of criteria.list) {
        const apps = [];
        for (const item of appsList.list) {
          apps.push({
            id: item.id,
            name: (item.name) ? item.name : (item.appName) ? item.appName : item.location
          });
        }
        criteriaData.list.push({
          operation: appsList.operation,
          condition: appsList.condition,
          list: apps
        });
      }
    }

    return criteriaData;
  }

  modalClosed(): void {
    if (this.isEdit) {
      this.selectedAudienceClusterEmit.emit(false);
      const that = this;
      // to avoid modal dismiss issue
      setTimeout(() => {
        that.acForm.get('cluster_type')?.setValue('RULE');
      }, 100);
    } else {
      setTimeout(() => {
        this.acForm.get('cluster_type')?.setValue('RULE');
      }, 100);
    }
    this.cancelFileUpload();
    this.cancelFileSanitation();
  }

  resetForm(): void {
    this.progress = this.getAllProgressFlagObject();
    this.selectionData = { include: [{ id: 1, name: 'All' }], exclude: [{ id: 2, name: 'Ohio' }] };
    this.locationSelectionData = getEmptyClusterFilterObject();
    this.appSelectionData = getEmptyClusterFilterObject();
    this.makersSelectionData = getEmptyClusterFilterObject();
    this.osSelectionData = getEmptyClusterFilterObject();
    this.wlOperatorSelectionData = getEmptyClusterFilterObject();
    this.sourcePackageSelectionData = getEmptyClusterFilterObject();
    this.deviceTierSelectionData = getEmptyClusterFilterObject();

    this.acForm.get('location')?.reset();
    this.acForm.get('installed_apps')?.reset();
    this.acForm.get('business')?.reset();
    this.acForm.get('makers')?.reset();
    this.acForm.get('wireless')?.reset();
    this.acForm.get('operating_system')?.reset();
    this.acForm.get('name')?.reset('');
    this.acForm.get('clusterFileObj')?.reset(null);
    this.acForm.get('cluster_file')?.reset('');
    this.acForm.get('geoLocations')?.setValue('');
    this.acForm.get('geoRadius')?.setValue(100);
    this.acForm.get('interestingLocationsType')?.setValue('FILE');
    // this.acForm.get('cluster_type').setValue('RULE');

    this.acForm.get('phonePermission')?.setValue('YES');
    this.acForm.get('locationPermission')?.setValue('YES');
    this.acForm.get('disclosureAccepted')?.setValue('YES');
    this.acForm.get('storagePermission')?.setValue('YES');

    this.clusterName = '';
    this.isUniqueName = true;
    this.selectedAudienceCluster = null;
    this.errorMessage = '';
    this.warningMessage = '';
    this.isEdit = false;
    this.selectedPlaceConfig = null;
    this.selectedExternalCampaign = null;

    jQuery('#clientTargetFile, #phoneTargetFile').val('');

    this.fileSanitationError = '';
    this.fileSanitationErrorCount = 0;
    this.fileSanitationData = null;

    this.uploadedFileDetails = null;
    this.isFileSanitationProgress = false;
    const elm = document.getElementById('clientTargetFile') as HTMLInputElement;
    if (elm) {
      elm.value = '';
    }
  }

  changeAppTopFilterCondition(event: any): void {
    if (event.isTrusted) {
      const elements = event.target.children;
      if (document.createEvent) {
        const evt = document.createEvent('MouseEvents');
        evt.initEvent('click', false, false);
        elements[0].dispatchEvent(evt);
      }
      // else if (document['createEventObject']) {
      //   elements[0].fireEvent('onclick') ;
      // }
      else if (typeof elements[0].onclick === 'function') {
        elements[0].onclick();
      }

      this.isFileUploadError = false;
      this.fileUploadErrorTxt = '';
      this.acForm.get('clusterFileObj')?.setValue(null);
    }

  }

  uploadTargetFileChange(fileInput: any): void {
    if (fileInput.target.files && fileInput.target.files[0]) {
      let errorFlag = false;
      this.isFileUploadError = false;
      this.fileUploadErrorTxt = '';
      const fileExtension = fileInput.target.files[0].name.substring(fileInput.target.files[0].name.lastIndexOf('.'));
      if (fileInput.target.files[0].size > 200715200) {
        errorFlag = true;
        this.isFileUploadError = true;
        this.fileUploadErrorTxt = 'Maximum allowed file size is 200 MB';
      }
      if (!errorFlag
        && this.allowedFileType.indexOf(fileInput.target.files[0].type) === -1
        && ['.txt', '.csv'].indexOf(fileExtension) === -1
      ) {
        errorFlag = true;
        this.isFileUploadError = true;
        this.fileUploadErrorTxt = 'File format not allowed, use txt or csv';
      }

      if (!errorFlag) {
        this.isFileUploadProgress = true;
        const formData: FormData = new FormData();
        formData.append('file', fileInput.target.files[0], fileInput.target.files[0].name);
        if (this.acForm.get('cluster_type')?.value === 'CLIENTID') {
          formData.append('type', 'clientId');
        } else if (this.acForm.get('cluster_type')?.value === 'PHONENUMBER') {
          formData.append('type', 'phoneNumber');
          formData.append('countryISOCode', this.orgSettings.countryISOCode);
          formData.append('countryISDCode', this.isoIsdCodes[this.orgSettings.countryISOCode].isd_code);
        } else if (this.acForm.get('cluster_type')?.value === 'EXTERNAL_CLUSTER') {
          formData.append('type', 'externalCluster');
          formData.append('countryISOCode', this.orgSettings.countryISOCode);
          formData.append('countryISDCode', this.isoIsdCodes[this.orgSettings.countryISOCode].isd_code);
        }
        this.fileUpload(formData);
      }
    }
  }

  fileUpload(formData: any = null): void {
    if (formData !== null) {
      this.fileUploadSubscription = this.audienceClusterService.uploadFile(formData).subscribe((res: any) => {
        if (res.type === HttpEventType.UploadProgress) {
          this.uploadedPercentage = Math.round(100 * res.loaded / res.total);
        } else if (res.type === HttpEventType.Response) {
          this.acForm.get('clusterFileObj')?.setValue(res.body.data);
          this.isFileUploadProgress = false;
          this.isFileUploadError = false;
          this.fileUploadErrorTxt = '';
          this.uploadedFileDetails = res.body.data;
          if (this.isEdit
            && this.warningMessage.length === 0
            && this.acForm.get('cluster_type')?.value === 'PHONENUMBER'
          ) {
            this.warningMessage = 'Previously identified devices will not be affected';
          }
          if (this.acForm.get('cluster_type')?.value === 'PHONENUMBER'
            || this.acForm.get('cluster_type')?.value === 'EXTERNAL_CLUSTER'
          ) {
            this.isFileSanitationProgress = true;
            this.fileSanitationError = '';
            this.fileSanitationErrorCount = 0;
            this.fileSanitationData = null;
            this.getFileSanitationData();
          }
        }
      }, (errors) => {
        this.acForm.get('clusterFileObj')?.setValue(null);
        this.fileUploadErrorTxt = 'File fails to upload to server';
        this.isFileUploadProgress = false;
        console.log(getErrorMessage(errors));
      });
    }
  }

  campaignSelection(event: any, campaign: any): void {
    if (event.isUserInput) {
      let newItemFlag = true;

      for (const item of this.campaignSelectionData) {
        if (item.campaignId === campaign.id) {
          newItemFlag = false;
          break;
        }
      }

      if (newItemFlag) {
        this.campaignSelectionData.push({
          campaignId: campaign.id,
          campaignName: campaign.name
        });
      }

      this.progress.noCampaignFlag = false;
      // this.acForm.get('campaign').setValue('');
      // this.filteredCampaign = Observable.of([]);
    }
  }

  displayCampaign(campaign: any): string {
    if (campaign) {
      return `${campaign.name}`;
    }

    return '';
  }

  removeCampaignSelection(campaignId: string): void {
    const index = this.campaignSelectionData.findIndex((item: any) => item.campaignId === campaignId);
    this.campaignSelectionData.splice(index, 1);
  }

  cancelFileUpload(): void {
    if (this.fileUploadSubscription) {
      this.fileUploadSubscription.unsubscribe();
      this.fileUploadSubscription = null;
      this.isFileUploadProgress = false;
      this.uploadedPercentage = 0;
    }
  }

  getGeoFenceList(event: any): void {
    this.acForm.get('geoLocations')?.setValue(event.selectedList);
    this.acForm.get('geoLocations')?.updateValueAndValidity();
    if (this.isEdit && this.warningMessage.length === 0) {
      this.warningMessage = 'Previously identified devices will not be affected';
    }
  }

  displayPlaceConfig(cluster: any): string {
    if (cluster) {
      return `${cluster.name}`;
    }

    return '';
  }

  placeConfigSelection(event: any, config: any): void {
    this.acForm.controls.placeConfig.setValue('');
    this.acForm.controls.placeConfig.setErrors({ required: true });
    this.acForm.controls.placeConfig.markAsDirty();
    this.selectedPlaceConfig = config;
  }

  removePlaceConfigSelection(): void {
    this.selectedPlaceConfig = null;
  }

  displayExternalCamapaign(cluster: any): string {
    if (cluster) {
      return `${cluster.name}`;
    }

    return '';
  }

  externalCampaignSelection(event: any, campaign: any): void {
    this.acForm.controls.exteralCampaign.setValue('');
    this.acForm.controls.exteralCampaign.setErrors({ required: true });
    this.acForm.controls.exteralCampaign.markAsDirty();
    this.selectedExternalCampaign = campaign;
  }

  removeExternalCampaignSelection(): void {
    this.selectedExternalCampaign = null;
  }

  toStandardDate(date: Date): any {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }

    return [year, month, day].join('-');
  }

  getFileDetails(fileId: string): void {
    this.apiService.get('files/' + fileId).subscribe(res => {
      this.uploadedFileDetails = res.data;
      this.acForm.get('clusterFileObj')?.setValue(res.data);
      this.isFileUploadError = false;
      this.fileUploadErrorTxt = '';
    }, (error) => {
      this.isFileUploadError = true;
      this.fileUploadErrorTxt = getErrorMessage(error);
    });
  }

  getTimeSlots(event: any): void {
    this.timeSlots = event.times;
    this.timeSlotErrorFlag = event.error;
  }

  getOrgSettings(): void {
    const orgId = JSON.parse(localStorage.getItem('iup') || '{}').data.organization.id;

    this.apiService.get(`organizations/${orgId}`).subscribe(res => {
      this.orgSettings = res.data;
      if (this.acForm.controls.cluster_type.value !== 'EXTERNAL_CLUSTER') {
        const selectedOptionTag = this.clusterTypeListElm.find(optionTag => optionTag.nativeElement.value === 'PHONENUMBER');
        this.renderer.setProperty(selectedOptionTag?.nativeElement, 'disabled', false);
      } else {
        this.renderer.setProperty(this.clientTargetFile.nativeElement, 'disabled', false);
      }
    }, errors => {
      console.log(getErrorMessage(errors));
    });
  }

  getFileSanitationData(): void {
    const fileId = (this.acForm.controls.clusterFileObj.value && this.acForm.controls.clusterFileObj.value.id)
      ? this.acForm.controls.clusterFileObj.value.id
      : null;
    if (fileId !== null) {
      this.apiService.get(`files/preview/${fileId}`).subscribe(res => {
        if (res.status === '101') {
          if (this.fileSanitationTimeout) {
            clearTimeout(this.fileSanitationTimeout);
            this.fileSanitationTimeout = null;
          }
          this.fileSanitationTimeout = setTimeout(() => {
            this.getFileSanitationData();
          }, 5000);
        } else if (res.status === '102') {
          this.isFileSanitationProgress = false;
          this.fileSanitationError = res.message;
        } else if (res.status === '0') {
          this.isFileSanitationProgress = false;
          this.fileSanitationData = [];
          res.data.content.forEach((item: any) => {
            const numbers = item.split(',');
            this.fileSanitationData.push({
              before: numbers[0],
              after: numbers[1]
            });
          });
        }
      }, errors => {
        console.log(getErrorMessage(errors));
        if (errors.status === 404) {
          this.fileSanitationErrorCount += 1;
          if (this.fileSanitationErrorCount > 2) {
            this.fileSanitationError = getErrorMessage(errors);
            this.isFileSanitationProgress = false;
          } else {
            if (this.fileSanitationTimeout) {
              clearTimeout(this.fileSanitationTimeout);
              this.fileSanitationTimeout = null;
            }
            this.fileSanitationTimeout = setTimeout(() => {
              this.getFileSanitationData();
            }, 5000);
          }
        } else {
          this.fileSanitationError = getErrorMessage(errors);
          this.isFileSanitationProgress = false;
        }
      });
    }
  }

  cancelFileSanitation(): void {
    this.isFileSanitationProgress = false;
    this.fileSanitationTimeout = null;
    this.fileSanitationError = '';
    this.fileSanitationErrorCount = 0;
    if (this.fileSanitationTimeout) {
      clearTimeout(this.fileSanitationTimeout);
    }
  }

  validateDeviceTierSelectionCriteria(): void {
    const deviceTierCollection: any = this.getEmptyFilterObject();

    for (const item of this.deviceTierSelectionData.list) {
      deviceTierCollection[item.operation].push(item.list[0]);
    }

    if (deviceTierCollection.INCLUDE.length > 0
      && deviceTierCollection.EXCLUDE.length > 0
    ) {
      const commonCriteria = this.intersectCriteria(
        deviceTierCollection.INCLUDE,
        deviceTierCollection.EXCLUDE,
        (e: any) => e
      );

      if (commonCriteria.length > 0) {
        this.selectionError.deviceTier = 'Invalid Selection Criteria';
      } else {
        this.selectionError.deviceTier = '';
      }
    } else {
      this.selectionError.deviceTier = '';
    }
  }

  deviceTierSelection(event: any, deviceCatogory: any): void {
    if (event.isUserInput) {
      if (event.source.selected) {
        this.addItemToSelection(
          this.deviceTierSelectionData.list,
          deviceCatogory,
          this.acForm.controls.deviceTier_filter.value.toUpperCase()
        );
      }
      setTimeout(() => {
        this.acForm.get('deviceTier')?.setValue('5a548ebed608473f29a15abf');
        this.acForm.updateValueAndValidity();
      }, 0);
      this.validateDeviceTierSelectionCriteria();
    }
  }

  removeDeviceTierSelection(id: string, listIndex: number): void {
    const index = this.deviceTierSelectionData.list[listIndex].list.findIndex((obj: any) => obj.id === id);
    this.deviceTierSelectionData.list[listIndex].list.splice(index, 1);
    if (this.deviceTierSelectionData.list[listIndex].list.length === 0) {
      this.deviceTierSelectionData.list.splice(listIndex, 1);
    }
    this.validateDeviceTierSelectionCriteria();
  }

  getDeviceTierList(): void {
    this.apiService.get(`devicetier`).subscribe((res) => {
      this.deviceTierList = res.data;
    }, errors => {
      console.log(getErrorMessage(errors));
    });
  }

}
