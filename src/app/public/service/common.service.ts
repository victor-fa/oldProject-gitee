
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocalizationService } from './localization.service';

@Injectable({
  providedIn: 'root'  // 必须添加，放在根部分
})
/**
 * 公用的
 */
export class CommonService {
  list: string[] = [];
  isLeftNavClose = false;
  nav = [
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: false }
  ];
  permission = {
    personal: false,
    reset: false,
    monitor: false,
    number: false,
    template: false,
    outbound: false,
    examine: false,
    material: false,
    datareport: false,
    account: false,
    role: false,
    conversation: false,
  };

  constructor(
    private _httpClient: HttpClient,
    public localizationService: LocalizationService,
  ) { }

  append(str: any) {
    this.list.push(str);
  }

  havePermission(): void {
    const flag = this.localizationService.getPermission.split(',');
    flag.forEach(item => {
      if (item === '个人资料') {
        this.permission.personal = true;
      } else if (item === '重置密码') {
        this.permission.reset = true;
      } else if (item === '首页监控') {
        this.permission.monitor = true;
      } else if (item === '号码管理') {
        this.permission.number = true;
      } else if (item === '模板管理') {
        this.permission.template = true;
      } else if (item === '外呼任务') {
        this.permission.outbound = true;
      } else if (item === '任务审核') {
        this.permission.examine = true;
      } else if (item === '员工列表') {
        this.permission.account = true;
      } else if (item === '角色列表') {
        this.permission.role = true;
      } else if (item === '会话记录') {
        this.permission.conversation = true;
      }
    });
  }

  closePermission(): void {
    this.permission.personal = false;
    this.permission.reset = false;
    this.permission.monitor = false;
    this.permission.number = false;
    this.permission.template = false;
    this.permission.outbound = false;
    this.permission.examine = false;
    this.permission.material = false;
    this.permission.datareport = false;
    this.permission.account = false;
    this.permission.role = false;
    this.permission.conversation = false;
  }

  menuNativeToFalse(): void {
    this.nav.forEach(item => {
      item.active = false;
    });
  }

  // 获取相对时间，格式为yyyy-mm-dd
  getBeforeDate(time) {
    const n = time;
    const d = new Date();
    let year = d.getFullYear();
    let mon = d.getMonth() + 1;
    let day = d.getDate();
    if (day <= n) {
      if (mon > 1) {
        mon = mon - 1;
      } else {
        year = year - 1;
        mon = 12;
      }
    }
    d.setDate(d.getDate() - n);
    year = d.getFullYear();
    mon = d.getMonth() + 1;
    day = d.getDate();
    const s = year + '-' + (mon < 10 ? ('0' + mon) : mon) + '-' + (day < 10 ? ('0' + day) : day);
    return s;
  }

  // 验证有效的手机号
  phoneNumValidator = (control: FormControl): { [s: string]: boolean } => {
    const MOBILE_REGEXP = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
    if (!control.value) {
      return { required: true };
    } else if (!MOBILE_REGEXP.test(control.value)) {
      return { error: true, mobile: true };
    }
  }

  // 验证手机号是否存在
  // _phoneNumAsyncValidator = (control: FormControl): any => {
  //   return this.queryPhone(control.value);
  // }

  // 注册查询，判断不存在
  queryPhone(phoneNumber: string): Observable<{ error: boolean, existent: boolean }> {
  //   const _url = `${this.appconfig.remoteServiceBaseUrl}/user/mobile/?user_phone=${phoneNumber}`;
  //   const _options = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //     })
  //   };
  //   return this._httpClient
  //     .get<StatusModel>(_url, _options)
  //     .flatMap((res: StatusModel) => {
  //       if (res.code === '0000') {
  //         return Observable.of(null);
  //       } else if (res.code === '0001') {
  //         // 手机号不存在
  //         this._notifyService.warning(res.msg);
  //         return Observable.of({ error: true, existent: true });
  //       } else {
          return Observable.of(null);
  //       }
  //     })
  }

  /**
   * 验证有效的账号 + 由数字或英文组成，8到12个字符
   */
  rightNumValidator = (control: FormControl): { [s: string]: boolean } => {
    const REGEXP = /^[a-zA-Z0-9]{8,12}$/;
    if (!control.value) {
      return { required: true };
    } else if (!REGEXP.test(control.value)) {
      return { error: true, rightNum: true };
    }
  }

  /**
   * 验证有效的密码 + 由数字或英文组成，6到12个字符
   */
  rightPasswordValidator = (control: FormControl): { [s: string]: boolean } => {
    const REGEXP = /^[a-zA-Z0-9]{6,12}$/;
    if (!control.value) {
      return { required: true };
    } else if (!REGEXP.test(control.value)) {
      return { error: true, rightNum: true };
    }
  }

  /**
   * 验证有效的用户名称 + 由中文或英文组成，不超过20个字符
   */
  userNameValidator = (control: FormControl): { [s: string]: boolean } => {
    const REGEXP = /^[\u4e00-\u9fa5a-zA-Z]{0,20}$/;
    if (!control.value) {
      return { required: true };
    } else if (!REGEXP.test(control.value)) {
      return { error: true, userName: true };
    }
  }

  /**
   * 验证有效的用户名称 + 由中文或英文组成，不超过10个字符，超过2个字符（用于提示）
   */
  userNameValidator1 = (control: FormControl): { [s: string]: boolean } => {
    const REGEXP = /^[\u4e00-\u9fa5a-zA-Z]{2,10}$/;
    if (!control.value) {
      return { required: true };
    } else if (!REGEXP.test(control.value)) {
      return { error: true, userName: true };
    }
  }

  /**
   * 验证有效的规则名称 + 由数字或英文组成
   */
  rightRuleValidator = (control: FormControl): { [s: string]: boolean } => {
    const REGEXP = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
    if (!control.value) {
      return { required: true };
    } else if (!REGEXP.test(control.value)) {
      return { error: true, rightRule: true };
    }
  }

}
