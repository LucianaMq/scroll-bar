import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScrollBarService {

  constructor() {
  }

  getBarData(): Observable<any> {
    return of({
      datalist: [{
        name: '2020年',
        male: 72334,
        female: 68844
      }, {
        name: '2019年',
        male: 72039,
        female: 68969
      }, {
        name: '2018年',
        male: 71864,
        female: 68677
      }, {
        name: '2017年',
        male: 71650,
        female: 68361
      }, {
        name: '2016年',
        male: 71307,
        female: 67925
      }, {
        name: '2015年',
        male: 70857,
        female: 67469
      }, {
        name: '2014年',
        male: 70522,
        female: 67124
      }, {
        name: '2013年',
        male: 70063,
        female: 66663
      }, {
        name: '2012年',
        male: 69660,
        female: 66262
      }, {
        name: '2011年',
        male: 69161,
        female: 65755
      }, {
        name: '2010年',
        male: 68748,
        female: 65343
      }, {
        name: '2009年',
        male: 68647,
        female: 64803
      }, {
        name: '2008年',
        male: 68357,
        female: 64445
      }, {
        name: '2007年',
        male: 68048,
        female: 64081
      }, {
        name: '2006年',
        male: 67728,
        female: 63720
      }, {
        name: '2005年',
        male: 67375,
        female: 63381
      }, {
        name: '2004年',
        male: 66976,
        female: 63012
      }, {
        name: '2003年',
        male: 66556,
        female: 62671
      }, {
        name: '2002年',
        male: 66115,
        female: 62338
      }, {
        name: '2001年',
        male: 65672,
        female: 61955
      }]
    })
  }
}
