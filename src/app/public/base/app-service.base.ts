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

  protected baseUrl = 'http://account-center-test.chewrobot.com/api/admin';
  protected contentUrl = 'http://account-center-test.chewrobot.com/api';
  protected dataCenterUrl = 'http://xiaowu.centaurstech.com:46004/api/v2/counts';
  protected options = {
    headers: new HttpHeaders({
      'Accept': '*/*',
      'Content-Type': 'application/json',
    })
  };

  protected fullUrl(url: string): string {
    return this.baseUrl + url;
  }

  protected fullContentUrl(url: string): string {
    return this.contentUrl + url;
  }

  protected fullDataCenterUrl(url: string): string {
    return this.dataCenterUrl + url;
  }

  protected json2stringfy(obj: {}): string {
    return JSON.stringify(obj);
  }

  protected set setOption(option: {}) {
    if (typeof option !== 'object') {
      throw new Error('不是有效的参数');
    }
    this.options = Object.assign(this.options, option);
  }

}
