import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { getErrorMessage } from '../../../../../my-lib/src/lib/helper/errors';
import { radix } from '../../../../../my-lib/src/lib/helper/basic';
import { ContentService } from '../content.service';
import { Subject } from 'rxjs';
import { FormControl, FormGroup, Validators, } from '@angular/forms';
import { takeUntil, debounceTime } from 'rxjs/operators';
declare var jQuery: any;
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
    this.canCreateImageContent();
    this.canEditImageContent();
    this.canCreateVideoContent();
    this.canEditVideoContent();
    this.canDeleteVideoContent();
    this.canDeleteImageContent();
    this.contentForm = new FormGroup({
      searchText: new FormControl('')
    });    this.contentService.getAllImageContentByOrganization('5a294f81993c8f1570c2550d').subscribe((res) => {
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
    this.contentForm.controls.searchText.valueChanges
      .pipe(debounceTime(100)
      , takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.searchText = data;
    });
  }

  sort(property: string): void {
    this.isDesc = !this.isDesc;
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  }

  rowToggle(event: any): void {
    this.contentLoading = true;
    this.isSelectedVideoPlaying = false;
    this.isUnSupportedVideo = false;
    if (jQuery(event.target.parentNode).hasClass('active')) {
      this.activeRow = null;
      event.target.parentNode.classList.remove('active');
      this.selectedCarouselData = null;
    } else {
      if (jQuery(event.target.parentNode).attr('data-index') != null) {
        this.activeRow = this.contentList.filter((content) => content.id === jQuery(event.target.parentNode).attr('data-index'))[0];
        jQuery(event.target.parentNode).addClass('active').siblings().removeClass('active');
      } else {
        this.activeRow = this.contentList.filter((content) => content.id === jQuery(event.target).closest('tr').attr('data-index'))[0];
        jQuery(event.target.parentNode.parentNode).addClass('active').siblings().removeClass('active');
      }
      this.buildCarouselData();
    }
    this.canEditImageContent();
    this.canEditVideoContent();
    this.canDeleteImageContent();
    this.canDeleteVideoContent();
    this.canDownloadImageContent();
    this.canDownloadVideoContent();
    this.contentDeleteError = '';
    setTimeout(() => {
      this.contentLoading = false;
    }, 1000);
  }

  buildCarouselData(): void {
    const carouselData: any = {
      notification: {},
      videoContent: null
    };
    let adType = '';
    switch (this.activeRow.imageContentType) {
      case 'NOTIFICATION':
        adType = 'NOTIFICATION_ONLY';
        carouselData.notificationImageContent = {imageUrl: this.activeRow.imageUrl};
        carouselData.mainImageContent = null;
        carouselData.fullImageContent = null;
        break;
      case 'MAIN':
        adType = 'PARTIAL_SCREEN_DISPLAY_ONLY';
        carouselData.notificationImageContent = null;
        carouselData.mainImageContent = {imageUrl: this.activeRow.imageUrl};
        carouselData.fullImageContent = null;
        break;
      case 'FULL':
        adType = 'FULL_SCREEN_DISPLAY_ONLY';
        carouselData.notificationImageContent = null;
        carouselData.mainImageContent = null;
        carouselData.fullImageContent = {imageUrl: this.activeRow.imageUrl};
        break;
      case 'VIDEO':
        adType = 'PARTIAL_SCREEN_DISPLAY_ONLY';
        carouselData.notificationImageContent = null;
        carouselData.mainImageContent = {imageUrl: '/assets/img/empty-partial.png'};
        carouselData.fullImageContent = null;
        carouselData.videoContent = this.activeRow;
        break;
      case 'RICHNOTIFICATION_BIG':
        adType = 'PARTIAL_SCREEN_DISPLAY_ONLY';
        carouselData.notificationImageContent = null;
        carouselData.mainImageContent = {imageUrl: this.activeRow.imageUrl};
        carouselData.fullImageContent = null;
        carouselData.label = 'RICHNOTIFICATION_BIG';
        break;
      case 'GIF':
        adType = 'FULL_SCREEN_DISPLAY_ONLY';
        carouselData.notificationImageContent = null;
        carouselData.mainImageContent = null;
        carouselData.fullImageContent = {imageUrl: '/assets/img/empty-partial.png'};
        carouselData.videoContent = this.activeRow;
        break;
    }
    carouselData.adContentType = adType;
    this.selectedCarouselData = carouselData;
  }

  playAndPause(event: any): void {
    const videoPlayer = document.getElementById('selected-video-content') as HTMLVideoElement;
    if (event.target.paused === false) {
      videoPlayer.pause();
    } else {
      videoPlayer.play();
    }
  }

  canCreateImageContent(): void {
    if (this.permissions?.hasOwnProperty('C_IC')
      || this.permissions?.hasOwnProperty('C_IC_OWN_ORG')
    ) {
      this.canCreateImageFlag = true;
    } else {
      this.canCreateImageFlag = false;
    }
  }

  canEditImageContent(): void {
    if (this.activeRow !== null) {
      if (this.permissions?.hasOwnProperty('U_IC')
        || this.permissions?.hasOwnProperty('U_IC_OWN')
        || this.permissions?.hasOwnProperty('U_IC_OWN_ORG')
      ) {
        this.canEditImageFlag = true;
      } else {
        this.canEditImageFlag = false;
      }
    } else {
      this.canEditImageFlag = false;
    }
  }

  canDeleteImageContent(): void {
    if (this.activeRow !== null) {
      if (this.permissions?.hasOwnProperty('D_IC')
        || this.permissions?.hasOwnProperty('D_IC_OWN')
        || this.permissions?.hasOwnProperty('D_IC_OWN_ORG')
      ) {
        this.canDeleteImageFlag = true;
      } else {
        this.canDeleteImageFlag = false;
      }
    } else {
      this.canDeleteImageFlag = false;
    }
  }

  canCreateVideoContent(): void {
    if (this.permissions?.hasOwnProperty('C_VC')
      || this.permissions?.hasOwnProperty('C_VC_OWN_ORG')
    ) {
      this.canCreateVideoFlag = true;
    } else {
      this.canCreateVideoFlag = false;
    }
  }

  canEditVideoContent(): void {
    if (this.activeRow !== null) {
      if (this.permissions?.hasOwnProperty('U_VC')
        || this.permissions?.hasOwnProperty('U_VC_OWN')
        || this.permissions?.hasOwnProperty('U_VC_OWN_ORG')
      ) {
        this.canEditVideoFlag = true;
      } else {
        this.canEditVideoFlag = false;
      }
    } else {
      this.canEditVideoFlag = false;
    }
  }

  canDeleteVideoContent(): void {
    if (this.activeRow !== null) {
      if (this.permissions?.hasOwnProperty('D_VC')
        || this.permissions?.hasOwnProperty('D_VC_OWN')
        || this.permissions?.hasOwnProperty('D_VC_OWN_ORG')
      ) {
        this.canDeleteVideoFlag = true;
      } else {
        this.canDeleteVideoFlag = false;
      }
    } else {
      this.canDeleteVideoFlag = false;
    }
  }

  getOrgSettings(): void {
    const organizationId = JSON.parse(localStorage.getItem('iup') || '{}')?.data?.organization?.id;
    // this.orgService.getOrganizationById(organizationId)
    //   .subscribe((res) => {
    //     this.orgSettings = res.data;
    //     this.setMaxImageUploadSize();
    //     this.setMaxVideoUploadSize();
    //   }, (errors) => {
    //     console.log(getErrorMessage(errors));
    //   });
  }

  setMaxImageUploadSize(): void {
    if (this.orgSettings.fsImageSize && this.orgSettings.notificationImageSize && this.orgSettings.mainImageSize) {
      this.maxAllowedImageSize = {
        NOTIFICATION: parseInt(this.orgSettings.notificationImageSize, radix) * 1000,
        MAIN: parseInt(this.orgSettings.mainImageSize, radix) * 1000,
        FULL: parseInt(this.orgSettings.fsImageSize, radix) * 1000
      };
    }
  }

  setMaxVideoUploadSize(): void {
    if (this.orgSettings.videoImageSize) {
      this.maxAllowedVideoSize = (parseInt(this.orgSettings.videoImageSize, radix) * 1000);
    }
  }

  editContent(): void {
    if (this.activeRow !== null) {
      if (this.activeRow.imageContentType !== 'VIDEO') {
        this.isNewImageContent = false;
        this.imageContentType = this.activeRow.imageContentType;
        this.imageContentDetail = this.activeRow;
        setTimeout(() => {
          jQuery('#imgContentModal').modal('show');
        }, 100);
      } else {
        this.isNewVideoContent = false;
        this.videoContentDetail = this.activeRow;
        setTimeout(() => {
          jQuery('#videoContentModal').modal('show');
        }, 100);
      }
    }
  }

  removeContent(): void {
    if (this.activeRow !== null) {
      jQuery('#deleteContentModel').modal('show');
    }
  }

  createImageContent(imageType: string): void {
    this.isNewImageContent = true;
    this.imageContentType = imageType;
    setTimeout(() => {
      jQuery('#imgContentModal').modal('show');
    }, 100);
  }

  imageUploadSuccess(event: any): void {
    jQuery('#imgContentModal').modal('hide');
    if (event) {
      if (!event.error) {
        switch (event.imgContentType) {
          case 'NOTIFICATION':
            console.log('NOTIFICATION');
            break;
          case 'MAIN':
            console.log('MAIN');
            break;
          case 'FULL':
            console.log('FULL');
            break;
          case 'GIF':
              console.log('GIF');
              break;
        }
        if (event.isEdit) {
          const index = this.getIndexByContentId(event.imageContentObj.id);
          this.contentList[index] = event.imageContentObj;
          if (event.imgContentType === 'GIF') {
            event.imageContentObj.imageContentType = 'GIF';
          }
          this.contentList = this.contentList.slice();
          jQuery('.table.table-bordered tr[data-index="' + event.imageContentObj.id + '"]').trigger('click');
        } else {
          if (event.imgContentType === 'GIF') {
            event.imageContentObj.imageContentType = 'GIF';
          }
          this.contentList = [...this.contentList, event.imageContentObj];
        }
      }
    }
  }

  closeImgContentModal(event: boolean): void {
    if ( event ) {
      jQuery('#imgContentModal').modal('hide');
      this.isNewImageContent = !this.isNewImageContent;
      setTimeout(() => {
        this.isNewImageContent = !this.isNewImageContent;
      }, 50);
    }
  }

  deleteContent(event: any): void {
    if (this.activeRow != null) {
      if (this.activeRow.imageContentType !== 'VIDEO') {
        this.deleteImageContent();
      } else {
        this.deleteVideoContent();
      }
    }
  }

  deleteImageContent(): void {
    this.deleteLoadingFlag = true;
    this.contentService.deleteImageContent(this.activeRow.id)
      .subscribe((resp) => {
          const contentId = this.activeRow.id;
          jQuery('#brief-section table > tbody > tr[data-index="' + this.activeRow.id + '"] > td')[0].click();
          this.deleteLoadingFlag = false;
          this.contentDeleteError = '';
          jQuery('#deleteContentModel').modal('hide');
          // alertify.success('Image content deleted successfully');
          this.removeContentFromList(contentId);
        }, (errors: any) => {
          // jQuery('#deleteClusterModel').modal('hide');
          this.deleteLoadingFlag = false;
          this.contentDeleteError = getErrorMessage(errors);
        }
      );
  }

  deleteVideoContent(): void {
    this.deleteLoadingFlag = true;
    this.contentService.deleteVideoContent(this.activeRow.id)
      .subscribe((resp: any) => {
          const contentId = this.activeRow.id;
          jQuery('#brief-section table > tbody > tr[data-index="' + this.activeRow.id + '"] > td')[0].click();
          this.deleteLoadingFlag = false;
          this.contentDeleteError = '';
          jQuery('#deleteContentModel').modal('hide');
          // alertify.success('Video content deleted successfully');

          this.removeContentFromList(contentId);
        }, (errors: any) => {
          // jQuery('#deleteClusterModel').modal('hide');
          this.deleteLoadingFlag = false;
          this.contentDeleteError = getErrorMessage(errors);
        }
      );
  }

  removeContentFromList(contentId: string): void {
    const index = this.getIndexByContentId(contentId);
    delete this.contentList[index];
    this.contentList = this.contentList.slice();
  }

  getIndexByContentId(contentId: string): number {
    return this.contentList.findIndex(item => item.id === contentId);
  }

  createVideoContent(): void {
    this.isNewVideoContent = true;
    setTimeout(() => {
      jQuery('#videoContentModal').modal('show');
    }, 100);
  }

  closeVideoContentModal(event: boolean): void {
    if ( event ) {
      jQuery('#videoContentModal').modal('hide');
    }
  }

  videoUploadSuccess(event: any): void {
    if (event) {
      if (!event.error) {
        if (event.isEdit) {
          const index = this.getIndexByContentId(event.videoContentObj.id);
          this.contentList[index] = event.videoContentObj;
          this.contentList = this.contentList.slice();
          this.activeRow = this.contentList[index];
        } else {
          event.videoContentObj.imageContentType = 'VIDEO';
          this.contentList = [...this.contentList, event.videoContentObj];
        }
      }
    }
  }

  playSelectedVideo(): void {
    const selectedVideoContentUrl = (this.activeRow.videoContentHostingType === 'IU')
      ? this.activeRow.videoFileUrl
      : this.activeRow.externalVideoUrl;
    if (selectedVideoContentUrl.substr(selectedVideoContentUrl.length - 3) !== 'mp4') {
      this.isUnSupportedVideo = true;
      this.isSelectedVideoPlaying = false;
    }
    if (this.isSelectedVideoPlaying !== true) {
      this.isSelectedVideoPlaying = true;
      setTimeout(() => {
        const videoPlayer = document.getElementById('selected-video-content') as HTMLVideoElement;
        if (videoPlayer) {
          videoPlayer.play();
        }
      }, 100);
    }
  }

  videoEnded(): void {
    this.videoCanPlay = false;
    this.isSelectedVideoPlaying = false;
  }

  videoIsLoaded(event: any): void {
    if (this.videoCanPlay !== true) {
      this.videoCanPlay = true;
    }
  }

  /*createImageContent() {
    this.componentData = ImageContentComponent;
  }

  createVideoContent() {
    this.componentData = VideoContentComponent;
  }*/

  getComponent(event: any): void {
    const component = event.component;
    if (component !== null) {
      if (typeof(component.instance.isClose) !== 'undefined' ) {
        const sub = component.instance.isClose;
        this.curentModal = sub.subscribe((res: any) => {
          this.componentData = null;
          this.destroyComponent();
        });
      }
    }
  }

  destroyComponent(): void {
    this.curentModal.next();
    this.curentModal.complete();
  }

  canDownloadImageContent(): void {
    if (this.activeRow !== null) {
      if (this.permissions?.hasOwnProperty('R_IC')
        || this.permissions?.hasOwnProperty('R_IC_OWN')
        || this.permissions?.hasOwnProperty('R_IC_OWN_ORG')
      ) {
        this.canDownloadImageFlag = true;
      } else {
        this.canDownloadImageFlag = false;
      }
    } else {
      this.canDownloadImageFlag = false;
    }
  }

  canDownloadVideoContent(): void {
    if (this.activeRow !== null) {
      if (this.permissions?.hasOwnProperty('R_VC')
        || this.permissions?.hasOwnProperty('R_VC_OWN')
        || this.permissions?.hasOwnProperty('R_VC_OWN_ORG')
      ) {
        this.canDownloadVideoFlag = true;
      } else {
        this.canDownloadVideoFlag = false;
      }
    } else {
      this.canDownloadVideoFlag = false;
    }
  }

  downloadContent(): void {
    if (this.activeRow != null) {
      if (this.activeRow.imageContentType !== 'VIDEO') {
        this.downloadImageContent();
      } else {
        this.downloadVideoContent();
      }
    }
  }

  downloadImageContent(): void {
    this.downloadFile(this.activeRow.imageUrl);
  }

  downloadVideoContent(): void {
    this.downloadFile(this.activeRow.videoFileUrl);
  }

  downloadFile(fileUrl: string): void {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', fileUrl.split('/').pop() || '');
    link.setAttribute('target', '_blank');
    link.click();
  }

  toggleGifImage(): void {
    this.isGifPlaying = true;
  }

}
