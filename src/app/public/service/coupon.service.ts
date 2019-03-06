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

export class CouponService extends AppServiceBase {
  // const token = this._cookiesService.getToken();
  token = localStorage.getItem('token');
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有优惠券列表 */
  getCouponList(searchItem): Observable<IResponse<any>> {
    const url = this.fullUrl(cmsApiUrls.couponList) + '/list'
    + '?page=0&pageSize=10'
    + (searchItem.couponName ? '&couponName=' + searchItem.couponName : '')
    + (searchItem.discountType ? '&discountType=' + searchItem.discountType : '')
    + (searchItem.couponCategory ? '&couponCategory=' + searchItem.couponCategory : '')
    + (searchItem.ctimeStart ? '&ctimeStart=' + searchItem.ctimeStart : '')
    + (searchItem.ctimeEnd ? '&ctimeEnd=' + searchItem.ctimeEnd : '');
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取单个 */
  getCoupon(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.couponList}/info?couponId=${id}`;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 删除单个 */
  deleteCoupon(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.couponList}/${id}`;
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addCoupon(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.couponList}`;
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient
      .put<IResponse<any>>(url, data, this.options);
  }

  /** 修改单个 */
  updateCoupon(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.couponList}`;
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 修改启用状态 */
  updateSwitch(id, enabled): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${cmsApiUrls.couponList}/${id}`;
    const body = `enabled=${enabled}`;
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };
    // tslint:disable-next-line:max-line-length
    return this.httpClient
      .patch<IResponse<any>>(url, body, this.options);
  }

}
