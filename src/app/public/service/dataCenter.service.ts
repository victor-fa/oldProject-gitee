import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { dataCenterApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';
import { CookiesService } from './cookies.service';

@Injectable({
  providedIn: 'root'
})

export class DataCenterService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private _cookiesService: CookiesService,
  ) {
    super(injector);
  }

  /** 获取所有订单列表 */
  getDataCenterList(begin, end): Observable<IResponse<any>> {
    const url = this.fullDataCenterUrl('')
        + '?begin=' + begin + '&end=' + end;
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }
}
