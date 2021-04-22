import { Component, OnInit, Input, OnDestroy, SimpleChanges, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';

import { isSafariBrowser, isFirefoxBrowser } from '../../helper/basic';
declare var jQuery: any;

@Component({
  selector: 'lib-content-carousel',
  templateUrl: './content-carousel.component.html',
  styleUrls: ['./content-carousel.component.css']
})
export class ContentCarouselComponent implements OnInit {
  @Input() campaign: any;
  @Input() videoContent: any;
  @Input() carouselRefId: any = '';

  private unsubscribe: Subject<void> = new Subject<void>();
  enableSection: any;
  subjectMsg!: string;
  textMsg!: string;
  clockTime!: string;
  clockInterval: any;
  selectedVideoContentUrl = '';
  isUnSupportedVideo = false;
  isVideoContentSelected = false;
  isSelectedVideoPlaying = false;
  videoCanPlay = false;
  isFullImageProperRatio = true;
  actionLabel = '';
  questionArray: any = [];
  isGifPlaying = false;

  constructor() {
    this.enableSection = {
      notification: false,
      main: false,
      full: false,
      richNotification: false
    };
  }

  ngOnInit(): void {
    if (this.campaign.survey !== null && this.campaign.survey !== undefined) {
      this.campaign.survey.questions.forEach((question: any, i: number) => {
        this.questionArray.push({ id: i, showDiv: false });
        if (question.answerType === 'DROPDOWN') {
          question.answerOptions.unshift('Select');
        }
      });
    }
    this.enableSection.full = (this.campaign.fullImageContent !== null) ? true : false;
    this.enableSection.main = (this.campaign.mainImageContent !== null) ? true : false;
    this.enableSection.notification = (this.campaign.notificationImageContent !== null) ? true : false;
    this.enableSection.richNotification = (this.campaign.notificationImageContent !== null) ? true : false;

    if (this.enableSection.full) {
      const tempImg = new Image();
      tempImg.src = this.campaign.fullImageContent.imageUrl;
      tempImg.onload = (e: any) => {
        let tempImgWidth = 0;
        let tempImgHeight = 0;
        if (isSafariBrowser() || isFirefoxBrowser() !== -1) {
          tempImgWidth = e.target.naturalWidth;
          tempImgHeight = e.target.naturalHeight;
        } else {
          tempImgWidth = e.path[0].naturalWidth;
          tempImgHeight = e.path[0].naturalHeight;
        }
        if (tempImgWidth > tempImgHeight) {
          this.isFullImageProperRatio = false;
        }
      };
    }

    if (this.videoContent != null && this.videoContent.videoContentFlag) {
      this.campaign.videoContentFlag = this.videoContent.videoContentFlag;
      this.isVideoContentSelected = true;
      this.isSelectedVideoPlaying = false;
      this.selectedVideoContentUrl = (this.videoContent.videoContentHostingType === 'IU')
        ? this.videoContent.videoFileUrl
        : this.videoContent.externalVideoUrl;
    } else if (this.videoContent != null && !this.videoContent.videoContentFlag) {
      this.campaign.videoContentFlag = this.videoContent.videoContentFlag;
    } else {
      this.selectedVideoContentUrl = '';
      this.isVideoContentSelected = false;
      this.isSelectedVideoPlaying = false;
      this.isUnSupportedVideo = false;
      this.videoCanPlay = false;
      this.campaign.videoContentFlag = false;
    }

    if (this.campaign.notification) {
      this.subjectMsg = this.campaign.notification.subject || '';
      this.textMsg = this.campaign.notification.message || '';
    }

    this.clockInterval = setInterval(() => {
      if (navigator.userAgent.match(/iPad/i) === null) {
        this.clockTime = (new Date()).toLocaleString(
          'en-US', { hour: 'numeric', minute: 'numeric', hour12: true }
        );
      } else {
        this.clockTime = (new Date().toLocaleTimeString().replace(/:\d+ /, ' ')).slice(0, 8);
      }
    }, 1000);

    if (this.campaign.notification && this.campaign.notification.adActionText !== null) {
      if (this.campaign.notification.adActionText !== undefined) {
        if (this.campaign.notification.adActionText.length !== 0) {
          this.actionLabel = this.campaign.notification.adActionText;
        }
      }
    } else {
      if (this.campaign.campaignObjective) {
        if (this.campaign.campaignObjective.fields.includes('goToWeb')) {
          this.actionLabel = 'LAUNCH WEBSITE';
        } else if (this.campaign.campaignObjective.fields.includes('packageNameToInstallApp')) {
          this.actionLabel = 'LAUNCH PLAY STORE';
        } else if (this.campaign.campaignObjective.fields.includes('packageNameToOpenApp')) {
          this.actionLabel = 'OPEN APP';
        } else if (this.campaign.campaignObjective.fields.includes('phoneToCall')) {
          this.actionLabel = 'CALL PHONE';
        } else if (this.campaign.campaignObjective.fields.includes('displayOnlyAd')) {
          this.actionLabel = 'OK';
        } else if (this.campaign.campaignObjective.fields.includes('surveyAd')) {
          this.actionLabel = 'OPEN SURVEY';
        }
      }
    }
  }

  ngAfterViewInit(): void {
    const checkCarouselItem = (event: any): void => {
      const carouselRefId = event.data.id;
      const carousel = jQuery(`#${carouselRefId}ContentCarousel`);
      if (jQuery(`#${carouselRefId}ContentCarousel .carousel-inner .item:first`).hasClass('active')) {
        carousel.children('.left').hide();
        carousel.children('.right').show();
      } else if (jQuery(`#${carouselRefId}ContentCarousel .carousel-inner .item:last`).hasClass('active')) {
        carousel.children('.right').hide();
        carousel.children('.left').show();
      } else {
        carousel.children('.carousel-control').show();
      }
    };

    jQuery(`#${this.carouselRefId}ContentCarouselPrev, #${this.carouselRefId}ContentCarouselNext`).hide();
    if (this.isSurveyWithInterstitialWithoutImage()) {
      jQuery(`#${this.carouselRefId}ContentCarouselPrev, #${this.carouselRefId}ContentCarouselNext`).hide();
    } else {
      if (jQuery(`#${this.carouselRefId}ContentCarousel .carousel-inner .item`).length > 1) {
        jQuery(`#${this.carouselRefId}ContentCarouselPrev, #${this.carouselRefId}ContentCarouselNext`).show();
      }
    }

    jQuery(`#${this.carouselRefId}ContentCarousel`).children('a.left.carousel-control').hide();
    jQuery(`#${this.carouselRefId}ContentCarousel`).on('slid.bs.carousel', { id: this.carouselRefId }, checkCarouselItem);
  }

  ngOnDestroy(): void {
    this.isUnSupportedVideo = false;
    this.enableSection.main = false;
    this.enableSection.notification = false;
    this.enableSection.full = false;

    clearInterval(this.clockInterval);
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  playSelectedVideo(): void {
    if (this.selectedVideoContentUrl.substr(this.selectedVideoContentUrl.length - 3) !== 'mp4') {
      this.isUnSupportedVideo = true;
      this.isSelectedVideoPlaying = false;
    }
    if (this.isSelectedVideoPlaying !== true) {
      this.isSelectedVideoPlaying = true;
      setTimeout(() => {
        const videoPlayer = document.getElementById('video-selected-content') as HTMLVideoElement;
        if (videoPlayer) {
          videoPlayer.play();
        }
      }, 100);
    }
  }

  videoIsLoaded(event: any): void {
    if (this.videoCanPlay !== true) {
      this.videoCanPlay = true;
    }
  }

  videoEnded(): void {
    this.videoCanPlay = false;
    this.isSelectedVideoPlaying = false;
  }

  playAndPause(event: any): void {
    const videoPlayer = document.getElementById('video-selected-content') as HTMLVideoElement;
    if (event.target.paused === false) {
      videoPlayer.pause();
    } else {
      videoPlayer.play();
    }
  }

  isNotificationOnlyCarousel(): boolean {
    return ((this.campaign.adContentType === 'NOTIFICATION_ONLY')
      || (this.campaign.showNotification === true
        && this.campaign.imageType === 'NONE')
    );
  }

  isFullOnlyCarousel(): boolean {
    return ((this.campaign.adContentType === 'FULL_SCREEN_DISPLAY_ONLY')
      || (this.campaign.showNotification === false
        && this.campaign.imageType === 'FULL')
    );
  }

  isPartialOnlyCarousel(): boolean {
    return ((this.campaign.adContentType === 'PARTIAL_SCREEN_DISPLAY_ONLY')
      || (this.campaign.showNotification === false
        && this.campaign.imageType === 'MAIN')
    );
  }

  isFullWithNotificationCarousel(): boolean {
    return ((this.campaign.adContentType === 'FULL_SCREEN_DISPLAY_WITH_NOTIFICATION')
      || (this.campaign.showNotification === true
        && this.campaign.imageType === 'FULL')
    );
  }

  isPartialWithNotificationCarousel(): boolean {
    return ((this.campaign.adContentType === 'PARTIAL_SCREEN_DISPLAY_WITH_NOTIFICATION')
      || (this.campaign.showNotification === true
        && this.campaign.imageType === 'MAIN')
    );
  }

  isRichNotificationCarousel(): boolean {
    return (this.campaign.adContentType === 'RICH_NOTIFICATION');
  }

  isRichNotificationTextCompactCarousel(): boolean {
    return (this.campaign.adContentType === 'RICH_NOTIFICATION'
      && this.campaign.notification.notificationType === 'STANDARD_TEXT'
    );
  }

  isRichNotificationTextExpandCarousel(): boolean {
    return (this.campaign.adContentType === 'RICH_NOTIFICATION'
      && this.campaign.notification.notificationType === 'STANDARD_TEXT'
      && this.campaign.notification.richNotificationMessageBody.length > 0
    );
  }

  isRichNotificationImageCompactCarousel(): boolean {
    return (this.campaign.adContentType === 'RICH_NOTIFICATION'
      && this.campaign.notification.notificationType === 'STANDARD_IMAGE'
    );
  }

  isRichNotificationImageExpandCarousel(): boolean {
    return (this.campaign.adContentType === 'RICH_NOTIFICATION'
      && this.campaign.notification.notificationType === 'STANDARD_IMAGE'
      && this.campaign.notification.richNotificationLargeImageContent !== null
    );
  }

  isRichNotificationCustomCompactCarousel(): boolean {
    return (this.campaign.adContentType === 'RICH_NOTIFICATION'
      && this.campaign.notification.notificationType === 'CUSTOM'
      && this.campaign.notificationImageContent !== null
    );
  }

  isRichNotificationCustomExpandCarousel(): boolean {
    return (this.campaign.adContentType === 'RICH_NOTIFICATION'
      && this.campaign.notification.notificationType === 'CUSTOM'
    );
  }

  isShowRichNotificationActionButtonText(): boolean {
    if (this.campaign.adContentType === 'RICH_NOTIFICATION' &&
      this.campaign.videoContent !== null) {
      return false;
    } else {
      if (this.campaign.adContentType === 'RICH_NOTIFICATION' &&
        this.campaign.mainImageContent !== null && this.campaign.fullImageContent === null) {
        return false;
      } else if (this.campaign.adContentType === 'RICH_NOTIFICATION' &&
        this.campaign.mainImageContent === null && this.campaign.fullImageContent !== null) {
        return false;
      } else {
        return true;
      }
    }
  }

  isSurveyWithInterstitialWithoutImage(): boolean {
    return (this.campaign.adContentType === 'FLEX' && this.campaign.imageType === 'NONE' && this.campaign.showNotification === false &&
      this.campaign.enableInterstitial === true && this.campaign.campaignObjective.fields[0] === 'surveyAd');
  }

  toggleDropdownDiv(index: number): void {
    const showDivValue = this.questionArray[index].showDiv;
    this.questionArray[index].showDiv = showDivValue === true ? false : true;
  }

  toggleGifImage(): void {
    this.isGifPlaying = true;
    if (this.enableSection.main) {
      document.getElementById('modilfy-height')!.style.marginTop = '18%';
    } else {
      document.getElementById('modilfy-height')!.style.marginTop = '36%';
    }
  }

  stopGif(): void {
    if (this.isGifPlaying) {
      this.isGifPlaying = false;
      document.getElementById('modilfy-height')!.style.marginTop = '0%';
    }
  }

}
