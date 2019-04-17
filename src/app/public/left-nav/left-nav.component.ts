import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/public/service/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent implements OnInit {

  currentAppHeader = '';
  currentUser = '';
  appHeaderAllow = [];
  fullMenuResource = JSON.parse(localStorage.getItem('FullMenuResource'));
  constructor(
    public commonService: CommonService,
    private _router: Router,
  ) {
    const tempKey = localStorage.getItem('currentAppHeader'); // 针对当前APP标识做的处理，因为每次切换都会加载组件，所以存放到localstorage（不能放ngInInit）
    JSON.parse(localStorage.getItem('AppHeaderAllow')).forEach(item => {
      if (item === 'XIAOWU') {
        this.appHeaderAllow.push({ id: item, name: '你好小悟' });
      } else if (item === 'LENZE') {
        this.appHeaderAllow.push({ id: item, name: '听听同学' });
      }
    });
    if (tempKey === '' || tempKey === null) { localStorage.setItem('currentAppHeader', this.appHeaderAllow[0].id); }
    this.currentAppHeader = localStorage.getItem('currentAppHeader'); // 用于清空缓存或者第一次打开后台系统时，拿到的初始值
  }

  ngOnInit() {
    this.currentUser = localStorage.getItem('currentUser');
  }

  // 专门处理全局的APP变量
  currentAppHeaderOnChange(value, flag) {
    if (flag === 'currentAppHeader') {
      localStorage.setItem('currentAppHeader', value);
    }
    if (this._router.url === '/appVersion') {
      history.go(0);
    } else {
      this._router.navigate(['/appVersion']);
    }
  }

  toggleCollapsed(): void {
    this.commonService.isCollapsed = !this.commonService.isCollapsed;
    this.commonService.isLeftNavClose = !this.commonService.isLeftNavClose;
  }

  cancellation(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('token');
    localStorage.removeItem('FullMenuResource');
    localStorage.removeItem('FullChildrenResource');
    localStorage.removeItem('AppHeaderAllow');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('dataCenterUrl');
    window.location.href = '/login';
  }

  goDataCenter() {
    this._router.navigate(['/dataCenter/app']);
  }

  // 判断一级是否有权限
  haveMenuPermission(flag, data) {
    let result = false;
    this.fullMenuResource.forEach(item => {
      if (item === data) {
        result = true;
      }
    });
    return result;
  }

}
