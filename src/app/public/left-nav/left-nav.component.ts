import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from 'src/app/public/service/common.service';
import { CookiesService } from '../service/cookies.service';
import { LocalizationService } from '../service/localization.service';
import { flatten } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent implements OnInit {

  isCollapsed = false;
  userName = '';
  constructor(
    private commonService: CommonService,
    private _cookiesService: CookiesService,
    public localizationService: LocalizationService,
  ) { }

  ngOnInit() {
    if (this.localizationService.getUserName) {
      this.userName = this.localizationService.getUserName;
    }
    this.commonService.havePermission();  // 获取权限
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
    this.commonService.isLeftNavClose = !this.commonService.isLeftNavClose;
  }

  cancellation(): void {
    this.localizationService.setLocalization = '';
    this.localizationService.setUserName = '';
    this.localizationService.setPermission = '';
    this._cookiesService.clearToken();
  }
}
