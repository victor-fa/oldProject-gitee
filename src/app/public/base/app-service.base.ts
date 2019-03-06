import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injector } from '@angular/core';

/**
 * 基础服务构造类，为所有API提供服务，注入新功能
 */
export abstract class AppServiceBase {

  constructor(
    injector: Injector
  ) {
  }

  protected baseUrl = 'http://account-center-test.chewrobot.com/api';  // 订票 用户测试 内容测试
  // protected baseUrl = 'https://xiaowu.centaurstech.com/api';  // 订票 用户测试 内容测试
  protected dataCenterUrl = 'http://account-center-test.chewrobot.com:46004/api';  // 数据中心测试【衡锐】
  // protected dataCenterUrl = 'http://xiaowu.centaurstech.com:46004/api';  // 数据中心正式【衡锐】
  // 因为数据中心区别ac，是另一个项目，没有SLL证书，所以数据中心在正式环境下，只能访问http而不能跟其他接口一致采用https
  protected taxiRouteUrl = 'http://account-center-test.chewrobot.com:41005/api';  // 打车路径测试【宇辉】
  // protected taxiRouteUrl = 'https://xiaowu.centaurstech.com:41005/api';  // 打车路径正式【宇辉】

  protected options = {
    headers: new HttpHeaders({
      'Accept': '*/*',
      'Content-Type': 'application/json',
    })
  };
  // 常用地址
  protected fullUrl(url: string): string {
    return this.baseUrl + url;
  }
  // 正式的数据中心
  protected fullDataCenterUrl(url: string): string {
    return this.dataCenterUrl + url;
  }
  protected fullTaxiRouteUrl(url: string): string {
    return this.taxiRouteUrl + url;
  }

  protected set setOption(option: {}) {
    if (typeof option !== 'object') {
      throw new Error('不是有效的参数');
    }
    this.options = Object.assign(this.options, option);
  }

}
