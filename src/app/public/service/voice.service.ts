import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { operatenApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class VoiceService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getVoiceList(): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${operatenApiUrls.voiceList}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': this.commonService.currentChanelId }) };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 修改单个 */
  updateVoice(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${operatenApiUrls.voiceList}/${data.id}`;
    const body = `supplier=${data.supplier}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': this.commonService.currentChanelId}) };
    return this.httpClient
      .patch<IResponse<any>>(url, body, this.options);
  }

}
