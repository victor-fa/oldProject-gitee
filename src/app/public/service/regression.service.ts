import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';

@Injectable({
  providedIn: 'root'
})

export class RegressionService extends AppServiceBase {
  constructor(
    private httpClient: HttpClient,
    private injector: Injector,
  ) {
    super(injector);
  }

  /** 获取所有列表 */
  getInformaList(data): Observable<any> {
    const url = `http://192.168.1.5:8000/auto/getTestCases?user_id=${data.user_id}`;
    return this.httpClient
      .get<any>(url, this.options);
  }

  /** 删除单个内容 */
  deleteInforma(data): Observable<any> {
    const url = `http://192.168.1.5:8000/auto/delTestCase?case_id=${data.id}`;
    return this.httpClient
      .get<any>(url, this.options);
  }



  /** 获取所有列表 */
  getCreTemplateList(data): Observable<any> {
    const url = `http://192.168.1.5:8000/auto/getTestTasks?user_id=${data.user_id}`;
    return this.httpClient
      .get<any>(url, this.options);
  }

  /** 删除单个内容 */
  deleteCreTemplate(data): Observable<any> {
    const url = `http://192.168.1.5:8000/auto/delTestTask?task_id=${data.id}`;
    return this.httpClient
      .get<any>(url, this.options);
  }



  /** 获取所有列表 */
  getCreTaskList(data): Observable<any> {
    const url = `http://192.168.1.5:8000/auto/getTestTasks?user_id=${data.user_id}`;
    return this.httpClient
      .get<any>(url, this.options);
  }

  /** 删除单个内容 */
  deleteCreTask(data): Observable<any> {
    const url = `http://192.168.1.5:8000/auto/delTestTask?task_id=${data.id}`;
    return this.httpClient
      .get<any>(url, this.options);
  }



  /** 获取所有列表 */
  getTemplateList(data): Observable<any> {
    const url = `http://192.168.1.5:8000/auto/getTestTemps?user_id=${data.user_id}`;
    return this.httpClient
      .get<any>(url, this.options);
  }

  /** 删除单个内容 */
  deleteTemplate(data): Observable<any> {
    const url = `http://192.168.1.5:8000/auto/delTestTemp?temp_id=${data.id}`;
    return this.httpClient
      .get<any>(url, this.options);
  }



  /** 获取所有列表 */
  getTestSubtasks(data): Observable<any> {
    const url = `http://192.168.1.5:8000/auto/getTestSubtasks?task_id=${data.task_id}`;
    return this.httpClient
      .get<any>(url, this.options);
  }

  /** 删除单个内容 */
  delTestSubtask(data): Observable<any> {
    const url = `http://192.168.1.5:8000/auto/delTestSubtask?stask_id=${data.id}`;
    return this.httpClient
      .get<any>(url, this.options);
  }
}
