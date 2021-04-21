import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { AudienceClusterService } from '../audience-cluster.service';
import { trimString, getEmptyClusterFilterObject, radix } from '../../../../../my-lib/src/lib/helper/basic';
import { CapitalizePipe } from '../../../../../my-lib/src/lib/helper/capitalize.pipe';
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
   }

  ngOnInit(): void {
    this.titleService.setTitle('Cluster Management');
    this.getClusters();

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

}
