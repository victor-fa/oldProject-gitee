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
    const url = `${this.commonService.baseUrl}${cmsApiUrls.protocolList}?title=${data}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addProtocol(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.protocolList}`;
    // tslint:disable-next-line:max-line-length
    const body = `title=${data.title}&content=${data.content}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader')})
    };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

}
