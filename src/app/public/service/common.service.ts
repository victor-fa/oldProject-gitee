
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppServiceBase } from '../base/app-service.base';
import { IResponse } from '../model/response.model';

@Injectable({
  providedIn: 'root'  // 必须添加，放在根部分
})
/**
 * 公用的
 */
export class CommonService extends AppServiceBase {
  currentServer = 'http://account-center-test.chewrobot.com'; // 切换服务器地址为测试
  // currentServer = 'http://xiaowu.centaurstech.com'; // 切换服务器地址为正式

  baseUrl = this.currentServer + '/api/admin';  // chrome浏览器不安全下使用
  // baseUrl = 'http://192.168.1.250:4000/api/admin';  // nginx测试前端地址【局域网访问】
  // baseUrl = 'http://192.168.1.250:3000/api/admin';  // nginx正式前端地址【局域网访问】
  // baseUrl = 'http://192.168.4.100:5000/api/admin';  // nginx正式前端地址【博士研发部专用访问】
  // baseUrl = 'http://localhost:8086/api/admin';  // nginx测试前端地址
  // baseUrl = 'http://localhost:8088/api/admin';  // nginx正式前端地址
  dataCenterUrl = this.currentServer + ':46004/api';  // 数据中心【衡锐】
  taxiRouteUrl = this.currentServer + ':41005/api';  // 打车路径【宇辉】

  // logsRouteUrl = this.currentServer + ':6667/api/admin';  // 对话日志【衡锐】
  logsRouteUrl = this.currentServer + ':46008/api';  // 对话日志测试【衡锐】
  // logsRouteUrl = 'http://aliyun-sh1.chewrobot.com:46008/api';  // 对话日志正式【衡锐】
  // 因为数据中心区别ac，是另一个项目，没有SLL证书，所以数据中心在正式环境下，只能访问http而不能跟其他接口一致采用https

  list: string[] = [];
  isLeftNavClose = false;
  isCollapsed = false;
  nav = [ { active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false }, { active: false } ]; // 大菜单的下标状态
  fullMenuResource = localStorage.getItem('FullMenuResource') !== '' ? JSON.parse(localStorage.getItem('FullMenuResource')) : '';
  fullChildrenResource = localStorage.getItem('FullChildrenResource') !== '' ? JSON.parse(localStorage.getItem('FullChildrenResource')) : '';
  config = { toolbar: [ ['bold', 'italic', 'underline', 'strike'], ['blockquote', 'code-block'], [{ 'header': 1 }, { 'header': 2 }], [{ 'list': 'ordered'}, { 'list': 'bullet' }], [{ 'script': 'sub'}, { 'script': 'super' }], [{ 'indent': '-1'}, { 'indent': '+1' }], [{ 'direction': 'rtl' }], [{ 'size': ['0.26rem', '0.31rem', '0.37rem', '0.41rem', '0.47rem', '0.52rem'] }], [{ 'header': [1, 2, 3, 4, 5, 6, false] }], [{ 'color': [] }, { 'background': [] }], [{ 'font': [] }], [{ 'align': [] }], ['clean'], ['link', 'video'] ]};
  dateSearch = { 'Today': [new Date(), new Date()], 'This Month': [new Date(), new Date()] };

  constructor(
    private _router: Router,
    private httpClient: HttpClient,
    private injector: Injector,
  ) {
    super(injector);
  }

  append(str: any) { this.list.push(str); }

  menuNativeToFalse(): void {
    this.nav.forEach(item => { item.active = false; });
  }

  // 获取指定时间的日期 格式：yyyyMMdd
  getDay(day): string {
    const today = new Date();
    const targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    today.setTime(targetday_milliseconds); // 注意，这行是关键代码
    const tYear = today.getFullYear();
    let tMonth = today.getMonth().toString();
    let tDate = today.getDate().toString();
    tMonth = this.doHandleMonth(parseInt(tMonth) + 1);
    tDate = this.doHandleMonth(tDate);
    return tYear + '' + tMonth + '' + tDate;
  }

  // 获取指定时间的日期 格式：yyyy-MM-dd
  getDayWithAcross(day): string {
    const today = new Date();
    const targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    today.setTime(targetday_milliseconds); // 注意，这行是关键代码
    const tYear = today.getFullYear();
    let tMonth = today.getMonth().toString();
    let tDate = today.getDate().toString();
    tMonth = this.doHandleMonth(parseInt(tMonth) + 1);
    tDate = this.doHandleMonth(tDate);
    return tYear + '-' + tMonth + '-' + tDate;
  }

  doHandleMonth(month): string {
    let m = month;
    if (month.toString().length === 1) {
      m = '0' + month;
    }
    return m;
  }

  /** 记录-管理员操作日志记录接口 */
  updateOperationlog(data): Observable<IResponse<any>> {
    const url = `${this.baseUrl}/audit?op_category=${data.op_category}&op_page=${data.op_page}&op_name=${data.op_name}`;
    this.setOption = { headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') }) };
    return this.httpClient
      .post<IResponse<any>>(url, this.options);
  }

  // 判断二级是否有权限
  haveMenuPermission(flag, data) {
    let result = false;
    this.fullChildrenResource.forEach(item => {
      if (item === data) { result = true; }
    });
    return result;
  }

  // 删除null以及''的对象
  deleteEmptyProperty(object) {
    for (const i in object) {
      const value = object[i];
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          if (value.length == 0) {
            delete object[i];
            continue;
          }
        }
        this.deleteEmptyProperty(value);
        if (this.isEmpty(value)) {
          delete object[i];
        }
      } else {
        if (value === '' || value === null || value === undefined) {
          delete object[i];
        } else {
        }
      }
    }
    return object;
  }

  // 判断json对象的值是否为空
  isEmpty(object) {
    for (const name in object) { return false; }
    return true;
  }
}
