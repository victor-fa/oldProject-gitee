import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { userApiUrls } from '../enum/api.enum';
import { LoginItemInput, LoginItemOutput } from '../model/user.model';
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
