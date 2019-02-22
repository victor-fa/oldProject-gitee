import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { userApiUrls } from '../enum/api.enum';
import { LoginItemInput } from '../model/user.model';
import { IResponse } from '../model/response.model';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CookiesService } from './cookies.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class UserService extends AppServiceBase {
  // const token = this._cookiesService.getToken();
  token = localStorage.getItem('token');
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private modalService: NzModalService,
    private _cookiesService: CookiesService,
    private router: Router,
    private notification: NzNotificationService,
  ) {
    super(injector);
  }

  /**
   * 获取所有用户列表
   * @param flag
   * @param id
   */
  getUserInfoList(pageSize, flag, id): Observable<IResponse<any>> {
    let url;
    this.setOption = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.token })
    };
    if (flag === '') {
      url = this.fullUrl(userApiUrls.users) + '/list?pageSize=' + pageSize;
    } else if (flag === 'last') {
      url = this.fullUrl(userApiUrls.users) + '/list?pageSize=' + pageSize + '&lastId=' + id;
    } else if (flag === 'first') {
      url = this.fullUrl(userApiUrls.users) + '/list?pageSize=' + pageSize + '&firstId=' + id;
    }
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /**
   * 获取所有用户列表
   * @param flag
   * @param id
   * @param type
   * @param infoId
   */
  getUserInfoListByType(pageSize, flag, id, type, infoId): Observable<IResponse<any>> {
    let url;
    this.setOption = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.token })
    };
    if (flag === '') {
      url = this.fullUrl(userApiUrls.users) + '/list?pageSize=' + pageSize + '&type=' + type + '&infoId=' + infoId;
    } else if (flag === 'last') {
      url = this.fullUrl(userApiUrls.users) + '/list?pageSize=' + pageSize + '&type=' + type + '&infoId=' + infoId + '&lastId=' + id;
    } else if (flag === 'first') {
      url = this.fullUrl(userApiUrls.users) + '/list?pageSize=' + pageSize + '&type=' + type + '&infoId=' + infoId + '&firstId=' + id;
    }
    // const url = this.fullUrl(userApiUrls.users) + '?type=' + type + '&infoId=' + infoId;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /**
   * 查看用户详情
   */
  getUserInfo(id): Observable<IResponse<any>> {
    const url = this.fullUrl(userApiUrls.userContact) + '?infoId=' + id;
    this.setOption = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.token })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /**
   * 查看用户反馈
   */
  getFeedBackInfo(): Observable<IResponse<any>> {
    const url = 'http://account-center-test.chewrobot.com/api/feedback/';
    return this.httpClient
      .get<IResponse<any>>(url);
  }

  /**
   * 查看点踩
   */
  getOppositionInfo(): Observable<IResponse<any>> {
    const url = 'http://account-center-test.chewrobot.com/api/v2/estimate?estimate=false&page=0&pageSize=20';
    return this.httpClient
      .get<IResponse<any>>(url);
  }

  /**
   * 查看点赞
   */
  getAgreeInfo(): Observable<IResponse<any>> {
    const url = 'http://account-center-test.chewrobot.com/api/v2/estimate?estimate=true&page=0&pageSize=20';
    return this.httpClient
      .get<IResponse<any>>(url);
  }

  /**
   * 更新用户状态
   * @param infoId
   */
  updateUserInfo(infoId): Observable<IResponse<any>> {
    const url = this.fullUrl(userApiUrls.users);
    const body = `infoId=${infoId}`;
    this.setOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Authorization': 'Bearer ' + this.token
      })
    };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 发送伪验证码 */
  sendMsg(phone): Observable<IResponse<any>> {
    // const url = 'http://lxwork.vipgz1.idcfengye.com/api/admin' + userApiUrls.sms;
    const url = 'http://account-center-test.chewrobot.com/api/admin' + userApiUrls.sms;
    this.setOption = {
      headers: new HttpHeaders({ 'Authorization': phone })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /**
   * 登录验证
   * @param input
   */
  login(input: LoginItemInput) {
    const Base64 = require('js-base64').Base64;
    const auth = 'Basic ' + Base64.encode(input.userName + ':' + input.password);
    const result = new XMLHttpRequest();
    let tempString = {
      'message': '',
      'payload': '',
      'retcode': 0,
      'status': 0
    };

    // result.open('POST', 'http://lxwork.vipgz1.idcfengye.com/api/admin/token', true);
    result.open('POST', 'http://account-center-test.chewrobot.com/api/admin/token', true);
    result.setRequestHeader('Authorization', auth);
    result.setRequestHeader('Content-Type', 'application/json');
    result.send('');
    result.onreadystatechange = doResult;
    function doResult() {
      if (result.readyState !== 4 || result.status !== 200) { return; }
      document.getElementById('resultInfo').innerHTML = result.responseText;
    }

    setTimeout(() => {
      tempString = JSON.parse(document.getElementById('resultInfo').innerHTML);

      if (tempString.retcode === 0) {
        // 登录成功，直接跳转
        this._cookiesService.setToken(tempString.payload);
        setTimeout(() => {
          this.router.navigateByUrl('booking');
          // 登录成功
          this.notification.blank(
            '提示',
            '登录成功！',
            {
              nzStyle: {
                color : 'green'
              }
            }
          );
        }, 1000);
      } else {
        // 登录不成功，处理错误信息
        this.modalService.error({
          nzTitle: '提示',
          nzContent: tempString.message
        });
      }
    }, 200);
  }

  /** 获取点赞点踩Excel模板接口 */
  getExcel(id, estimate) {
    const head = new Headers({ 'Content-Type': 'application/vnd.ms-excel;charset=UTF-8' });
    this.setOption = {
      headers: head,
      responseType: 'blob'
    };
    const url = 'http://account-center-test.chewrobot.com/api/v2/estimate/session?id=' + id + '&estimate=' + true;
    return this.httpClient
      .get<Blob>(url, this.options);
  }

}
