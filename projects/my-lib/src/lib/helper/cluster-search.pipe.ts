import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clusterSearch'
})
export class ClusterSearchPipe implements PipeTransform {

  transform(clusters: any[], searchText: any): any {
    if (searchText == null) {
      return clusters;
    }

    return clusters !== undefined && clusters.filter((cluster: any) => {
      if (cluster.hasOwnProperty('name')) {
        return (cluster.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
      } else {
        return false;
      }
    });
  }
}