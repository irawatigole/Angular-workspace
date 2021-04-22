import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ContentService } from '../content.service';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, Validators, } from '@angular/forms';
import { takeUntil, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-manage-content',
  templateUrl: './manage-content.component.html',
  styleUrls: ['./manage-content.component.sass']
})
export class ManageContentComponent implements OnInit {
  private curentModal: Subject<void> = new Subject<void>();
  private unsubscribe: Subject<any> = new Subject<any>();
  componentData = null;
  contentList!: any[];
  initLoading = true;
  isListEmpty = false;
  contentLoading = false;
  isDesc = false;
  column = 'updatedAt';
  direction = -1;
  activeRow: any = null;
  searchText = '';
  imageContentType = '';
  permissions: any;
  canEditImageFlag = false;
  canEditVideoFlag = false;
  canCreateImageFlag = false;
  canCreateVideoFlag = false;
  canDeleteVideoFlag = false;
  canDeleteImageFlag = false;
  isNewImageContent = true;
  isNewVideoContent = true;
  imageContentDetail: any;
  videoContentDetail: any;
  orgId!: string;
  deleteLoadingFlag = false;
  contentDeleteError!: string;
  selectedCarouselData: any = null;
  maxAllowedImageSize: any;
  maxAllowedVideoSize!: number;
  orgSettings: any;
  isUnSupportedVideo = false;
  videoCanPlay = false;
  isSelectedVideoPlaying = false;
  canDownloadImageFlag = false;
  canDownloadVideoFlag = false;
  contentForm: FormGroup;
  isGifPlaying = false;

  constructor(
    private contentService: ContentService,
    private titleService: Title
  ) {
    this.permissions = JSON.parse(localStorage.getItem('iup') || '{}')?.data?.permissions;
    this.orgId = JSON.parse(localStorage.getItem('iup') || '{}')?.data?.organization?.id;
    // this.getOrgSettings();
    this.contentService.getAllImageContentByOrganization('5a294f81993c8f1570c2550d').subscribe((res) => {
      this.contentService.getAllVideoContentByOrganization('5a294f81993c8f1570c2550d').subscribe((resp) => {
        const videoContentList = resp?.data?.map((video: any) => {
          if (video.videoContentFlag) {
            video.imageContentType = 'VIDEO';
          } else {
            video.imageContentType = 'GIF';
          }
          return video;
        });
        this.initLoading = false;
        this.isListEmpty = false;
        this.contentList = res?.data?.concat(videoContentList);
      }, (errors) => {
        this.initLoading = false;
        this.contentList = res?.data;
      });
    }, (errors) => {
      this.initLoading = false;
      this.isListEmpty = true;
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Content Management');
  }

  // getOrgSettings(): void {
  //   const organizationId = JSON.parse(localStorage.getItem('iup') || '{}')?.data?.organization?.id;
  //   this.orgService.getOrganizationById(organizationId)
  //     .subscribe((res) => {
  //       this.orgSettings = res.data;
  //       this.setMaxImageUploadSize();
  //       this.setMaxVideoUploadSize();
  //     }, (errors) => {
  //       console.log(getErrorMessage(errors));
  //     });
  // }

}
