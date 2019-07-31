import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { IResponse } from '../model/response.model';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class DataCenterService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取单元 正式 */
  getUnitList(data): Observable<IResponse<any>> {
    const url = `${this.commonService.dataCenterUrl}/v2/counts/` + data.flag
        + ('?begin=' + data.begin + '&end=' + data.end)
        + (data.platform !== '' ? '&platform=' + data.platform : '')
        + (data.checkAllChannel === true ? '' : (data.origin !== '' ? '&origin=' + data.origin : '&origin=' + localStorage.getItem('currentAppHeader')));
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

}
