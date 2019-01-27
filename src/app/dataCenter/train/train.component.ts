import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/public/service/common.service';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { DataCenterService } from 'src/app/public/service/dataCenter.service';

@Component({
  selector: 'app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss']
})
export class TrainComponent implements OnInit {

  displayData = [];
  allChecked = false;
  indeterminate = false;
  pageSize = 100;
  myDate = new Date();
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
    if (this.commonService.dataCenterStatus === 'all' && isDataCenterSearch === 'false') {
      beginDate = this.commonService.getDay(-7);
      endDate = this.commonService.getDay(-1);
      this.dataCenterService.getUnitList(beginDate, endDate, '', '', 'train-bot').subscribe(res => {
        if (res.retcode === 0 && res.status !== 500) {
          localStorage.setItem('dataCenter', res.payload);
          this.commonService.commonDataCenter = JSON.parse(res.payload).reverse();
          localStorage.setItem('dataCenterTime', currentTime);
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  // 主面板分页表单
  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    const allChecked = this.displayData.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.displayData.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

}
