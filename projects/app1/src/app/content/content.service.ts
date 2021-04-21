import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../../../my-lib/src/lib/api-base-service';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private apiService: ApiBaseService) { }

  getAllImageContentByOrganization(orgId: string): Observable<any> {
    return this.apiService.get(`imagecontents/organizationid/${orgId}`);
  }

  getAllVideoContentByOrganization(orgId: string): Observable<any> {
    return this.apiService.get(`videocontents/organizationid/${orgId}`);
  }

  deleteImageContent(contentId: string): Observable<any> {
    return this.apiService.delete(`imagecontents/${contentId}`);
  }

  deleteVideoContent(contentId: string): Observable<any> {
    return this.apiService.delete(`videocontents/${contentId}`);
  }

  updateImageContent(contentId: string, updateData: any): Observable<any> {
    return this.apiService.put('imagecontents/' + contentId, updateData);
  }

  createImageContent(imageContent: any): Observable<any> {
    return this.apiService.post('imagecontents', imageContent);
  }

  uploadImage(formData: any): Observable<any> {
    const headers = new HttpHeaders({'Content-Type-2': 'multipart/form-data'});
    return this.apiService.post('files/upload', formData, headers);
  }

  checkImageContent(searchTerm: string, imgContentType: string = ''): Observable<any> {
    return this.apiService.get('imagecontents/name?name=' + searchTerm + '&imageContentType=' + imgContentType);
  }

  checkVideoContent(searchTerm: string, videoContentFlag: boolean = false): Observable<any> {
    return this.apiService.get('videocontents/name?name=' + searchTerm + '&videoContentFlag=' + videoContentFlag);
  }

  createVideoContent(videoContent: any): Observable<any> {
    return this.apiService.post('videocontents', videoContent);
  }

  uploadVideo(formData: any): Observable<any> {
    const headers = new HttpHeaders({'Content-Type-2': 'multipart/form-data'});
    return this.apiService.post('files/upload', formData, headers);
  }
}
