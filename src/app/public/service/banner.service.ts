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

export class BannerService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有内容列表 */
  getBannerList(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.bannerList}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取单个 */
  getBanner(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.bannerList}/${id}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 删除单个 */
  deleteBanner(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.bannerList}/${id}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addBanner(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.bannerList}`;
    // tslint:disable-next-line:max-line-length
    const body = `title=${data.title}&site=${data.site}&enabled=${data.enabled}&jump=${data.jump}&image=${data.image}&order=${data.order}&url=${data.url}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader')})
    };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 修改单个 */
  updateBanner(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.bannerList}/${data.id}`;
    // tslint:disable-next-line:max-line-length
    const body = `title=${data.title}&site=${data.site}&jump=${data.jump}&image=${data.image}&order=${data.order}&url=${data.url}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader')})
    };
    return this.httpClient
      .patch<IResponse<any>>(url, body, this.options);
  }

  /** 修改启用状态 */
  updateSwitch(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.bannerList}/${data.id}`;
    const body = `enabled=${data.enabled}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    // tslint:disable-next-line:max-line-length
    return this.httpClient
      .patch<IResponse<any>>(url, body, this.options);
  }

}
