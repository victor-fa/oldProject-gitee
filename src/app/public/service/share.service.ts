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

export class ShareService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getShareList(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.shareList}`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addShare(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.shareList}`;
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

}
