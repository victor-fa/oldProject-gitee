import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { userApiUrls } from '../enum/api.enum';
import { LoginItemInput, LoginItemOutput, IUserInfoOutput } from '../model/user.model';
import { IResponse } from '../model/response.model';

@Injectable({
  providedIn: 'root'
})

export class UserService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
  ) {
    super(injector);
  }

  /** 获取所有用户列表 */
  getUserInfoList(lastId): Observable<IResponse<any>> {
    const url = this.fullUrl(userApiUrls.users) + '/list?pageSize=10' + '&lastId=' + lastId;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取所有用户列表 通过userName or phoneNum */
  getUserInfoListByType(type, infoId): Observable<IResponse<any>> {
    const url = this.fullUrl(userApiUrls.users) + '?type=' + type + '&infoId=' + infoId;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 更新用户状态 */
  updateUserInfo(infoId): Observable<IResponse<any>> {
    const url = this.fullUrl(userApiUrls.users);
    const body = `infoId=${infoId}`;
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 发送伪验证码 */
  sendMsg(phone): Observable<IResponse<any>> {
    const url = this.fullUrl(userApiUrls.users);
    const head = new Headers({
      'Content-Type': 'application/json',
      'Authorization': phone
    });
    this.setOption = {
      headers: head
    };
    return this.httpClient
      .post<IResponse<any>>(url, this.options);
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

}
