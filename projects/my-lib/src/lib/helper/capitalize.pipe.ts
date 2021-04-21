import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (typeof(value) === 'undefined') {
      return;
    }
    if (value === null) {
      return;
    }
    if (value.length === 0) {
      return;
    }

    return value.toLowerCase().replace(/(^| )(\w)/g, (s: any) => s.toUpperCase());
  }

}