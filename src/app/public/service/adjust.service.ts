import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { IResponse } from '../model/response.model';
import { cmsApiUrls } from '../enum/api.enum';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class AdjustService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getAdjustList(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${cmsApiUrls.adjustList}?adjustType=${data.adjustType}`;
    if (data.begin !== '') {
      url = url + '&begin=' + data.begin + '&end=' + data.end;
    }
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取单个 */
  getAdjust(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.adjustList}/${id}`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 删除单个 */
  deleteAdjust(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.adjustList}/${id}`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addAdjust(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.adjustList}`;
    // tslint:disable-next-line:max-line-length
    const body = `adjustAmount=${data.adjustAmount}&adjustReason=${data.adjustReason}&adjustType=${data.adjustType}&code=${data.code}&noticeAbstract=${data.noticeAbstract}&noticeContent=${data.noticeContent}&noticeTitle=${data.noticeTitle}&operater=${data.operater}&users=${data.users}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader')})
    };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 修改单个 */
  updateAdjust(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.adjustList}/${data.id}`;
    // tslint:disable-next-line:max-line-length
    const body = `title=${data.title}&site=${data.site}&jump=${data.jump}&image=${data.image}&order=${data.order}&url=${data.url}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader')})
    };
    return this.httpClient
      .patch<IResponse<any>>(url, body, this.options);
  }

}
