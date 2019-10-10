import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { appVersionApiUrls, operatenApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class AppversionService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取APP版本 */
  getAppversionList(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.appVersionList}?app-channel-id=${localStorage.getItem('currentAppHeader')}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取单个 */
  getAppversion(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.appVersionList}/info?appversionId=${id}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addAppversion(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.appVersionList}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 获取操作系统 */
  getSystemSymbolList(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.appVersionList}/system_symbol`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取渠道 */
  getChannelList(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.appVersionList}/channel`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取打车路径列表 */
  getTaxiList(data): Observable<IResponse<any>> {
    const url = `${this.commonService.taxiRouteUrl}${operatenApiUrls.taxiList}`
    + (data.orderId ? '?orderId=' + data.orderId : '')
    + (data.startTime ? (data.orderId ? '&startTime=' : '?startTime=') + data.startTime : '')
    + (data.endTime ? (data.orderId || data.startTime ? '&endTime=' : '?endTime=') + data.endTime : '');
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取列表 */
  getOrderStateList(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${operatenApiUrls.orderStateList}?pageSize=999`
    + (data.startTime ? '&startTime=' + data.startTime : '')
    + (data.endTime ? '&endTime=' + data.endTime : '')
    + (data.orderId ? '&orderId=' + data.orderId : '')
    + (data.orderType ? '&orderType=' + data.orderType : '')
    + (data.state ? '&state=' + data.state : '');
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取列表 */
  getOrderStateSettingList(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${operatenApiUrls.orderStateSettingList}?pageSize=999`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取列表 */
  modifyOrderStateSetting(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${operatenApiUrls.orderStateSettingList}`;
    const body = `id=${data.id}&low=${data.low}&high=${data.high}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

}
