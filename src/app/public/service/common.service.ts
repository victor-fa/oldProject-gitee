
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
  baseUrl = 'http://account-center-test.chewrobot.com/api/admin';  // chrome浏览器不安全下使用 测试环境
  // baseUrl = 'https://xiaowu.centaurstech.com/api/admin';  // chrome浏览器不安全下使用 正式环境
  // baseUrl = 'http://192.168.1.250:4000/api/admin';  // nginx测试前端地址【局域网访问】
  // baseUrl = 'http://192.168.1.250:3000/api/admin';  // nginx正式前端地址【局域网访问】
  // baseUrl = 'http://192.168.4.100:5000/api/admin';  // nginx正式前端地址【博士研发部专用访问】
  // baseUrl = 'http://localhost:8086/api/admin';  // nginx测试前端地址
  // baseUrl = 'http://localhost:8088/api/admin';  // nginx正式前端地址
  dataCenterUrl = 'http://account-center-test.chewrobot.com:46004/api';  // 数据中心测试【衡锐】
  // dataCenterUrl = 'http://xiaowu.centaurstech.com:46004/api';  // 数据中心正式【衡锐】
  // 因为数据中心区别ac，是另一个项目，没有SLL证书，所以数据中心在正式环境下，只能访问http而不能跟其他接口一致采用https
  taxiRouteUrl = 'http://account-center-test.chewrobot.com:41005/api';  // 打车路径测试【宇辉】
  // taxiRouteUrl = 'http://xiaowu.centaurstech.com:41005/api';  // 打车路径正式【宇辉】

  list: string[] = [];
  isLeftNavClose = false;
  isCollapsed = false;
  nav = [    // 大菜单的下标状态
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: false }
  ];
  fullMenuResource = localStorage.getItem('FullMenuResource') !== '' ? JSON.parse(localStorage.getItem('FullMenuResource')) : '';
  // tslint:disable-next-line:max-line-length
  fullChildrenResource = localStorage.getItem('FullChildrenResource') !== '' ? JSON.parse(localStorage.getItem('FullChildrenResource')) : '';

  constructor(
    private _router: Router,
    private httpClient: HttpClient,
    private injector: Injector,
  ) {
    super(injector);
  }

  append(str: any) {
    this.list.push(str);
  }

  menuNativeToFalse(): void {
    this.nav.forEach(item => {
      item.active = false;
    });
  }

  // 获取指定时间的日期 格式：yyyyMMdd
  getDay(day): string {
    const today = new Date();
    const targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    today.setTime(targetday_milliseconds); // 注意，这行是关键代码
    const tYear = today.getFullYear();
    let tMonth = today.getMonth().toString();
    let tDate = today.getDate().toString();
    // tslint:disable-next-line:radix
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
    // tslint:disable-next-line:radix
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
    this.setOption = {
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader') })
    };
    return this.httpClient
      .post<IResponse<any>>(url, this.options);
  }

  // 判断二级是否有权限
  haveMenuPermission(flag, data) {
    let result = false;
    this.fullChildrenResource.forEach(item => {
      if (item === data) {
        result = true;
      }
    });
    return result;
  }

}
