import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { userApiUrls } from '../enum/api.enum';
import { LoginItemInput, LoginItemOutput, IUserInfoOutput } from '../model/user.model';
import { IResponse } from '../model/response.model';
import { NzModalService } from 'ng-zorro-antd';
import { CookiesService } from './cookies.service';

@Injectable({
  providedIn: 'root'
})

export class UserService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private modalService: NzModalService,
    private _cookiesService: CookiesService,
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
    const url = 'http://account-center-test.chewrobot.com/api/admin' + userApiUrls.sms;
    this.setOption = {
      headers: new HttpHeaders({ 'Authorization': phone })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 登录账号 */
  login(login: LoginItemInput): Observable<IResponse<LoginItemOutput>> {
    const url = this.fullUrl(userApiUrls.login);
    const body = `userName=${login.userName}&password=${login.password}`;
    return this.httpClient
      .post<IResponse<LoginItemOutput>>(url, body, this.options)
      .switchMap(res => {
          if (res.retcode === 0) {
              // 如果注册成功则调用授权API自动登录
              const loginItemInput = new LoginItemInput();
              loginItemInput.userName  = login.userName;
              loginItemInput.password  = login.password;
              this.modalService.success({
                nzTitle: '提示',
                nzContent: res.message
              });
              this.authenticate(loginItemInput).subscribe();
              return Observable.of(null);
          }
          // 注册不成功，处理错误信息
          this.modalService.error({
            nzTitle: '提示',
            nzContent: res.message
          });
          return Observable.of(null);
      });
  }

  /**
   * 登录验证
   * @param input
   */
  authenticate(input: LoginItemInput): Observable<LoginItemOutput> {
    const _url = this.fullUrl('/user/login/');
    const _content = JSON.stringify(input);
    return this.httpClient
        .post<LoginItemOutput>(_url, _content, this.options)
        .switchMap(res => {
            if (res.token) {
                // 登录成功，直接跳转
                this._cookiesService.setToken(res.token);
                location.href = this.fullUrl('/user/center');
                return Observable.of(null);
            }
            // 登录不成功，处理错误信息
            this.modalService.error({
              nzTitle: '提示',
              nzContent: '登录失败！'
            });
            return Observable.of(null);
        });
}

  /** 获取加密用的盐 */
  getPublicSalt(): Observable<IResponse<any>> {
    const url = this.fullUrl(userApiUrls.publicSalt);
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

}
