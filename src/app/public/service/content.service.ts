import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { cmsApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class ContentService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getContentList(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.contentList}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取单个内容 */
  getContent(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.contentList}/${id}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 删除单个内容 */
  deleteContent(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.contentList}/${id}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 添加单个内容 */
  addContent(data): Observable<IResponse<any>> {
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    const body = `title=${data.title}&url=${data.url}&content=${data.content}&abstractContent=${data.abstractContent}&pseudonym=${data.pseudonym}&publishTime=${data.publishTime}&type=${data.type}&thumbnail=${data.thumbnail}`;
    const url = `${this.commonService.baseUrl}${cmsApiUrls.contentList}`;
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 修改单个内容 */
  updateContent(data): Observable<IResponse<any>> {
    const body = `title=${data.title}&url=${data.url}&content=${data.content}&abstractContent=${data.abstractContent}&pseudonym=${data.pseudonym}&publishTime=${data.publishTime}&type=${data.type}&thumbnail=${data.thumbnail}`;
    const url = `${this.commonService.baseUrl}${cmsApiUrls.contentList}/${data.id}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .patch<IResponse<any>>(url, body, this.options);
  }

}
