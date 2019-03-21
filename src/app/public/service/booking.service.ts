import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { userApiUrls, bookingApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';
import { CookiesService } from './cookies.service';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class BookingService extends AppServiceBase {
  // token = this._cookiesService.getToken();
  token = localStorage.getItem('token');
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private _cookiesService: CookiesService,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有订单列表 */
  getBookingList(pageSize, flag, id, state?, orderType?, createTime?, orderId?): Observable<IResponse<any>> { // sortType?, sortKey?
    let url;
    this.setOption = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.token })
    };
    if (flag === '') {
      url = `${this.commonService.baseUrl}/admin${bookingApiUrls.orderList}`
          + this.getBookingListUrl(pageSize, state, orderType, createTime, orderId);
    } else if (flag === 'last') {
      url = `${this.commonService.baseUrl}/admin${bookingApiUrls.orderList}`
          + this.getBookingListUrl(pageSize, state, orderType, createTime, orderId) + '&lastId=' + id;
    } else if (flag === 'first') {
      url = `${this.commonService.baseUrl}/admin${bookingApiUrls.orderList}`
          + this.getBookingListUrl(pageSize, state, orderType, createTime, orderId) + '&preId=' + id;
    }
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  getBookingListUrl(pageSize, state, orderType, createTime, orderId): string {
    this.setOption = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.token })
    };
    const url = '?pageSize=' + pageSize + (state ? '&state=' + state : '')
    + (orderType ? '&orderType=' + orderType : '')
    + (createTime ? '&createTime=' + createTime : '')
    + (orderId ? '&orderId=' + orderId : '');

    return url;
  }

  /** 获取订单详情 */
  getBookingDetail(orderType, orderId): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}/admin${bookingApiUrls.orderDetail}?orderType=${orderType}&orderId=${orderId}`;
    this.setOption = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.token })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 更新订单状态 */
  updateBookingInfo(updateType, orderId): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}/admin${bookingApiUrls.orderDetail}`;
    this.setOption = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.token })
    };
    const body = `updateType=${updateType}&orderId=${orderId}`;
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

}
