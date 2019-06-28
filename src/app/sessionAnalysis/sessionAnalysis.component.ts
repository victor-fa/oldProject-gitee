import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from '../public/service/common.service';
import { SessionLogService } from '../public/service/sessionLog.service';
import { NzModalService } from 'ng-zorro-antd';

registerLocaleData(zh);

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-sessionAnalysis',
  templateUrl: './sessionAnalysis.component.html',
  styleUrls: ['./sessionAnalysis.component.scss']
})
export class SessionAnalysisComponent implements OnInit {

  isSessionLogSearchVisiable = false; // 用于切换对话日志搜索
  isExplainVisiable = false;
  searchSessionLogForm: FormGroup;
  pageSize = 100;
  dateSearch = { 'Today': [new Date(), new Date()], 'This Month': [new Date(), new Date()] };
  beginDate = '';
  endDate = '';
  isSpinning = false;
  currentPanel = 'sessionLog';
  sessionLogFlag = 0;
  abnormalType = ''; // 异常回答
  sessionLogLevel = 'QA'; // 对话轮数
  currentTitle = '对话日志';
  currentSessionBusiness = []; // 对话日志下的类型
  checkDataOptions = {};
  sessionLogData = [];
  conpareFirst = '<';
  conpareSecond = '<';
  conpareThird = '<';
  changeSessionLogPage = 1;
  doFirstSessionLog = true;
  doLastSessionLog = true;
  allSessionLogSize = 0;
  totalSessionLog = 0;
  sessionLogPageSize = 10;
  lastSessionLogId = 0;
  firstSessionLogId = 0;
  constructor(
    public commonService: CommonService,
    private sessionLogService: SessionLogService,
    private modalService: NzModalService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) {
    this.commonService.nav[8].active = true;
    this._initForm();
    this.beginDate = null;
    this.endDate = null;
    this.checkDataOptions = {
      // tslint:disable-next-line:max-line-length
      'sessionAnalysis': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': false }, { 'checked': false }, { 'checked': false }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }],
    };
  }

  ngOnInit() {
    this.loadData('sessionLog');
  }

  /**
   * 查询全部
   */
  private loadData(flag): void {
    this.isSpinning = true;
    if (flag === 'sessionLog') {
      let id = 0;
      let pageFlag = '';
      if (this.doLastSessionLog) { id = this.lastSessionLogId; pageFlag = 'last'; }  // 下一页
      if (this.doFirstSessionLog) { id = this.firstSessionLogId; pageFlag = 'first'; }  // 上一页
      const logInput = {
        'start': this.beginDate,
        'end': this.endDate,
        'bots': this.currentSessionBusiness,
        'uid': this.searchSessionLogForm.controls['uid'].value,
        'ask': this.searchSessionLogForm.controls['ask'].value,
        'answer': this.searchSessionLogForm.controls['answer'].value,
        'flag': this.sessionLogFlag === 0 ? '' : this.sessionLogFlag === 1 ? true : false,
        'abnormalType': this.abnormalType,
        'intentionNum': this.searchSessionLogForm.controls['intentionNum'].value,
        'repetitionNum': this.searchSessionLogForm.controls['repetitionNum'].value,
        'cost': this.searchSessionLogForm.controls['cost'].value,
        'level': this.sessionLogLevel,
        'lastId': id,
        'firstId': id,
        'pageSize': this.sessionLogPageSize,
        'conpareFirst': this.conpareFirst,
        'conpareSecond': this.conpareSecond,
        'conpareThird': this.conpareThird,
        'pageFlag': pageFlag
      };
      // console.log(logInput);
      this.sessionLogService.getSessionLogList(logInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.totalSessionLog = res.count;
          this.allSessionLogSize = Math.round(res.count / this.sessionLogPageSize);
          this.sessionLogData = JSON.parse(res.payload).reverse();
          this.sessionLogData.forEach(item => {
            item.sessionDuration = this.formatDuring(item.sessionDuration);
          });
          console.log(this.sessionLogData);
          this.firstSessionLogId = JSON.parse(res.payload)[0].id;  // 最前面的Id
          this.lastSessionLogId = JSON.parse(res.payload)[JSON.parse(res.payload).length - 1].id;  // 最后面的Id
          const operationInput = { op_category: '客服中心', op_page: '对话日志' , op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          // this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
        }
      });
      this.doLastSessionLog = false;
      this.doFirstSessionLog = false;
    }
  }

  getExcecl(flag) {
    if (flag === 'sessionLog') {
      const logInput = {
        'start': this.beginDate,
        'end': this.endDate,
        'bots': this.currentSessionBusiness,
        'uid': this.searchSessionLogForm.controls['uid'].value,
        'ask': this.searchSessionLogForm.controls['ask'].value,
        'answer': this.searchSessionLogForm.controls['answer'].value,
        'flag': this.sessionLogFlag === 0 ? '' : this.sessionLogFlag === 1 ? true : false,
        'abnormalType': this.abnormalType,
        'intentionNum': this.searchSessionLogForm.controls['intentionNum'].value,
        'repetitionNum': this.searchSessionLogForm.controls['repetitionNum'].value,
        'cost': this.searchSessionLogForm.controls['cost'].value,
        'level': this.sessionLogLevel,
        'lastId': '',
        'firstId': '',
        'pageSize': 10,
        'conpareFirst': this.conpareFirst,
        'conpareSecond': this.conpareSecond,
        'conpareThird': this.conpareThird
      };
      console.log(logInput);

      this.sessionLogService.getExcel(logInput).subscribe(res => {
        const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=UTF-8' });
        const a = document.createElement('a');
        a.id = 'tempId';
        document.body.appendChild(a);
        a.download = '对话日志.xls';
        a.href = URL.createObjectURL(blob);
        a.click();
        const tempA = document.getElementById('tempId');
        // const operationInput = { op_category: '客服中心', op_page: '对话日志' , op_name: '下载' };
        // this.commonService.updateOperationlog(operationInput).subscribe();
        if (tempA) {
          tempA.parentNode.removeChild(tempA);
        }
        setTimeout(() => { window.location.reload(); }, 2000);
      });
    }
  }

  // 日期插件
  onChange(result: Date): void {
    // 正确选择数据
    if (result[0] !== '' || result[1] !== '') {
      this.beginDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss');
      this.endDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
    }
    // 手动点击清空
    if (this.beginDate === null || this.endDate === null) {
      this.beginDate = null;
      this.endDate = null;
    }
  }

  private _initForm(): void {
    this.searchSessionLogForm = this.fb.group({ date: [''], bots: [''], uid: [''], ask: [''], answer: [''], flag: [''],
        abnormalType: [''], intentionNum: [''], repetitionNum: [''], cost: [''], level: ['']});
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
    if (flag !== this.currentPanel) { this.currentPanel = flag; this.loadData('sessionLog'); }
    // tslint:disable-next-line:max-line-length
    this.currentTitle = flag === 'sessionLog' ? '对话日志' : '';
  }

  // 选择对话日志的业务类型
  chooseSessionBusiness(val, flag) {
    this.currentSessionBusiness = val;
  }

  // 选择切换大小于号
  chooseSessionCompare(val, flag) {
    if (flag === 'conpareFirst') {
      this.conpareFirst = val.target.text === '<' ? '>' : '<';
    }
    if (flag === 'conpareSecond') {
      this.conpareSecond = val.target.text === '<' ? '>' : '<';
    }
    if (flag === 'conpareThird') {
      this.conpareThird = val.target.text === '<' ? '>' : '<';
    }
  }

  /**
   * 上一页
   */
  lastPage(flag): void {
    this.changeSessionLogPage -= 1;
    this.doFirstSessionLog = true;
    this.loadData(flag);
  }

  /**
   * 下一页
   */
  nextPage(flag): void {
    this.changeSessionLogPage += 1;
    this.doLastSessionLog = true;
    this.loadData(flag);
  }

  // 毫秒转 分 秒
  formatDuring(mss) {
    // tslint:disable-next-line:radix
    const minutes = Math.round(Number((mss % (1000 * 60 * 60)) / (1000 * 60)));
    const seconds = Math.round((mss % (1000 * 60)) / 1000);
    return minutes + '分钟' + seconds + '秒 ';
  }

  // 标记/不标记
  changeFlag(val, flag) {
    if (flag === 'sessionLog') {
      const logInput = { id: val.id, flag: val.flag === true ? false : true };
      this.sessionLogService.updateSessionLog(logInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.changeSessionLogPage = 1;
          this.loadData('sessionLog');
          const operationInput = { op_category: '客服中心', op_page: '对话日志' , op_name: '标记/不标记' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

}
