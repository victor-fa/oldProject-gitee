import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { dataCenterApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';

@Injectable({
  providedIn: 'root'
})

export class DataCenterService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
  ) {
    super(injector);
  }

  /** 获取单元 正式 */
  getUnitList(begin, end, platform, origin, flag): Observable<IResponse<any>> {
    const url = this.fullDataCenterUrl('') + '/v2/counts/' + flag
        + '?begin=' + begin + '&end=' + end
        + (platform !== '' ? '&platform=' + platform : '')
        + (origin !== '' ? '&origin=' + origin : '');
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

}
