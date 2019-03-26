import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { IResponse } from '../model/response.model';
import { operateApiUrls } from '../enum/api.enum';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class XiaowubeanService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    public commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getXiaowubeanList(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${operateApiUrls.xiaowubeanList}`
      + '?a=1' + (data.title ? '&title=' + data.title : '')
      + (data.beginTime ? '&beginTime=' + data.beginTime : '')
      + (data.endTime ? '&endTime=' + data.endTime : '');
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取单个 */
  getXiaowubean(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${operateApiUrls.xiaowubeanList}/${id}`;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addXiaowubean(data, flag): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${operateApiUrls.xiaowubeanList}`;
    let body = '';
    if (flag === 'PERCENT_GIFT') {
      // tslint:disable-next-line:max-line-length
      body = `title=${data.title}&describe=${data.describe}&type=${data.type}&depositAmount=${data.depositAmount}&giftPercent=${data.giftPercent}&beginTime=${data.beginTime}&endTime=${data.endTime}`;
    } else if (flag === 'FIXED_QUOTA_GIFT') {
      // tslint:disable-next-line:max-line-length
      body = `title=${data.title}&describe=${data.describe}&type=${data.type}&depositAmount=${data.depositAmount}&giftAmount=${data.giftAmount}&beginTime=${data.beginTime}&endTime=${data.endTime}`;
    }
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 修改单个 */
  updateXiaowubean(data, flag): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${operateApiUrls.xiaowubeanList}/${data.id}`;
    let body = '';
    if (flag === 'PERCENT_GIFT') {
      // tslint:disable-next-line:max-line-length
      body = `title=${data.title}&describe=${data.describe}&type=${data.type}&depositAmount=${data.depositAmount}&giftPercent=${data.giftPercent}&beginTime=${data.beginTime}&endTime=${data.endTime}`;
    } else if (flag === 'FIXED_QUOTA_GIFT') {
      // tslint:disable-next-line:max-line-length
      body = `title=${data.title}&describe=${data.describe}&type=${data.type}&depositAmount=${data.depositAmount}&giftAmount=${data.giftAmount}&beginTime=${data.beginTime}&endTime=${data.endTime}`;
    }
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };
    return this.httpClient
      .patch<IResponse<any>>(url, body, this.options);
  }
}
