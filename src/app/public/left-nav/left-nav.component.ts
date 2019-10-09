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
    if (localStorage.getItem('AppHeaderAllow') === '' || localStorage.getItem('AppHeaderAllow') === null) {
      alert('请重新登录');
      window.location.href = '/login';
      return;
    }
    const resultJson = JSON.parse(localStorage.getItem('AppHeaderAllow'));
		for(var item in resultJson) {
      this.appHeaderAllow.push({ id: item, name: resultJson[item] });
    }
    if (tempKey === '' || tempKey === null) {
      localStorage.setItem('currentAppHeader', this.appHeaderAllow[0].id);
      this.commonService.currentChanelId = this.appHeaderAllow[0].id;
    }
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
    } else if (this._router.url.indexOf('/dataCenter') > -1) {
      const dataCenterTab = localStorage.getItem('dataCenterTab');
      let number = 1;
      switch (dataCenterTab) {
        case 'dataApp': number = 1; break;
        case 'keepApp': number = 2; break;
        case 'overview': number = 3; break;
        case 'product': number = 4; break;
        case 'error': number = 5; break;
        case 'ticket': number = 6; break;
        case 'train': number = 7; break;
        case 'hotel': number = 8; break;
        case 'weather': number = 9; break;
        case 'navigate': number = 10; break;
        case 'taxi': number = 11; break;
        case 'music': number = 12; break;
        case 'horoscope': number = 13; break;
        case 'recharge': number = 14; break;
        case 'errand': number = 15; break;
        case 'movie': number = 16; break;
        case 'tts': number = 17; break;
        case 'reminder': number = 18; break;
        case 'news': number = 19; break;
        default:
          break;
      }
      window.location.href = '/dataCenter?currentTab=' + number;
    } else {
      this.commonService.currentChanelId = localStorage.getItem('currentAppHeader');
      this._router.navigate(['/appVersion']);
    }
  }

  toggleCollapsed(): void {
    this.commonService.isCollapsed = !this.commonService.isCollapsed;
    this.commonService.isLeftNavClose = !this.commonService.isLeftNavClose;
  }

  // 注销退出
  cancellation(): void {
    localStorage.clear();
    window.location.href = '/login';
  }

  // 修改密码
  modifyPwd() {
    window.location.href = '/changePass';
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
