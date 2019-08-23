import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { sessionAnalysisApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class SpecialUserService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getSpecialUserList(): Observable<IResponse<any>> {
    // const url = `${this.commonService.baseUrl}${sessionAnalysisApiUrls.specialUserList}`;
    const url = `http://aliyun-sz2.chewrobot.com:46008/api${sessionAnalysisApiUrls.specialUserList}?pageSize=999`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addSpecialUser(data): Observable<IResponse<any>> {
    // const url = `${this.commonService.baseUrl}${sessionAnalysisApiUrls.specialUserList}`;
    const url = `http://aliyun-sz2.chewrobot.com:46008/api${sessionAnalysisApiUrls.specialUserList}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 修改单个 */
  modifySpecialUser(data): Observable<IResponse<any>> {
    // const url = `${this.commonService.baseUrl}${sessionAnalysisApiUrls.specialUserList}`;
    const url = `http://aliyun-sz2.chewrobot.com:46008/api${sessionAnalysisApiUrls.specialUserList}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .put<IResponse<any>>(url, data, this.options);
  }

  /** 删除单个 */
  deleteSpecialUser(data): Observable<IResponse<any>> {
    // const url = `${this.commonService.baseUrl}${sessionAnalysisApiUrls.specialUserList}`;
    const url = `http://aliyun-sz2.chewrobot.com:46008/api${sessionAnalysisApiUrls.specialUserList}`;
    const body = `id=${data}`;
    this.setOption = { body: body, headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 刷新历史 */
  refreshHistory(): Observable<IResponse<any>> {
    // const url = `${this.commonService.baseUrl}${sessionAnalysisApiUrls.specialUserList}`;
    const url = `http://aliyun-sz2.chewrobot.com:46008/api/logs/history-categories`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .put<IResponse<any>>(url, this.options);
  }


  /** 获取所有列表 */
  getCategoriesList(): Observable<IResponse<any>> {
    // const url = `${this.commonService.baseUrl}${sessionAnalysisApiUrls.categoriesList}`;
    const url = `http://aliyun-sz2.chewrobot.com:46008/api${sessionAnalysisApiUrls.categoriesList}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addCategories(data): Observable<IResponse<any>> {
    // const url = `${this.commonService.baseUrl}${sessionAnalysisApiUrls.categoriesList}`;
    const url = `http://aliyun-sz2.chewrobot.com:46008/api${sessionAnalysisApiUrls.categoriesList}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 修改单个 */
  modifyCategories(data): Observable<IResponse<any>> {
    // const url = `${this.commonService.baseUrl}${sessionAnalysisApiUrls.categoriesList}`;
    const url = `http://aliyun-sz2.chewrobot.com:46008/api${sessionAnalysisApiUrls.categoriesList}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .put<IResponse<any>>(url, data, this.options);
  }

  /** 删除单个 */
  deleteCategories(data): Observable<IResponse<any>> {
    // const url = `${this.commonService.baseUrl}${sessionAnalysisApiUrls.categoriesList}`;
    const url = `http://aliyun-sz2.chewrobot.com:46008/api${sessionAnalysisApiUrls.categoriesList}/${data}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

}
