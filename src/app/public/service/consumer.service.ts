import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { IResponse } from '../model/response.model';
import { cmsApiUrls } from '../enum/api.enum';
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
    const url = `${this.commonService.baseUrl}${cmsApiUrls.consumerList}/list?pageSize=999`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addConsumer(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.consumerList}`;
    const body = `appChannelId=${data.appChannel}&appChannelName=${data.appChannelName}&loginType=${data.loginType}&robot=${data.robot}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader')})
    };
    return this.httpClient
      .put<IResponse<any>>(url, body, this.options);
  }

  /** 添加Payment Key */
  addPayment(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.consumerList}/payment`;
    const body = `appChannel=${data.id}&paymentKey=${data.paymentKey}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader')})
    };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 添加sms */
  addSms(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.consumerList}/sms`;
    const body = `appChannel=${data.id}&smsSignType=${data.smsSign}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader')})
    };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

}
