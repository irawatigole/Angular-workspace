import { timeZonesDetails } from '../../../../../src/time-zone';

export function sortByKey(collection: any[], key: string): any {
    return collection.sort((a, b) => {
      const x = a[key];
      const y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  export function trimString(str: any): string {
    if (typeof str === 'string') {
      return str.trim();
    }
    return str;
  }

  export function isMobile(): boolean {
    return /Android|iPhone|iPad/i.test(window.navigator.userAgent);
  }

  export function isIEBrowser(): boolean {
    return /MSIE\/|Trident\/|Edge\//i.test(window.navigator.userAgent);
  }

  export function isSafariBrowser(): boolean {
    return (window as { [key: string]: any }).safari !== undefined;
  }

  export function isFirefoxBrowser(): number {
    return navigator.userAgent.toLowerCase().indexOf('firefox');
  }

  export const emailRegEx = /^[\w._+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;

  export function queryStringToObject(queryString: string): any {
    const obj: any = {};

    if (queryString) {
      queryString.slice(1).split('&').map((item) => {
        const [k, v] = item.split('=')
        v ? obj[k] = v : null;
      });
    }

    return obj;
  }

  export const radix = 10;

  export function isValidJSON(jsonString: string): boolean {
    try {
      return (JSON.parse(jsonString) && !!jsonString);
    } catch (e) {
      return false;
    }
  }

  export function formatClusterCriteria(criteria: any): any {
    const criteriaData = {
      condition: criteria.condition,
      list: [] as any
    };

    if (criteria.list.length > 0) {
      for (const filters of criteria.list) {
        const itemList = [];
        for (const item of filters.list) {
          itemList.push({
            id: item.id
          });
        }
        criteriaData.list.push({
          operation: filters.operation,
          condition: filters.condition,
          list: itemList
        });
      }
    }

    return criteriaData;
  }

  export function getEmptyClusterFilterObject(): any {
    return { condition: 'ANY', list: [] };
  }

  export const multiFieldSort = (fields: any) => (a: any, b: any) => fields.map((o: any) => {
    let dir = 1;
    if (o[0] === '-') { dir = -1; o = o.substring(1); }
    return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
  }).reduce((p: any, n: any) => p ? p : n, 0);

  export const paginationPageSize = 10;

  export function prettyJson(jsonString: string): any {
    jsonString = jsonString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const jsonRegEx = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;
    return jsonString.replace(jsonRegEx, (match) => {
      let elementClass = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          elementClass = 'json-key';
        } else {
          elementClass = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        elementClass = 'json-boolean';
      } else if (/null/.test(match)) {
        elementClass = 'json-null';
      }

      return '<span class="' + elementClass + '">' + match + '</span>';
    });
  }

  export function isIncludeFilterAdded(clusters: any): boolean {
    let includeFlag = false;
    if (clusters.list.length > 0) {
      for (let i = 0; i < clusters.list.length; i++) {
        if (clusters.list[i].operation === 'INCLUDE') {
          includeFlag = true;
          break;
        }
      }
    }

    return includeFlag;
  }

  export function compareObjectKeys(a: any, b: any): any {
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);

    if (aProps.length !== bProps.length) {
      return false;
    }

    for (let i = 0; i < aProps.length; i++) {
      const propName = aProps[i];
      if (bProps.indexOf(propName) === -1) {
        return false;
      }

      if (typeof a[propName] === 'object') {
        return compareObjectKeys(a[propName], b[propName]);
      }
    }

    return true;
  }

  export function convertDateByTimeZone(timezone: string): any {
    // create Date object for current location
    const dateObj = new Date();

    // convert to UTC-0
    dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());

    // convert to desire timezone using offset
    dateObj.setMinutes(dateObj.getMinutes() + (getTimezoneOffset(timezone) * 60));

    return dateObj;
  }

  export function getTimezoneOffset(timezone: string): any {
    let offest = null;
    for (const country of timeZonesDetails) {
      for (const zone of country.zones) {
        if (zone.java_code === timezone) {
          offest = zone.utc_diff.substr(4);
          // convert minutes to decimal, if minute exists
          if (offest.indexOf('.') !== -1) {
            const minute: any = offest.substr(offest.indexOf('.') + 1);
            const hour = parseInt(offest.substr(0, offest.indexOf('.')), radix);
            const decimal: any = minute / 60;
            if (hour >= 0) {
              offest = hour + decimal;
            } else {
              offest = hour - decimal;
            }
          }
          break;
        }
      }
      if (offest !== null) {
        break;
      }
    }

    return offest;
  }
