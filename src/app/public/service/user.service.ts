import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { cmsApiUrls, userApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';
import { LoginItemInput } from '../model/user.model';
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
  getUserInfoList( data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${cmsApiUrls.mgmtList}/user-info?pageSize=9999`;
    url += data.locked ? '&locked=' + data.locked : '';
    url += data.loginBegin && data.loginBegin !== null ? '&loginBegin=' + data.loginBegin : '';
    url += data.loginEnd && data.loginEnd !== null ? '&loginEnd=' + data.loginEnd : '';
    url += data.registerBegin && data.registerBegin !== null ? '&registerBegin=' + data.registerBegin : '';
    url += data.registerEnd && data.registerEnd !== null ? '&registerEnd=' + data.registerEnd : '';
    url += data.phone ? '&phone=' + data.phone : '';
    url += data.userId ? '&userId=' + data.userId : '';
    return this.httpClient.get<IResponse<any>>(url, this.options);
  }

  /**
   * 查看用户反馈
   */
  getFeedBackInfo(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}/feedback/`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /**
   * 查看点踩
   */
  getOppositionInfo(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}/v2/estimate?estimate=false&page=0&pageSize=2000`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient.get<IResponse<any>>(url, this.options);
  }

  /**
   * 查看点赞
   */
  getAgreeInfo(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}/v2/estimate?estimate=true&page=0&pageSize=2000`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient.get<IResponse<any>>(url, this.options);
  }

  /**
   * 更新用户状态
   * @param infoId
   */
  updateUserInfo(infoId): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${userApiUrls.users}`;
    const body = `infoId=${infoId}`;
    this.setOption = {
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
    localStorage.setItem('currentUser', '');
    const result = new XMLHttpRequest();
    const formData = new FormData();
    formData.set('username', input.userName);
    formData.set('password', input.password);
    localStorage.setItem('currentUser', input.userName);
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
            if (JSON.parse(resultFull.responseText).payload === '') {
              return;
            }
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
    this.setOption = { headers: head, responseType: 'blob' };
    const url = `${this.commonService.baseUrl}/v2/estimate/session?id=${id}&estimate=${estimate}`;
    return this.httpClient
      .get<Blob>(url, this.options);
  }

  /** 获取点赞点踩Excel模板接口 */
  getBatchExcel(data) {
    const head = new Headers({ 'Content-Type': 'application/vnd.ms-excel;charset=UTF-8' });
    this.setOption = { headers: head, responseType: 'blob' };
    // tslint:disable-next-line:max-line-length
    let url = `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}/v2/estimate/session?estimate=${data.estimate}`;
    if (data.selected === 1) { url += data.number ? '&number=' + data.number : ''; }
    if (data.selected === 2) {
      url += data.startDate ? '&startDate=' + data.startDate : '';
      url += data.endDate ? '&endDate=' + data.endDate : '';
    }
    if (data.selected === 3) {
      url += data.botName ? '&botName=' + data.botName : '';
      url += data.userPhone ? '&userPhone=' + data.userPhone : '';
      url += data.startDate1 ? '&startDate1=' + data.startDate1 : '';
      url += data.endDate1 ? '&endDate1=' + data.endDate1 : '';
    }
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

  /**
   * 查看常用信息
   */
  getUserCommonInfo(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${cmsApiUrls.mgmtList}/general-info?userId=${data.userId}`;
    url += data.queryType ? '&queryType=' + data.queryType : '';
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url);
  }

}
