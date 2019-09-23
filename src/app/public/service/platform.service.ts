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
  baseUrl = this.commonService.documentRouteUrl; // 测试
  // baseUrl = this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'));  // 部署
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getcategoryList(): Observable<IResponse<any>> {
    const url = `${this.baseUrl}${platformApiUrls.categoryList}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取单个 */
  getcategoryItem(data): Observable<IResponse<any>> {
    const url = `${this.baseUrl}${platformApiUrls.categoryList}/${data}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addCategory(data): Observable<IResponse<any>> {
    const url = `${this.baseUrl}${platformApiUrls.categoryList}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 修改单个 */
  updateCategory(data): Observable<IResponse<any>> {
    const url = `${this.baseUrl}${platformApiUrls.categoryList}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .put<IResponse<any>>(url, data, this.options);
  }

  /** 删除单个 */
  deleteCategory(id): Observable<IResponse<any>> {
    const url = `${this.baseUrl}${platformApiUrls.categoryList}/${id}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }



  /** 获取所有列表 */
  getUserList(): Observable<IResponse<any>> {
    const url = `${this.baseUrl}${platformApiUrls.userList}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addUser(data): Observable<IResponse<any>> {
    const url = `${this.baseUrl}${platformApiUrls.userList}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 修改单个 */
  modifyUser(data): Observable<IResponse<any>> {
    const url = `${this.baseUrl}${platformApiUrls.userList}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .put<IResponse<any>>(url, data, this.options);
  }

  /** 删除单个 */
  deleteUser(id): Observable<IResponse<any>> {
    const url = `${this.baseUrl}${platformApiUrls.userList}/${id}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

}
