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

export class QqCustomerService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getQqCustomerList(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.qqCustomerList}`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 修改单个 */
  modifyQqCustomer(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.qqCustomerList}?contact_qq=${data.contact_qq}`;
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .put<IResponse<any>>(url, data, this.options);
  }

}
