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

export class ConsumerService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getConsumerList(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${consumerApiUrls.consumerList}/list?pageSize=999`;
    url += data.available && data.available !== '' ? '&available=' + data.available : '';
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addConsumer(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${consumerApiUrls.consumerList}`;
    let body = `appChannelId=${data.appChannel}&appChannelName=${data.appChannelName}&loginType=${data.loginType}&robot=${data.robot}&phone=${data.phone}&accessMode=${data.accessMode}`;
    if (data.accessMode === 'SDK') {
      body += `&activationMode=${data.activationMode}`;
      if (data.activationMode === 'SN_WHITE_LIST') {
        body += `&officially=${data.officially}&needGuestKey=${data.needGuestKey}&maxSnActivation=${data.maxSnActivation}`;
      }
    }
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .put<IResponse<any>>(url, body, this.options);
  }

  /** 添加Payment Key */
  addPayment(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${consumerApiUrls.consumerList}/payment`;
    const body = `appChannel=${data.id}&paymentKey=${data.paymentKey}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 添加sms */
  addSms(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${consumerApiUrls.consumerList}/sms`;
    const body = `appChannel=${data.id}&smsSignType=${data.smsSign}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 添加key */
  addKey(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${consumerApiUrls.serialBatch}/${data.groupId}/keys`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': data.id }) };
    return this.httpClient
      .post<IResponse<any>>(url, data.keys, this.options);
  }

  /** 删除 */
  deleteSerial(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}/guest/keys/${data.id}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': data.appChannelId }) };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 获取所有列表 */
  getOrderType(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${consumerApiUrls.sms}?appChannel=${data.appChannel}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': data.appChannel }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加orderType */
  addOrderType(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${consumerApiUrls.sms}`;
    const body = `appChannel=${data.id}&orderTypes=${data.orderTypes}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 修改orderType */
  modifyOrderType(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${consumerApiUrls.sms}`;
    const body = `customerChannelSmsList=${data}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .put<IResponse<any>>(url, data, this.options);
  }

  /** 修改激活次数 */
  modifyActivation(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${consumerApiUrls.consumerList}/${data.id}`;
    const body = `appChannel=${data.id}&maxSnActivation=${data.maxSnActivation}&phone=${data.phone}&needGuestKey=${data.needGuestKey}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .put<IResponse<any>>(url, body, this.options);
  }

  /** 修改作废标记 */
  modifyAvailable(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${consumerApiUrls.consumerList}/${data.id}`;
    const body = `available=${data.available}&phone=${data.phone}&needGuestKey=${data.needGuestKey}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .put<IResponse<any>>(url, body, this.options);
  }

  /** 获取所有列表 */
  getSerialList(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${consumerApiUrls.serialBatch}/${data.groupId}/keys?pageSize=9999`;
    url += data.sn ? '&sn=' + data.sn : '';
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': data.appChannel }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取所有列表 */
  getVoucher(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${consumerApiUrls.voucher}?appChannel=${data.appChannel}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': data.appChannel }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取所有列表 */
  getCallback(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${consumerApiUrls.callback}/list?size=999`;
    url += data.appChannelP ? '&appChannel=' + data.appChannelP : '';
    url += data.orderType ? '&orderType=' + data.orderType : '';
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': data.appChannel }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加 */
  addCallback(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${consumerApiUrls.callback}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 修改 */
  modifyCallback(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${consumerApiUrls.callback}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .put<IResponse<any>>(url, data, this.options);
  }

  /** 删除 */
  deleteCallback(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${consumerApiUrls.callback}/${data}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 获取所有列表 */
  getSerialBatch(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${consumerApiUrls.serialBatch}?size=999`;
    url += data.groupName ? '&groupName=' + data.groupName : '';
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': data.appChannel }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加 */
  addSerialBatch(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${consumerApiUrls.serialBatch}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': data.appChannelId }) };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 修改 */
  modifySerialBatch(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${consumerApiUrls.serialBatch}/${data.id}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': data.appChannelId }) };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 删除 */
  deleteSerialBatch(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${consumerApiUrls.serialBatch}/${data.groupId}/keys/batch`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': data.appChannelId }), body: data.keys };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

}
