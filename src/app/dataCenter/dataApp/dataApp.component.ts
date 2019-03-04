import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from 'src/app/public/service/common.service';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { DataCenterService } from 'src/app/public/service/dataCenter.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-dataApp',
  templateUrl: './dataApp.component.html',
  styleUrls: ['./dataApp.component.scss']
})
export class DataAppComponent implements OnInit {

  displayData = [];
  allChecked = false;
  indeterminate = false;
  pageSize = 100;
  myDate = new Date();
  isSpinning = false;
  constructor(
    public commonService: CommonService,
    private notification: NzNotificationService,
    private dataCenterService: DataCenterService,
    private modalService: NzModalService,
  ) {
  }

  ngOnInit() {
    let beginDate = localStorage.getItem('beginDate');
    let endDate = localStorage.getItem('endDate');
    const currentTime = this.myDate.getFullYear() + '-' + (this.myDate.getMonth() + 1) + '-' + this.myDate.getDate(); // 用于比较时间
    const isDataCenterSearch = localStorage.getItem('isDataCenterSearch');
    this.isSpinning = true; // loading
    if (this.commonService.dataCenterStatus === 'all' && isDataCenterSearch === 'false') {
      beginDate = this.commonService.getDay(-7);
      endDate = this.commonService.getDay(-1);
      this.dataCenterService.getUnitList(beginDate, endDate, '', '', 'user-behavior').subscribe(res => {
        if (res.retcode === 0 && res.status !== 500) {
          localStorage.setItem('dataCenter', res.payload);
          this.commonService.commonDataCenter = JSON.parse(res.payload).reverse();
          localStorage.setItem('dataCenterTime', currentTime);
          this.isSpinning = false;  // loading
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

}
