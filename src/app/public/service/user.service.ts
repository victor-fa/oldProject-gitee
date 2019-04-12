import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { userApiUrls } from '../enum/api.enum';
import { LoginItemInput } from '../model/user.model';
import { IResponse } from '../model/response.model';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class UserService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private modalService: NzModalService,
    private router: Router,
    private notification: NzNotificationService,
    public commonService: CommonService,
    private http: HttpClient,
  ) {
    super(injector);
  }

  /**
   * 获取所有列表
   * @param flag
   * @param id
   */
  getUserInfoList(pageSize, flag, id): Observable<IResponse<any>> {
    let url;
    if (flag === '') {
      url = `${this.commonService.baseUrl}${userApiUrls.users}/list?pageSize=${pageSize}`;
    } else if (flag === 'last') {
      url = `${this.commonService.baseUrl}${userApiUrls.users}/list?pageSize=${pageSize}&lastId=${id}`;
    } else if (flag === 'first') {
      url = `${this.commonService.baseUrl}${userApiUrls.users}/list?pageSize=${pageSize}&firstId=${id}`;
    }
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /**
   * 获取所有列表
   * @param flag
   * @param id
   * @param type
   * @param infoId
   */
  getUserInfoListByType(pageSize, flag, id, type, infoId): Observable<IResponse<any>> {
    let url;
    if (flag === '') {
      url = `${this.commonService.baseUrl}${userApiUrls.users}/list?pageSize=${pageSize}&type=${type}&infoId=${infoId}`;
    } else if (flag === 'first') {
      url = `${this.commonService.baseUrl}${userApiUrls.users}/list?pageSize=${pageSize}&type=${type}&infoId=${infoId}&firstId=${id}`;
    } else if (flag === 'last') {
      url = `${this.commonService.baseUrl}${userApiUrls.users}/list?pageSize=${pageSize}&type=${type}&infoId=${infoId}&lastId=${id}`;
    }
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /**
   * 查看用户详情
   */
  getUserInfo(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${userApiUrls.userContact}?infoId=${id}`;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /**
   * 查看用户反馈
   */
  getFeedBackInfo(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}/feedback/`;
    return this.httpClient
      .get<IResponse<any>>(url);
  }

  /**
   * 查看点踩
   */
  getOppositionInfo(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}/v2/estimate?estimate=false&page=0&pageSize=2000`;
    return this.httpClient
      .get<IResponse<any>>(url);
  }

  /**
   * 查看点赞
   */
  getAgreeInfo(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}/v2/estimate?estimate=true&page=0&pageSize=2000`;
    return this.httpClient
      .get<IResponse<any>>(url);
  }

  /**
   * 更新用户状态
   * @param infoId
   */
  updateUserInfo(infoId): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${userApiUrls.users}`;
    const body = `infoId=${infoId}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
    };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 发送伪验证码 */
  sendMsg(phone): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${userApiUrls.sms}`;
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
    localStorage.setItem('token', '');
    localStorage.setItem('FullMenuResource', '');
    localStorage.setItem('FullChildrenResource', '');
    localStorage.setItem('AppHeaderAllow', '');
    const result = new XMLHttpRequest();
    const formData = new FormData();
    formData.set('username', input.userName);
    formData.set('password', input.password);
    const that = this;
    let count = 0;  // 因为该方法会被掉4次，所以出此下策只提示一次

    result.onreadystatechange = function() {
      if (result.readyState !== 4 || result.status !== 200) {
        count += 1;
        if (count === 2 && result.status === 401) { that.notification.blank('提示', '登录信息有误！', { nzStyle: { color : 'red' }}); }
        return;
      }
      if (result.responseText !== '') {
        localStorage.setItem('token', JSON.parse(result.responseText).authorization);
        that.notification.blank('提示', '登录成功！', { nzStyle: { color : 'green' }});
        // 获取当前登录用户的资源树
        const resultFull = new XMLHttpRequest();
        resultFull.onreadystatechange = function() {
          const menuArr = [];
          const childrenArr = [];
          if (resultFull.responseText !== '') {
            localStorage.setItem('AppHeaderAllow', JSON.stringify(JSON.parse(JSON.parse(resultFull.responseText).payload).grantedPlatform));
            JSON.parse(JSON.parse(resultFull.responseText).payload).grantedRes.forEach(item => {
              console.log(item);
              if (item.isVisible === true) {
                menuArr.push(item.name);
              }
              if (item.children) {
                item.children.forEach(cell => {
                  console.log(cell.isVisible);
                  if (cell.isVisible === true) {
                    childrenArr.push(cell.name);
                  }
                });
              }
            });
            localStorage.setItem('FullMenuResource', JSON.stringify(menuArr));
            that.commonService.fullMenuResource = JSON.stringify(menuArr);
            localStorage.setItem('FullChildrenResource', JSON.stringify(childrenArr)); // 正式
            // tslint:disable-next-line:max-line-length
            that.commonService.fullChildrenResource = JSON.stringify(childrenArr);
            setTimeout(() => {
              let target = 'appVersion';
              if (menuArr.indexOf('APP管理') <= -1) { // 不存在
                target = 'customer';
                if (menuArr.indexOf('客服中心') <= -1) { // 不存在
                  target = 'user';
                  if (menuArr.indexOf('用户管理') <= -1) { // 不存在
                    target = 'operate';
                    if (menuArr.indexOf('运维后台') <= -1) { // 不存在
                      target = 'content';
                      if (menuArr.indexOf('内容管理') <= -1) { // 不存在
                        target = 'activity';
                        if (menuArr.indexOf('活动管理') <= -1) { // 不存在
                          target = 'dataCenter';
                          if (menuArr.indexOf('数据中心') <= -1) { // 不存在
                            target = 'account';
                          }
                        }
                      }
                    }
                  }
                }
              }
              that.router.navigateByUrl(target);
            }, 2000);
          }
        };
        resultFull.open('GET', `${that.commonService.baseUrl}/auth/info`, true);
        resultFull.setRequestHeader('App-Channel-Id', localStorage.getItem('currentAppHeader'));
        resultFull.setRequestHeader('Authorization', localStorage.getItem('token'));
        resultFull.send();

      } else {
        that.modalService.error({ nzTitle: '提示', nzContent: '登录信息有误！' });
      }
    };
    result.open('POST', `${this.commonService.baseUrl}/process_login`, true);
    result.send(formData);
  }

  /** 获取点赞点踩Excel模板接口 */
  getExcel(id, estimate) {
    const head = new Headers({ 'Content-Type': 'application/vnd.ms-excel;charset=UTF-8' });
    this.setOption = {
      headers: head,
      responseType: 'blob'
    };
    const url = `${this.commonService.baseUrl}/v2/estimate/session?id=${id}&estimate=${estimate}`;
    return this.httpClient
      .get<Blob>(url, this.options);
  }

  /**
   * 查看发票详情
   */
  getInvoiceDetail(orderId): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}/order/invoice/detail?orderId=${orderId}`;
    return this.httpClient
      .get<IResponse<any>>(url);
  }

}
