import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { cmsApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class InvoiceService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getInvoiceTimeList(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${cmsApiUrls.invoiceList}?pageSize=100`;
    url += data.minTime ? '&minTime=' + data.minTime : '';
    url += data.maxTime ? '&maxTime=' + data.maxTime : '';
    url += data.orderId ? '&orderId=' + data.orderId : '';
    url += data.orderType ? '&orderType=' + data.orderType : '';
    url += data.phone ? '&phone=' + data.phone : '';
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取所有列表 */
  getInvoiceLogList(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${cmsApiUrls.invoiceList}/logs?pageSize=100`;
    url += data.minTime ? '&minTime=' + data.minTime : '';
    url += data.maxTime ? '&maxTime=' + data.maxTime : '';
    url += data.orderId ? '&orderId=' + data.orderId : '';
    url += data.orderType ? '&orderType=' + data.orderType : '';
    url += data.phone ? '&phone=' + data.phone : '';
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 修改启用状态 */
  updateSwitch(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.invoiceList}`;
    const body = {
      admin: localStorage.getItem('currentUser'),
      drawBill: data.drawBill,
      orderId: data.orderId
    };
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    // tslint:disable-next-line:max-line-length
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

}
