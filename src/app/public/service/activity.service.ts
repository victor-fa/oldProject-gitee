import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { IResponse } from '../model/response.model';
import { activityApiUrls } from '../enum/api.enum';

@Injectable({
  providedIn: 'root'
})

export class ActivityService extends AppServiceBase {
  token = localStorage.getItem('token');
  activityUrl = 'http://account-center-test.chewrobot.com/api';
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
  ) {
    super(injector);
  }

  /** 获取APP版本 */
  getActivityList(searchItem): Observable<IResponse<any>> {
    const url = this.fullContentUrl(activityApiUrls.activityList)
    + '?app-channel-id=' + searchItem;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取单个 */
  getActivity(id): Observable<IResponse<any>> {
    const url = this.activityUrl + activityApiUrls.activityList + '/info?activityId=' + id;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 添加单个 */
  addActivity(data): Observable<IResponse<any>> {
    const url = 'http://account-center-test.chewrobot.com/api/admin' + activityApiUrls.activityList;
    this.setOption = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

}
