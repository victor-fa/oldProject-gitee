import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../public/service/common.service';
import { DataCenterService } from '../public/service/dataCenter.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { iterateListLike } from '@angular/core/src/change_detection/change_detection_util';
import { initDomAdapter } from '@angular/platform-browser/src/browser';

registerLocaleData(zh);

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-dataCenter',
  templateUrl: './dataCenter.component.html',
  styleUrls: ['./dataCenter.component.scss']
})
export class DataCenterComponent implements OnInit {

  dataResult: any = [];
  displayData = [];
  allChecked = false;
  indeterminate = false;
  searchForm: FormGroup;  // 查询表单
  pageSize = 100;
  dateSearch = { 'Today': [new Date(), new Date()], 'This Month': [new Date(), new Date()] };
  beginDate = '20190101';
  endDate = '20190115';
  myDate = new Date();
  localStorageTime = localStorage.getItem('dataCenterTime');
  currentTitle = '数据中心';
  titleName = ['APP', '留存', 'BOT总览', '产品', '异常表述', '机票BOT', '火车BOT', '酒店BOT', '天气BOT', '导航BOT'];
  constructor(
    public commonService: CommonService,
    private dataCenterService: DataCenterService,
    private modalService: NzModalService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private _router: Router,
  ) {
    this.commonService.nav[3].active = true;
    this._initSearchForm();
  }

  ngOnInit() {
    this.initData();
    this.getTitle();
  }

  initData(): void {
    const currentTime = this.myDate.getFullYear() + '-' + (this.myDate.getMonth() + 1) + '-' + this.myDate.getDate(); // 用于比较时间
    if (localStorage.getItem('dataCenter') == null || currentTime !== this.localStorageTime) {
      this.loadData();
    }
    localStorage.setItem('beginDate', this.beginDate);
    localStorage.setItem('endDate', this.endDate);
  }

  loadData(): void {
    const currentTime = this.myDate.getFullYear() + '-' + (this.myDate.getMonth() + 1) + '-' + this.myDate.getDate(); // 用于比较时间
    this.dataCenterService.getDataCenterList(this.beginDate, this.endDate).subscribe(res => {
      if (res.retcode === 0) {
        localStorage.setItem('dataCenter', res.payload);
        localStorage.setItem('dataCenterTime', currentTime);
      } else {
        this.modalService.error({
          nzTitle: '提示',
          nzContent: res.message
        });
      }
    });
  }

  doSearch(): void {
    if (this.beginDate === localStorage.getItem('beginDate') || this.endDate === localStorage.getItem('endDate')) {
      // this.loadData();
      localStorage.setItem('beginDate', this.beginDate);
      localStorage.setItem('endDate', this.endDate);
    }
  }

  getTitle(): void {
    let count = 0;
    this.commonService.dataCenter.forEach(item => {
      if (item.active === true) {
        this.currentTitle = this.titleName[count];
      }
      count++;
    });
  }

  // 日期插件
  onChange(result: Date): void {
    if (result[0] !== '') {
      let beginDate = this.datePipe.transform(result[0], 'yyyy-MM-dd 00:00:00');
      let endDate = this.datePipe.transform(result[1], 'yyyy-MM-dd 23:59:59');
      if (beginDate === endDate) {
        beginDate = this.datePipe.transform(result[0], 'yyyy-MM-dd');
        endDate = this.datePipe.transform(result[1], 'yyyy-MM-dd');
      }
      this.beginDate = beginDate;
      this.endDate = endDate;
    }
  }

  private _initSearchForm(): void {
    this.searchForm = this.fb.group({
      date: [''],
      status: [''],
    });
  }

}
