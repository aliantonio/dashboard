import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], query: any): any {
    if (query == undefined) { 
      return items;
    } else {
      return items.filter(item => item.name.toUpperCase().indexOf(query.toUpperCase()) > -1);
    }
  }

}
