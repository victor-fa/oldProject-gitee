import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { newsApiUrls } from '../enum/api.enum';
import { IResponse } from '../model/response.model';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class NewsService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
    private commonService: CommonService,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getTaggingNewsList(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${newsApiUrls.newsList}?size=99999`;
    url += data.status && data.status !== null ? '&status=' + data.status : '&status=NEW,MARKED';
    url += data.uploadTimeCeil && data.uploadTimeCeil !== '' ? '&uploadTimeCeil=' + data.uploadTimeCeil : '';
    url += data.uploadTimeFloor && data.uploadTimeFloor !== '' ? '&uploadTimeFloor=' + data.uploadTimeFloor : '';
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': this.commonService.currentChanelId }), };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取所有列表 */
  getTaggingNewsById(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${newsApiUrls.newsList}/${data.id}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': this.commonService.currentChanelId }), };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 提交词集 */
  submitSpeech(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${newsApiUrls.newsList}/${data.id}/submit`;
    const body = `id=${data.id}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': this.commonService.currentChanelId}) };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 提交词集 */
  submitWords(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${newsApiUrls.newsList}/${data.id}/words`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': this.commonService.currentChanelId}) };
    return this.httpClient
      .put<IResponse<any>>(url, data.words, this.options);
  }

  /** 获取所有列表 */
  getManualAuditList(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${newsApiUrls.newsList}?size=99999`;
    url += data.submitter && data.submitter !== null ? '&submitter=' + data.submitter : '';
    url += data.status && data.status !== null ? '&status=' + data.status : '&status=SUBMITTED,CONFIRMED';
    url += data.submitTimeCeil && data.submitTimeCeil !== '' ? '&submitTimeCeil=' + data.submitTimeCeil : '';
    url += data.submitTimeFloor && data.submitTimeFloor !== '' ? '&submitTimeFloor=' + data.submitTimeFloor : '';
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': this.commonService.currentChanelId }), };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 提交词集 */
  updateLoading(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${newsApiUrls.newsList}/${data.id}/merge`;
    const body = `id=${data.id}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': this.commonService.currentChanelId}) };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 审核通过 */
  confirmSpeech(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${newsApiUrls.newsList}/${data.id}/confirm`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': this.commonService.currentChanelId}) };
    return this.httpClient
      .post<IResponse<any>>(url, data.words, this.options);
  }

  /** 获取所有列表 */
  getNewsThesaurusList(data): Observable<IResponse<any>> {
    let url = `${this.commonService.baseUrl}${newsApiUrls.newsWordList}?size=2000&page=${data.number}`;
    url += data.type && data.type !== '' ? '&type=' + data.type : '';
    url += data.name && data.name !== null ? '&name=' + data.name : '';
    url += data.fullMatch && data.fullMatch === true ? '&fullMatch=true' : '';
    // url += data.submitTimeCeil && data.submitTimeCeil !== '' ? '&submitTimeCeil=' + data.submitTimeCeil : '';
    // url += data.submitTimeFloor && data.submitTimeFloor !== '' ? '&submitTimeFloor=' + data.submitTimeFloor : '';
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': this.commonService.currentChanelId }), };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 获取所有列表 */
  updateNewWords(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${newsApiUrls.newsWordList}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': this.commonService.currentChanelId }), };
    return this.httpClient
      .put<IResponse<any>>(url, data.newsWord, this.options);
  }

  /** 获取所有列表 */
  getNerList(data): Observable<IResponse<any>> {
    let url = `${this.commonService.nerRouteUrl}${newsApiUrls.nerList}?pageSize=999`;
    url += data.name && data.name !== null ? '&name=' + data.name : '';
    url += data.startDate && data.startDate !== '' ? '&startDate=' + data.startDate : '';
    url += data.endDate && data.endDate !== '' ? '&endDate=' + data.endDate : '';
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': this.commonService.currentChanelId }), };
    return this.httpClient
      .get<IResponse<any>>(url, this.options);
  }

  /** 测试NER */
  testNewsNER(data): Observable<IResponse<any>> {
    const url = `${this.commonService.nerRouteUrl}${newsApiUrls.nerTest}`;
    let body = `id=${data.id}&nerUrl=${data.nerUrl}`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'App-Channel-Id': this.commonService.currentChanelId }), };
    return this.httpClient
      .post<IResponse<any>>(url, body, this.options);
  }

  /** 新增词条 */
  addWord(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}${newsApiUrls.newsWordList}/batch`;
    this.setOption = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'App-Channel-Id': this.commonService.currentChanelId}) };
    return this.httpClient
      .post<IResponse<any>>(url, data, this.options);
  }

  /** 删除词集 */
  deleteManualAudit(data): Observable<IResponse<any>> {
    const url = `${this.commonService.baseUrl}/news/word-sets/${data.id}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': this.commonService.currentChanelId}) };
    return this.httpClient
      .delete<IResponse<any>>(url, this.options);
  }

}
