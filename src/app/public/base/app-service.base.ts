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

  // protected baseUrl = 'http://lxwork.vipgz1.idcfengye.com/api/admin'; // 刘兴
  protected baseUrl = 'http://account-center-test.chewrobot.com/api/admin';  // 订票 用户正式
  protected contentUrl = 'http://account-center-test.chewrobot.com/api';  // 内容正式
  protected dataCenterUrl = 'http://xiaowu.centaurstech.com:46004/api/v2/counts';  // 数据中心正式
  // protected dataCenterUrl = 'http://aliyun-sz2.chewrobot.com:46004/api/v2/counts';  // 数据中心测试1
  // protected dataCenterUrl = 'http://hrygddv2.vipgz1.idcfengye.com/api/v2/counts';  // 衡锐自己的服务器2
  protected tempDataCenterUrl = 'http://aliyun-sz2.chewrobot.com:46004/api/v2/counts';  // 临时的数据中心测试，测试完了就删除
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

  protected tempFullDataCenterUrl(url: string): string {
    return this.tempDataCenterUrl + url;
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
