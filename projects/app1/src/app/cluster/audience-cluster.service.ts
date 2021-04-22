import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiBaseService } from '../../../../my-lib/src/lib/api-base-service';
import { formatClusterCriteria } from '../../../../my-lib/src/lib/helper/basic';

@Injectable({
  providedIn: 'root'
})
export class AudienceClusterService {

  constructor(private apiService: ApiBaseService, private httpClient: HttpClient) { }

  getClusterByName(term: string): Observable<any> {
    return this.apiService.get('audienceclusters/name?name=' + term);
  }

  getAudienceCluster(term: string, limit: number = 20): Observable<any> {
    return this.apiService.get('audienceclusters?filter=' + term + '&limit=' + limit);
  }

  getAudienceReachCount(collection: any, force: boolean = false): Observable<any> {
    const filters = 'filters=' + JSON.stringify(formatClusterCriteria(collection));

    return this.apiService.get('audienceclusters/reachcount?' + filters + '&forcecalculation=' + force);
  }

  getNewAudienceReachCount(collection: any, force: boolean = false): Observable<any> {
    const filters = 'filters=' + JSON.stringify(formatClusterCriteria(collection));

    return this.apiService.get('audienceclusters/reachcount/new?' + filters + '&forcecalculation=' + force);
  }


  getClusters(organizationId: string, placesConfigFlag: boolean = false, externalFlag: boolean = false)
  : Observable<any> {
    return this.apiService.get(
      `audienceclusters/v2/organizationid/${organizationId}?placesConfig=${placesConfigFlag}&externalAudienceCluster=${externalFlag}`
    );
  }

  getClusterDetails(clusterId: string): Observable<any> {
    return this.apiService.get('audienceclusters/v2/' + clusterId);
  }

  updateCluster(cluster: any, clusterId: string): Observable<any> {
    return this.apiService.put('audienceclusters/' + clusterId, cluster);
  }

  cloneCluster(cluster: any): Observable<any> {
    return this.apiService.post('audienceclusters/clone', cluster);
  }

  deleteCluster(clusterId: string): Observable<any> {
    return this.apiService.delete('audienceclusters/' + clusterId);
  }


  getClusterFilePreview(fileId: string): Observable<any> {
    return this.apiService.get(`files/preview/${fileId}`);
  }

  getAllExternalAudience(): Observable<any> {
    return this.apiService.get('externalAudienceCluster');
  }

  updateExternalAudience(updatedCluster: any): Observable<any> {
    return this.apiService.post(`externalAudienceCluster/${updatedCluster.id}`, updatedCluster);
  }

  createExternalAudience(cluster: any): Observable<any> {
    return this.apiService.post('externalAudienceCluster', cluster);
  }

  uploadFile(formData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type-2': 'multipart/form-data' });
    return this.apiService.postFile('files/upload/text', formData, headers);
  }
}
