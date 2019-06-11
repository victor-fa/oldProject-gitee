import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from '../public/service/common.service';

registerLocaleData(zh);

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-sessionAnalysis',
  templateUrl: './sessionAnalysis.component.html',
  styleUrls: ['./sessionAnalysis.component.scss']
})
export class SessionAnalysisComponent implements OnInit {

  isSessionLogSearchVisiable = true; // 用于切换对话日志搜索
  isExplainVisiable = false;
  searchSessionLogForm: FormGroup;
  pageSize = 100;
  dateSearch = { 'Today': [new Date(), new Date()], 'This Month': [new Date(), new Date()] };
  beginDate = '';
  endDate = '';
  isSpinning = false;
  currentPanel = 'sessionLog';
  sessionLogData: any = [];
  dataCenterStatus = 'all';
  currentTitle = '对话日志';
  currentSessionBusiness = 1; // 对话日志下的类型
  checkDataOptions = {};
  constructor(
    public commonService: CommonService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) {
    this.commonService.nav[8].active = true;
    this._initForm();
    this.beginDate = this.commonService.getDay(-7);
    this.endDate = this.commonService.getDay(-1);
    this.checkDataOptions = {
      // tslint:disable-next-line:max-line-length
      'sessionAnalysis': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }],
    };
  }

  ngOnInit() {
    this.doSearch('sessionLog');
  }

  // 查询
  doSearch(flag): void {
    if (flag === 'sessionLog') {
      console.log('sessionLog');
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
    this.searchSessionLogForm = this.fb.group({ date: [''], status: [''], });
  }

  // 展开数据说明
  shouSomething(flag) {
    if (flag === 'sessionLog') {
      this.isSessionLogSearchVisiable = this.isSessionLogSearchVisiable === true ? false : true;
    } else if (flag === 'explain') {
      this.isExplainVisiable = this.isExplainVisiable === true ? false : true;
    }
  }

  // 切换面板
  changePanel(flag): void {
    if (flag !== this.currentPanel) { this.currentPanel = flag; this.doSearch('sessionLog'); }
    // tslint:disable-next-line:max-line-length
    this.currentTitle = flag === 'sessionLog' ? '对话日志' : '';
  }

  // 选择对话日志的业务类型
  chooseSessionBusiness(val, flag) {
    console.log(val);
    this.currentSessionBusiness = flag;
  }

}
