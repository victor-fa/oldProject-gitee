import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { consumerApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class ConsumerAccountService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getConsumerAccountList(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${consumerApiUrls.consumerAccountList}?pageSize=999`;
    url += data.customerName && data.customerName !== '' ? '&customerName=' + data.customerName : '';
    url += data.deviceType && data.deviceType !== '' ? '&deviceType=' + data.deviceType : '';
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取所有列表 */
  getCustomerIdList(): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${consumerApiUrls.consumerAccountList}/accountId`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取所有列表 */
  getCapitalList(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${consumerApiUrls.consumerAccountList}/trades?row=999`;
    url += data.customerId && data.customerId !== '' ? '&customerId=' + data.customerId : '';
    url += data.timeEnd && data.timeEnd !== '' ? '&timeEnd=' + data.timeEnd : '';
    url += data.timeStart && data.timeStart !== '' ? '&timeStart=' + data.timeStart : '';
    url += data.orderType && data.orderType !== '' ? '&orderType=' + data.orderType : '';
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addConsumerAccount(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${consumerApiUrls.consumerAccountList}`;
    let body = `customerId=${data.customerId}&email=${data.email}&phoneNum=${data.phoneNum}&code=${data.code}&balanceThresholds=${data.balanceThresholds}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 发短信 */
  sendMsg(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${consumerApiUrls.consumerAccountList}/captcha?phoneNum=${data}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 修改单个 */
  modifyConsumerAccount(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${consumerApiUrls.consumerAccountList}`;
    let body = `customerId=${data.customerId}&email=${data.email}&phoneNum=${data.phoneNum}&code=${data.code}&balanceThresholds=${data.balanceThresholds}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .put<IResponse<any>>(url, body, this.options);
  }

  /** 充值 */
  rechargeAccount(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${consumerApiUrls.consumerAccountList}/recharge`;
    let body = `customerId=${data.customerId}&amount=${data.amount}&phoneNum=${data.phoneNum}&code=${data.code}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** API白名单 */
  getApiWhiteListList(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${consumerApiUrls.apiWhiteList}?page=${data.page}`;
    url += data.appChannel && data.appChannel !== '' ? '&appChannel=' + data.appChannel : '';
    url += data.businessId && data.businessId !== '' ? '&businessId=' + data.businessId : '';
    url += data.id && data.id !== '' ? '&id=' + data.id : '';
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 新增 */
  addApiWhiteList(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${consumerApiUrls.apiWhiteList}`;
    let body = `appChannel=${data.appChannel}&count=${data.count}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 删除 */
  deleteApiWhiteList(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${consumerApiUrls.apiWhiteList}/${id}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 获取所有列表 */
  getRegisterDevice(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}/guest/activation?pageNo=${data.pageNo}`;
    url += data.appChannelId && data.appChannelId !== '' ? '&appChannelId=' + data.appChannelId : '';
    url += data.androidId && data.androidId !== '' ? '&androidId=' + data.androidId : '';
    url += data.startTime && data.startTime !== '' ? '&startTime=' + data.startTime : '';
    url += data.endTime && data.endTime !== '' ? '&endTime=' + data.endTime : '';
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 导出 */
  exportRegisterDevice(data): Observable<Blob> {
    let url = `${this.commonService.baseUrl}/guest/activation/file?page=1`;
    url += data.appChannelId && data.appChannelId !== '' ? '&appChannelId=' + data.appChannelId : '';
    url += data.startTime && data.startTime !== '' ? '&startTime=' + data.startTime : '';
    url += data.endTime && data.endTime !== '' ? '&endTime=' + data.endTime : '';
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/vnd.ms-excel;charset=UTF-8;', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }), responseType: 'blob' };
    return this.httpClient
      .get<Blob>(url, this.options);
  }

  /** 导出 */
  exportSerial(groupId): Observable<Blob> {
    const url = `${this.commonService.baseUrl}/guest/activation/file/${groupId}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/vnd.ms-excel;charset=UTF-8;', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }), responseType: 'blob' };
    return this.httpClient
      .get<Blob>(url, this.options);
  }

  /** 获取所有列表 */
  getSuperSerial(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${consumerApiUrls.guestList}?appChannelId=${data.appChannelId}`;
    url += data.sn && data.sn !== '' ? '&sn=' + data.sn : '';
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 新增 */
  addSuperSerial(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${consumerApiUrls.guestList}`;
    let body = `appChannelId=${data.appChannelId}&sn=${data.sn}&startTime=${data.startTime}&endTime=${data.endTime}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 修改启用状态 */
  updateSwitch(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${consumerApiUrls.guestList}`;
    const body = `sn=${data.sn}&appChannelId=${data.appChannelId}&available=${data.available}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .put<IResponse<any>>(url, body, this.options);
  }

}
