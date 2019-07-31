import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { IResponse } from '../model/response.model';
import { appVersionApiUrls } from '../enum/api.enum';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class TaskService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    public commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getTaskCenterList(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${appVersionApiUrls.taskList}?size=9999`;
    url += data.name && data.name !== '' ? '&name=' + data.name : '';
    url += data.type && data.type !== '' ? '&type=' + data.type : '';
    url += data.createTimeCeil && data.createTimeCeil !== '' ? '&createTimeCeil=' + data.createTimeCeil : '';
    url += data.createTimeFloor && data.createTimeFloor !== '' ? '&createTimeFloor=' + data.createTimeFloor : '';
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取所有列表 */
  getTaskCenterLog(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.taskList}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取单个 */
  getTaskCenter(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.taskList}/${id}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 删除单个 */
  deleteTaskCenter(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.taskList}/${id}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addTaskCenter(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.taskList}`;
    const body = `type=${data.type}&action=${data.action}&totalTimes=${data.totalTimes}&name=${data.name}&description=${data.description}`
      + `&group=${data.group}&sequence=${data.sequence}&pic=${data.pic}&jump=${JSON.stringify(data.jump)}`
      + `&taskAward=${JSON.stringify(data.taskAward)}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 修改单个 */
  updateTaskCenter(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.taskList}/${data.id}`;
    const body = `title=${data.title}&jump=${data.jump}&site=${data.site}&duration=${data.duration}&url=${data.url}`
      + `&skip=${data.skip}&image=${data.image}&expireTime=${data.expireTime}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .put<IResponse<any>>(url, body, this.options);
  }

  /** 修改启用状态 */
  updateSwitch(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${appVersionApiUrls.taskList}/${data.id}/enabled`;
    const body = `enabled=${data.enabled}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .put<IResponse<any>>(url, body, this.options);
  }

}
