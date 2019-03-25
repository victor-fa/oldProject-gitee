import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { userApiUrls } from '../enum/api.enum';
import { LoginItemInput } from '../model/user.model';
import { IResponse } from '../model/response.model';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CookiesService } from './cookies.service';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonService } from './common.service';

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
    public commonService: CommonService,
    private http: HttpClient,
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
      url = `${this.commonService.baseUrl}/admin${userApiUrls.users}/list?pageSize=${pageSize}`;
    } else if (flag === 'last') {
      url = `${this.commonService.baseUrl}/admin${userApiUrls.users}/list?pageSize=${pageSize}&lastId=${id}`;
    } else if (flag === 'first') {
      url = `${this.commonService.baseUrl}/admin${userApiUrls.users}/list?pageSize=${pageSize}&firstId=${id}`;
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
      url = `${this.commonService.baseUrl}/admin${userApiUrls.users}/list?pageSize=${pageSize}&type=${type}&infoId=${infoId}`;
    } else if (flag === 'first') {
      url = `${this.commonService.baseUrl}/admin${userApiUrls.users}/list?pageSize=${pageSize}&type=${type}&infoId=${infoId}&firstId=${id}`;
    } else if (flag === 'last') {
      url = `${this.commonService.baseUrl}/admin${userApiUrls.users}/list?pageSize=${pageSize}&type=${type}&infoId=${infoId}&lastId=${id}`;
    }
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /**
   * 查看用户详情
   */
  getUserInfo(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}/admin${userApiUrls.userContact}?infoId=${id}`;
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
    const url = `${this.commonService.baseUrl}/admin${userApiUrls.users}`;
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
    const url = `${this.commonService.baseUrl}/admin${userApiUrls.sms}`;
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
    const result = new XMLHttpRequest();
    const formData = new FormData();
    formData.set('username', input.userName);
    formData.set('password', input.password);
    result.onreadystatechange = function() {
      console.log(result.getAllResponseHeaders());
      console.log(result.getResponseHeader);
      console.log(result.getResponseHeader('Authorization'));
      console.log(result);
        //   if (result.readyState !== 4 || result.status !== 200) { return; }
      // if (this.readyState === this.HEADERS_RECEIVED) {
        // const contentType = result.getAllResponseHeaders();
        // console.log(this.readyState + '===' + this.HEADERS_RECEIVED);
      // }
    };
    result.open('POST', `http://192.168.1.39:8086/api/admin/process_login`);
    result.send(formData);

    // const formData = new FormData();
    // formData.set('username', input.userName);
    // formData.set('password', input.password);
    // const req = new HttpRequest('POST', `http://192.168.1.39:8086/api/admin/process_login`, formData, {
    //   reportProgress: true
    // });
    // this.http
    //   .request(req)
    //   .pipe(filter(e => e instanceof HttpResponse))
    //   .subscribe((event: HttpResponse<{ code: any, data: any, msg: any }> | any) => {
    //     console.log(event);
    //     if (event.body.retcode === 0) {
    //     } else {
    //     }
    //   },
    //   err => {  }
    // );

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

}
