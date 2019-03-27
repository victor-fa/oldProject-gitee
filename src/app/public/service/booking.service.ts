import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { userApiUrls, bookingApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class BookingService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getBookingList(pageSize, flag, id, state?, orderType?, createTime?, orderId?): Observable<IResponse<any>> { // sortType?, sortKey?
    let url;
    if (flag === '') {
      url = `${this.commonService.baseUrl}${bookingApiUrls.orderList}`
          + this.getBookingListUrl(pageSize, state, orderType, createTime, orderId);
    } else if (flag === 'last') {
      url = `${this.commonService.baseUrl}${bookingApiUrls.orderList}`
          + this.getBookingListUrl(pageSize, state, orderType, createTime, orderId) + '&lastId=' + id;
    } else if (flag === 'first') {
      url = `${this.commonService.baseUrl}${bookingApiUrls.orderList}`
          + this.getBookingListUrl(pageSize, state, orderType, createTime, orderId) + '&preId=' + id;
    }
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  getBookingListUrl(pageSize, state, orderType, createTime, orderId): string {
    const url = '?pageSize=' + pageSize + (state ? '&state=' + state : '')
    + (orderType ? '&orderType=' + orderType : '')
    + (createTime ? '&createTime=' + createTime : '')
    + (orderId ? '&orderId=' + orderId : '');

    return url;
  }

  /** 获取订单详情 */
  getBookingDetail(orderType, orderId): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${bookingApiUrls.orderDetail}?orderType=${orderType}&orderId=${orderId}`;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 更新订单状态 */
  updateBookingInfo(updateType, orderId): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${bookingApiUrls.orderDetail}`;
    const body = `updateType=${updateType}&orderId=${orderId}`;
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

}
