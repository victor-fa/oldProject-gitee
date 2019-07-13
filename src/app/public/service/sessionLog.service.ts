import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { IResponse } from '../model/response.model';
import { cmsApiUrls } from '../enum/api.enum';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class SessionLogService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getSessionLogList(data): Observable<IResponse<any>> {
    let url = `${this.commonService.logsRouteUrl}${cmsApiUrls.sessionLogList}?pageSize=${data.pageSize}`;
    url += data.start && data.start !== null ? '&start=' + data.start : '';
    url += data.end && data.start !== null ? '&end=' + data.end : '';
    url += data.bots && data.bots.length > 0 ? '&bots=' + data.bots : [];
    url += data.uid && data.uid !== '' ? '&uid=' + data.uid : '';
    url += data.ask && data.ask !== '' ? '&ask=' + data.ask : '';
    url += data.answer && data.answer !== '' ? '&answer=' + data.answer : '';
    url += data.flag !== '' ? '&flag=' + data.flag : '';
    url += data.abnormalType && data.abnormalType !== 'all' ? '&abnormalType=' + data.abnormalType : '';
    url += data.intentionNum && data.intentionNum !== '' ? '&intentionNum=' + data.conpareFirst + data.intentionNum : '';
    url += data.repetitionNum && data.repetitionNum !== '' ? '&repetitionNum=' + data.conpareSecond + data.repetitionNum : '';
    url += data.cost && data.cost !== '' ? '&cost=' + data.conpareThird + data.cost : '';
    url += data.level && data.level !== 'all' ? '&level=' + data.level : '';
    url += data.lastId && data.lastId !== '' && data.pageFlag === 'last' ? '&lastId=' + data.lastId : '';
    url += data.firstId && data.firstId !== '' && data.firstId !== 0 && data.pageFlag === 'first' ? '&firstId=' + data.firstId : '';
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 修改单个 */
  updateSessionLog(data): Observable<IResponse<any>> {
    const url = `${this.commonService.logsRouteUrl}${cmsApiUrls.sessionLogList}/${data.id}/flag`;
    const body = `flag=${data.flag}`;
    this.setOption = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': localStorage.getItem('currentAppHeader')})
    };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 导出Excel */
  getExcel(data) {
    let url = `${this.commonService.logsRouteUrl}${cmsApiUrls.sessionLogList}/file?pageSize=${data.pageSize}`;
    url += data.start && data.start !== null ? '&start=' + data.start : '';
    url += data.end && data.start !== null ? '&end=' + data.end : '';
    url += data.bots && data.bots.length > 0 ? '&bots=' + data.bots : [];
    url += data.uid && data.uid !== '' ? '&uid=' + data.uid : '';
    url += data.ask && data.ask !== '' ? '&ask=' + data.ask : '';
    url += data.answer && data.answer !== '' ? '&answer=' + data.answer : '';
    url += data.flag !== '' ? '&flag=' + data.flag : '';
    url += data.abnormalType && data.abnormalType !== 'all' ? '&abnormalType=' + data.abnormalType : '';
    url += data.intentionNum && data.intentionNum !== '' ? '&intentionNum=' + data.conpareFirst + data.intentionNum : '';
    url += data.repetitionNum && data.repetitionNum !== '' ? '&repetitionNum=' + data.conpareSecond + data.repetitionNum : '';
    url += data.cost && data.cost !== '' ? '&cost=' + data.conpareThird + data.cost : '';
    url += data.level && data.level !== 'all' ? '&level=' + data.level : '';
    url += data.lastId && data.lastId !== '' ? '&lastId=' + data.lastId : '';
    url += data.firstId && data.firstId !== '' ? '&firstId=' + data.firstId : '';
    const head = new Headers({
      'Content-Type': 'application/vnd.ms-excel;charset=UTF-8;',
      'App-Channel-Id': localStorage.getItem('currentAppHeader')
    });
    this.setOption = { headers: head, responseType: 'blob' };
    return this.httpClient
      .get<Blob>(url, this.options);
  }

}
