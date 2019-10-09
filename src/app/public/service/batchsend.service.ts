import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { activityApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class BatchsendService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getBatchsendList(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${activityApiUrls.batchsendList}/list?page=0&pageSize=100`
      + (data.sendStartTime ? ('&sendStartTime=' + data.sendStartTime) : '')
      + (data.sendEndTime ? ('&sendEndTime=' + data.sendEndTime) : '');
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': this.commonService.currentChanelId }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取单个 */
  getBatchsend(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${activityApiUrls.batchsendList}/info?pushRuleId=${id}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': this.commonService.currentChanelId }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addBatchsend(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${activityApiUrls.batchsendList}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': this.commonService.currentChanelId }) };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 添加单个 */
  batchsend(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${activityApiUrls.batchsendList}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': this.commonService.currentChanelId }) };
    return this.httpClient
      .patch<IResponse<any>>(url, data, this.options);
  }

}
