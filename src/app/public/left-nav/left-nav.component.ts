import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/public/service/common.service';
import { CookiesService } from '../service/cookies.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent implements OnInit {

  currentAppHeader = '';
  constructor(
    public commonService: CommonService,
    private _cookiesService: CookiesService,
    private _router: Router,
  ) {
    const tempKey = localStorage.getItem('currentAppHeader'); // 针对当前APP标识做的处理，因为每次切换都会加载组件，所以存放到localstorage（不能放ngInInit）
    // tslint:disable-next-line:no-unused-expression
    tempKey === '' || tempKey === null ? localStorage.setItem('currentAppHeader', 'XIAOWU') : 1;
    this.currentAppHeader = localStorage.getItem('currentAppHeader'); // 用于清空缓存或者第一次打开后台系统时，拿到的初始值
  }

  ngOnInit() {
  }

  // 专门处理全局的APP变量
  currentAppHeaderOnChange(value, flag) {
    if (flag === 'currentAppHeader') {
      localStorage.setItem('currentAppHeader', value);
    }
    history.go(0);
  }

  toggleCollapsed(): void {
    this.commonService.isCollapsed = !this.commonService.isCollapsed;
    this.commonService.isLeftNavClose = !this.commonService.isLeftNavClose;
  }

  cancellation(): void {
    this._cookiesService.clearToken();
  }

  goDataCenter() {
    this._router.navigate(['/dataCenter/app']);
  }
}
