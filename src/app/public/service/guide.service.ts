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

export class GuideService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有APP列表 */
  getGuideAppList(): Observable<IResponse<any>> {
    // const url = `${this.commonService.baseUrl}${cmsApiUrls.guideList}/apps`;
    const url = `http://192.168.1.217:8086/api${cmsApiUrls.guideList}/apps`;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取指定APP的模板列表 */
  getGuideList(id): Observable<IResponse<any>> {
    // const url = `${this.commonService.baseUrl}${cmsApiUrls.guideList}/templates?appId=${id}`;
    const url = `http://192.168.1.217:8086/api${cmsApiUrls.guideList}/templates?appId=${id}`;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加模板 */
  addGuide(data): Observable<IResponse<any>> {
    // const url = `${this.commonService.baseUrl}${cmsApiUrls.guideList}/templates?name=${data.name}`;
    const url = `http://192.168.1.217:8086/api${cmsApiUrls.guideList}/templates`;
    const body = `name=${data.name}&type=${data.type}`;
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };
    return this.httpClient
      .put<IResponse<any>>(url, body, this.options);
  }

  /** 给APP添加模板  */
  addGuideForApp(data): Observable<IResponse<any>> {
    // const url = `${this.commonService.baseUrl}${cmsApiUrls.guideList}/apps/${data.id}/template`;
    const url = `http://192.168.1.217:8086/api${cmsApiUrls.guideList}/apps/${data.id}/template`;
    const body = `templateId=${data.templateId}`;
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 添加元三大元素给模板 */
  addXxxForGuide(data, flag): Observable<IResponse<any>> {
    // const url = `${this.commonService.baseUrl}${cmsApiUrls.guideList}/templates/${data.id}${flag}`;
    const url = `http://192.168.1.217:8086/api${cmsApiUrls.guideList}/templates/${data.templateId}/${flag}`;
    let body = '';
    if (flag === 'message-element' || flag === 'button-element') {
      body = `templateId=${data.templateId}&text=${data.text}&index=${data.index}`;
    } else if (flag === 'image-element') {
      // tslint:disable-next-line:max-line-length
      body = `templateId=${data.templateId}&imageKey=${data.imageKey}&jumpType=${data.jumpType}&appDestinationType=${data.appDestinationType}&webUrl=${data.webUrl}&index=${data.index}`;
    }
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 从APP中删除模板 */
  deleteGuideFromApp(appId, templateId): Observable<IResponse<any>> {
    // const url = `${this.commonService.baseUrl}${cmsApiUrls.guideList}/templates/${id}`;
    const url = `http://192.168.1.217:8086/api${cmsApiUrls.guideList}/apps/${appId}/template/${templateId}`;
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 修改启用状态 */
  updateSwitch(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.guideList}/${data.id}`;
    const body = `enabled=${data.enabled}`;
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };
    // tslint:disable-next-line:max-line-length
    return this.httpClient
      .patch<IResponse<any>>(url, body, this.options);
  }

}
