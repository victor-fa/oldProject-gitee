import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CommonService } from '../public/service/common.service';
import { ConsumerService } from '../public/service/consumer.service';

registerLocaleData(zh);

@Component({
  selector: 'app-consumer',
  templateUrl: './consumer.component.html',
  styleUrls: ['./consumer.component.scss']
})

export class ConsumerComponent implements OnInit {

  isAddConsumerVisible = false;
  consumerSearchForm: FormGroup;
  addConsumerForm: FormGroup;
  consumerDate = { 'appChannel': '', 'appChannelName': '', 'robot': '', 'loginType': 0 };
  dataConsumer = []; // 客户
  isSpinning = false;

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private modalService: NzModalService,
    private consumerService: ConsumerService,
    private notification: NzNotificationService,
  ) {
    this.commonService.nav[9].active = true;
    this._initForm();
  }

  ngOnInit() {
    this.loadData('consumer');
  }

  loadData(flag) {
    this.isSpinning = true;
    if (flag === 'consumer') {
      this.consumerService.getConsumerList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataConsumer = JSON.parse(res.payload);
          console.log(this.dataConsumer);
          const operationInput = { op_category: '客户管理', op_page: '客户管理', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  private _initForm(): void {
    // tslint:disable-next-line:max-line-length
    this.consumerSearchForm = this.fb.group({ userPhone: [''], jump: [''], skip: [''], site: [''], duration: [''], url: [''], expireTime: [''] });
    this.addConsumerForm = this.fb.group({ appChannel: [''], appChannelName: [''], robot: [''] });
  }

  // 新增内容 - 弹窗
  showAddModal(flag) {
    if (flag === 'consumer') {
      this.isAddConsumerVisible = true;
      this.consumerDate = { 'appChannel': '', 'appChannelName': '', 'robot': '', 'loginType': 0 };  // 清空
    }
  }

  // 隐藏
  hideAddModal(flag) {
    if (flag === 'consumer') {
      this.isAddConsumerVisible = false;
    }
  }

  // 封装验证新增
  verificationAdd(flag): boolean {
    let result = true;
    if (flag === 'consumer') {
      if (this.addConsumerForm.controls['appChannel'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '客户ID未填写' });
        result = false;
      } else if (this.addConsumerForm.controls['appChannelName'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '客户名称未填写' });
        result = false;
      } else if (this.addConsumerForm.controls['robot'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: 'BOT名称未填写' });
        result = false;
      }
    }
    return result;
  }

  // 新增操作
  doSave(flag): void {
    if (flag === 'consumer') {
      if (!this.verificationAdd('consumer')) {
        return;
      }
      const consumerInput = {
        'appChannel': this.addConsumerForm.controls['appChannel'].value,
        'appChannelName': this.addConsumerForm.controls['appChannelName'].value,
        'loginType': this.consumerDate.loginType,
        'robot': this.addConsumerForm.controls['robot'].value,
      };
      this.consumerService.addConsumer(consumerInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '客户管理', op_page: '客户管理', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideAddModal('consumer');
          this.loadData('consumer');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

}
