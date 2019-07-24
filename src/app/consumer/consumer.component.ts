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
  isModifyConsumerVisible = false;
  consumerSearchForm: FormGroup;
  addConsumerForm: FormGroup;
  modifyConsumerForm: FormGroup;
  consumerDate = { 'appChannel': '', 'appChannelName': '', 'robot': '', 'loginType': 0, 'paymentKey': '', 'smsSign': '' };
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
    const tabFlag = [{label: '客户管理', value: 'consumer'}];
    let targetFlag = 0;
    for (let i = 0; i < tabFlag.length; i++) {
      if (this.commonService.haveMenuPermission('children', tabFlag[i].label)) {targetFlag = i; break; }
    }
    console.log(tabFlag[targetFlag].value);
    this.loadData(tabFlag[targetFlag].value);
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
    // tslint:disable-next-line:max-line-length
    this.addConsumerForm = this.fb.group({ appChannel: [''], appChannelName: [''], robot: [''], paymentKey: [''], smsSign: [''], aaa: [''], keys: [''] });
    this.modifyConsumerForm = this.fb.group({ paymentKey: [''], smsSign: [''] });
  }

  // 弹窗
  showModal(flag, data) {
    if (flag === 'addConsumer') {
      this.isAddConsumerVisible = true;
      this.consumerDate = { 'appChannel': '', 'appChannelName': '', 'robot': '', 'loginType': 0, 'paymentKey': '', 'smsSign': '' };  // 清空
    } else if (flag === 'modifyConsumer') {
      this.consumerDate = { 'appChannel': '', 'appChannelName': '', 'robot': '', 'loginType': 0, 'paymentKey': '', 'smsSign': '' };
      this.consumerDate = {
        'appChannel': data.appChannel,
        'appChannelName': data.appChannelName,
        'robot': data.robot,
        'loginType': data.loginType,
        'paymentKey': data.paymentKey,
        'smsSign': data.smsSignType
      };
      this.isModifyConsumerVisible = true;
    }
  }

  // 隐藏
  hideModal(flag) {
    if (flag === 'addConsumer') {
      this.isAddConsumerVisible = false;
    } else if (flag === 'modifyConsumer') {
      this.isModifyConsumerVisible = false;
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
    if (flag === 'addConsumer') {
      if (!this.verificationAdd('consumer')) {
        return;
      }
      const consumerInput = {
        'appChannel': this.addConsumerForm.controls['appChannel'].value,
        'appChannelName': this.addConsumerForm.controls['appChannelName'].value,
        'loginType': this.consumerDate.loginType,
        'robot': this.addConsumerForm.controls['robot'].value,
        'paymentKey': this.addConsumerForm.controls['paymentKey'].value,
        'smsSign': this.addConsumerForm.controls['smsSign'].value,
        'keys': this.addConsumerForm.controls['keys'].value !== undefined ? this.addConsumerForm.controls['keys'].value.split('\n') : '',
      };

      this.consumerService.addConsumer(consumerInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '客户管理', op_page: '客户管理', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('addConsumer');
          this.loadData('consumer');
          setTimeout(() => {
            this.addPaymengSms(consumerInput);
          }, 3000);
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'modifyConsumer') {
      const consumerInput = {
        'appChannel': this.consumerDate.appChannel,
        'paymentKey': this.modifyConsumerForm.controls['paymentKey'].value,
        'smsSign': this.modifyConsumerForm.controls['smsSign'].value,
      };
      this.addPaymengSms(consumerInput);
    }
  }

  addPaymengSms(data) {
    if (data.paymentKey !== '' && data.paymentKey !== undefined) {
      const paymentInput = {
        id: data.appChannel,
        paymentKey: data.paymentKey,
      };
      this.consumerService.addPayment(paymentInput).subscribe(res => {
        if (res.retcode === 0) {
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
    if (data.smsSign !== '' && data.smsSign !== undefined) {
      const smsInput = {
        id: data.appChannel,
        smsSign: data.smsSign,
      };
      this.consumerService.addSms(smsInput).subscribe(res => {
        if (res.retcode === 0) {
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
    if (data.keys !== '' && data.keys !== undefined) {
      const keysInput = {
        id: data.appChannel,
        keys: data.keys,
      };
      this.consumerService.addKey(keysInput).subscribe(res => {
        if (res.retcode === 0) {
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
    this.loadData('consumer');
    this.hideModal('modifyConsumer');
  }

}
