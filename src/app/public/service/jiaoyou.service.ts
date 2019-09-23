import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { jiaoyouApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class JiaoyouService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getFreeList(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${jiaoyouApiUrls.freeList}?pageSize=999`;
    url += data.startTime && data.startTime !== '' ? '&startTime=' + data.startTime : '';
    url += data.endTime && data.endTime !== '' ? '&endTime=' + data.endTime : '';
    url += data.appChannelId && data.appChannelId !== '' ? '&appChannelId=' + data.appChannelId : '';
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addFree(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${jiaoyouApiUrls.freeList}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .put<IResponse<any>>(url, data, this.options);
  }

  /** 修改单个 */
  modifyFree(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${jiaoyouApiUrls.freeList}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 删除单个 */
  deleteFree(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${jiaoyouApiUrls.freeList}/${data}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }


  /** 获取所有列表 */
  getPayList(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${jiaoyouApiUrls.payList}?pageSize=999`;
    url += data.skillName && data.skillName !== '' ? '&skillName=' + data.skillName : '';
    url += data.appChannelId && data.appChannelId !== '' ? '&appChannelId=' + data.appChannelId : '';
    url += data.startTime && data.startTime !== '' ? '&startTime=' + data.startTime : '';
    url += data.endTime && data.endTime !== '' ? '&endTime=' + data.endTime : '';
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addPay(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${jiaoyouApiUrls.payList}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .put<IResponse<any>>(url, data, this.options);
  }

  /** 修改单个 */
  modifyPay(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${jiaoyouApiUrls.payList}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 删除单个 */
  deletePay(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${jiaoyouApiUrls.payList}/${data}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader')}) };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }



  /** 获取所有列表 */
  getFreeChannelList(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${jiaoyouApiUrls.freeList}-available?channelType=${data}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取所有列表 */
  getPayChannelList(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${jiaoyouApiUrls.payList}/channel-pay`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取所有列表 */
  getSkillList(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${jiaoyouApiUrls.typeList}?pageSize=999`;
    url += data.skillTypeId && data.skillTypeId !== '' ? '&skillTypeId=' + data.skillTypeId : '';
    url += data.startTime && data.startTime !== '' ? '&startTime=' + data.startTime : '';
    url += data.endTime && data.endTime !== '' ? '&endTime=' + data.endTime : '';
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 新增 */
  addSkill(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${jiaoyouApiUrls.typeList}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .put<IResponse<any>>(url, data, this.options);
  }

}
