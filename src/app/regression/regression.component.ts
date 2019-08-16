import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CommonService } from '../public/service/common.service';
import * as XLSX from 'xlsx';
import { RegressionService } from '../public/service/regression.service';

registerLocaleData(zh);

@Component({
  selector: 'app-regression',
  templateUrl: './regression.component.html',
  styleUrls: ['./regression.component.scss']
})

export class RegressionComponent implements OnInit {

  visiable = {addRegression: false, modifyRegression: false, modifySerial: false, addSerial: false, };
  regressionSearchForm: FormGroup;
  addRegressionForm: FormGroup;
  modifyRegressionForm: FormGroup;
  serialSearchForm: FormGroup;
  regressionDate = { 'appChannel': '', 'appChannelName': '', 'robot': '', 'loginType': 0, 'paymentKey': '', 'smsSign': '', keys: '' };
  addSerialData = {};
  dataRegression = []; // 客户
  dataSerial = [];
  isSpinning = false;
  serialData = {appChannel: ''};
  editSerialData = '';

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private modalService: NzModalService,
    private regressionService: RegressionService,
    private notification: NzNotificationService,
  ) {
    this.commonService.nav[9].active = true;
    this._initForm();
  }

  ngOnInit() {
    const tabFlag = [{label: '客户管理', value: 'regression'}];
    let targetFlag = 0;
    for (let i = 0; i < tabFlag.length; i++) {
      if (this.commonService.haveMenuPermission('children', tabFlag[i].label)) {targetFlag = i; break; }
    }
    console.log(tabFlag[targetFlag].value);
    this.loadData(tabFlag[targetFlag].value);
  }

  loadData(flag) {
    this.isSpinning = true;
    if (flag === 'regression') {
      // this.regressionService.getRegressionList().subscribe(res => {
      //   if (res.retcode === 0 && res.status === 200) {
      //     this.isSpinning = false;
      //     this.dataRegression = JSON.parse(res.payload);
      //     console.log(this.dataRegression);
      //     const operationInput = { op_category: '客户管理', op_page: '客户管理', op_name: '访问' };
      //     this.commonService.updateOperationlog(operationInput).subscribe();
      //   } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      // });
    } else if (flag === 'modifySerial') {
      const serialInput = {
        sn: this.serialSearchForm.controls['sn'].value,
        appChannel: this.serialData.appChannel
      };
      console.log(serialInput);
      // this.regressionService.getSerialList(serialInput).subscribe(res => {
      //   if (res.retcode === 0 && res.status === 200) {
      //     this.isSpinning = false;
      //     this.dataSerial = JSON.parse(res.payload).data;
      //     console.log(this.dataSerial);
      //   } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      // });
    }
  }

  private _initForm(): void {
    this.regressionSearchForm = this.fb.group({ userPhone: [''], jump: [''], skip: [''], site: [''], duration: [''], url: [''], expireTime: [''] });
    this.addRegressionForm = this.fb.group({ appChannel: [''], appChannelName: [''], robot: [''], paymentKey: [''], smsSign: [''], aaa: [''], keys: [''] });
    this.modifyRegressionForm = this.fb.group({ paymentKey: [''], smsSign: [''], keys: [''] });
    this.serialSearchForm = this.fb.group({ sn: [''] });
  }

  // 弹窗
  showModal(flag, data) {
    if (flag === 'addRegression') {
      this.visiable.addRegression = true;
      this.regressionDate = { 'appChannel': '', 'appChannelName': '', 'robot': '', 'loginType': 0, 'paymentKey': '', 'smsSign': '', 'keys': '' };  // 清空
    } else if (flag === 'modifyRegression') {
      this.regressionDate = { 'appChannel': '', 'appChannelName': '', 'robot': '', 'loginType': 0, 'paymentKey': '', 'smsSign': '', 'keys': '' };
      this.regressionDate = {
        appChannel: data.appChannel,
        appChannelName: data.appChannelName,
        robot: data.robot,
        loginType: data.loginType,
        paymentKey: data.paymentKey,
        smsSign: data.smsSignType,
        keys: ''
      };
      this.visiable.modifyRegression = true;
    } else if (flag === 'modifySerial') {
      this.serialData = data;
      this.loadData('modifySerial');
      this.visiable.modifySerial = true;
    } else if (flag === 'addSerial') {
      this.visiable.addSerial = true;
    }
  }

  // 隐藏
  hideModal(flag) {
    if (flag === 'addRegression') {
      this.visiable.addRegression = false;
    } else if (flag === 'modifyRegression') {
      this.visiable.modifyRegression = false;
    } else if (flag === 'modifySerial') {
      this.visiable.modifySerial = false;
    } else if (flag === 'addSerial') {
      this.regressionDate = { 'appChannel': '', 'appChannelName': '', 'robot': '', 'loginType': 0, 'paymentKey': '', 'smsSign': '', keys: '' };
      this.visiable.addSerial = false;
    }
  }

  // 封装验证新增
  verificationAdd(flag): boolean {
    let result = true;
    if (flag === 'regression') {
      if (this.addRegressionForm.controls['appChannel'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '客户ID未填写' });
        result = false;
      } else if (this.addRegressionForm.controls['appChannelName'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '客户名称未填写' });
        result = false;
      } else if (this.addRegressionForm.controls['robot'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: 'BOT名称未填写' });
        result = false;
      }
    } else if (flag === 'addSerial') {
      if (this.regressionDate.keys === '' || this.regressionDate.keys.length === 0 || this.regressionDate.keys.replace(/ /g,'') === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '序列号不得为空' });
        result = false;
      }
    }
    return result;
  }

  // 新增操作
  doSave(flag): void {
    if (flag === 'addRegression') {
      if (!this.verificationAdd('regression')) { return; }
      const regressionInput = {
        'appChannel': this.addRegressionForm.controls['appChannel'].value,
        'appChannelName': this.addRegressionForm.controls['appChannelName'].value,
        'loginType': this.regressionDate.loginType,
        'robot': this.addRegressionForm.controls['robot'].value,
        'paymentKey': this.addRegressionForm.controls['paymentKey'].value,
        'smsSign': this.addRegressionForm.controls['smsSign'].value,
        // 临时
        // 'keys': this.addRegressionForm.controls['keys'].value !== undefined ? this.addRegressionForm.controls['keys'].value.split('\n') : '',
      };

      this.regressionService.addRegression(regressionInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '客户管理', op_page: '客户管理', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('addRegression');
          this.loadData('regression');
          setTimeout(() => {
            this.addPaymengSms(regressionInput);
          }, 3000);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'modifyRegression') {
      const regressionInput = {
        'appChannel': this.regressionDate.appChannel,
        'paymentKey': this.modifyRegressionForm.controls['paymentKey'].value,
        'smsSign': this.modifyRegressionForm.controls['smsSign'].value,
        // 临时
        // 'keys': this.modifyRegressionForm.controls['keys'].value !== undefined ? this.modifyRegressionForm.controls['keys'].value.split('\n') : '',
      };
      this.addPaymengSms(regressionInput);
    } else if (flag === 'addSerial') {
      if (!this.verificationAdd('addSerial')) { return; }
      let arr = [];
      this.regressionDate.keys.split('\n').forEach(item => {
        if (item !== '' && item.replace(/ /g,'') !== '') { arr.push(item); }
      });
      arr = this.unique(arr); // 去重
      const keysInput = { id: this.serialData.appChannel, keys: arr, };
      // this.regressionService.addKey(keysInput).subscribe(res => {
      //   if (res.retcode === 0) {
      //     this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
      //     this.hideModal('addSerial');
      //   } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      // });
    }
  }

  // 去重
  unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) { result.push(elem); hash[elem] = true; }
    }
    return result;
  }

  addPaymengSms(data) {
    if (data.paymentKey !== '' && data.paymentKey !== undefined) {
      const paymentInput = {
        id: data.appChannel,
        paymentKey: data.paymentKey,
      };
      // this.regressionService.addPayment(paymentInput).subscribe(res => {
      //   if (res.retcode === 0) {
      //   } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      // });
    }
    if (data.smsSign !== '' && data.smsSign !== undefined) {
      const smsInput = {
        id: data.appChannel,
        smsSign: data.smsSign,
      };
      // this.regressionService.addSms(smsInput).subscribe(res => {
      //   if (res.retcode === 0) {
      //   } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      // });
    }
    // 临时
    // if (data.keys !== '' && data.keys !== undefined) {
    //   const keysInput = {
    //     id: data.appChannel,
    //     keys: data.keys,
    //   };
    //   this.regressionService.addKey(keysInput).subscribe(res => {
    //     if (res.retcode === 0) {
    //     } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
    //   });
    // }
    this.loadData('regression');
    this.hideModal('modifyRegression');
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
        if (item.toString() !== '') { arr.push(item); }
      });
      arr = this.unique(arr);
      arr.splice(0, 1).toString();
      this.regressionDate.keys = this.regressionDate.keys.length > 0 ? (this.regressionDate.keys + '\n' + arr.join('\n')) : (this.regressionDate.keys + arr.join('\n'));
      evt.target.value="" // 清空
    };
    reader.readAsBinaryString(target.files[0]);
  }

}
