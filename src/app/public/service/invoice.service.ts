import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { customerApiUrls, userApiUrls } from '../enum/api.enum';
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
    let url = `${this.commonService.baseUrl}${customerApiUrls.invoiceList}?pageSize=9999`;
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
    let url = `${this.commonService.baseUrl}${customerApiUrls.invoiceList}/logs?pageSize=9999`;
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
  getBusinessList(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}/business/cooperation?page=0&pageSize=999`;
    url += data.startDate && data.startDate !== null ? '&startDate=' + data.startDate : '';
    url += data.endDate && data.endDate !== null ? '&endDate=' + data.endDate : '';
    url += data.phone ? '&phone=' + data.phone : '';
    url += data.content ? '&content=' + data.content : '';
    url += data.name ? '&name=' + data.name : '';
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 修改启用状态 */
  updateSwitch(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${customerApiUrls.invoiceList}`;
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

  /** 获取所有列表 */
  getRechargeListForUser(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${userApiUrls.mgmtList}/deposit-history?pageSize=9999`;
    url += data.phone ? '&phone=' + data.phone : '';
    url += data.beginTime && data.beginTime !== null ? '&beginTime=' + data.beginTime : '';
    url += data.endTime && data.endTime !== null ? '&endTime=' + data.endTime : '';
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取所有列表 */
  getInvoiceListForUser(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${userApiUrls.mgmtList}/invoice-history?pageSize=9999`;
    url += data.createTimeBegin && data.createTimeBegin.indexOf('null') === -1  ? '&createTimeBegin=' + data.createTimeBegin : '';
    url += data.createTimeEnd && data.createTimeEnd.indexOf('null') === -1 ? '&createTimeEnd=' + data.createTimeEnd : '';
    url += data.phone ? '&phone=' + data.phone : '';
    url += data.orderType && data.orderType !== '' ? '&orderType=' + data.orderType : '';
    url += data.state && data.state !== '' ? '&state=' + data.state : '';
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

}
