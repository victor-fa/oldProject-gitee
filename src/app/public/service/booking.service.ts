import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { userApiUrls, bookingApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';

@Injectable({
  providedIn: 'root'
})

export class BookingService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
  ) {
    super(injector);
  }

  /** 获取所有订单列表 */
  getBookingList(flag, id, sortType?, sortKey?): Observable<IResponse<any>> {
    let url;
    if (flag === '') {
      url = this.fullUrl(bookingApiUrls.orderList) + this.getBiikingListUrl(sortType, sortKey);
    } else if (flag === 'last') {
      url = this.fullUrl(bookingApiUrls.orderList) + this.getBiikingListUrl(sortType, sortKey) + '&lastId=' + id;
    } else if (flag === 'first') {
      url = this.fullUrl(bookingApiUrls.orderList) + this.getBiikingListUrl(sortType, sortKey) + '&firstId=' + id;
    }
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  getBiikingListUrl(sortType, sortKey): string {
    let url = '';
    if (!sortType) {
      url = '?pageSize=10';
    } else {
      url = '?pageSize=10' + '&sortType=' + sortType + '&sortKey=' + sortKey;
    }
    return url;
  }

  /** 获取订单详情 */
  getBookingDetail(orderType, orderId): Observable<IResponse<any>> {
    const url = this.fullUrl(bookingApiUrls.orderDetail) + '?orderType=' + orderType + '&orderId=' + orderId;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 更新订单状态 */
  updateBookingInfo(updateType, orderId): Observable<IResponse<any>> {
    const url = this.fullUrl(bookingApiUrls.orderDetail);
    const body = `updateType=${updateType}&orderId=${orderId}`;
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

}
