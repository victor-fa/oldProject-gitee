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

export class GuideService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getGuideAppList(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.guideList}/channels`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取指定APP的模板列表 */
  getGuideList(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.guideList}/templates?channelId=${id}`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加模板 */
  addGuide(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.guideList}/templates`;
    const body = `name=${data.name}&type=${data.type}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .put<IResponse<any>>(url, body, this.options);
  }

  /** 给APP添加模板  */
  addGuideForApp(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.guideList}/channels/${data.id}/template`;
    const body = `templateId=${data.templateId}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 添加元三大元素给模板 */
  addXxxForGuide(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.guideList}/templates/${data.templateId}`;
    const body = `elements=${JSON.stringify(data.elements)}&name=${data.name}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 从APP中删除模板 */
  deleteGuideFromApp(appId, templateId): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.guideList}/channels/${appId}/template/${templateId}`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 修改启用状态 */
  updateSwitch(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.guideList}/channels/${data.id}/template-enable`;
    const body = `templateId=${data.templateId}&enable=${data.enable}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

}
