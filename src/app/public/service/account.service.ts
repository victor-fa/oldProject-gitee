import { Injectable, Injector } from '@angular/core';
import { AppServiceBase } from '../base/app-service.base';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from '../model/response.model';
import { userApiUrls } from '../enum/api.enum';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class AccountService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取全部角色 */
  getRolesList(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${userApiUrls.roles}/list`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 新增角色 */
  addRoles(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${userApiUrls.roles}`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 修改角色 */
  modifyRole(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${userApiUrls.roles}`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .put<IResponse<any>>(url, data, this.options);
  }

  /** 删除角色 */
  deleteRole(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${userApiUrls.roles}?id=${data.id}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 获取全部用户 */
  getCustomerList(data): Observable<IResponse<any>> {
    let realname = '';
    let roleIds = '';
    let username = '';
    if (data) {
      realname = data.realname ? data.realname : '';
      roleIds = data.roleIds ? data.roleIds : '';
      username = data.username ? data.username : '';
    }
    const url = `${this.commonService.baseUrl}${userApiUrls.acc}/list` + (realname ? '?realname=' + realname : '')
        + (roleIds ? (realname ? '&roleIds=' : '?roleIds=') + roleIds : '')
        + (username ? (realname || roleIds ? '&username=' : '?username=') + username : '');
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 新增员工 */
  addCustomer(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${userApiUrls.acc}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 修改员工 */
  modifyCustomer(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${userApiUrls.acc}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .put<IResponse<any>>(url, data, this.options);
  }

  /** 删除员工 */
  deleteCustomer(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${userApiUrls.acc}?id=${data.id}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 获取加密用的盐 */
  getPublicSalt(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${userApiUrls.publicSalt}/admin`;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

}
