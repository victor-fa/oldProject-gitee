import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CommonService } from '../public/service/common.service';
import { ConsumerService } from '../public/service/consumer.service';
import { ClipboardService } from 'ngx-clipboard';
import * as XLSX from 'xlsx';

registerLocaleData(zh);

@Component({
  selector: 'app-consumer',
  templateUrl: './consumer.component.html',
  styleUrls: ['./consumer.component.scss']
})

export class ConsumerComponent implements OnInit {

  visiable = {addConsumer: false, modifyConsumer: false, modifySerial: false, addSerial: false, explain: false, voucher: false, addCallback: false, modifyCallback: false, };
  currentPanel = 'skill';
  consumerSearchForm: FormGroup;
  addConsumerForm: FormGroup;
  modifyConsumerForm: FormGroup;
  serialSearchForm: FormGroup;
  callbackSearchForm: FormGroup;
  consumerDate = { 'appChannel': '', 'appChannelName': '', 'robot': '', 'loginType': '1', 'paymentKey': '', 'smsSign': '', 'keys': '', 'phone': '', 'officially': false, 'available': '', 'maxSnActivation': '' };
  addSerialData = {};
  dataConsumer = []; // 客户
  dataSerial = [];
  isSpinning = false;
  serialData = {appChannel: ''};
  editSerialData = '';
  voucherInfo = {appChannel: '', appSecret: '', aesKey: '', aesIv: '', privateKey: '', };
  dataMsgArr = [{name: '机票', value: 1, checked: false}, {name: '火车', value: 2, checked: false}, {name: '酒店', value: 3, checked: false}, {name: '打车', value: 4, checked: false}, {name: '充话费', value: 5, checked: false}, {name: '星座', value: 6, checked: false}, {name: '电影票', value: 9, checked: false}, {name: '付费音频', value: 10, checked: false}, {name: '闪送', value: 8, checked: false}];
  orderTypeData = [];
  dataCallback = [];
  callbackData = {appChannel: '', orderType: '', callbackUrl: '', id: ''};
  pageNum = {
    dataConsumerPage: 1,
  };
  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private modalService: NzModalService,
    private consumerService: ConsumerService,
    private notification: NzNotificationService,
    private _clipboardService: ClipboardService
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
      const consumerInput = {available: this.consumerDate.available};
      this.consumerService.getConsumerList(consumerInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataConsumer = JSON.parse(res.payload);
          console.log(this.dataConsumer);
          const operationInput = { op_category: '客户管理', op_page: '客户管理', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'modifySerial') {
      const serialInput = { sn: this.serialSearchForm.controls['sn'].value, appChannel: this.serialData.appChannel };
      console.log(serialInput);
      this.consumerService.getSerialList(serialInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataSerial = JSON.parse(res.payload).data;
          console.log(this.dataSerial);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'voucher') {
      const voucherInput = { appChannel: this.voucherInfo.appChannel, };
      this.consumerService.getVoucher(voucherInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.voucherInfo = JSON.parse(res.payload);
          console.log(this.voucherInfo);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'orderType') {
      const orderTypeInput = { appChannel: this.consumerDate.appChannel, };
      this.consumerService.getOrderType(orderTypeInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.orderTypeData = JSON.parse(res.payload);
          this.orderTypeData.forEach(item => {
            this.dataMsgArr.forEach(cell => { item.orderType === cell.value ? cell.checked = true : null; });
          })
          console.log(this.orderTypeData);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'callback') {
      const orderTypeInput = { appChannel: this.consumerDate.appChannel, appChannelP: this.callbackSearchForm.controls['appChannel'].value, orderType: this.callbackSearchForm.controls['orderType'].value };
      this.consumerService.getCallback(orderTypeInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataCallback = JSON.parse(res.payload).content;
          console.log(this.dataCallback);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  private _initForm(): void {
    this.consumerSearchForm = this.fb.group({ userPhone: [''], jump: [''], skip: [''], site: [''], duration: [''], url: [''], expireTime: [''] });
    this.addConsumerForm = this.fb.group({ appChannel: [''], appChannelName: [''], robot: [''], paymentKey: [''], smsSign: [''], aaa: [''], keys: [''], phone: [''], officially: [''], maxSnActivation: [''] });
    this.modifyConsumerForm = this.fb.group({ paymentKey: [''], smsSign: [''], keys: [''], maxSnActivation: [''], officially: [''] });
    this.serialSearchForm = this.fb.group({ sn: [''] });
    this.callbackSearchForm = this.fb.group({ appChannel: [''], orderType: [''] });
  }

  // 弹窗
  showModal(flag, data) {
    if (flag === 'addConsumer') {
      this.visiable.addConsumer = true;
      this.consumerDate = { 'appChannel': '', 'appChannelName': '', 'robot': '', 'loginType': '1', 'paymentKey': '', 'smsSign': '', 'keys': '', 'phone': '', 'officially': false, 'available': '', 'maxSnActivation': '' };  // 清空
    } else if (flag === 'modifyConsumer') {
      this.consumerDate = { 'appChannel': '', 'appChannelName': '', 'robot': '', 'loginType': '1', 'paymentKey': '', 'smsSign': '', 'keys': '', 'phone': '', 'officially': false, 'available': '', 'maxSnActivation': '' };
      this.consumerDate = {
        appChannel: data.appChannel,
        appChannelName: data.appChannelName,
        robot: data.robot,
        loginType: data.loginType,
        paymentKey: data.paymentKey,
        smsSign: data.smsSignType,
        keys: '',
        phone: data.phone,
        officially: data.officially,
        available: '',
        maxSnActivation: data.maxSnActivation
      };
      console.log(this.consumerDate);
      this.loadData('orderType');
      this.visiable.modifyConsumer = true;
    } else if (flag === 'modifySerial') {
      this.serialData = data;
      this.loadData('modifySerial');
      this.visiable.modifySerial = true;
    } else if (flag === 'addSerial') {
      this.visiable.addSerial = true;
    } else if (flag === 'explain') {
      this.visiable.explain = true;
    } else if (flag === 'voucher') {
      this.voucherInfo.appChannel = data.appChannel;
      this.loadData('voucher');
      this.visiable.voucher = true;
    } else if (flag === 'deleteConsumer') {
      const res = data.data;
      const text = data.event.target.innerText;
      const activationInput = { id: res.appChannel, available: (text === '作废' ? false : true), phone: res.phone && res.phone !== '' ? res.phone : '15111407234' };
      this.consumerService.modifyAvailable(activationInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          this.loadData('consumer');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'addCallback') {
      this.visiable.addCallback = true;
    } else if (flag === 'modifyCallback') {
      this.callbackData = data;
      console.log(this.callbackData);
      this.visiable.modifyCallback = true;
    } else if (flag === 'deleteCallback') {
      this.modalService.confirm({ nzTitle: '提示', nzContent: '您确定要删除该信息？', nzOkText: '确定', nzOnOk: () => this.doDelete(data, flag) });
    }
  }

  // 隐藏
  hideModal(flag) {
    if (flag === 'addConsumer') {
      this.visiable.addConsumer = false;
    } else if (flag === 'modifyConsumer') {
      this.dataMsgArr.map(item => item.checked = false);
      this.visiable.modifyConsumer = false;
    } else if (flag === 'modifySerial') {
      this.visiable.modifySerial = false;
    } else if (flag === 'addSerial') {
      this.consumerDate = { 'appChannel': '', 'appChannelName': '', 'robot': '', 'loginType': '1', 'paymentKey': '', 'smsSign': '', 'keys': '', 'phone': '', 'officially': false, 'available': '', 'maxSnActivation': '' };
      this.visiable.addSerial = false;
    } else if (flag === 'explain') {
      this.visiable.explain = false;
    } else if (flag === 'voucher') {
      this.voucherInfo = {appChannel: '', appSecret: '', aesKey: '', aesIv: '', privateKey: '' };
      this.visiable.voucher = false;
    } else if (flag === 'addCallback') {
      this.callbackData = {appChannel: '', orderType: '', callbackUrl: '', id: ''};
      this.visiable.addCallback = false;
    } else if (flag === 'modifyCallback') {
      this.callbackData = {appChannel: '', orderType: '', callbackUrl: '', id: ''};
      this.visiable.modifyCallback = false;
    }
  }

  // 封装验证新增
  verificationAdd(flag): boolean {
    let result = true;
    if (flag === 'consumer') {
      const robot = this.addConsumerForm.controls['robot'].value;
      if (this.addConsumerForm.controls['appChannel'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '客户ID未填写' });
        result = false;
      } else if (this.addConsumerForm.controls['appChannelName'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '客户名称未填写' });
        result = false;
      } else if (robot === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: 'BOT配置文件ID未填写' });
        result = false;
      } else if (this.addConsumerForm.controls['phone'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '手机号码未填写' });
        result = false;
      } else if (!(/^\w{3,32}$/.test(robot))) {
        this.modalService.error({ nzTitle: '提示', nzContent: 'BBOT配置文件ID只允许出现下划线，a-zA-Z0-9' });
        result = false;
      } else if (this.addConsumerForm.controls['officially'].value === false) {
        if (this.addConsumerForm.controls['maxSnActivation'].value === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '激活次数未填写' });
          result = false;
        }
      }
    } else if (flag === 'addSerial') {
      if (this.consumerDate.keys === '' || this.consumerDate.keys.length === 0 || this.consumerDate.keys.replace(/ /g,'') === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '序列号不得为空' });
        result = false;
      }
    }
    return result;
  }

  // 新增操作
  doSave(flag): void {
    if (flag === 'addConsumer') {
      if (!this.verificationAdd('consumer')) { return; }
      const orderTypes = [];
      this.dataMsgArr.map(item => item.checked === true ? orderTypes.push(item.value) : null)
      const consumerInput = {
        'appChannel': this.addConsumerForm.controls['appChannel'].value,
        'appChannelName': this.addConsumerForm.controls['appChannelName'].value,
        'loginType': this.consumerDate.loginType,
        'robot': this.addConsumerForm.controls['robot'].value,
        'paymentKey': this.addConsumerForm.controls['paymentKey'].value,
        'smsSign': this.addConsumerForm.controls['smsSign'].value,
        'phone': this.addConsumerForm.controls['phone'].value,
        'officially': this.addConsumerForm.controls['officially'].value,
        'maxSnActivation': this.addConsumerForm.controls['officially'].value === true ? '3' : this.addConsumerForm.controls['maxSnActivation'].value,
        'orderTypes': orderTypes
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
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'modifyConsumer') {
      const orderTypes = [];
      this.dataMsgArr.map(item => item.checked === true ? orderTypes.push(item.value) : null)
      const consumerInput = {
        'flag': 'modify',
        'appChannel': this.consumerDate.appChannel,
        'paymentKey': this.modifyConsumerForm.controls['paymentKey'].value,
        'smsSign': this.modifyConsumerForm.controls['smsSign'].value,
        'phone': (this.consumerDate.phone === undefined ? '15111407234' : this.consumerDate.phone),
        'officially': this.consumerDate.officially,
        'maxSnActivation': this.consumerDate.officially === true ? '3' : this.modifyConsumerForm.controls['maxSnActivation'].value,
        'orderTypes': orderTypes
      };
      this.addPaymengSms(consumerInput);
    } else if (flag === 'addSerial') {
      if (!this.verificationAdd('addSerial')) { return; }
      let arr = [];
      this.consumerDate.keys.split('\n').forEach(item => {
        if (item !== '' && item.replace(/ /g,'') !== '') { arr.push(item); }
      });
      arr = this.unique(arr); // 去重
      const keysInput = { id: this.serialData.appChannel, keys: arr, };
      this.consumerService.addKey(keysInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          this.hideModal('addSerial');
          this.loadData('modifySerial');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'voucher') {
      const str = `【appChannel/appKey】${this.voucherInfo.appChannel}\n【appSecret】${this.voucherInfo.appSecret}\n【aesKey】${this.voucherInfo.aesKey}\n【aesIv】${this.voucherInfo.aesIv}\n【privateKey】${this.voucherInfo.privateKey}`;
      this._clipboardService.copyFromContent(str);
      this.notification.success( '提示', '复制成功', { nzStyle: { color : 'green' } });
    } else if (flag === 'addCallback') {
      this.consumerService.addCallback(this.callbackData).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          this.loadData('callback');
          this.hideModal('addCallback');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'modifyCallback') {
      const callbackInput = {id: this.callbackData.id, callbackUrl: this.callbackData.callbackUrl};
      this.consumerService.modifyCallback(callbackInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          this.loadData('callback');
          this.hideModal('modifyCallback');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  // 删除
  doDelete(id, flag) {
    if (flag === 'deleteCallback') {
      this.consumerService.deleteCallback(id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '客户管理', op_page: '回调地址', op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('callback');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
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
      const paymentInput = { id: data.appChannel, paymentKey: data.paymentKey };
      this.consumerService.addPayment(paymentInput).subscribe(res => {
        if (res.retcode !== 0) this.modalService.error({ nzTitle: '提示', nzContent: res.message });
      });
    }
    if (data.smsSign !== '' && data.smsSign !== undefined) {
      const smsInput = { id: data.appChannel, smsSign: data.smsSign };
      this.consumerService.addSms(smsInput).subscribe(res => {
        if (res.retcode !== 0) this.modalService.error({ nzTitle: '提示', nzContent: res.message });
      });
    }
    if (data.flag === undefined && data.orderTypes &&data.orderTypes.length > 0) { // 新增 禁用短信通知
      const orderInput = { id: data.appChannel, orderTypes: data.orderTypes };
      this.consumerService.addOrderType(orderInput).subscribe(res => {
        if (res.retcode !== 0) this.modalService.error({ nzTitle: '提示', nzContent: res.message });
      });
    }
    if (data.flag === 'modify' && data.orderTypes && data.orderTypes.length > 0) { // 修改 禁用短信通知
      let addArr = [];
      const modifyArr = [];
      this.dataMsgArr.forEach(item => {
        this.orderTypeData.forEach(cell => {
          if (item.value === cell.orderType) { modifyArr.push({ id: cell.id, usable: !item.checked }); }
        })
      })
      addArr = this.array_diff(this.dataMsgArr.filter(item => item.checked === true).map(item => item.value), this.orderTypeData.map(item => item.orderType));
      console.log(modifyArr);
      console.log(addArr);
      if (modifyArr.length > 0) { // 变化的
        this.consumerService.modifyOrderType(JSON.stringify(modifyArr)).subscribe(res => {
          if (res.retcode !== 0) this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        });
      }
      if (addArr.length > 0) {  // 剩下多出来的新增
        const orderInput = { id: data.appChannel, orderTypes: addArr };
        this.consumerService.addOrderType(orderInput).subscribe(res => {
          if (res.retcode !== 0) this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        });
      }
    }
    if (data.flag === 'modify' && data.officially === false && data.maxSnActivation !== '') { // 修改 且 测试key 且 最大值不为空
      const activationInput = { id: data.appChannel, maxSnActivation: data.maxSnActivation, phone: data.phone };
      this.consumerService.modifyActivation(activationInput).subscribe(res => {
        if (res.retcode !== 0) this.modalService.error({ nzTitle: '提示', nzContent: res.message });
      });
    }
    this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
    this.loadData('consumer');
    this.hideModal('modifyConsumer');
  }

  // 日期插件
  onChange(result, flag): void {
    if (flag === 'callback') {
      // if (result === []) { this.beginBaseInfoDate = ''; this.endBaseInfoDate = ''; return; }
      // if (result[0] !== '' || result[1] !== '') { this.beginBaseInfoDate = this.datePipe.transform(result[0], 'yyyy-MM-dd'); this.endBaseInfoDate = this.datePipe.transform(result[1], 'yyyy-MM-dd'); }
    } else if (flag === 'msgArr') {
      const checked = result.checked;
      const value = result.value;
      console.log(checked);
      console.log(value);
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
        if (item.toString() !== '') { arr.push(item); }
      });
      arr = this.unique(arr);
      arr.splice(0, 1).toString();
      this.consumerDate.keys = this.consumerDate.keys.length > 0 ? (this.consumerDate.keys + '\n' + arr.join('\n')) : (this.consumerDate.keys + arr.join('\n'));
      evt.target.value="" // 清空
    };
    reader.readAsBinaryString(target.files[0]);
  }

  // 保留两个数组公用元素
  array_diff(a, b) {
    for(var i=0; i<b.length; i++) {
      for(var j=0; j<a.length; j++) { if(a[j]==b[i]){ a.splice(j,1); j=j-1; } }
    }
    return a;
  }

  // 切换面板
  changePanel(flag): void {
    if (flag !== this.currentPanel) {this.loadData(flag); }
    this.currentPanel = flag;
    const operationInput = { op_category: '客户管理', op_page: flag === 'consumer' ? '客户管理' : flag === 'callback' ? '回调地址' : '', op_name: '访问' };
    this.commonService.updateOperationlog(operationInput).subscribe();
  }

}
