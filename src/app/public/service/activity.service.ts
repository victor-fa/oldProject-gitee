import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { IResponse } from '../model/response.model';
import { activityApiUrls } from '../enum/api.enum';

@Injectable({
  providedIn: 'root'
})

export class ActivityService extends AppServiceBase {
  token = localStorage.getItem('token');
  activityUrl = 'http://account-center-test.chewrobot.com/api';
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
  ) {
    super(injector);
  }

  /** 获取APP版本 */
  getActivityList(data): Observable<IResponse<any>> {
    const url = this.fullContentUrl(activityApiUrls.activityList)
    + '/list?page=0&pageSize=10'
    + (data.actName ? '&actName=' + data.actName : '')
    + (data.status ? '&status=' + data.status : '');
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取单个活动 */
  getActivity(id): Observable<IResponse<any>> {
    const url = this.activityUrl + activityApiUrls.activityList + '/info?id=' + id;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取新增后的红包信息 */
  getNewCouponList(actRuleId): Observable<IResponse<any>> {
    const url = this.activityUrl + activityApiUrls.activityList + '/gift'
    + '?actRuleId=' + actRuleId;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 删除单个活动 */
  deleteActivity(id): Observable<IResponse<any>> {
    const url = this.activityUrl + activityApiUrls.activityList + '?id=' + id;
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 删除单个活动奖励 */
  deleteCouponArr(actRuleId, actGiftNo): Observable<IResponse<any>> {
    const url = this.activityUrl + activityApiUrls.activityList + '/gift?actRuleId=' + actRuleId + '&actGiftNo=' + actGiftNo;
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 添加单个活动 */
  addActivity(data): Observable<IResponse<any>> {
    const url = this.activityUrl + activityApiUrls.activityList;
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient
      .put<IResponse<any>>(url, data, this.options);
  }

  /** 保存单个活动 */
  saveActivity(data): Observable<IResponse<any>> {
    const url = this.activityUrl + activityApiUrls.activityList;
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 添加单个红包到活动 */
  addCoupon(data): Observable<IResponse<any>> {
    const url = this.activityUrl + activityApiUrls.activityList + '/gift';
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient
      .put<IResponse<any>>(url, data, this.options);
  }

  /** 删除图片 */
  deleteImage(data): Observable<IResponse<any>> {
    // tslint:disable-next-line:max-line-length
    const url = this.activityUrl + activityApiUrls.activityList + '/img?actRuleId=' + data.imageResPos[0].actRuleId + '&imageNo=' + data.imageResPos[0].imageNo;
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

}
