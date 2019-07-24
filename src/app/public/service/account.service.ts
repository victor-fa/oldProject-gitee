import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { accountApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';
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
    const url = `${this.commonService.baseUrl}${accountApiUrls.roles}/list?size=999`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 新增角色 */
  addRoles(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${accountApiUrls.roles}`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 修改角色 */
  modifyRole(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${accountApiUrls.roles}`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .put<IResponse<any>>(url, data, this.options);
  }

  /** 删除角色 */
  deleteRole(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${accountApiUrls.roles}?id=${data.id}`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 获取全部用户 */
  getCustomerList(data): Observable<IResponse<any>> {
    let realname = '';
    let roleId = '';
    let username = '';
    if (data) {
      realname = data.realname ? data.realname : '';
      roleId = data.roleId ? data.roleId : '';
      username = data.username ? data.username : '';
    }
    const url = `${this.commonService.baseUrl}${accountApiUrls.acc}/list?size=999` + (realname ? '&realname=' + realname : '')
        + (roleId ? (realname ? '&roleId=' : '&roleId=') + roleId : '')
        + (username ? (realname || roleId ? '&username=' : '&username=') + username : '');
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 新增员工 */
  addCustomer(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${accountApiUrls.acc}`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 修改员工 */
  modifyCustomer(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${accountApiUrls.acc}`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .put<IResponse<any>>(url, data, this.options);
  }

  /** 删除员工 */
  deleteCustomer(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${accountApiUrls.acc}?id=${data.id}`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 获取所有资源树 */
  getFullResource(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}/common/fullres`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 查询-管理员操作日志查询接口 */
  getOperationlogList(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${accountApiUrls.audit}?page=0&size=999`
        + (data.op_category ? '&op_category=' + data.op_category : '')
        + (data.op_page ? '&op_page=' + data.op_page : '')
        + (data.op_time_end ? '&op_time_end=' + data.op_time_end : '')
        + (data.op_time_start ? '&op_time_start=' + data.op_time_start : '')
        + (data.realname ? '&realname=' + data.realname : '')
        + (data.role_id ? '&role_id=' + data.role_id : '')
        + (data.username ? '&username=' + data.username : '');
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

}
