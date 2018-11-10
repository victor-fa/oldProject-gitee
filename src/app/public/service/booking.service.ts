import { HttpClient } from '@angular/common/http';
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
  getBookingList(sortType?, sortKey?): Observable<IResponse<any>> {
    let url;
    if (!sortType) {
      url = this.fullUrl(bookingApiUrls.orderList) + '?pageSize=10';
    } else {
      url = this.fullUrl(bookingApiUrls.orderList) + '?pageSize=10' + '&sortType=' + sortType + '&sortKey=' + sortKey;
    }
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
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
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

}
