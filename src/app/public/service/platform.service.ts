import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { platformApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class PlatformService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getPlatformList(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${platformApiUrls.platformList}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取单个 */
  getPlatform(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${platformApiUrls.platformList}/${id}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 删除单个 */
  deletePlatform(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${platformApiUrls.platformList}/${id}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addPlatform(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${platformApiUrls.platformList}`;
    const body = `title=${data.title}&site=${data.site}&enabled=${data.enabled}&jump=${data.jump}&image=${data.image}&order=${data.order}&url=${data.url}&expireTime=${data.expireTime}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 修改单个 */
  updatePlatform(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${platformApiUrls.platformList}/${data.id}`;
    const body = `title=${data.title}&site=${data.site}&jump=${data.jump}&image=${data.image}&order=${data.order}&url=${data.url}&expireTime=${data.expireTime}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .patch<IResponse<any>>(url, body, this.options);
  }

  /** 修改启用状态 */
  updateSwitch(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${platformApiUrls.platformList}/${data.id}`;
    const body = `enabled=${data.enabled}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .patch<IResponse<any>>(url, body, this.options);
  }

}
