import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CommonService } from '../public/service/common.service';
import { InvoiceService } from '../public/service/invoice.service';
import { UserService } from '../public/service/user.service';
import { LoggerService } from 'ng-zorro-antd/core/util/logger/logger.service';
registerLocaleData(zh);

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  visiable = {feedBack: false, opposition: false, agree: false, batchDownload: false, addProblem: false, editProblem: false, editStatus: false, replyUser: false, };
  pageSize = 10;
  feedbackInfo = [{'dialogues': [{msg: ''}], 'message': []}];
  problemInfo = [];
  dataProblem = {id: '', concreteProblems: '', name: '', sort: ''};
  oppositionInfo = [{'ask': [], 'answer': [], 'session': [{'cpsAnswer': '', 'businessAnswer': '', 'ask': ''}]}];
  agreeInfo = [];
  invoiceTimeInfo = [{'ask': [], 'answer': [], 'session': [{'cpsAnswer': '', 'businessAnswer': '', 'ask': ''}]}];
  invoiceLogInfo = [];
  businessInfo = [];
  currentOppositionAgreeId = '';  // 弹框后的id
  searchFeedBackForm: FormGroup;
  searchInvoiceTimeForm: FormGroup;
  searchInvoiceLogForm: FormGroup;
  searchBusinessForm: FormGroup;
  batchDownloadForm: FormGroup;
  oppositionSearchForm: FormGroup;
  agreeSearchForm: FormGroup;
  addProblemForm: FormGroup;
  editProblemForm: FormGroup;
  batchDownloadDate = { 'botName': '', 'number': '', 'estimate': '', 'date': '', 'userPhone': '' };
  tempFeedBack = { 'id': '', 'words': '', 'photo': '', 'number': '', 'status': 'SUBMITTED', 'dialogues': '', 'message': [], 'messageTemp': '' };
  tempOpposition = { session: '' };
  tempAgree = { session: '' };
  currentPanel = 'feedback';
  beginInvoiceTimeDate = '';
  endInvoiceTimeDate = '';
  beginInvoiceLogDate = '';
  endInvoiceLogDate = '';
  beginBusinessDate = '';
  endBusinessDate = '';
  beginBatchFirstDate = '';
  endBatchFirstDate = '';
  beginBatchSecondDate = '';
  endBatchSecondDate = '';
  beginOppositionDate = '';
  endOppositionDate = '';
  beginAgreeDate = '';
  endAgreeDate = '';
  beginFeedbackDate = '';
  endFeedbackDate = '';
  isSpinning = false;
  currentBatchSelected = '1';
  currentTabset = 0;
  currentAppHeader = '';
  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private userService: UserService,
    private modalService: NzModalService,
    private notification: NzNotificationService,
    private invoiceService: InvoiceService,
    private datePipe: DatePipe,
  ) {
    this.commonService.nav[2].active = true;
    this.currentAppHeader = this.commonService.currentChanelId;
    this._initForm();
  }

  ngOnInit() {
    const tabFlag = [{label: '用户反馈', value: 'feedback'}, {label: '点踩日志', value: 'opposition'},
        {label: '点赞日志', value: 'agree'}, {label: '开票时间管理', value: 'invoiceTime'},
        {label: '开票日志管理', value: 'invoiceLog'}, {label: '商务合作', value: 'business'}];
    let targetFlag = 0;
    for (let i = 0; i < tabFlag.length; i++) {
      if (this.commonService.haveMenuPermission('children', tabFlag[i].label)) {
        targetFlag = i;
        break;
      }
    }
    console.log(tabFlag[targetFlag].value);
    this.loadData(tabFlag[targetFlag].value);  // 反馈信息
    this.loadData('problem');
    this.changePanel(tabFlag[targetFlag].value);
    if (localStorage.getItem('batchDownload') !== undefined) {
      if (localStorage.getItem('batchDownload') === 'opposition') {
        this.changePanel('opposition');
        this.currentTabset = 1;
      } else if (localStorage.getItem('batchDownload') === 'agree') {
        this.changePanel('agree');
        this.currentTabset = 2;
      }
      localStorage.setItem('batchDownload', '');
    }
  }

  /**
   * 查询全部
   */
  private loadData(flag): void {
    this.isSpinning = true;
    if (flag === 'feedback') {
      const feedbackInput = {
        phone: this.searchFeedBackForm.controls['phone'].value,
        type: this.searchFeedBackForm.controls['type'].value,
        status: this.searchFeedBackForm.controls['status'].value,
        replyStatus: this.searchFeedBackForm.controls['replyStatus'].value,
        startDate: this.beginFeedbackDate,
        endDate: this.endFeedbackDate
      };
      this.userService.getFeedBackInfo(feedbackInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.feedbackInfo = JSON.parse(res.payload);
          this.feedbackInfo.forEach(item => {
            if (item.dialogues) {
              const arr = [];
              item.dialogues.forEach(cell => {
                if (cell.msg) { arr.push(cell.msg); }
              })
              item.message = arr;
            }
          });
          console.log(this.feedbackInfo);
          const operationInput = { op_category: '客服中心', op_page: '用户反馈' , op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.confirm({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'feedbackItem') {
      const feedbackInput = { id: this.tempFeedBack.id };
      this.userService.getFeedBackItem(feedbackInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.tempFeedBack = JSON.parse(res.payload)[0];
        } else { this.modalService.confirm({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'problem') {
      this.userService.getProblemInfo().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.problemInfo = JSON.parse(res.payload).reverse();
          console.log(this.problemInfo);
          const operationInput = { op_category: '客服中心', op_page: '用户反馈' , op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.confirm({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'opposition') {
      const oppositionInput = {
        userPhone: this.oppositionSearchForm.controls['userPhone'].value,
        startDate: this.beginOppositionDate,
        endDate: this.endOppositionDate
      };
      this.userService.getOppositionInfo(oppositionInput).subscribe(res => {
        console.log(res);
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.oppositionInfo = JSON.parse(res.payload);
          this.oppositionInfo.forEach(item => {
            if (item.session !== undefined) {
              const ask = [];
              const answer = [];
              item.session.forEach(cell => {
                if (cell.businessAnswer !== undefined) {  // 齐悟回答
                  ask.push(cell.businessAnswer);
                }
                if (cell.ask !== undefined) { // 子bot回答
                  answer.push(cell.ask);
                }
                if (cell.cpsAnswer !== undefined) { // 问
                  answer.push(cell.cpsAnswer);
                }
                item.ask = ask;
                item.answer = answer;
              });
            }
          });
          console.log(this.oppositionInfo);
          const operationInput = { op_category: '客服中心', op_page: '点踩日志' , op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.confirm({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'agree') {
      const agreeInput = {
        userPhone: this.agreeSearchForm.controls['userPhone'].value,
        startDate: this.beginAgreeDate,
        endDate: this.endAgreeDate
      };
      this.userService.getAgreeInfo(agreeInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.agreeInfo = JSON.parse(res.payload);
          this.agreeInfo.forEach(item => {
            if (item.session !== undefined) {
              const ask = [];
              const answer = [];
              item.session.forEach(cell => {
                if (cell.businessAnswer !== undefined) {  // 齐悟回答
                  ask.push(cell.businessAnswer);
                }
                if (cell.ask !== undefined) { // 子bot回答
                  answer.push(cell.ask);
                }
                if (cell.cpsAnswer !== undefined) { // 问
                  answer.push(cell.cpsAnswer);
                }
                item.ask = ask;
                item.answer = answer;
              });
            }
          });
          console.log(this.agreeInfo);
          const operationInput = { op_category: '客服中心', op_page: '点赞日志' , op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.confirm({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'invoiceTime') {
      const invoiceTimeInput = {
        minTime: this.beginInvoiceTimeDate,
        maxTime: this.endInvoiceTimeDate,
        orderId: this.searchInvoiceTimeForm.controls['orderId'].value,
        orderType: this.searchInvoiceTimeForm.controls['orderType'].value,
        phone: this.searchInvoiceTimeForm.controls['phone'].value,
      };
      this.invoiceService.getInvoiceTimeList(invoiceTimeInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.invoiceTimeInfo = JSON.parse(res.payload);
          const operationInput = { op_category: '客服中心', op_page: '开票时间管理' , op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          console.log(this.invoiceTimeInfo);
        } else { this.modalService.confirm({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'invoiceLog') {
      const invoiceTimeInput = {
        minTime: this.beginInvoiceLogDate,
        maxTime: this.endInvoiceLogDate,
        orderId: this.searchInvoiceLogForm.controls['orderId'].value,
        orderType: this.searchInvoiceLogForm.controls['orderType'].value,
        phone: this.searchInvoiceLogForm.controls['phone'].value,
      };
      this.invoiceService.getInvoiceLogList(invoiceTimeInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.invoiceLogInfo = JSON.parse(res.payload);
          const operationInput = { op_category: '客服中心', op_page: '开票管理日志' , op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          console.log(this.invoiceLogInfo);
        } else { this.modalService.confirm({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'business') {
      const businessInput = {
        startDate: this.beginBusinessDate,
        endDate: this.endBusinessDate,
        phone: this.searchBusinessForm.controls['phone'].value,
        content: this.searchBusinessForm.controls['content'].value,
        name: this.searchBusinessForm.controls['name'].value,
      };
      this.invoiceService.getBusinessList(businessInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.businessInfo = JSON.parse(res.payload);
          const operationInput = { op_category: '客服中心', op_page: '商务合作' , op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          console.log(this.businessInfo);
        } else { this.modalService.confirm({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  private _initForm(): void {
    this.searchFeedBackForm = this.fb.group({ replyStatus: [''], phone: [''], type: [''], status: [''], orderType: [''], orderId: [''], date: [''], });
    this.searchInvoiceTimeForm = this.fb.group({ phone: [''], orderType: [''], orderId: [''], date: [''], });
    this.searchInvoiceLogForm = this.fb.group({ phone: [''], orderType: [''], orderId: [''], date: [''], });
    this.searchBusinessForm = this.fb.group({ phone: [''], name: [''], content: [''], date: [''], });
    this.batchDownloadForm = this.fb.group({ number: [''], estimate: [''], date: [''], userPhone: [''], selected: [''] });
    this.oppositionSearchForm = this.fb.group({ userPhone: [''], date: [''] });
    this.agreeSearchForm = this.fb.group({ userPhone: [''], date: [''] });
    this.addProblemForm = this.fb.group({ name: [''], sort: [''], concreteProblems: [''] });
    this.editProblemForm = this.fb.group({ name: [''], sort: [''], concreteProblems: [''] });
  }

  doSave(flag) {
    if (flag === 'addProblem') {
      const name = this.addProblemForm.controls['name'].value;
      const sort = this.addProblemForm.controls['sort'].value;
      if (this.problemInfo.some(item => name === item.name)) {
        this.modalService.error({ nzTitle: '提示', nzContent: '问题类型不可重复' }); return;
      }
      if (this.problemInfo.some(item => Number(sort) ===  Number(item.sort))) {
        this.modalService.error({ nzTitle: '提示', nzContent: '问题排序不可重复' }); return;
      }
      const problemInput = {
        'name': name,
        'sort': sort,
        'concreteProblems': this.addProblemForm.controls['concreteProblems'].value.split('\n')
      };
      this.userService.addProblem(problemInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '客服中心', op_page: '反馈问题管理', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('addProblem');
          this.loadData('problem');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'editProblem') {
      const name = this.editProblemForm.controls['name'].value;
      const sort = this.editProblemForm.controls['sort'].value;
      const problemInput = {
        'id': this.dataProblem.id,
        'name': name,
        'sort': sort,
        'concreteProblems': this.editProblemForm.controls['concreteProblems'].value.split('\n')
      };
      this.userService.addProblem(problemInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '客服中心', op_page: '反馈问题管理', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('editProblem');
          this.dataProblem = {id: '', concreteProblems: '', name: '', sort: ''};
          this.loadData('problem');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'editStatus') {
      const statusInput = {
        'id': this.tempFeedBack.id,
        'status': this.tempFeedBack.status,
      };
      this.userService.editStatus(statusInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          this.hideModal('editStatus');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'editReply') {
      const replyInput = {
        'msg': this.tempFeedBack.messageTemp,
        'feedbackId': this.tempFeedBack.id,
      };
      this.userService.editReply(replyInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '回复成功', { nzStyle: { color : 'green' } });
          this.loadData('feedbackItem');
          this.hideModal('replyUser');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  showModal(data, flag) {
    if (flag === 'opposition') {
      this.visiable.opposition = true;
      this.tempOpposition = data;
      this.currentOppositionAgreeId = data.id;
    } else if (flag === 'batchDownload') {
      this.visiable.batchDownload = true;
    } else if (flag === 'feedBack') {
      this.tempFeedBack = data;
      console.log(this.tempFeedBack);
      this.tempFeedBack.status = data.status ? data.status : 'SUBMITTED';
      this.visiable.feedBack = true;
    } else if (flag === 'agree') {
      this.visiable.agree = true;
      this.tempAgree = data;
      this.currentOppositionAgreeId = data.id;
    } else if (flag === 'addProblem') {
      this.visiable.addProblem = true;
    } else if (flag === 'editProblem') {
      this.dataProblem = data;
      console.log(data);
      this.dataProblem.concreteProblems = data.concreteProblems.indexOf('\n') > -1 ? data.concreteProblems : data.concreteProblems.join('\n');
      this.visiable.editProblem = true;
    } else if (flag === 'deleteProblem') {
      this.modalService.confirm({ nzTitle: '提示', nzContent: '删除该问题类型，其下所有问题都会被删除，确认删除吗？', nzOkText: '确定', nzOnOk: () => this.doDelete(data.id, flag) });
    } else if (flag === 'editStatus') {
      this.visiable.editStatus = true;
    } else if (flag === 'replyUser') {
      this.visiable.replyUser = true;
    }
  }

  hideModal(flag) {
    if (flag === 'opposition') {
      this.visiable.opposition = false;
    } else if (flag === 'batchDownload') {
      this.visiable.batchDownload = false;
    } else if (flag === 'feedBack') {
      this.loadData('feedback');
      this.visiable.feedBack = false;
    } else if (flag === 'agree') {
      this.visiable.agree = false;
    } else if (flag === 'addProblem') {
      this.dataProblem = {id: '', concreteProblems: '', name: '', sort: ''};
      this.visiable.addProblem = false;
    } else if (flag === 'editProblem') {
      this.visiable.editProblem = false;
    } else if (flag === 'editStatus') {
      this.loadData('feedbackItem');
      this.visiable.editStatus = false;
    } else if (flag === 'replyUser') {
      this.visiable.replyUser = false;
    }
  }

  // 删除
  doDelete(data, flag) {
    if (flag === 'deleteProblem') {
      this.userService.deleteProblem(data).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '客服中心', op_page: '反馈问题管理', op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('problem');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  // 下载Excel模板
  getExcel(flag): void {
    if (flag === 'opposition' || flag === 'agree') {
      const estimate = flag === 'opposition' ? false : true;
      const fileName = flag === 'opposition' ? '点踩对话日志' : '点赞对话日志';
      this.userService.getExcel(this.currentOppositionAgreeId, estimate).subscribe(res => {
        const blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=UTF-8' });
        const a = document.createElement('a');
        a.id = 'tempId';
        document.body.appendChild(a);
        a.download = fileName + '.xls';
        a.href = URL.createObjectURL(blob);
        a.click();
        const tempA = document.getElementById('tempId');
        const operationInput = { op_category: '客服中心', op_page: fileName , op_name: '下载' };
        this.commonService.updateOperationlog(operationInput).subscribe();
        if (tempA) {
          tempA.parentNode.removeChild(tempA);
        }
      });
    } else {
      const fileName = this.currentPanel === 'opposition' ? '点踩对话日志' : '点赞对话日志';
      const estimate = this.currentPanel === 'opposition' ? false : true;
      let batchInput = {};
      if (this.currentBatchSelected === '1') {
        batchInput = {
          selected: 1,
          estimate: estimate,
          number: this.batchDownloadForm.controls['number'].value,
        };
      } else if (this.currentBatchSelected === '2') {
        batchInput = {
          selected: 2,
          estimate: estimate,
          startDate: this.beginBatchFirstDate,
          endDate: this.endBatchFirstDate,
        };
      } else if (this.currentBatchSelected === '3') {
        if (!this.verification('allDownload')) { return; }
        batchInput = {
          selected: 3,
          estimate: estimate,
          userPhone: this.batchDownloadForm.controls['userPhone'].value,
          startDate1: this.beginBatchSecondDate,
          endDate1: this.endBatchSecondDate,
        };
      }
      this.userService.getBatchExcel(batchInput).subscribe(result => {
        if (result.type === 'application/json') {
          this.modalService.confirm({ nzTitle: '提示', nzContent: '下载失败' });
        } else if (result.type === 'text/csv') {
          const blob = new Blob([result], { type: 'application/vnd.ms-excel;charset=UTF-8' });
          console.log(blob);
          const a = document.createElement('a');
          a.id = 'tempId';
          document.body.appendChild(a);
          a.download = fileName + '.csv';
          a.href = URL.createObjectURL(blob);
          a.click();
          const tempA = document.getElementById('tempId');
          const operationInput = { op_category: '客服中心', op_page: fileName , op_name: '下载' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          if (tempA) {
            tempA.parentNode.removeChild(tempA);
          }
        }
        localStorage.setItem('batchDownload', this.currentPanel === 'opposition' ? 'opposition' : 'agree');
        setTimeout(() => { window.location.reload(); }, 2000);
      });
    }
  }

  // 封装验证新增
  verification(flag): boolean {
    let result = true;
    if (flag === 'allDownload') {
      if (this.batchDownloadForm.controls['userPhone'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '用户账号未填写' });
        result = false;
      } else if (this.beginBatchSecondDate === '' || this.beginBatchSecondDate === null) {
        this.modalService.error({ nzTitle: '提示', nzContent: '时间范围未选择' });
        result = false;
      }
    }
    return result;
  }

  // 日期插件
  onChange(result, flag): void {
    if (flag === 'invoiceTime') {
      if (result === []) {
        this.beginInvoiceTimeDate = '';
        this.endInvoiceTimeDate = '';
        return;
      }
      if (result[0] !== '' || result[1] !== '') {
        this.beginInvoiceTimeDate = this.datePipe.transform(result[0], 'yyyy-MM-dd');
        this.endInvoiceTimeDate = this.datePipe.transform(result[1], 'yyyy-MM-dd');
      }
    } else if (flag === 'invoiceLog') {
      if (result === []) {
        this.beginInvoiceLogDate = '';
        this.endInvoiceLogDate = '';
        return;
      }
      if (result[0] !== '' || result[1] !== '') {
        this.beginInvoiceLogDate = this.datePipe.transform(result[0], 'yyyy-MM-dd');
        this.endInvoiceLogDate = this.datePipe.transform(result[1], 'yyyy-MM-dd');
      }
    } else if (flag === 'business') {
      if (result === []) {
        this.beginBusinessDate = '';
        this.endBusinessDate = '';
        return;
      }
      if (result[0] !== '' || result[1] !== '') {
        this.beginBusinessDate = this.datePipe.transform(result[0], 'yyyy-MM-dd 00:00:00');
        this.endBusinessDate = this.datePipe.transform(result[1], 'yyyy-MM-dd 23:59:59');
      }
    } else if (flag === 'batchDownloadFirst') {
      if (result === []) {
        this.beginBatchFirstDate = '';
        this.endBatchFirstDate = '';
        return;
      }
      if (result[0] !== '' || result[1] !== '') {
        this.beginBatchFirstDate = this.datePipe.transform(result[0], 'yyyy-MM-dd 00:00:00');
        this.endBatchFirstDate = this.datePipe.transform(result[1], 'yyyy-MM-dd 23:59:59');
      }
    } else if (flag === 'batchDownloadSecond') {
      if (result === []) {
        this.beginBatchSecondDate = '';
        this.endBatchSecondDate = '';
        return;
      }
      if (result[0] !== '' || result[1] !== '') {
        this.beginBatchSecondDate = this.datePipe.transform(result[0], 'yyyy-MM-dd 00:00:00');
        this.endBatchSecondDate = this.datePipe.transform(result[1], 'yyyy-MM-dd 23:59:59');
      }
    } else if (flag === 'searchOpposition') {
      if (result === []) {
        this.beginOppositionDate = '';
        this.endOppositionDate = '';
        return;
      }
      if (result[0] !== '' || result[1] !== '') {
        this.beginOppositionDate = this.datePipe.transform(result[0], 'yyyy-MM-dd 00:00:00');
        this.endOppositionDate = this.datePipe.transform(result[1], 'yyyy-MM-dd 23:59:59');
      }
    } else if (flag === 'searchAgree') {
      if (result === []) {
        this.beginAgreeDate = '';
        this.endAgreeDate = '';
        return;
      }
      if (result[0] !== '' || result[1] !== '') {
        this.beginAgreeDate = this.datePipe.transform(result[0], 'yyyy-MM-dd 00:00:00');
        this.endAgreeDate = this.datePipe.transform(result[1], 'yyyy-MM-dd 23:59:59');
      }
    } else if (flag === 'feedback') {
      if (result === []) {
        this.beginFeedbackDate = '';
        this.endFeedbackDate = '';
        return;
      }
      if (result[0] !== '' || result[1] !== '') {
        this.beginFeedbackDate = this.datePipe.transform(result[0], 'yyyy-MM-dd 00:00:00');
        this.endFeedbackDate = this.datePipe.transform(result[1], 'yyyy-MM-dd 23:59:59');
      }
    }
  }

  // 点击switch
  clickSwitch(data, flag) {
    if (flag === 'invoiceTime') {
      this.invoiceService.updateSwitch(data).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '客服中心', op_page: '开票时间管理', op_name: '启用/不启用' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
        this.loadData('invoiceTime');
      });
    }
  }

  // 切换面板
  changePanel(flag): void {
    if (flag !== this.currentPanel) { this.loadData(flag); }
    this.currentPanel = flag;
    const operationInput = { op_category: '客服中心', op_page: flag === 'feedback' ? '用户反馈' : flag === 'opposition' ? '点踩日志' : flag === 'agree' ? '点赞日志' : '', op_name: '访问' };
    this.commonService.updateOperationlog(operationInput).subscribe();
  }

}
