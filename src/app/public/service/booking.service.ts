import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { userApiUrls, bookingApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';
import { CookiesService } from './cookies.service';

@Injectable({
  providedIn: 'root'
})

export class BookingService extends AppServiceBase {
  token = this._cookiesService.getToken();
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private _cookiesService: CookiesService,
  ) {
    super(injector);
  }

  /** 获取所有订单列表 */
  getBookingList(pageSize, flag, id, sortType?, sortKey?): Observable<IResponse<any>> {
    let url;
    this.setOption = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.token })
    };
    if (flag === '') {
      url = this.fullUrl(bookingApiUrls.orderList) + this.getBookingListUrl(pageSize, sortType, sortKey);
    } else if (flag === 'last') {
      url = this.fullUrl(bookingApiUrls.orderList) + this.getBookingListUrl(pageSize, sortType, sortKey) + '&lastId=' + id;
    } else if (flag === 'first') {
      url = this.fullUrl(bookingApiUrls.orderList) + this.getBookingListUrl(pageSize, sortType, sortKey) + '&firstId=' + id;
    }
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  getBookingListUrl(pageSize, sortType, sortKey): string {
    let url = '';
    this.setOption = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.token })
    };
    if (!sortType) {
      url = '?pageSize=' + pageSize;
    } else {
      url = '?pageSize=' + pageSize + '&sortType=' + sortType + '&sortKey=' + sortKey;
    }
    return url;
  }

  /** 获取订单详情 */
  getBookingDetail(orderType, orderId): Observable<IResponse<any>> {
    const url = this.fullUrl(bookingApiUrls.orderDetail) + '?orderType=' + orderType + '&orderId=' + orderId;
    this.setOption = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.token })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 更新订单状态 */
  updateBookingInfo(updateType, orderId): Observable<IResponse<any>> {
    const url = this.fullUrl(bookingApiUrls.orderDetail);
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
