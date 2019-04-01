import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { IUserInfoItemOutput, SendMsgInput, UserSearchInput } from '../public/model/user.model';
import { CommonService } from '../public/service/common.service';
import { UserService } from '../public/service/user.service';
import { Router } from '@angular/router';
registerLocaleData(zh);

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  phoneNum = '';
  sendMsgForm: FormGroup;  // 发送短信表单
  sendScreenHeight = '';
  pageSize = 10;
  feedBackPageSize = 1000;
  feedbackInfo = [];
  oppositionInfo = [];
  agreeInfo = [];
  oppositionPageSize = 1000;
  agreePageSize = 1000;
  isFeedBackVisible = false;
  isOppositionVisible = false;
  isAgreeVisible = false;
  currentOppositionAgreeId = '';  // 弹框后的id
  tempFeedBack = {
    'words': '',
    'photo': '',
    'number': ''
  };
  tempOpposition = { session: '' };
  tempAgree = { session: '' };
  currentPanel = 'feedback';
  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private userService: UserService,
    private modalService: NzModalService,
    private notification: NzNotificationService,
  ) {
    this.commonService.nav[2].active = true;
    this._initSendMsgForm();
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
    }
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

  /* 显示发送提示 */
  showSendMsgModal(): void {
    const phoneNum = this.sendMsgForm.controls['phoneNum'].value;
    if (phoneNum === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '请填写手机号' });
      return;
    }
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: '确定发送验证码给该手机号：' + phoneNum + '的用户吗？',
      nzOkText: '确定',
      nzOnOk: () => this.doSendMsg()
    });
  }

  /* 发送短息 */
  doSendMsg(): void {
    const Base64 = require('js-base64').Base64;
    const phoneNum = 'Basic ' + Base64.encode(this.sendMsgForm.controls['phoneNum'].value);
    this.userService.sendMsg(phoneNum).subscribe(res => {
      if (res.retcode === 0) {
        this.modalService.success({ nzTitle: '获取成功', nzContent: '验证码为： ' + res.message, nzOkText: '知道了', });
      } else {
        this.modalService.error({ nzTitle: '提示', nzContent: res.message });
      }
    });
  }

  private _initSendMsgForm(): void {
    this.sendMsgForm = this.fb.group({
      phoneNum: [''],
    });
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

  // 切换面板
  changePanel(flag): void {
    // tslint:disable-next-line:no-unused-expression
    flag !== this.currentPanel ? this.loadData(flag) : 1;
    this.currentPanel = flag;
    const operationInput = {
      op_category: '客服中心',
      op_page: flag === 'feedback' ? '用户反馈' : flag === 'opposition' ? '点踩日志' : flag === 'agree' ? '点赞日志' : '',
      op_name: '访问'
    };
    this.commonService.updateOperationlog(operationInput).subscribe();
  }

}
