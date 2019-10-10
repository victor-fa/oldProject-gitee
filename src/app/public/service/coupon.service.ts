import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { activityApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class CouponService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getCouponList(searchItem): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${activityApiUrls.couponList}/list`
    + '?page=0&pageSize=10'
    + (searchItem.couponName ? '&couponName=' + searchItem.couponName : '')
    + (searchItem.discountType ? '&discountType=' + searchItem.discountType : '')
    + (searchItem.couponCategory ? '&couponCategory=' + searchItem.couponCategory : '')
    + (searchItem.ctimeStart ? '&ctimeStart=' + searchItem.ctimeStart : '')
    + (searchItem.ctimeEnd ? '&ctimeEnd=' + searchItem.ctimeEnd : '');
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取单个 */
  getCoupon(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${activityApiUrls.couponList}/info?couponId=${id}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 删除单个 */
  deleteCoupon(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${activityApiUrls.couponList}/${id}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addCoupon(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${activityApiUrls.couponList}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 修改单个 */
  updateCoupon(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${activityApiUrls.couponList}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .put<IResponse<any>>(url, data, this.options);
  }

  /** 修改启用状态 */
  updateSwitch(id, enabled): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${activityApiUrls.couponList}/${id}`;
    const body = `enabled=${enabled}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .patch<IResponse<any>>(url, body, this.options);
  }

}
