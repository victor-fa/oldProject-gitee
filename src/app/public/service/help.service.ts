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

export class HelpService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getHelpList(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.helpList}`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取单个 */
  getHelp(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.helpList}/${id}`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 删除单个 */
  deleteHelp(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.helpList}/${id}`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addHelp(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.helpList}`;
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 修改单个 */
  updateHelp(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.helpList}/${data.id}`;
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .patch<IResponse<any>>(url, data, this.options);
  }

}
