import { Injectable, Injector } from '@angular/core';
import { AppServiceBase } from '../base/app-service.base';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse } from '../model/response.model';
import { userApiUrls } from '../enum/api.enum';
import { IAccountListItemOutput, LoginItemInput, IRolesItemInput,
  IRolesItemOutput, AddRolesItem, AddCustomerItem, CustomerItem, LoginItemOutput } from '../model/account.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AccountService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
  ) {
    super(injector);
  }

  /** 获取全部账号 */
  getUserList(customerItem: CustomerItem): Observable<IResponse<IAccountListItemOutput[]>> {
    let userName = '';
    let nick = '';
    let department = '';
    let role = '';
    if (customerItem) {
      userName = customerItem.userName ? customerItem.userName : '';
      nick = customerItem.nick ? customerItem.nick : '';
      department = customerItem.department ? customerItem.department : '';
      role = customerItem.role ? customerItem.role : '';
    }
    const url = this.fullUrl(userApiUrls.users) + (userName ? '?userName=' + userName : '')
        + (nick ? (userName ? '&nick=' : '?nick=') + nick : '')
        + (department ? (userName || nick ? '&department=' : '?department=') + department : '')
        + (role ? (userName || nick || department ? '&roleId=' : '?roleId=') + role : '');
    return this.httpClient
      .get<IResponse<IAccountListItemOutput[]>>(url, this.options);
  }

  /** 登录账号 */
  login(login: LoginItemInput): Observable<IResponse<LoginItemOutput>> {
    const url = this.fullUrl(userApiUrls.login);
    const body = `userName=${login.userName}&password=${login.password}`;
    return this.httpClient
      .post<IResponse<LoginItemOutput>>(url, body, this.options);
  }

  /** 获取加密用的盐 */
  getPublicSalt(): Observable<IResponse<any>> {
    const url = this.fullUrl(userApiUrls.publicSalt);
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 新增员工 */
  addCustomer(customer: AddCustomerItem): Observable<IResponse<IAccountListItemOutput[]>> {
    const url = this.fullUrl(userApiUrls.register);
    // tslint:disable-next-line:max-line-length
    const body = `userName=${customer.userName}&password=${customer.password}&nick=${customer.nick}&department=${customer.department}&roleIds=${customer.roles}`;
    return this.httpClient
      .post<IResponse<IAccountListItemOutput[]>>(url, body, this.options);
  }

  /** 修改员工 */
  modifyCustomer(id: string, customer: AddCustomerItem): Observable<IResponse<IAccountListItemOutput[]>> {
    let body = '';
    const url = this.fullUrl(userApiUrls.users) + '/' + id;
    if (customer.password === undefined) {
      // tslint:disable-next-line:max-line-length
      body = `userName=${customer.userName}&nick=${customer.nick}&department=${customer.department}&roleIds=${customer.roles}`;
    } else {
      // tslint:disable-next-line:max-line-length
      body = `userName=${customer.userName}&password=${customer.password}&nick=${customer.nick}&department=${customer.department}&roleIds=${customer.roles}`;
    }
    return this.httpClient
      .post<IResponse<IAccountListItemOutput[]>>(url, body, this.options);
  }

  /** 删除员工 */
  deleteCustomer(id: string): Observable<IResponse<any>> {
    const url = this.fullUrl(userApiUrls.users) + '/' + id;
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 登出当前账号 */
  logout() {
    const url = this.fullUrl(userApiUrls.logout);
    return this.httpClient
      .post<IResponse<IAccountListItemOutput[]>>(url, this.options);
  }

  /** 获取全部角色 */
  getRolesList(role?: IRolesItemInput): Observable<IResponse<IRolesItemOutput[]>> {
    let name = '';
    if (role) {
      name = role.name ? role.name : '';
    }
    const url = this.fullUrl(userApiUrls.roles) + (name ? '?name=' + name : '');
    return this.httpClient
      .get<IResponse<IRolesItemOutput[]>>(url, this.options);
  }

  /** 新增角色 */
  addRoles(role: AddRolesItem): Observable<IResponse<IRolesItemOutput[]>> {
    // tslint:disable-next-line:max-line-length
    const url = this.fullUrl(userApiUrls.roles);
    const body = `name=${role.name}&description=${role.description}&permissions=${role.permissions}`;
    return this.httpClient
      .post<IResponse<IRolesItemOutput[]>>(url, body, this.options);
  }

  /** 修改角色 */
  modifyRole(id: string, customer: AddRolesItem): Observable<IResponse<IRolesItemOutput[]>> {
    const url = this.fullUrl(userApiUrls.roles) + '/' + id;
    const body = `name=${customer.name}&description=${customer.description}&permissions=${customer.permissions}`;
    return this.httpClient
      .post<IResponse<IRolesItemOutput[]>>(url, body, this.options);
  }

  /** 删除角色 */
  deleteRole(id: string): Observable<IResponse<any>> {
    const url = this.fullUrl(userApiUrls.roles) + '/' + id;
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /* 获取部门下拉 */
  getdepartments(): Observable<IResponse<any>> {
    const url = this.fullUrl(userApiUrls.departments);
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

}
