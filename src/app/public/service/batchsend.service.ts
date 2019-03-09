import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { IResponse } from '../model/response.model';
import { activityApiUrls } from '../enum/api.enum';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class BatchsendService extends AppServiceBase {
  // const token = this._cookiesService.getToken();
  token = localStorage.getItem('token');
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有内容列表 */
  getBatchsendList(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${activityApiUrls.batchsendList}/list?page=0&pageSize=100`
      + (data.sendStartTime ? ('&sendStartTime=' + data.sendStartTime) : '')
      + (data.sendEndTime ? ('&sendEndTime=' + data.sendEndTime) : '');
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取单个 */
  getBatchsend(id): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${activityApiUrls.batchsendList}/${id}`;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addBatchsend(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${activityApiUrls.batchsendList}`;
    // tslint:disable-next-line:max-line-length
    const body = `title=${data.title}&site=${data.site}&enabled=${data.enabled}&jump=${data.jump}&image=${data.image}&order=${data.order}&url=${data.url}`;
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

}
