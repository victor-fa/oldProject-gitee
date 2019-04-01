import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/public/service/common.service';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { DataCenterService } from 'src/app/public/service/dataCenter.service';

@Component({
  selector: 'app-taxi',
  templateUrl: './taxi.component.html',
  styleUrls: ['./taxi.component.scss']
})
export class TaxiComponent implements OnInit {

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
      this.dataCenterService.getUnitList(beginDate, endDate, '', '', 'taxi-bot').subscribe(res => {
        if (res.retcode === 0 && res.status !== 500) {
          const operationInput = { op_category: '数据中心', op_page: '打车BOT' , op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
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
