import { Pipe, PipeTransform } from '@angular/core';
/*
 * Usage:
 *   value | toKB:kb
 * Example:
 *   {{ 1024 | toKB:kb }}
 *   formats to: 1KB
*/

@Pipe({name: 'toKBMB'})
export class FileSizePipe implements PipeTransform {
  transform(value: number, decimals?: number): string {

    let result = value / Math.pow(2,20);
    let d = isNaN(decimals) ? 1: decimals;

    if (result >= 1.0) 
        return result.toFixed(d) + ' MB'
    
    return (result * 1024).toFixed(d) + ' KB';
  }
}