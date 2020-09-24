import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'asCollection',
})
export class AsCollectionPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    const res = [];
    for (let i = 0; i < value; i++) {
      res.push(i);
    }
    return res;
  }
}
