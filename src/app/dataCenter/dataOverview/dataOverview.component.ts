import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/public/service/common.service';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-dataOverview',
  templateUrl: './dataOverview.component.html',
  styleUrls: ['./dataOverview.component.scss']
})
export class DataOverviewComponent implements OnInit {

  displayData = [];
  allChecked = false;
  indeterminate = false;
  pageSize = 100;
  constructor(
    public commonService: CommonService,
    private notification: NzNotificationService,
  ) {
  }

  ngOnInit() {
    if (this.commonService.dataCenterStatus !== 'all' && this.commonService.needDataCenter) {  // 单独接口需要重新请求
      this.notification.create('info', '提示', '您切换了查询面板，请重新查询数据');
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
