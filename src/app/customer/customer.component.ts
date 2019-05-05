import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CommonService } from '../public/service/common.service';
import { InvoiceService } from '../public/service/invoice.service';
import { UserService } from '../public/service/user.service';
registerLocaleData(zh);

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  sendScreenHeight = '';
  pageSize = 10;
  feedBackPageSize = 1000;
  feedbackInfo = [];
  oppositionInfo = [];
  agreeInfo = [];
  invoiceTimeInfo = [];
  invoiceLogInfo = [];
  oppositionPageSize = 1000;
  agreePageSize = 1000;
  isFeedBackVisible = false;
  isOppositionVisible = false;
  isAgreeVisible = false;
  currentOppositionAgreeId = '';  // 弹框后的id
  searchInvoiceTimeForm: FormGroup;
  searchInvoiceLogForm: FormGroup;
  tempFeedBack = {
    'words': '',
    'photo': '',
    'number': ''
  };
  tempOpposition = { session: '' };
  tempAgree = { session: '' };
  currentPanel = 'feedback';
  beginInvoiceTimeDate = '';
  endInvoiceTimeDate = '';
  beginInvoiceLogDate = '';
  endInvoiceLogDate = '';
  dateSearch = { 'Today': [new Date(), new Date()], 'This Month': [new Date(), new Date()] };
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
    this._initForm();
  }

  ngOnInit() {
    this.loadData('feedback');  // 反馈信息
    this.changePanel('feedback');
    this.sendScreenHeight = (window.screen.height - 524) + 'px';
  }

  /**
   * 查询全部
   */
  private loadData(flag): void {
    if (flag === 'feedback') {
      this.userService.getFeedBackInfo().subscribe(res => {
        if (res.payload !== '') {
          if (res.status === 200) {
            this.feedbackInfo = JSON.parse(res.payload).reverse();
            const operationInput = { op_category: '客服中心', op_page: '用户反馈' , op_name: '访问' };
            this.commonService.updateOperationlog(operationInput).subscribe();
          }
        } else {
          this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'opposition') {
      this.userService.getOppositionInfo().subscribe(res => {
        if (res.payload !== '') {
          if (res.status === 200) {
            this.oppositionInfo = JSON.parse(res.payload);
            const operationInput = { op_category: '客服中心', op_page: '点踩日志' , op_name: '访问' };
            this.commonService.updateOperationlog(operationInput).subscribe();
          }
        } else {
          this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'agree') {
      this.userService.getAgreeInfo().subscribe(res => {
        if (res.payload !== '') {
          if (res.status === 200) {
            this.agreeInfo = JSON.parse(res.payload);
            const operationInput = { op_category: '客服中心', op_page: '点赞日志' , op_name: '访问' };
            this.commonService.updateOperationlog(operationInput).subscribe();
          }
        } else {
          this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
        }
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
        if (res.payload !== '') {
          if (res.status === 200) {
            this.invoiceTimeInfo = JSON.parse(res.payload);
            const operationInput = { op_category: '客服中心', op_page: '开票时间管理' , op_name: '访问' };
            this.commonService.updateOperationlog(operationInput).subscribe();
            console.log(this.invoiceTimeInfo);
          }
        } else {
          this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
        }
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
        if (res.payload !== '') {
          if (res.status === 200) {
            this.invoiceLogInfo = JSON.parse(res.payload);
            const operationInput = { op_category: '客服中心', op_page: '开票管理日志' , op_name: '访问' };
            this.commonService.updateOperationlog(operationInput).subscribe();
            console.log(this.invoiceLogInfo);
          }
        } else {
          this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  private _initForm(): void {
    this.searchInvoiceTimeForm = this.fb.group({ phone: [''], orderType: [''], orderId: [''], date: [''], });
    this.searchInvoiceLogForm = this.fb.group({ phone: [''], orderType: [''], orderId: [''], date: [''], });
  }

  // 反馈详情
  showFeedbackInfo(data): void {
    this.isFeedBackVisible = true;
    this.tempFeedBack = data;
  }

  hideFeedBack(): void {
    this.isFeedBackVisible = false;
  }

  // 点踩详情
  showOppositionInfo(data): void {
    this.isOppositionVisible = true;
    this.tempOpposition = data;
    this.currentOppositionAgreeId = data.id;
  }

  hideOpposition(): void {
    this.isOppositionVisible = false;
  }

  // 点赞详情
  showAgreeInfo(data): void {
    this.isAgreeVisible = true;
    this.tempAgree = data;
    this.currentOppositionAgreeId = data.id;
  }

  hideAgree(): void {
    this.isAgreeVisible = false;
  }

  // 下载Excel模板
  getExcel(flag): void {
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
    }
  }

  // 点击switch
  clickSwitch(data, flag) {
    if (flag === 'invoiceTime') {
      console.log(data);
      this.invoiceService.updateSwitch(data).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '客服中心', op_page: '开票时间管理', op_name: '启用/不启用' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
        this.loadData('invoiceTime');
      });
    }
  }

  // 切换面板
  changePanel(flag): void {
    if (flag !== this.currentPanel) { this.loadData(flag); }
    this.currentPanel = flag;
    const operationInput = {
      op_category: '客服中心',
      op_page: flag === 'feedback' ? '用户反馈' : flag === 'opposition' ? '点踩日志' : flag === 'agree' ? '点赞日志' : '',
      op_name: '访问'
    };
    this.commonService.updateOperationlog(operationInput).subscribe();
  }

}
