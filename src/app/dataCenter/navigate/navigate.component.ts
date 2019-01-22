import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DataCenterService } from 'src/app/public/service/dataCenter.service';

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.scss']
})
export class NavigateComponent implements OnInit {

  dataResult: any = [];
  displayData = [];
  allChecked = false;
  indeterminate = false;
  searchForm: FormGroup;  // 查询表单
  pageSize = 10;
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private modalService: NzModalService,
    private dataCenterService: DataCenterService,
    private notification: NzNotificationService,
    private _router: Router,
  ) {
    this._initSearchForm();
  }

  ngOnInit() {
    this.dataResult = JSON.parse(localStorage.getItem('dataCenter'));
  }

  doSearch() {
  }

  private _initSearchForm(): void {
    this.searchForm = this.fb.group({
      date: [''],
      status: [''],
    });
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
