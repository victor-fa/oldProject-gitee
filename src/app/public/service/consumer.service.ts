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
  getConsumerList(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${consumerApiUrls.consumerList}/list?pageSize=999`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addConsumer(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${consumerApiUrls.consumerList}`;
    const body = `appChannelId=${data.appChannel}&appChannelName=${data.appChannelName}&loginType=${data.loginType}&robot=${data.robot}`;
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
    const url = `${this.commonService.baseUrl}${consumerApiUrls.consumerKey}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': data.id }) };
    return this.httpClient
      .post<IResponse<any>>(url, data.keys, this.options);
  }

  /** 获取所有列表 */
  getSerialList(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${consumerApiUrls.consumerKey}?pageSize=9999`;
    url += data.sn ? '&sn=' + data.sn : '';
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': data.appChannel }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

}
