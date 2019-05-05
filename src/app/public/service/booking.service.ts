import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { bookingApiUrls } from '../enum/api.enum';
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
  getBookingList(pageSize, flag, id, queryType, state?, orderType?, createTime?, orderId?, phone?): Observable<IResponse<any>> {
    let url;
    if (flag === '') {
      url = `${this.commonService.baseUrl}${bookingApiUrls.orderList}`
          + this.getBookingListUrl(queryType, pageSize, state, orderType, createTime, orderId, phone);
    } else if (flag === 'last') {
      url = `${this.commonService.baseUrl}${bookingApiUrls.orderList}`
          + this.getBookingListUrl(queryType, pageSize, state, orderType, createTime, orderId, phone) + '&lastId=' + id;
    } else if (flag === 'first') {
      url = `${this.commonService.baseUrl}${bookingApiUrls.orderList}`
          + this.getBookingListUrl(queryType, pageSize, state, orderType, createTime, orderId, phone) + '&preId=' + id;
    }
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  getBookingListUrl(queryType, pageSize, state, orderType, createTime, orderId, phone): string {
    const url = '?pageSize=' + pageSize
      + (state ? '&state=' + state : '')
      + (orderType ? '&orderType=' + orderType : (queryType && queryType !== '' ? '&queryType=' + queryType : ''))
      + (createTime ? '&createTime=' + createTime : '')
      + (orderId ? '&orderId=' + orderId : '')
      + (phone ? '&phone=' + phone : '');
    return url;
  }

  /** 获取订单详情 */
  getBookingDetail(orderType, orderId): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${bookingApiUrls.orderDetail}?orderType=${orderType}&orderId=${orderId}`;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取退票详情 */
  getRefundDetail(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}/order/flight/refund?orderId=${data.orderId}`;
    // const url = `${this.commonService.baseUrl}/order/flight/refund?orderId=f20190329185732052790102`;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 退票 */
  deleteRefundDetail(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}/order/flight/refund`;
    // tslint:disable-next-line:max-line-length
    // const body = `userId=${data.userId}&orderId=${data.orderId}&passengerId=${data.passengerId}&refundCauseId=${data.refundCauseId}&refundCause=${data.refundCause}&ticketPrice=${data.ticketPrice}&preRefundFee=${data.preRefundFee}&preRefundPrice=${data.preRefundPrice}`;
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<IResponse<any>>(url, data, this.options);
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
