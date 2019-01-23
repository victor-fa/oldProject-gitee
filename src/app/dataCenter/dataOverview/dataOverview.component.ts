import { Component, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-dataOverview',
  templateUrl: './dataOverview.component.html',
  styleUrls: ['./dataOverview.component.scss']
})
export class DataOverviewComponent implements OnInit {

  dataResult: any = [];
  displayData = [];
  allChecked = false;
  indeterminate = false;
  pageSize = 100;
  constructor(
  ) {
  }

  ngOnInit() {
    this.dataResult = JSON.parse(localStorage.getItem('dataCenter')).reverse();
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
