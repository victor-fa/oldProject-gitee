import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/public/service/common.service';
import { CookiesService } from '../service/cookies.service';

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent implements OnInit {

  constructor(
    public commonService: CommonService,
    private _cookiesService: CookiesService,
  ) { }

  ngOnInit() {
  }

  toggleCollapsed(): void {
    this.commonService.isCollapsed = !this.commonService.isCollapsed;
    this.commonService.isLeftNavClose = !this.commonService.isLeftNavClose;
  }

  cancellation(): void {
    this._cookiesService.clearToken();
  }
}
