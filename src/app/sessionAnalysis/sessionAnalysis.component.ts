import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NzMessageService, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import * as XLSX from 'xlsx';
import { CommonService } from '../public/service/common.service';
import { SessionLogService } from '../public/service/sessionLog.service';
import { SpecialUserService } from '../public/service/specialUser.service';

registerLocaleData(zh);

@Component({
  selector: 'app-sessionAnalysis',
  templateUrl: './sessionAnalysis.component.html',
  styleUrls: ['./sessionAnalysis.component.scss']
})
export class SessionAnalysisComponent implements OnInit {

  visiable = {sessionLogSearch: true, explain: false, orign: false, changeFlag: false, addUserType: false, modifyUserType: false, addSpecialUser: false };
  allSessionBusinessChecked = false;
  indeterminate = true;
  checkOptionsOne = [];
  tabsetJson = { currentNum: 0, param: '' };
  uid = '';
  searchSessionLogForm: FormGroup;
  beginDate = this.commonService.getDayWithAcross(0) + ' 00:00:00';
  endDate = this.commonService.getDayWithAcross(0) + ' 23:59:59';
  isSpinning = false;
  currentPanel = 'sessionLog';
  sessionLogFlag = 0;
  abnormalType = ''; // 异常回答
  sessionLogLevel = 'QA'; // 对话轮数
  currentTitle = '对话日志';
  currentSessionBusiness = []; // 对话日志下的类型
  checkDataOptions = {};
  sessionLogData = [{sessionDuration: '', color: false, sessionId: ''}];
  specialUserData = [];
  dataSpecialUser = {categoryId: '', content: '', specialUsers: [{uid: '', remark: '', createTime: ''}]};
  userTypeData = [{name: '', order: '', id: ''}];
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
  currentSessionLogId = ''; // 用于标记后查询当前页
  currentSessionLogFlag = ''; // 用于标记后查询当前页
  dateRange = [];
  staticParams: any;  // 保留上一次查询数据，区分是否
  checkFlag = {checked: false, id: '', ask: '',  businessAnswer: '', business: '', remark: ''};
  checkOrign = {
    allApp: false,
    allSdk: false,
    allApi: false,
    allTest: false,
    phone: {xiaowu: false,tingting: false,wotewode: false,},
    car: {botai: false,tongxingApi: false,tongxingSdk: false,tongxingTest: false,},
    watch: {weiteSdk: false,weiteTest: false,},
    robot: {xiaohaSdk: false,xiaohaTest: false,},
    other: {k11Api: false,k11Test: false,}
  };
  listOfOption1 = [];
  accountType = [];
  listOfOption2 = [];
  specialUserCategoryId = [];

  constructor(
    public commonService: CommonService,
    private sessionLogService: SessionLogService,
    private specialUserService: SpecialUserService,
    private modalService: NzModalService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private msg: NzMessageService,
    private routerParams: ActivatedRoute,
    private router: Router,
  ) {
    this.commonService.nav[8].active = true;
    this._initForm();
    this.checkDataOptions = {
      'sessionAnalysis': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }],
    };
    this.dateRange = [this.beginDate, this.endDate];
    this.checkOptionsOne = [
      { label: '闲聊', value: 'FREE_CHAT', checked: false },
      { label: '机票', value: 'FLIGHT', checked: false },
      { label: '火车', value: 'TRAIN', checked: false },
      { label: '酒店', value: 'HOTEL', checked: false },
      { label: '天气', value: 'WEATHER', checked: false },
      { label: '闪送', value: 'ERRAND', checked: false },
      { label: '电影', value: 'MOVIE', checked: false },
      { label: '星座', value: 'HOROSCOPE', checked: false },
      { label: '音乐', value: 'MUSIC', checked: false },
      { label: '新闻', value: 'NEWS', checked: false },
      { label: '导航打车', value: 'NAVICAR', checked: false },
      { label: '充话费', value: 'RECHARGE', checked: false },
      { label: '打电话', value: 'CALL', checked: false },
      { label: '提问', value: 'AIUI_CHAT', checked: false }
    ];
    this.listOfOption1 = [
      { label: '首批账户', value: 'ORIGINAL'},
      { label: '普通账户', value: 'GENERAL'},
      { label: '客户测试账户', value: 'CUSTOMER_TEST'},
      { label: '控制台测试', value: 'CONSOLE_TEST'},
      { label: '控制台自动测试', value: 'CONSOLE_AUTO_TEST'},
      { label: '其他账户', value: 'OTHER'}
    ];
  }

  ngOnInit() {
    const tabFlag = [{label: '对话日志', value: 'sessionLog'}];
    let targetFlag = 0;
    for (let i = 0; i < tabFlag.length; i++) {
      if (this.commonService.haveMenuPermission('children', tabFlag[i].label)) {targetFlag = i; break; }
    }
    console.log(tabFlag[targetFlag].value);
    this.loadData(tabFlag[targetFlag].value);
    this.changePanel(tabFlag[targetFlag].value);
    this.routerParams.queryParams.subscribe((params: ParamMap) => {
      if (params['uid'] && params['uid'] !== undefined) {
        this.showSomething('goUid', params['uid']);
      }
    });
    this.loadData('categoriesDropdown'); // 获取下拉数据
  }

  /**
   * 查询全部
   */
  private loadData(flag): void {
    this.isSpinning = true;
    if (flag === 'sessionLog' || flag === 'sessionLogSearch') {
      let id = 0;
      let pageFlag = '';
      if (flag === 'sessionLog') {
        if (this.doLastSessionLog) { id = this.lastSessionLogId; pageFlag = 'last'; }  // 下一页
        if (this.doFirstSessionLog) { id = this.firstSessionLogId; pageFlag = 'first'; }  // 上一页
      } else if (flag === 'sessionLogSearch') {
        // this.visiable.explain = false;
        this.changeSessionLogPage = 1;
        if (this.doLastSessionLog) { id = 0; pageFlag = 'last'; }  // 下一页
        if (this.doFirstSessionLog) { id = 0; pageFlag = 'first'; }  // 上一页
      }
      this.currentSessionLogId = id + ''; // 获取当前的id
      this.currentSessionLogFlag = pageFlag;  // 获取当前的翻页状态
      const logInput = {
        'start': this.beginDate,
        'end': this.endDate,
        'bots': this.chooseSessionBusiness(),
        'uid': this.uid,
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
        'accountType': this.accountType.toString(),
        'specialUserCategoryId': this.specialUserCategoryId.toString(),
        'pageFlag': pageFlag
      };
      console.log(logInput);
      this.staticParams = logInput; // 用于与切换上一页下一页时候进行比较
      this.sessionLogService.getSessionLogList(logInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.totalSessionLog = res.count;
          this.allSessionLogSize = Math.round(res.count / this.sessionLogPageSize);
          this.sessionLogData = JSON.parse(res.payload);
          for (let i = 0; i < this.sessionLogData.length - 1; i++) {
            this.sessionLogData[0].color = true;
            if (this.sessionLogData[i].sessionId === this.sessionLogData[i + 1].sessionId) {
              this.sessionLogData[i + 1].color = this.sessionLogData[i].color;
            } else { this.sessionLogData[i + 1].color = !this.sessionLogData[i].color; }
          }
          this.sessionLogData.forEach((item, index) => { item.sessionDuration = this.formatDuring(item.sessionDuration); });
          console.log(this.sessionLogData);
          if (this.sessionLogData.length > 0) {
            this.firstSessionLogId = JSON.parse(res.payload)[0].id;  // 最前面的Id
            this.lastSessionLogId = JSON.parse(res.payload)[JSON.parse(res.payload).length - 1].id;  // 最后面的Id
          } else {
            this.firstSessionLogId = 0;
            this.lastSessionLogId = 0;
          }
          const operationInput = { op_category: '对话分析', op_page: '对话日志' , op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.confirm({ nzTitle: '提示', nzContent: res.message }); }
      });
      this.doLastSessionLog = false;
      this.doFirstSessionLog = false;
    } else if (flag === 'currentSessionLog') {
      const logInput = {
        'start': this.beginDate,
        'end': this.endDate,
        'bots': this.chooseSessionBusiness(),
        'uid': this.uid,
        'ask': this.searchSessionLogForm.controls['ask'].value,
        'answer': this.searchSessionLogForm.controls['answer'].value,
        'flag': this.sessionLogFlag === 0 ? '' : this.sessionLogFlag === 1 ? true : false,
        'abnormalType': this.abnormalType,
        'intentionNum': this.searchSessionLogForm.controls['intentionNum'].value,
        'repetitionNum': this.searchSessionLogForm.controls['repetitionNum'].value,
        'cost': this.searchSessionLogForm.controls['cost'].value,
        'level': this.sessionLogLevel,
        'lastId': this.currentSessionLogId,
        'firstId': this.currentSessionLogId,
        'pageSize': this.sessionLogPageSize,
        'conpareFirst': this.conpareFirst,
        'conpareSecond': this.conpareSecond,
        'conpareThird': this.conpareThird,
        'accountType': this.accountType.toString(),
        'specialUserCategoryId': this.specialUserCategoryId.toString(),
        'pageFlag': this.currentSessionLogFlag
      };
      console.log(logInput);
      this.sessionLogService.getSessionLogList(logInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.totalSessionLog = res.count;
          this.allSessionLogSize = Math.round(res.count / this.sessionLogPageSize);
          this.sessionLogData = JSON.parse(res.payload);
          this.sessionLogData.forEach(item => { item.sessionDuration = this.formatDuring(item.sessionDuration); });
          console.log(this.sessionLogData);
          const operationInput = { op_category: '对话分析', op_page: '对话日志' , op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.confirm({ nzTitle: '提示', nzContent: res.message }); }
      });
      this.doLastSessionLog = false;
      this.doFirstSessionLog = false;
    } else if (flag === 'specialUser') {
      this.specialUserService.getSpecialUserList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.specialUserData = JSON.parse(res.payload);
          console.log(this.specialUserData);
          const operationInput = { op_category: '对话分析', op_page: '特殊用户' , op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.confirm({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'categories' || flag === 'categoriesDropdown') {
      this.specialUserService.getCategoriesList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.userTypeData = JSON.parse(res.payload);
          if (flag === 'categoriesDropdown') {
            this.userTypeData.forEach(item => {
              this.listOfOption2.push({ label: item.name, value: item.id });
            });
          }
          console.log(this.userTypeData);
        } else { this.modalService.confirm({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  getExcecl(flag) {
    if (flag === 'sessionLog') {
      const logInput = {
        'start': this.beginDate,
        'end': this.endDate,
        'bots': this.chooseSessionBusiness(),
        'uid': this.uid,
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
        'accountType': this.accountType.toString(),
        'specialUserCategoryId': this.specialUserCategoryId.toString(),
        'conpareThird': this.conpareThird
      };
      console.log(logInput);

      this.sessionLogService.getExcel(logInput).subscribe(res => {
        const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=UTF-8' });
        const a = document.createElement('a');
        a.id = 'tempId';
        document.body.appendChild(a);
        a.download = '对话日志' + this.datePipe.transform(new Date(), 'yyyy-MM-dd HH-mm-ss') + '.xlsx';
        a.href = URL.createObjectURL(blob);
        a.click();
        const tempA = document.getElementById('tempId');
        const operationInput = { op_category: '对话分析', op_page: '对话日志' , op_name: '导出Excel' };
        this.commonService.updateOperationlog(operationInput).subscribe();
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
      if (this.datePipe.transform(result[0], 'HH:mm:ss') === this.datePipe.transform(result[1], 'HH:mm:ss')) {
        this.beginDate = this.datePipe.transform(result[0], 'yyyy-MM-dd' + ' 00:00:00');
        this.endDate = this.datePipe.transform(result[1], 'yyyy-MM-dd' + ' 23:59:59');
      } else {
        this.beginDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss');
        this.endDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
      }
    }
    if (this.beginDate === null || this.endDate === null) {
      this.beginDate = this.commonService.getDayWithAcross(0) + ' 00:00:00';
      this.endDate = this.commonService.getDayWithAcross(0) + ' 23:59:59';
    }
  }

  private _initForm(): void {
    this.searchSessionLogForm = this.fb.group({ date: [''], bots: [''], uid: [''], ask: [''], answer: [''], flag: [''],
        abnormalType: [''], intentionNum: [''], repetitionNum: [''], cost: [''], level: [''], checkA: false, checkB: [],
        accountType: [''], specialUserCategoryId: ['']});
  }

  // 展开数据说明
  showSomething(flag, data) {
    if (flag === 'sessionLog') {
      this.visiable.sessionLogSearch = !this.visiable.sessionLogSearch;
    } else if (flag === 'explain') {
      this.visiable.explain = !this.visiable.explain;
    } else if (flag === 'orign') {
      this.visiable.orign = !this.visiable.orign;
    } else if (flag === 'changeFlag') {
      this.checkFlag.id = data.id;
      this.checkFlag.checked = true;
      this.checkFlag.ask = data.ask;
      this.checkFlag.businessAnswer = data.businessAnswer;
      this.checkFlag.business = data.business;
      console.log(this.checkFlag);
      this.visiable.changeFlag = !this.visiable.changeFlag;
    } else if (flag === 'addUserType') {
      this.visiable.addUserType ? this.userTypeData = [{name: '', order: '', id: ''}] : this.loadData('categories');
      this.visiable.addUserType = !this.visiable.addUserType;
    } else if (flag === 'modifyUserType') {
      this.visiable.modifyUserType ? this.userTypeData = [{name: '', order: '', id: ''}] : this.loadData('categories');
      this.visiable.modifyUserType = !this.visiable.modifyUserType;
    } else if (flag === 'addSpecialUser') {
      this.visiable.addSpecialUser ? null : this.loadData('categories');
      this.visiable.addSpecialUser = !this.visiable.addSpecialUser;
    } else if (flag === 'addUserTypeItem') {
      this.userTypeData.push({name: '', order: '', id: ''});
    } else if (flag === 'deleteUserTypeById' || flag === 'deleteSpecialUser') {
      this.modalService.confirm({ nzTitle: '提示', nzContent: '您确定要删除该信息？', nzOkText: '确定', nzOnOk: () => this.doDelete(data, flag) });
    } else if (flag === 'deleteUserType') {
      this.userTypeData.splice(data, 1);
    } else if (flag === 'goUid') {  // 查看对话日志
      console.log(data);
      this.uid = data;
      setTimeout(() => { this.loadData('sessionLogSearch'); }, 1000);
      this.tabsetJson.currentNum = 0;
    }
  }

  // 删除
  doDelete(id, flag) {
    if (flag === 'deleteUserTypeById') {
      this.specialUserService.deleteCategories(id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          this.loadData('categories');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'deleteSpecialUser') {
      this.specialUserService.deleteSpecialUser(id.replace(/\+/g, '%2B')  ).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          this.loadData('specialUser');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  // 切换面板
  changePanel(flag): void {
    if (flag !== this.currentPanel) { this.currentPanel = flag; this.loadData(flag); }
    this.currentTitle = flag === 'sessionLog' ? '对话日志' : flag === 'specialUser' ? '特殊用户' : '';
  }

  // 选择对话日志的业务类型
  chooseSessionBusiness() {
    const result = [];
    this.checkOptionsOne.forEach(item => {
      item.checked === true ? result.push(item.value) : '';
    });
    return result;
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

  /** 上一页 */
  lastPage(flag): void {
    delete this.staticParams.lastId;
    delete this.staticParams.firstId;
    delete this.staticParams.pageFlag;
    if (this.isObjectValueEqual(this.staticParams, this.getFreshParam())) { // 若条件没有改变，则可上一页
      this.changeSessionLogPage -= 1;
      this.doFirstSessionLog = true;
    } else {  // 若条件有改变，则默认查询回到第一页
      this.changeSessionLogPage = 1;
      this.doFirstSessionLog = false;
    }
    this.loadData(flag);
  }

  /** 下一页 */
  nextPage(flag): void {
    delete this.staticParams.lastId;
    delete this.staticParams.firstId;
    delete this.staticParams.pageFlag;
    if (this.isObjectValueEqual(this.staticParams, this.getFreshParam())) { // 若条件没有改变，则可下一页
      this.changeSessionLogPage += 1;
      this.doLastSessionLog = true;
    } else {  // 若条件有改变，则默认查询回到第一页
      this.changeSessionLogPage = 1;
      this.doLastSessionLog = false;
    }
    this.loadData(flag);
  }

  // 毫秒转 分 秒
  formatDuring(mss) {
    const minutes = Math.round(Number((mss % (1000 * 60 * 60)) / (1000 * 60)));
    const seconds = Math.round((mss % (1000 * 60)) / 1000);
    return minutes + '分钟' + seconds + '秒 ';
  }

  // 标记/不标记
  changeFlag(flag) {
    if (flag === 'sessionLog') {
      this.sessionLogService.updateSessionLog(this.checkFlag).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.visiable.changeFlag = false;
          this.loadData('currentSessionLog');
          const operationInput = { op_category: '对话分析', op_page: '对话日志' , op_name: '标记/不标记' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.confirm({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  // 全选
  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allSessionBusinessChecked) {
      this.checkOptionsOne = this.checkOptionsOne.map(item => { return { ...item, checked: true }; });
    } else {
      this.checkOptionsOne = this.checkOptionsOne.map(item => { return { ...item, checked: false }; });
    }
  }

  // 选择多选中其中某个
  updateSingleChecked(): void {
    if (this.checkOptionsOne.every(item => item.checked === false)) {
      this.allSessionBusinessChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked === true)) {
      this.allSessionBusinessChecked = true;
      this.indeterminate = false;
    } else { this.indeterminate = true; }
  }

  // 判断两个json对象是否相等
  isObjectValueEqual(obj1, obj2) {
    const o1 = obj1 instanceof Object;
    const o2 = obj2 instanceof Object;
    if (!o1 || !o2) { return obj1 === obj2; }
    if (Object.keys(obj1).length !== Object.keys(obj2).length) { return false; }
    for (var o in obj1) {
      const t1 = obj1[o] instanceof Object;
      const t2 = obj2[o] instanceof Object;
      if (t1 && t2) {
        if (obj1[o].toString() !== obj2[o].toString()) { return false; }
      } else if (obj1[o] !== obj2[o]) { return false; }
    }
    return true;
  }

  // 用于获取最新数据【少了lastId、firstId、pageFlag】
  getFreshParam() {
    const staticParams = {
      'start': this.beginDate, 'end': this.endDate, 'bots': this.chooseSessionBusiness(), 'uid': this.uid,
      'ask': this.searchSessionLogForm.controls['ask'].value, 'answer': this.searchSessionLogForm.controls['answer'].value,
      'flag': this.sessionLogFlag === 0 ? '' : this.sessionLogFlag === 1 ? true : false, 'abnormalType': this.abnormalType,
      'intentionNum': this.searchSessionLogForm.controls['intentionNum'].value, 'repetitionNum': this.searchSessionLogForm.controls['repetitionNum'].value,
      'cost': this.searchSessionLogForm.controls['cost'].value, 'level': this.sessionLogLevel, 'pageSize': this.sessionLogPageSize,
      'conpareFirst': this.conpareFirst, 'conpareSecond': this.conpareSecond, 'conpareThird': this.conpareThird,
    };
    return staticParams
  }

  // 新增操作
  doSave(flag): void {
    if (flag === 'addUserType') {
      // if (!this.verificationAdd('addUserType')) { return; }
      const arr = [];
      this.userTypeData.filter(item => item.id === '').forEach(item => {
        arr.push({name: item.name, order: item.order});
      });
      this.specialUserService.addCategories(arr).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          this.showSomething('addUserType', '');
          this.loadData('specialUser');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'modifyUserType') {
      // if (!this.verificationAdd('addUserType')) { return; }
      this.specialUserService.modifyCategories(this.userTypeData).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          this.showSomething('modifyUserType', '');
          this.loadData('specialUser');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'addSpecialUser') {
      const arr = [];
      this.dataSpecialUser.content.split('\n').forEach(item => {
        if (item !== '' && item.replace(/ /g,'') !== '') { arr.push(item); }
      });
      const finalArr = [];
      if (this.dataSpecialUser.categoryId === '') { this.msg.error('未选择特殊用户类型'); return; }
      if (arr.length === 0) { this.msg.error('输入的内容，不得为空'); return; }
      if (arr.every(item => item.indexOf(',') === -1)) { this.msg.error('输入的内容，有部分行没有逗号'); return; }
      if (arr.some(item => item.split(',')[0] === '')) { this.msg.error('输入的内容，逗号前不得为空'); return; }
      arr.forEach(item => {
        finalArr.push({
          uid: item.split(',')[0],
          remark: item.split(',')[1],
          createTime: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        });
      });
      const input = {
        categoryId: this.dataSpecialUser.categoryId,
        specialUsers: finalArr
      }
      console.log(input);
      this.specialUserService.addSpecialUser(input).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          this.showSomething('addSpecialUser', '');
          this.loadData('specialUser');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'refreshHistory') {
      this.specialUserService.refreshHistory().subscribe(res => {
        console.log(res);
        if (res.retcode === 0) {
          this.notification.blank( '提示', '更新成功', { nzStyle: { color : 'green' } });
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  getExcel(evt) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    let result = [];
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      result = (XLSX.utils.sheet_to_json(ws, {header: 1}));
      let arr = [];
      result.forEach(item => {
        if (item.toString() !== '') { arr.push([item[0], (item[1] === undefined ? '' : item[1])]); }
      });
      arr = this.unique(arr);
      arr.splice(0, 1).toString();
      console.log(arr);
      this.dataSpecialUser.content = this.dataSpecialUser.content.length > 0
        ? (this.dataSpecialUser.content + '\n' + arr.join('\n'))
        : (this.dataSpecialUser.content + arr.join('\n'));
      evt.target.value="" // 清空
    };
    reader.readAsBinaryString(target.files[0]);
  }

  // 去重
  unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) { result.push(elem); hash[elem] = true; }
    }
    return result;
  }

  // 跳转到对话日志
  goUid(data) {
    window.location.href = '/sessionAnalysis?uid=' + data.uid.replace(/\+/g, '%2B');
  }

}
