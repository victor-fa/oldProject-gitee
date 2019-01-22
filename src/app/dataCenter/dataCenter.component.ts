import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../public/service/common.service';
import { DataCenterService } from '../public/service/dataCenter.service';
import { NzModalService } from 'ng-zorro-antd';
registerLocaleData(zh);

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-dataCenter',
  templateUrl: './dataCenter.component.html',
  styleUrls: ['./dataCenter.component.scss']
})
export class DataCenterComponent implements OnInit {

  myDate = new Date();
  localStorageTime = localStorage.getItem('dataCenterTime')
  constructor(
    public commonService: CommonService,
    private dataCenterService: DataCenterService,
    private modalService: NzModalService,
  ) {
    this.commonService.nav[3].active = true;
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    const currentTime = this.myDate.getFullYear() + '-' + (this.myDate.getMonth() + 1) + '-' + this.myDate.getDate(); // 用于
    if (localStorage.getItem('dataCenter') == null || currentTime !== this.localStorageTime) {
      this.dataCenterService.getDataCenterList('20181226', '20190111').subscribe(res => {
        if (res.retcode === 0) {
          localStorage.setItem('dataCenter', res.payload);
          // tslint:disable-next-line:max-line-length
          localStorage.setItem('dataCenterTime', currentTime);
        } else {
          this.modalService.error({
            nzTitle: '提示',
            nzContent: res.message
          });
        }
      });
    }
  }
}
