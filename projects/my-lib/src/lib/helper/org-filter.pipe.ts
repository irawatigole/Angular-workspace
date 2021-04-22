import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orgFilter'
})
export class OrgFilterPipe implements PipeTransform {

  transform(orgList: any, searchText: string): any {
    if (searchText == null) {
      return orgList;
    }

    return orgList.filter((org: any) => {
      return (org.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
    });
  }

}
