import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { appVersionApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class ProtocolService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getProtocolList(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.protocolList}?title=${data}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': this.commonService.currentChanelId }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addProtocol(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.protocolList}`;
    const body = `title=${data.title}&content=${data.content}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': this.commonService.currentChanelId}) };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

}
