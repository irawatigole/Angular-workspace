import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { AudienceClusterService } from '../audience-cluster.service';
import { trimString, getEmptyClusterFilterObject, radix } from '../../../../../my-lib/src/lib/helper/basic';
import { CapitalizePipe } from '../../../../../my-lib/src/lib/helper/capitalize.pipe';
import { getErrorMessage } from '../../../../../my-lib/src/lib/helper/errors';
declare var jQuery: any;
@Component({
  selector: 'app-manage-cluster',
  templateUrl: './manage-cluster.component.html',
  styleUrls: ['./manage-cluster.component.sass'],
  providers: [AudienceClusterService, CapitalizePipe]
})
export class ManageClusterComponent implements OnInit {
  clusterList: any;
  clusterListLoading!: boolean;
  searchText!: string;
  isDesc!: boolean;
  column!: string;
  direction!: number;
  activeRow: any;
  activeRowDetails: any;
  clusterDetailsLoading!: boolean;
  clusterName!: string;
  clusterNameControl = new FormControl();
  isUniqueNewClusterName!: boolean;
  audienceTargetLevel = 3;
  reachCount = null;
  loadingReachCount = false;
  permissions: any;
  organizationId!: string;
  canRename!: boolean;
  canClone!: boolean;
  canEdit!: boolean;
  canDelete!: boolean;
  canCreate!: boolean;
  isLoadingSearchClusterName!: boolean;
  isLoading!: boolean;
  isListEmpty = false;
  isClusterNameError = false;
  clusterNameError = '';
  clusterCriteria: any = { include: [], exclude: [] };
  isNewCluster!: boolean;
  editOrgDetails: null;
  currentUserId!: string;
  installedTopCondition!: string;
  getReachCountSetTimeOut: any = null;
  activeDeviceReachCount: any = null;
  newReachCount = null;
  newActiveDeviceReachCount = null;
  loadingNewReachCount = false;
  isNewReachCountLoading = false;
  getNewReachCountSetTimeOut: any = null;
  loopNewCount = 0;
  newWarningFlag = false;
  showNewReachCountFlag = false;
  fileSanitationData: any;
  isFileSanitationProgress = false;
  fileSanitationTimeout: any;
  fileSanitationError!: string;
  fileSanitationErrorCount = 0;
  clusterSearchForm: FormGroup;
  modifyClusterNameForm: FormGroup;

  private unsubscribe: Subject<any> = new Subject<any>();

  constructor(
    private audienceClusterService: AudienceClusterService,
    private titleService: Title,
    private capitalize: CapitalizePipe,
    private route: ActivatedRoute,
  ) {
    this.clusterList = [];
    this.clusterListLoading = true;
    this.isDesc = false;
    this.column = 'createdAt';
    this.direction = -1;
    this.activeRow = null;
    this.activeRowDetails = null;
    this.clusterDetailsLoading = true;
    this.isUniqueNewClusterName = false;
    this.clusterName = '';
    this.canRename = false;
    this.canClone = false;
    this.canEdit = false;
    this.canDelete = false;
    this.canCreate = false;
    this.permissions = JSON.parse(localStorage.getItem('iup') || '{}').data.permissions;
    this.organizationId = JSON.parse(localStorage.getItem('iup') || '{}').data.organization.id;
    this.currentUserId = JSON.parse(localStorage.getItem('iup') || '{}').data.user.id;
    this.isLoadingSearchClusterName = false;
    this.isLoading = false;
    this.isNewCluster = false;
    this.installedTopCondition = 'All';
    // alertify.delay(10000);
    // alertify.logPosition('bottom right');  // set to right size
    this.showNewReachCountFlag = (
      this.route.snapshot.queryParamMap.get('nr') !== null
      && this.route.snapshot.queryParamMap.get('nr') === '1'
    ) ? true : false;
    this.clusterSearchForm = new FormGroup({
      searchText: new FormControl('')
    });

    this.modifyClusterNameForm = new FormGroup({
      clusterName: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Cluster Management');
    this.getClusters();
    if ((this.permissions.hasOwnProperty('C_AC'))
      || (this.permissions.hasOwnProperty('C_AC_OWN_ORG'))
    ) {
      this.canCreate = true;
    }

    this.clusterSearchForm.controls.searchText.valueChanges
      .pipe(debounceTime(100)
        , takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.searchText = data;
      });

    this.modifyClusterNameForm.controls.clusterName.valueChanges
      .pipe(debounceTime(100)
        , takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.clusterName = data;
      });
  }

  sort(property: string): void {
    this.isDesc = !this.isDesc;
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  }

  rowToggle(event: any): void {
    if (jQuery(event.target.parentNode).hasClass('active')) {
      this.activeRow = null;
      this.activeRowDetails = null;
      event.target.parentNode.classList.remove('active');
    } else {
      this.activeRowDetails = null;
      this.activeRow = this.clusterList.filter((cluster: any) => cluster.id === jQuery(event.target.parentNode).attr('data-index'))[0];
      jQuery(event.target.parentNode).addClass('active').siblings().removeClass('active');
      this.clusterDetailsLoading = true;
      this.audienceClusterService.getClusterDetails(jQuery(event.target.parentNode).attr('data-index'))
        .subscribe(
          (resp) => {
            this.fileSanitationData = of([]);
            this.activeRowDetails = resp.data;

            if (this.activeRowDetails.clusterType === 'RULE') {
              this.activeRowDetails.locations = JSON.parse(this.activeRowDetails.locations);
              this.activeRowDetails.installedApps = JSON.parse(this.activeRowDetails.installedApps);
              this.installedTopCondition = this.capitalize.transform(this.activeRowDetails.installedApps.condition);
              // this.activeRowDetails.runningApps = JSON.parse(this.activeRowDetails.runningApps);
              this.activeRowDetails.makers = JSON.parse(this.activeRowDetails.makers);
              this.activeRowDetails.osVersions = JSON.parse(this.activeRowDetails.osVersions);
              this.activeRowDetails.wirelessOperators = JSON.parse(this.activeRowDetails.wirelessOperators);
              this.activeRowDetails.sourcePackages = JSON.parse(this.activeRowDetails.sourcePackages);
              this.activeRowDetails.deviceTier = JSON.parse(this.activeRowDetails.deviceTier);
            }
            if (this.activeRowDetails.clusterType === 'INTERESTINGLOCATIONS') {
              this.activeRowDetails.geoLocations = JSON.parse(this.activeRowDetails.geoLocations);
            }
            if (this.activeRowDetails.clusterType === 'PHONENUMBER') {
              this.getFileSanitationData();
            }
            this.clusterDetailsLoading = false;
            this.prepare();
            this.authorization();
          },
          (errors) => {
            console.log(getErrorMessage(errors));
            // alertify.closeLogOnClick(true).error(getErrorMessage(errors));
          });

    }
  }

  authorization(): void {
    this.canEdit = false;
    this.canClone = false;
    this.canRename = false;
    this.canDelete = false;

    if (this.permissions.hasOwnProperty('U_AC')) {
      this.canRename = true;
      this.canEdit = true;
    } else if (
      (this.organizationId === this.activeRowDetails.organizationId)
      && (this.currentUserId === this.activeRowDetails.userId)
      && this.permissions.hasOwnProperty('U_CAMPAIGN_OWN')) {
      this.canRename = true;
      this.canEdit = true;
    }

    if (((this.organizationId === this.activeRowDetails.organizationId)
      && this.permissions.hasOwnProperty('C_AC_OWN_ORG'))
      || this.permissions.hasOwnProperty('C_AC')) {
      this.canClone = true;
    }

    if (((this.organizationId === this.activeRowDetails.organizationId)
      && this.permissions.hasOwnProperty('D_AC_OWN_ORG'))
      || this.permissions.hasOwnProperty('D_AC')) {
      this.canDelete = true;
    }

  }

  prepare(): void {
    if (this.getReachCountSetTimeOut) {
      clearTimeout(this.getReachCountSetTimeOut);
      this.updateReachCount({ data: { count: 0, activeDeviceReachCount: 0 } });
    }
    this.loopAudienceReachCount();
    if (this.showNewReachCountFlag) {
      if (this.getNewReachCountSetTimeOut) {
        clearTimeout(this.getNewReachCountSetTimeOut);
        this.updateNewReachCount({ data: { count: 0, activeDeviceReachCount: 0 } });
      }
      this.loopNewAudienceReachCount();
    }
  }

  getClusters(): void {
    this.audienceClusterService.getClusters('5a294f81993c8f1570c2550d')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (list) => {
          this.clusterList = list.data;
          this.clusterListLoading = false;
          this.isListEmpty = false;
        },
        (errors: any) => {
          this.clusterListLoading = false;
          this.clusterList = [];
          this.isListEmpty = true;
        }
      );
  }

  renameCluster(event: any): void {
    jQuery('#renameClusterModel').modal('show');
  }

  updateClusterName(): void {
    this.isLoading = true;
    this.isClusterNameError = false;
    this.clusterName = trimString(this.clusterName);
    if (this.clusterName.length > 2) {
      this.isLoadingSearchClusterName = true;
      this.audienceClusterService.getClusterByName(this.clusterName)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((resp: any) => {
          this.isLoadingSearchClusterName = false;
          if (resp.message === 'false') {
            const updatedCluster = { name: this.clusterName };
            this.audienceClusterService.updateCluster(updatedCluster, this.activeRowDetails.id)
              .pipe(takeUntil(this.unsubscribe))
              .subscribe((res) => {
                this.activeRow.name = this.clusterName;
                this.activeRowDetails.name = this.clusterName;
                // alertify.success('Cluster name updated successfully');
                this.clusterName = '';
                this.isLoading = false;
                this.modifyClusterNameForm.controls.clusterName.setValue('');
                jQuery('#renameClusterModel').modal('hide');
              }, (errors: any) => {
                this.isLoading = false;
                this.isClusterNameError = true;
                this.clusterNameError = getErrorMessage(errors);
                this.modifyClusterNameForm.controls.clusterName.setValue('');
              });
          } else {
            this.isLoading = false;
            this.isClusterNameError = true;
            this.clusterNameError = 'Cluster name is already exists, try different name';
          }
        }, (errors: any) => {
          this.isLoading = false;
          this.isClusterNameError = true;
          this.clusterNameError = getErrorMessage(errors);
          this.modifyClusterNameForm.controls.clusterName.setValue('');
        });
    } else {
      this.isLoading = false;
      this.isClusterNameError = true;
      this.clusterNameError = 'Cluster name is required and minimum of 3 character';
    }

  }

  duplicateCluster(event: any): void {
    jQuery('#duplicateClusterModel').modal('show');
  }

  cloneCluster(): void {
    this.isLoading = true;
    this.isClusterNameError = false;
    this.clusterName = trimString(this.clusterName);
    if (this.clusterName.length > 2) {
      this.isLoadingSearchClusterName = true;
      this.audienceClusterService.getClusterByName(this.clusterName)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((resp: any) => {
          this.isLoadingSearchClusterName = false;
          if (resp.message === 'false') {

            const audienceClusterInput = {
              newAudienceClusterName: this.clusterName,
              sourceAudienceClusterId: this.activeRow.id
            };

            this.audienceClusterService.cloneCluster(audienceClusterInput)
              .pipe(takeUntil(this.unsubscribe))
              .subscribe((res) => {
                jQuery('#duplicateClusterModel').modal('hide');
                this.modifyClusterNameForm.controls.clusterName.setValue('');
                // alertify.success('Cluster cloned successfully');
                this.updatedClusterList(null);
                this.clearText();
              }, (errors: any) => {
                this.isLoading = false;
                this.isClusterNameError = true;
                this.clusterNameError = getErrorMessage(errors);
              });
          } else {
            this.isLoading = false;
            this.isClusterNameError = true;
            this.clusterNameError = 'Cluster name is already exists, try different name';
          }
        }, (errors: any) => {
          this.isLoading = false;
          this.isClusterNameError = true;
          this.clusterNameError = getErrorMessage(errors);
        });
    } else {
      this.isLoading = false;
      this.isClusterNameError = true;
      this.clusterNameError = 'Cluster name is required and minimum of 3 character';
    }

  }

  deleteCluster(event: any): void {
    jQuery('#deleteClusterModel').modal('show');
  }

  destroyCluster(event: any): void {
    if (this.activeRow != null) {
      this.isLoading = true;
      this.isClusterNameError = false;
      this.audienceClusterService.deleteCluster(this.activeRow.id)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((resp: any) => {
          this.updatedClusterList(null);
          jQuery('#deleteClusterModel').modal('hide');
          this.isLoading = false;
          this.isClusterNameError = false;
          // alertify.success('Cluster deleted successfully');
        },
          (errors: any) => {
            // jQuery('#deleteClusterModel').modal('hide');
            this.isLoading = false;
            this.isClusterNameError = true;
            this.clusterNameError = getErrorMessage(errors);
          }
        );
    }
  }

  searchClusterName(): void {
    this.isUniqueNewClusterName = false;
    this.isLoadingSearchClusterName = true;
    if (this.clusterName.trim().length > 2) {
      this.audienceClusterService.getClusterByName(trimString(this.clusterName))
        .pipe(debounceTime(800),
          takeUntil(this.unsubscribe))
        .subscribe((resp: any) => {
          if (resp.message === 'false') {
            this.isUniqueNewClusterName = true;
          } else {
            this.isUniqueNewClusterName = false;
          }
          this.isLoadingSearchClusterName = false;
        },
          (errors: any) => {
            console.log(getErrorMessage(errors));
            this.isLoadingSearchClusterName = false;
          });
    }
  }

  updatedClusterList(data: any): void {
    this.editOrgDetails = null;
    if (data !== false) {
      this.activeRow = null;
      this.activeRowDetails = null;
      this.clusterListLoading = true;
      this.getClusters();
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.getReachCountSetTimeOut);
    clearTimeout(this.getNewReachCountSetTimeOut);
    clearInterval(this.fileSanitationTimeout);
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  clearText(): void {
    this.clusterName = '';
    this.isLoading = false;
    this.clusterNameError = '';
    this.isClusterNameError = false;
    this.isUniqueNewClusterName = false;
  }

  loopAudienceReachCount(force: boolean = false, loopReachCount: boolean = true): void {
    if (this.activeRowDetails !== null) {
      if (loopReachCount) {
        const clusterCriteria: any = getEmptyClusterFilterObject();
        clusterCriteria.list.push({
          condition: 'ANY',
          operation: 'INCLUDE',
          list: [{ id: this.activeRowDetails.id, name: this.activeRowDetails.name }]
        });
        this.clusterCriteria = clusterCriteria;
        this.clusterCriteria = clusterCriteria;


        this.audienceClusterService.getAudienceReachCount(clusterCriteria, force)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(
            (list) => {
              if (parseInt(list.status, radix) !== 100) {
                this.updateReachCount(list.data);
                loopReachCount = false;
              } else {
                loopReachCount = true;
                this.updateReachCount({ loading: true });
              }

              if (this.getReachCountSetTimeOut !== null) {
                clearTimeout(this.getReachCountSetTimeOut);
                this.getReachCountSetTimeOut = null;
              }

              setTimeout(() => {
                this.loopAudienceReachCount(false, loopReachCount);
              }, 10000);
            },
            (errors: any) => {
              loopReachCount = true;
              this.loopAudienceReachCount();
              console.log(getErrorMessage(errors));
            });
      }
    }
  }

  updateReachCount(data: any): void {
    if (data !== null) {
      if (data.loading) {
        this.loadingReachCount = true;
        this.reachCount = null;
      } else {
        this.audienceTargetLevel = data.scope;
        this.reachCount = data.count;
        this.activeDeviceReachCount = data.activeDeviceReachCount;
        this.loadingReachCount = false;
      }
    }
  }

  refreshReachCount(): void {
    this.reachCount = null;
    this.loopAudienceReachCount(true);
  }

  editCluster(): void {
    this.isNewCluster = false;
    this.editOrgDetails = this.activeRowDetails;
    setTimeout(() => {
      jQuery('#customAudienceClusterModal').modal('show');
    }, 100);
  }

  addCluster(): void {
    this.isNewCluster = true;
    setTimeout(() => {
      jQuery('#customAudienceClusterModal').modal('show');
    }, 100);
  }

  loopNewAudienceReachCount(force: boolean = false, loopNewReachCount: boolean = true): void {
    if (this.activeRowDetails !== null) {
      if (loopNewReachCount) {
        if (force) {
          jQuery('#force-new-reach-count-btn i').addClass('fa-spin');
        }
        const clusterCriteria: any = getEmptyClusterFilterObject();
        clusterCriteria.list.push({
          condition: 'ANY',
          operation: 'INCLUDE',
          list: [{ id: this.activeRowDetails.id, name: this.activeRowDetails.name }]
        });
        this.clusterCriteria = clusterCriteria;
        this.clusterCriteria = clusterCriteria;


        this.audienceClusterService.getNewAudienceReachCount(clusterCriteria, force)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(
            (list) => {
              if (parseInt(list.status, radix) !== 100) {
                this.updateNewReachCount(list.data);
                loopNewReachCount = false;
              } else {
                loopNewReachCount = true;
                this.updateNewReachCount({ loading: true });
              }

              if (this.getNewReachCountSetTimeOut !== null) {
                clearTimeout(this.getNewReachCountSetTimeOut);
                this.getNewReachCountSetTimeOut = null;
              }

              this.getNewReachCountSetTimeOut = setTimeout(() => {
                this.loopNewAudienceReachCount(false, loopNewReachCount);
              }, 10000);
            },
            (errors: any) => {
              loopNewReachCount = true;
              this.loopNewAudienceReachCount();
              console.log(getErrorMessage(errors));
            });
      }
    }
  }

  updateNewReachCount(data: any): void {
    if (data !== null) {
      if (data.loading) {
        this.loadingNewReachCount = true;
        this.newReachCount = null;
      } else {
        jQuery('#force-new-reach-count-btn i').removeClass('fa-spin');
        this.newReachCount = data.count;
        this.newActiveDeviceReachCount = data.activeDeviceReachCount;
        this.loadingNewReachCount = false;
      }
    }
  }

  refreshNewReachCount(): void {
    this.newReachCount = null;
    this.loopNewAudienceReachCount(true);
  }

  getDayOfWeek(day: any): string {
    switch (day) {
      case 0:
        return 'Sunday';
      case 1:
        return 'Monday';
      case 2:
        return 'Tuesday';
      case 3:
        return 'Wednesday';
      case 4:
        return 'Thursday';
      case 5:
        return 'Friday';
      case 6:
        return 'Saturday';
      case 7:
        return 'Not a Day';
      default:
        return '';
    }
  }

  minutesToTime(totalMin: number): any {
    const hh: number = Math.trunc(totalMin / 60);
    let mm: any = totalMin - (hh * 60);
    const med: string = hh < 12 ? 'AM' : 'PM';

    let H: any = (med === 'PM') ? (hh - 12) : hh;
    if (hh === 12 && med === 'PM') { H = 12; }
    if (hh === 0) { H = 12; }
    if (mm === 0) {
      mm = '00';
    } else if (mm < 10) {
      mm = `0${mm}`;
    }
    return `${H}:${mm} ${med}`;
  }

  getFileSanitationData(): void {
    this.isFileSanitationProgress = true;
    const fileId = this.activeRowDetails.clusterFileId;
    this.audienceClusterService.getClusterFilePreview(fileId).subscribe(res => {
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
        const normalization: any = [];
        res.data.content.forEach((item: any) => {
          const numbers = item.split(',');
          normalization.push({
            before: numbers[0],
            after: numbers[1]
          });
        });

        this.fileSanitationData = of(normalization);
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
