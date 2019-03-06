import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { IResponse } from '../model/response.model';
import { appVersionApiUrls } from '../enum/api.enum';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class AppversionService extends AppServiceBase {
  // const token = this._cookiesService.getToken();
  token = localStorage.getItem('token');
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取APP版本 */
  getAppversionList(searchItem): Observable<IResponse<any>> {
    const url = `${this.fullUrl(appVersionApiUrls.appVersionList)}?app-channel-id=${searchItem}`;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取单个 */
  getAppversion(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.appVersionList}/info?appversionId=${id}`;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addAppversion(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}/admin${appVersionApiUrls.appVersionList}`;
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 获取操作系统 */
  getSystemSymbolList(): Observable<IResponse<any>> {
    const url = `${this.fullUrl(appVersionApiUrls.appVersionList)}/system_symbol`;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取渠道 */
  getChannelList(): Observable<IResponse<any>> {
    const url = `${this.fullUrl(appVersionApiUrls.appVersionList)}/channel`;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取打车路径列表 */
  getTaxiList(data): Observable<IResponse<any>> {
    const url = this.fullTaxiRouteUrl(appVersionApiUrls.taxiList)
    + (data.orderId ? '?orderId=' + data.orderId : '')
    + (data.startTime ? (data.orderId ? '&startTime=' : '?startTime=') + data.startTime : '')
    + (data.endTime ? (data.orderId || data.startTime ? '&endTime=' : '?endTime=') + data.endTime : '');
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

}
