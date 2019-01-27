
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'  // 必须添加，放在根部分
})
/**
 * 公用的
 */
export class CommonService {
  list: string[] = [];
  isLeftNavClose = false;
  isCollapsed = false;
  commonDataCenter: any = [];
  dataCenterStatus = 'all';
  currentDataCenter = 0;   // 用于比对是否还是当前面板
  needDataCenter = false;   // 用于判断是否需要提示
  nav = [
    { active: false },
    { active: false },
    { active: false },
    { active: false },
    { active: false }
  ];
  dataCenter = [    // 数据中心下标状态
    { active: false },
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
  currentTitle = '数据中心';  // 数据中心标题

  constructor(
    private _router: Router,
  ) { }

  append(str: any) {
    this.list.push(str);
  }

  menuNativeToFalse(): void {
    this.nav.forEach(item => {
      item.active = false;
    });
  }

  changeDataCenter(flag, route): void {
    const dataCenterTitle = ['APP', '留存', 'BOT总览', '产品', '异常表述', '机票BOT', '火车BOT', '酒店BOT', '天气BOT', '导航BOT'];
    this.needDataCenter = flag === this.currentDataCenter ? false : true;
    localStorage.setItem('isDataCenterSearch', 'false');

    this.dataCenter.forEach(item => {
      item.active = false;
    });

    this.dataCenter[flag].active = true;
    this.currentTitle = dataCenterTitle[flag];
    this.currentDataCenter = flag;
    this.dataCenterStatus = 'all';

    if (location.href.indexOf('dataCenter') > -1) {
      return;
    }
    setTimeout(() => {
      this._router.navigate([route]);
    }, 400);
  }

  // 获取指定时间的日期 格式：yyyyMMdd
  getDay(day): string {
    const today = new Date();
    const targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    today.setTime(targetday_milliseconds); // 注意，这行是关键代码
    const tYear = today.getFullYear();
    let tMonth = today.getMonth().toString();
    let tDate = today.getDate().toString();
    tMonth = this.doHandleMonth(tMonth + 1);
    tDate = this.doHandleMonth(tDate);
    return tYear + '' + tMonth + '' + tDate;
  }

  doHandleMonth(month): string {
    let m = month;
    if (month.toString().length === 1) {
      m = '0' + month;
    }
    return m;
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
