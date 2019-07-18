import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { userApiUrls } from '../enum/api.enum';
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
  // tslint:disable-next-line:max-line-length
  getBookingList(pageSize, flag, id, queryType, state?, orderType?, createTimeBegin?, createTimeEnd?, orderId?, phone?): Observable<IResponse<any>> {
    let url;
    if (flag === '') {
      url = `${this.commonService.baseUrl}${userApiUrls.orderList}`
          + this.getBookingListUrl(queryType, pageSize, state, orderType, createTimeBegin, createTimeEnd, orderId, phone);
    } else if (flag === 'last') {
      url = `${this.commonService.baseUrl}${userApiUrls.orderList}`
          + this.getBookingListUrl(queryType, pageSize, state, orderType, createTimeBegin, createTimeEnd, orderId, phone) + '&lastId=' + id;
    } else if (flag === 'first') {
      url = `${this.commonService.baseUrl}${userApiUrls.orderList}`
          + this.getBookingListUrl(queryType, pageSize, state, orderType, createTimeBegin, createTimeEnd, orderId, phone) + '&preId=' + id;
    }
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  getBookingListUrl(queryType, pageSize, state, orderType, createTimeBegin, createTimeEnd, orderId, phone): string {
    const url = '?pageSize=' + pageSize
      + (state ? '&state=' + state : '')
      // tslint:disable-next-line:max-line-length
      + (orderType ? (orderType.length > 3 ? '&subType=' + orderType : '&orderType=' + orderType) : (queryType && queryType !== '' ? '&queryType=' + queryType : ''))
      + (createTimeBegin ? '&createTimeBegin=' + createTimeBegin : '')
      + (createTimeEnd ? '&createTimeEnd=' + createTimeEnd : '')
      + (orderId ? '&orderId=' + orderId : '')
      + (phone ? '&phone=' + phone : '');
    return url;
  }

  /** 获取订单详情 */
  getBookingDetail(orderType, orderId): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${userApiUrls.orderDetail}?orderType=${orderType}&orderId=${orderId}`;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取退票详情 */
  getRefundDetail(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}/order/flight/refund?orderId=${data.orderId}`;
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 退票 */
  deleteRefundDetail(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}/order/flight/refund`;
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient.post<IResponse<any>>(url, data, this.options);
  }

  /** 更新订单状态 */
  updateBookingInfo(updateType, orderId): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${userApiUrls.orderDetail}`;
    const body = `updateType=${updateType}&orderId=${orderId}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

}
