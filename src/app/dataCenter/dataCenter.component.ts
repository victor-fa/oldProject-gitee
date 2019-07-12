import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CommonService } from '../public/service/common.service';
import { DataCenterService } from '../public/service/dataCenter.service';

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
  isExplainVisiable = false;
  isSessionLineVisiable = false;  // 显隐行列
  searchDataCenterForm: FormGroup;
  pageSize = 100;
  dateSearch = { 'Today': [new Date(), new Date()], 'This Month': [new Date(), new Date()] };
  beginDate = '';
  endDate = '';
  isSpinning = false;
  currentPanel = 'dataApp';
  commonDataCenter: any = [];
  dataCenterStatus = 'all';
  currentTitle = 'APP总览';
  checkDataOptions = {};
  currentTabNum = 0;
  currentSessionBusiness = 1; // 对话日志下的类型
  currentChannel = '';
  constructor(
    public commonService: CommonService,
    private dataCenterService: DataCenterService,
    private modalService: NzModalService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private router: Router,
    private routerParams: ActivatedRoute,
    private notification: NzNotificationService,
    private _router: Router,
  ) {
    this.commonService.nav[0].active = true;
    this._initForm();
    this.beginDate = this.commonService.getDay(-7);
    this.endDate = this.commonService.getDay(-1);
    this.currentChannel = localStorage.getItem('currentAppHeader');
    this.checkDataOptions = {
      // tslint:disable-next-line:max-line-length
      'dataApp': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }],
      // tslint:disable-next-line:max-line-length
      'keepApp': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true } ],
      // tslint:disable-next-line:max-line-length
      'overview': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, ],
      // tslint:disable-next-line:max-line-length
      'product': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, ],
      // tslint:disable-next-line:max-line-length
      'error': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, ],
      // tslint:disable-next-line:max-line-length
      'ticket': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, ],
      // tslint:disable-next-line:max-line-length
      'train': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, ],
      // tslint:disable-next-line:max-line-length
      'hotel': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, ],
      // tslint:disable-next-line:max-line-length
      'weather': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, ],
      // tslint:disable-next-line:max-line-length
      'navigate': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, ],
      // tslint:disable-next-line:max-line-length
      'taxi': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, ],
      // tslint:disable-next-line:max-line-length
      'music': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }],
      // tslint:disable-next-line:max-line-length
      'horoscope': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }],
      // tslint:disable-next-line:max-line-length
      'recharge': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }],
      // tslint:disable-next-line:max-line-length
      'errand': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }],
      // tslint:disable-next-line:max-line-length
      'movie': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }],
      'tts': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }],
    };
  }

  ngOnInit() {
    this.initData();
  }

  initData(): void {
    this.routerParams.queryParams.subscribe((params: ParamMap) => {
      this.currentTabNum = params['currentTab'] - 1;
    });
    switch (Number(this.currentTabNum) + 1) {
      case 1:
        this.currentPanel = 'dataApp';
        break;
      case 2:
        this.currentPanel = 'keepApp';
        break;
      case 3:
        this.currentPanel = 'overview';
        break;
      case 4:
        this.currentPanel = 'product';
        break;
      case 5:
        this.currentPanel = 'error';
        break;
      case 6:
        this.currentPanel = 'ticket';
        break;
      case 7:
        this.currentPanel = 'train';
        break;
      case 8:
        this.currentPanel = 'hotel';
        break;
      case 9:
        this.currentPanel = 'weather';
        break;
      case 10:
        this.currentPanel = 'navigate';
        break;
      case 11:
        this.currentPanel = 'taxi';
        break;
      case 12:
        this.currentPanel = 'music';
        break;
      case 13:
        this.currentPanel = 'horoscope';
        break;
      case 14:
        this.currentPanel = 'recharge';
        break;
      case 15:
        this.currentPanel = 'errand';
        break;
      case 16:
        this.currentPanel = 'movie';
        break;
      case 17:
        this.currentPanel = 'tts';
        break;
      default:
        break;
    }
    this.doSearch('dataCenter');
  }

  // 获取单元数据
  loadUnitData(platform, origin): void {
    let flag = 'user-behavior';
    switch (this.currentPanel) {
      case 'dataApp':
        flag = 'user-behavior';
        break;
      case 'keepApp':
        flag = 'retentions';
        break;
      case 'overview':
        flag = 'bot-awaken';
        break;
      case 'product':
        flag = 'user-behavior';
        break;
      case 'error':
        flag = 'bot-exception';
        break;
      case 'ticket':
        flag = 'flight-bot';
        break;
      case 'train':
        flag = 'train-bot';
        break;
      case 'hotel':
        flag = 'hotel-bot';
        break;
      case 'weather':
        flag = 'weather-bot';
        break;
      case 'navigate':
        flag = 'navigation-bot';
        break;
      case 'taxi':
        flag = 'taxi-bot';
        break;
      case 'music':
        flag = 'music-bot';
        break;
      case 'horoscope':
        flag = 'horoscope-bot';
        break;
      case 'recharge':
        flag = 'recharge-bot';
        break;
      case 'errand':
        flag = 'errand-bot';
        break;
      case 'movie':
        flag = 'movie-bot';
        break;
      case 'tts':
        flag = 'tts-switch';
        break;
      default:
        break;
    }
    this.isSpinning = true; // loading
    this.dataCenterService.getUnitList(this.beginDate, this.endDate, platform, origin, flag).subscribe(res => {
      this.commonDataCenter.splice(0, this.commonDataCenter.length);  // 清空
      if (res.retcode === 0 && res.status !== 500) {
        this.commonDataCenter = JSON.parse(res.payload).reverse();
        console.log(this.commonDataCenter);
        this.isSpinning = false;  // loading
        const operationInput = {
          op_category: '数据中心',
          op_page: this.currentTitle,
          op_name: '访问'
        };
        this.commonService.updateOperationlog(operationInput).subscribe();
      } else {
        this.modalService.error({ nzTitle: '提示', nzContent: res.message });
      }
    });
  }

  // 查询
  doSearch(flag): void {
    if (flag === 'dataCenter') {
      const params = this.searchDataCenterForm.controls['status'].value === '' ? 'all' : this.searchDataCenterForm.controls['status'].value;
      this.dataCenterStatus = params;
      if (params === 'all') {
        const platform = '';
        const origin = '';
        this.loadUnitData(platform, origin);
        localStorage.setItem('isDataCenterSearch', 'true');
      } else {
        const origin = params.substring(0, params.indexOf('-'));
        const platform = params.substring(params.indexOf('-') + 1, params.length);
        this.loadUnitData(platform, origin);
      }
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

  private _initForm(): void {
    this.searchDataCenterForm = this.fb.group({ date: [''], status: [''], });
  }

  // 展开数据说明
  shouSomething(flag) {
    if (flag === 'explain') {
      this.isExplainVisiable = true;
    }
  }

  // 关闭数据说明
  hideSomething(flag) {
    if (flag === 'explain') {
      this.isExplainVisiable = false;
    }
  }

  // 切换面板
  changePanel(flag): void {
    if (flag !== this.currentPanel) { this.currentPanel = flag; this.doSearch('dataCenter'); }
    // tslint:disable-next-line:max-line-length
    this.currentTitle = flag === 'dataApp' ? 'APP总览' : flag === 'keepApp' ? 'App留存' : flag === 'overview' ? 'BOT总览' :
     flag === 'product' ? '产品权限' : flag === 'error' ? '异常表述' : flag === 'ticket' ? '机票BOT' : flag === 'train' ? '火车BOT'
     : flag === 'hotel' ? '酒店BOT' : flag === 'weather' ? '天气BOT' : flag === 'navigate' ? '导航BOT' : flag === 'taxi' ? '打车BOT' :
     flag === 'music' ? '音乐BOT' : flag === 'horoscope' ? '星座BOT' : flag === 'recharge' ? '闪送BOT' : flag === 'errand' ? '充话费BOT' :
      flag === 'movie' ? '电影BOT' : flag === 'tts' ? '语音切换BOT' : '';
  }

  // 选择对话日志的业务类型
  chooseSessionBusiness(val, flag) {
    console.log(val);
    this.currentSessionBusiness = flag;
  }

}
