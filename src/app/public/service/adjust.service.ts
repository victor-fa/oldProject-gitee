import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { userApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class AdjustService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getAdjustList(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${userApiUrls.adjustList}?adjustType=${data.adjustType}&pageSize=999`;
    if (data.begin !== '' && data.begin !== null) {
      url = url + '&begin=' + data.begin + '&end=' + data.end;
    }
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': this.commonService.currentChanelId }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取单个 */
  getAdjust(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${userApiUrls.adjustList}/${id}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': this.commonService.currentChanelId }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addAdjust(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${userApiUrls.adjustList}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': this.commonService.currentChanelId}) };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 获取操作者列表 */
  getOperaters(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${userApiUrls.adjustList}/operaters`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': this.commonService.currentChanelId}) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取操作者列表 */
  sendMsg(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${userApiUrls.adjustList}/captcha?operater=${data}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': this.commonService.currentChanelId}) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

}
