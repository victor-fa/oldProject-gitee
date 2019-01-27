import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { userApiUrls, contentApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';
import { CookiesService } from './cookies.service';

@Injectable({
  providedIn: 'root'
})

export class ContentService extends AppServiceBase {
  // const token = this._cookiesService.getToken();
  token = localStorage.getItem('token');
  contentUrl = 'http://account-center-test.chewrobot.com/api';
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private _cookiesService: CookiesService,
  ) {
    super(injector);
  }

  /** 获取所有内容列表 */
  getContentList(): Observable<IResponse<any>> {
    const url = this.fullContentUrl(contentApiUrls.contentList);
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取单个内容 */
  getContent(id): Observable<IResponse<any>> {
    let url;
    // this.setOption = {
    //   headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.token })
    // };
    // url = this.fullUrl(contentApiUrls.orderList) + ;
    url = this.contentUrl + contentApiUrls.contentList + '/' + id;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 删除单个内容 */
  deleteContent(id): Observable<IResponse<any>> {
    let url;
    // url = this.fullUrl(contentApiUrls.orderList) + ;
    url = this.contentUrl + contentApiUrls.contentList + '/' + id;
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 添加单个内容 */
  addContent(data): Observable<IResponse<any>> {
    let url;
    let body = '';
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };
    // url = this.fullUrl(contentApiUrls.orderList) + ;
    // tslint:disable-next-line:max-line-length
    body = `title=${data.title}&url=${data.url}&content=${data.content}&abstractContent=${data.abstractContent}&pseudonym=${data.pseudonym}&publishTime=${data.publishTime}&type=${data.type}&thumbnail=${data.thumbnail}`;
    url = this.contentUrl + contentApiUrls.contentList;
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 修改单个内容 */
  updateContent(data): Observable<IResponse<any>> {
    let url;
    let body = '';
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };
    // url = this.fullUrl(contentApiUrls.orderList) + ;
    // tslint:disable-next-line:max-line-length
    body = `title=${data.title}&url=${data.url}&content=${data.content}&abstractContent=${data.abstractContent}&pseudonym=${data.pseudonym}&publishTime=${data.publishTime}&type=${data.type}&thumbnail=${data.thumbnail}`;
    // url = this.fullUrl(contentApiUrls.orderList) + data.id;
    url = this.contentUrl + contentApiUrls.contentList + '/' + data.id;
    return this.httpClient
      .patch<IResponse<any>>(url, body, this.options);
  }

}
