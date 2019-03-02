import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../public/service/common.service';
import { DataCenterService } from '../public/service/dataCenter.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

registerLocaleData(zh);

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-dataCenter',
  templateUrl: './dataCenter.component.html',
  styleUrls: ['./dataCenter.component.scss']
})
export class DataCenterComponent implements OnInit {

  displayData = [];
  allChecked = false;
  indeterminate = false;
  searchForm: FormGroup;  // 查询表单
  pageSize = 100;
  dateSearch = { 'Today': [new Date(), new Date()], 'This Month': [new Date(), new Date()] };
  beginDate = '';
  endDate = '';
  myDate = new Date();
  localStorageTime = localStorage.getItem('dataCenterTime');
  isSpinning = false;
  constructor(
    public commonService: CommonService,
    private dataCenterService: DataCenterService,
    private modalService: NzModalService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private _router: Router,
  ) {
    this.commonService.nav[7].active = true;
    this._initSearchForm();
    this.beginDate = this.commonService.getDay(-7);
    this.endDate = this.commonService.getDay(-1);
  }

  ngOnInit() {
    this.initData();
    // this.doSearch();
  }

  initData(): void {
    const currentTime = this.myDate.getFullYear() + '-' + (this.myDate.getMonth() + 1) + '-' + this.myDate.getDate(); // 用于比较时间
    localStorage.setItem('beginDate', this.beginDate);
    localStorage.setItem('endDate', this.endDate);
  }

  // 获取单元数据
  loadUnitData(platform, origin): void {
    const currentTime = this.myDate.getFullYear() + '-' + (this.myDate.getMonth() + 1) + '-' + this.myDate.getDate(); // 用于比较时间
    let flag = 'user-behavior';
    switch (this.commonService.currentTitle) {
      case 'APP':
        flag = 'user-behavior';
        break;
      case '留存':
        flag = 'retentions';
        break;
      case 'BOT总览':
        flag = 'bot-awaken';
        break;
      case '产品':
        flag = 'user-behavior';
        break;
      case '异常表述':
        flag = 'bot-exception';
        break;
      case '机票BOT':
        flag = 'flight-bot';
        break;
      case '火车BOT':
        flag = 'train-bot';
        break;
      case '酒店BOT':
        flag = 'hotel-bot';
        break;
      case '天气BOT':
        flag = 'weather-bot';
        break;
      case '导航BOT':
        flag = 'navigation-bot';
        break;
      case '打车BOT':
        flag = 'taxi-bot';
        break;
      case '音乐BOT':
        flag = 'music-bot';
        break;
      default:
        break;
    }
    this.isSpinning = true; // loading
    this.dataCenterService.getUnitList(this.beginDate, this.endDate, platform, origin, flag).subscribe(res => {
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

  // 查询
  doSearch(): void {
    const params = this.searchForm.controls['status'].value;
    this.commonService.dataCenterStatus = params;
    this.commonService.needDataCenter = false;
    if (params === 'all') {
      const platform = '';
      const origin = '';
      this.loadUnitData(platform, origin);
      localStorage.setItem('beginDate', this.beginDate);
      localStorage.setItem('endDate', this.endDate);
      localStorage.setItem('isDataCenterSearch', 'true');
    } else {
      if ((Number(this.endDate) - Number(this.beginDate)) >= 30) {  // 限制查询条件
        this.modalService.confirm({ nzTitle: '提示', nzContent: '查询范围只能在该月范围内' });
        return;
      }
      const origin = params.substring(0, params.indexOf('-'));
      const platform = params.substring(params.indexOf('-') + 1, params.length);
      this.loadUnitData(platform, origin);
    }
  }

  // 日期插件
  onChange(result: Date): void {
    // 正确选择数据
    if (result[0] !== '' || result[1] !== '') {
      this.beginDate = this.datePipe.transform(result[0], 'yyyyMMdd');
      this.endDate = this.datePipe.transform(result[1], 'yyyyMMdd');
    }
    // 手动点击清空
    if (this.beginDate === null || this.endDate === null) {
      this.beginDate = this.commonService.getDay(-7);
      this.endDate = this.commonService.getDay(-1);
    }
  }

  private _initSearchForm(): void {
    this.searchForm = this.fb.group({
      date: [''],
      status: [''],
    });
  }

}
