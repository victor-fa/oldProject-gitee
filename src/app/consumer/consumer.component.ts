import { registerLocaleData, DatePipe } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService, NzNotificationService, UploadFile, NzMessageService } from 'ng-zorro-antd';
import { CommonService } from '../public/service/common.service';
import { ConsumerService } from '../public/service/consumer.service';
import { ClipboardService } from 'ngx-clipboard';
import * as XLSX from 'xlsx';
import { MusicService } from '../public/service/music.service';
import { BluetoothService } from '../public/service/bluetooth.service';
import { HttpRequest, HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { ConsumerAccountService } from '../public/service/consumerAccount.service';

registerLocaleData(zh);

@Component({
  selector: 'app-consumer',
  templateUrl: './consumer.component.html',
  styleUrls: ['./consumer.component.scss']
})

export class ConsumerComponent implements OnInit {

  visiable = {addConsumer: false, modifyConsumer: false, modifySerial: false, addSerial: false, deleteSerial: false, explain: false, voucher: false, addCallback: false, modifyCallback: false, serialBatch: false, addSerialBatch: false, modifySerialBatch: false, deleteSerialResult: false, addMusic: false, modifyMusic: false, addBluetooth: false, modifyBluetooth: false, addAccount: false, modifyAccount: false, recharge: false, capital: false };
  currentPanel = 'skill';
  consumerSearchForm: FormGroup;
  addConsumerForm: FormGroup;
  modifyConsumerForm: FormGroup;
  serialSearchForm: FormGroup;
  callbackSearchForm: FormGroup;
  serialBatchSearchForm: FormGroup;
  musicSearchForm: FormGroup;
  bluetoothSearchForm: FormGroup;
  accountSearchForm: FormGroup;
  capitalSearchForm: FormGroup;
  consumerDate = { 'appChannel': '', 'appChannelName': '', 'robot': '', 'loginType': '1', 'paymentKey': '', 'smsSign': '', 'keys': '', 'phone': '', 'officially': false, 'available': '', 'maxSnActivation': '', 'needGuestKey': false };
  addSerialData = {};
  dataConsumer = []; // 客户
  dataSerial = [];
  dataSerialBatch = [];
  dataBluetooth = [];
  dataAccount = [];
  dataCapital = [];
  dataMusic = [];
  serialBatchData = { appChannel: '', name: '', type: '', id: '' };
  isSpinning = false;
  serialData = {appChannelId: '', groupId: ''};
  musicData = {appChannel: '', useSDK: false, xiaoWu: false, koudaiAccess: false, lanRenAccess: false, musicAccess: false, xmlyAccess: false};
  bluetoothData = {id: '', customerName: '', deviceType: '', functionDesc: '', deviceIcon1: '', deviceIcon2: '', deviceIcon3: '', logo: '', supportBle: '', fileLogo: [], fileIcon1: [], fileIcon2: [], fileIcon3: [], currentImage: '', deviceTypeList: [], newDeviceType: '' };
  accountData = {customerId: '', customerIds: [], email: '', phoneNum: '18682233554', code: '', balanceThresholds: '', countDown: 60, recharge: '', accountBalance: '' };
  editSerialData = '';
  voucherInfo = {appChannel: '', appSecret: '', aesKey: '', aesIv: '', privateKey: '', };
  dataMsgArr = [{name: '机票', value: 0, checked: false}, {name: '机票', value: 1, checked: false}, {name: '火车', value: 2, checked: false}, {name: '酒店', value: 3, checked: false}, {name: '打车', value: 4, checked: false}, {name: '充话费', value: 5, checked: false}, {name: '星座', value: 6, checked: false}, {name: '电影票', value: 9, checked: false}, {name: '付费音频', value: 10, checked: false}, {name: '闪送', value: 8, checked: false}];
  orderTypeData = [];
  dataCallback = [];
  callbackData = {appChannel: '', orderType: '', callbackUrl: '', id: ''};
  pageNum = { dataConsumerPage: 1 };
  dateRange = [];
  serialBatchStartDate = null;
  serialBatchEndDate = null;
  capitalStartDate = null;
  capitalEndDate = null;
  orderTypeItem = [
    {key: 'FLIGHT_RETURN_ORDER', value: '机票', visiable: true},
    {key: 'TRAIN_ORDER', value: '火车', visiable: true},
    {key: 'HOTEL_ORDER', value: '酒店', visiable: true},
    {key: 'TAXI_ORDER', value: '打车', visiable: true},
    {key: 'EXPRESS_ORDER', value: '闪送', visiable: true},
    {key: 'PHONE_CHARGE_ORDER', value: '充话费', visiable: true},
    {key: 'MOVIE_ORDER', value: '电影票', visiable: true},
    {key: 'MUSIC_ORDER', value: '付费音频', visiable: true},
    {key: 'JIAOYOU_GAME_ORDER', value: '交游天下游戏', visiable: true}
  ];
  deleteSerialResult = { successSns: '', failSns: '' };
  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private modalService: NzModalService,
    private consumerService: ConsumerService,
    private musicService: MusicService,
    private bluetoothService: BluetoothService,
    private consumerAccountService: ConsumerAccountService,
    private msg: NzMessageService,
    private notification: NzNotificationService,
    private http: HttpClient,
    private _clipboardService: ClipboardService,
    private datePipe: DatePipe,
  ) {
    this.commonService.nav[9].active = true;
    this._initForm();
  }

  ngOnInit() {
    const tabFlag = [{label: '客户管理', value: 'consumer'}, {label: '回调地址', value: 'callback'}, {label: '音频管理 ', value: 'music'}, {label: '蓝牙设备', value: 'bluetooth'}, {label: '客户账户', value: 'account'}];
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
          setTimeout(() => {
            if (this.consumerDate.appChannel !== '') {
              console.log(1);
              this.dataConsumer = this.dataConsumer.filter(item => item.appChannel.indexOf(this.consumerDate.appChannel) > -1 );
            }
            if (this.consumerDate.appChannelName !== '') {
              console.log(2);
              this.dataConsumer = this.dataConsumer.filter(item => item.appChannelName.indexOf(this.consumerDate.appChannelName) > -1  );
            }
            console.log(this.dataConsumer);
          }, 200);
          const operationInput = { op_category: '客户管理', op_page: '客户管理', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'modifySerial') {
      const serialInput = { sn: this.serialSearchForm.controls['sn'].value, appChannel: this.serialData.appChannelId, groupId: this.serialData.groupId };
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
    } else if (flag === 'serialBatch') {
      const input = { appChannel: this.serialBatchData.appChannel, groupName: this.serialBatchSearchForm.controls['groupName'].value };
      this.consumerService.getSerialBatch(input).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataSerialBatch = JSON.parse(res.payload);
          console.log(this.dataSerialBatch);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'music') {
      const input = { appChannel: this.musicSearchForm.controls['appChannel'].value };
      this.musicService.getMusicList(input).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          if (res.message === 'SUCCESS') {
            this.dataMusic.length = 0;
            this.dataMusic[0] = JSON.parse(res.payload);
          } else {
            this.dataMusic = JSON.parse(res.message);
          }
          console.log(this.dataMusic);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'bluetooth') {
      const input = { customerName: this.bluetoothSearchForm.controls['customerName'].value, deviceType: this.bluetoothSearchForm.controls['deviceType'].value };
      this.bluetoothService.getBluetoothList(input).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataBluetooth = JSON.parse(res.payload).reverse();
          console.log(this.dataBluetooth);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'deviceType') {
      this.bluetoothService.getDeviceTypeList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.bluetoothData.deviceTypeList = JSON.parse(res.payload);
          console.log(this.bluetoothData);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'account') {
      const input = { customerId: this.accountSearchForm.controls['customerId'].value, customerName: this.accountSearchForm.controls['customerName'].value };
      this.consumerAccountService.getConsumerAccountList(input).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataAccount = JSON.parse(res.payload).reverse();
          console.log(this.dataAccount);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'customerId') {
      this.consumerAccountService.getCustomerIdList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.accountData.customerIds = JSON.parse(res.payload);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'capital') {
      const input = {
        customerId: this.accountData.customerId,
        orderType: this.capitalSearchForm.controls['orderType'].value,
        timeStart: this.capitalStartDate,
        timeEnd: this.capitalEndDate,
      };
      this.consumerAccountService.getCapitalList(input).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataCapital = JSON.parse(res.payload);
          console.log(this.dataCapital);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  private _initForm(): void {
    this.consumerSearchForm = this.fb.group({ userPhone: [''], jump: [''], skip: [''], site: [''], duration: [''], url: [''], expireTime: [''] });
    this.addConsumerForm = this.fb.group({ appChannel: [''], appChannelName: [''], robot: [''], paymentKey: [''], smsSign: [''], aaa: [''], keys: [''], phone: [''], officially: [''], maxSnActivation: [''], needGuestKey: [''] });
    this.modifyConsumerForm = this.fb.group({ paymentKey: [''], smsSign: [''], keys: [''], maxSnActivation: [''], officially: [''], needGuestKey: [''] });
    this.serialSearchForm = this.fb.group({ sn: [''] });
    this.callbackSearchForm = this.fb.group({ appChannel: [''], orderType: [''] });
    this.serialBatchSearchForm = this.fb.group({ groupName: [''] });
    this.musicSearchForm = this.fb.group({ appChannel: [''], aaa: [''], date: [''] });
    this.bluetoothSearchForm = this.fb.group({ customerName: [''], deviceType: [''] });
    this.accountSearchForm = this.fb.group({ customerId: [''], customerName: [''] });
    this.capitalSearchForm = this.fb.group({ orderType: [''], date: [''] });
  }

  // 弹窗
  showModal(flag, data) {
    if (flag === 'addConsumer') {
      this.visiable.addConsumer = true;
      this.consumerDate = { 'appChannel': '', 'appChannelName': '', 'robot': '', 'loginType': '1', 'paymentKey': '', 'smsSign': '', 'keys': '', 'phone': '', 'officially': false, 'available': '', 'maxSnActivation': '', 'needGuestKey': false };  // 清空
    } else if (flag === 'modifyConsumer') {
      this.consumerDate = { 'appChannel': '', 'appChannelName': '', 'robot': '', 'loginType': '1', 'paymentKey': '', 'smsSign': '', 'keys': '', 'phone': '', 'officially': false, 'available': '', 'maxSnActivation': '', 'needGuestKey': false };
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
        maxSnActivation: data.maxSnActivation,
        needGuestKey: (data.needGuestKey !== undefined ? data.needGuestKey : true),
      };
      console.log(this.consumerDate);
      this.loadData('orderType');
      this.visiable.modifyConsumer = true;
    } else if (flag === 'modifySerial') {
      this.serialData = data;
      this.serialData.groupId = data.id;
      console.log(this.serialData);
      this.loadData('modifySerial');
      this.visiable.modifySerial = true;
    } else if (flag === 'addSerial') {
      this.visiable.addSerial = true;
    } else if (flag === 'deleteSerialM') {
      this.visiable.deleteSerial = true;
    } else if (flag === 'explain') {
      this.visiable.explain = true;
    } else if (flag === 'voucher') {
      this.voucherInfo.appChannel = data.appChannel;
      this.loadData('voucher');
      this.visiable.voucher = true;
    } else if (flag === 'deleteConsumer') {
      const res = data.data;
      const text = data.event.target.innerText;
      const activationInput = { id: res.appChannel, available: (text === '作废' ? false : true), phone: res.phone && res.phone !== '' ? res.phone : '15111407234', needGuestKey: (res.needGuestKey ? res.needGuestKey : true) };
      this.consumerService.modifyAvailable(activationInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          this.loadData('consumer');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'addCallback') {
      this.visiable.addCallback = true;
      console.log(this.dataConsumer);
    } else if (flag === 'modifyCallback') {
      this.callbackData = data;
      console.log(this.callbackData);
      this.visiable.modifyCallback = true;
    } else if (flag === 'deleteCallback' || flag === 'deleteSerial' || flag === 'deleteSerialBatch' || flag === 'deleteMusic' || flag === 'deleteBluetooth') {
      this.modalService.confirm({
        nzTitle: '提示',
        nzContent: flag === 'deleteSerialBatch' ? '确认删除该序列号吗？删除后，该序列号将不可激活，请谨慎操作' : flag === 'deleteMusic' ? '确定删除该数据吗？' : '您确定要删除该信息？',
        nzOkText: '确定',
        nzOnOk: () => this.doDelete(data, flag) });
    } else if (flag === 'serialBatch') {
      this.serialBatchData = data;
      this.loadData('serialBatch');
      this.visiable.serialBatch = true;
    } else if (flag === 'addSerialBatch') {
      this.visiable.addSerialBatch = true;
    } else if (flag === 'modifySerialBatch') {
      this.serialBatchData.name = data.name;
      this.serialBatchData.type = data.type;
      this.serialBatchData.id = data.id;
      this.dateRange = [data.testStartDate, data.testEndDate];
      this.visiable.modifySerialBatch = true;
    } else if (flag === 'deleteSerialResult') {
      this.visiable.deleteSerialResult = true;
    } else if (flag === 'addMusic') {
      this.visiable.addMusic = true;
    } else if (flag === 'modifyMusic') {
      this.musicData = {appChannel: data.appChannel, useSDK: data.useSDK, xiaoWu: data.xiaoWu, koudaiAccess: data.koudaiAccess, lanRenAccess: data.lanRenAccess, musicAccess: data.musicAccess, xmlyAccess: data.xmlyAccess};
      this.visiable.modifyMusic = true;
    } else if (flag === 'addBluetooth') {
      this.loadData('deviceType');
      this.visiable.addBluetooth = true;
    } else if (flag === 'modifyBluetooth') {
      this.bluetoothData = {
        id: data.id,
        customerName: data.customerName,
        deviceType: data.deviceType,
        functionDesc: data.functionDesc,
        deviceIcon1: data.deviceIcon1,
        deviceIcon2: data.deviceIcon2,
        deviceIcon3: data.deviceIcon3,
        logo: data.logo ? data.logo : '',
        supportBle: data.supportBle,
        fileLogo: data.logo ? ((data.logo.length > 0) ? [{}] : []) : [],
        fileIcon1: data.deviceIcon1 ? ((data.deviceIcon1.length > 0) ? [{}] : []) : [],
        fileIcon2: data.deviceIcon2 ? ((data.deviceIcon2.length > 0) ? [{}] : []) : [],
        fileIcon3: data.deviceIcon3 ? ((data.deviceIcon3.length > 0) ? [{}] : []) : [],
        currentImage: '',
        deviceTypeList: [],
        newDeviceType: ''
      };
      console.log(this.bluetoothData);
      this.visiable.modifyBluetooth = true;
    } else if (flag === 'addAccount') {
      this.loadData('customerId');  // 获取客户ID列表
      this.visiable.addAccount = true;
    } else if (flag === 'modifyAccount') {
      this.accountData = {
        customerId: data.customerId,
        customerIds: this.accountData.customerIds,
        email: data.email,
        phoneNum: '18682233554',
        code: '',
        balanceThresholds: data.balanceThresholds,
        countDown: 60,
        recharge: '',
        accountBalance: ''
      };
      this.visiable.modifyAccount = true;
    } else if (flag === 'recharge') {
      this.accountData = {
        customerId: data.customerId,
        customerIds: [],
        email: '',
        phoneNum: '18682233554',
        code: '',
        balanceThresholds: '',
        countDown: 60,
        recharge: '',
        accountBalance: data.accountBalance
      };
      this.visiable.recharge = true;
    } else if (flag === 'capital') {
      this.accountData = {
        customerId: data.customerId,
        customerIds: [],
        email: '',
        phoneNum: '18682233554',
        code: '',
        balanceThresholds: '',
        countDown: 60,
        recharge: '',
        accountBalance: data.accountBalance
      };
      this.loadData('capital');
      console.log(this.accountData);
      this.visiable.capital = true;
    }
  }

  // 隐藏
  hideModal(flag) {
    if (flag === 'addConsumer') {
      this.visiable.addConsumer = false;
      this.consumerDate = { 'appChannel': '', 'appChannelName': '', 'robot': '', 'loginType': '1', 'paymentKey': '', 'smsSign': '', 'keys': '', 'phone': '', 'officially': false, 'available': '', 'maxSnActivation': '', 'needGuestKey': false };
    } else if (flag === 'modifyConsumer') {
      this.dataMsgArr.map(item => item.checked = false);
      this.visiable.modifyConsumer = false;
      this.consumerDate = { 'appChannel': '', 'appChannelName': '', 'robot': '', 'loginType': '1', 'paymentKey': '', 'smsSign': '', 'keys': '', 'phone': '', 'officially': false, 'available': '', 'maxSnActivation': '', 'needGuestKey': false };
    } else if (flag === 'modifySerial') {
      this.visiable.modifySerial = false;
    } else if (flag === 'addSerial') {
      this.consumerDate = { 'appChannel': '', 'appChannelName': '', 'robot': '', 'loginType': '1', 'paymentKey': '', 'smsSign': '', 'keys': '', 'phone': '', 'officially': false, 'available': '', 'maxSnActivation': '', 'needGuestKey': false };
      this.visiable.addSerial = false;
    } else if (flag === 'deleteSerialM') {
      this.visiable.deleteSerial = false;
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
    } else if (flag === 'serialBatch') {
      this.visiable.serialBatch = false;
    } else if (flag === 'addSerialBatch') {
      this.serialBatchData.name = '';
      this.serialBatchData.type = '';
      this.visiable.addSerialBatch = false;
    } else if (flag === 'modifySerialBatch') {
      this.serialBatchData.name = '';
      this.serialBatchData.type = '';
      this.serialBatchData.id = '';
      this.dateRange = [null, null];
      this.visiable.modifySerialBatch = false;
    } else if (flag === 'deleteSerialResult') {
      this.deleteSerialResult = { successSns: '', failSns: '' };
      this.loadData('modifySerial');
      this.visiable.deleteSerialResult = false;
    } else if (flag === 'addMusic') {
      this.musicData = {appChannel: '', useSDK: false, xiaoWu: false, koudaiAccess: false, lanRenAccess: false, musicAccess: false, xmlyAccess: false};
      this.visiable.addMusic = false;
    } else if (flag === 'modifyMusic') {
      this.musicData = {appChannel: '', useSDK: false, xiaoWu: false, koudaiAccess: false, lanRenAccess: false, musicAccess: false, xmlyAccess: false};
      this.visiable.modifyMusic = false;
    } else if (flag === 'addBluetooth') {
      this.bluetoothData = {id: '', customerName: '', deviceType: '', functionDesc: '', deviceIcon1: '', deviceIcon2: '', deviceIcon3: '', logo: '', supportBle: '', fileLogo: [], fileIcon1: [], fileIcon2: [], fileIcon3: [], currentImage: '', deviceTypeList: [], newDeviceType: '' };
      this.visiable.addBluetooth = false;
    } else if (flag === 'modifyBluetooth') {
      this.bluetoothData = {id: '', customerName: '', deviceType: '', functionDesc: '', deviceIcon1: '', deviceIcon2: '', deviceIcon3: '', logo: '', supportBle: '', fileLogo: [], fileIcon1: [], fileIcon2: [], fileIcon3: [], currentImage: '', deviceTypeList: [], newDeviceType: '' };
      this.visiable.modifyBluetooth = false;
    } else if (flag === 'addAccount') {
      this.accountData = {customerId: '', customerIds: [], email: '', phoneNum: '18682233554', code: '', balanceThresholds: '', countDown: 60, recharge: '', accountBalance: '' };
      this.visiable.addAccount = false;
    } else if (flag === 'modifyAccount') {
      this.accountData = {customerId: '', customerIds: [], email: '', phoneNum: '18682233554', code: '', balanceThresholds: '', countDown: 60, recharge: '', accountBalance: '' };
      this.visiable.modifyAccount = false;
    } else if (flag === 'recharge') {
      this.accountData = {customerId: '', customerIds: [], email: '', phoneNum: '18682233554', code: '', balanceThresholds: '', countDown: 60, recharge: '', accountBalance: '' };
      this.visiable.recharge = false;
    } else if (flag === 'capital') {
      this.visiable.capital = false;
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
        'orderTypes': orderTypes,
        'needGuestKey': this.addConsumerForm.controls['needGuestKey'].value
      };
      console.log(consumerInput);
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
        'orderTypes': orderTypes,
        'needGuestKey': this.modifyConsumerForm.controls['needGuestKey'].value
      };
      this.addPaymengSms(consumerInput);
    } else if (flag === 'addSerial') {
      if (!this.verificationAdd('addSerial')) { return; }
      let arr = [];
      this.consumerDate.keys.split('\n').forEach(item => {
        if (item !== '' && item.replace(/ /g,'') !== '') { arr.push(item); }
      });
      arr = this.unique(arr); // 去重
      const keysInput = { id: this.serialData.appChannelId, keys: arr, groupId: this.serialData.groupId };
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
    } else if (flag === 'addSerialBatch') {
      const input = {
        appChannelId: this.serialBatchData.appChannel,
        name: this.serialBatchData.name,
        testStartDate: this.serialBatchStartDate,
        testEndDate: this.serialBatchEndDate,
        type: this.serialBatchData.type
      };
      this.consumerService.addSerialBatch(input).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '添加成功', { nzStyle: { color : 'green' } });
          this.loadData('serialBatch');
          this.hideModal('addSerialBatch');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'modifySerialBatch') {
      const input = {
        appChannelId: this.serialBatchData.appChannel,
        name: this.serialBatchData.name,
        id: this.serialBatchData.id,
        testStartDate: this.serialBatchStartDate,
        testEndDate: this.serialBatchEndDate,
        type: this.serialBatchData.type
      };
      this.consumerService.modifySerialBatch(input).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          this.loadData('serialBatch');
          this.hideModal('modifySerialBatch');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'addMusic') {
      const input = {
        appChannel: this.musicData.appChannel,
        useSDK: this.musicData.useSDK,
        xiaoWu: this.musicData.xiaoWu,
        koudaiAccess: this.musicData.koudaiAccess,
        lanRenAccess: this.musicData.lanRenAccess,
        musicAccess: this.musicData.musicAccess,
        xmlyAccess: this.musicData.xmlyAccess,
        createTime: new Date(),
        operator: localStorage.getItem('currentUser'),
      };
      console.log(input);
      this.musicService.addMusic(input).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '添加成功', { nzStyle: { color : 'green' } });
          this.loadData('music');
          this.hideModal('addMusic');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'modifyMusic') {
      const input = {
        appChannel: this.musicData.appChannel,
        useSDK: this.musicData.useSDK,
        xiaoWu: this.musicData.xiaoWu,
        koudaiAccess: this.musicData.koudaiAccess,
        lanRenAccess: this.musicData.lanRenAccess,
        musicAccess: this.musicData.musicAccess,
        xmlyAccess: this.musicData.xmlyAccess,
      };
      this.musicService.modifyMusic(input).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          this.loadData('music');
          this.hideModal('modifyMusic');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'addBluetooth') {
      const input = {
        customerName: this.bluetoothData.customerName,
        deviceType: this.bluetoothData.deviceType === 'new' ? this.bluetoothData.newDeviceType : this.bluetoothData.deviceType,
        functionDesc: this.bluetoothData.functionDesc,
        deviceIcon1: this.bluetoothData.deviceIcon1,
        deviceIcon2: this.bluetoothData.deviceIcon2,
        deviceIcon3: this.bluetoothData.deviceIcon3,
        logo: this.bluetoothData.logo,
        supportBle: this.bluetoothData.supportBle,
      };
      console.log(input);
      this.bluetoothService.addBluetooth(input).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          this.loadData('bluetooth');
          this.hideModal('addBluetooth');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'modifyBluetooth') {
      const input = {
        id: this.bluetoothData.id,
        customerName: this.bluetoothData.customerName,
        deviceType: this.bluetoothData.deviceType,
        functionDesc: this.bluetoothData.functionDesc,
        deviceIcon1: this.bluetoothData.deviceIcon1,
        deviceIcon2: this.bluetoothData.deviceIcon2,
        deviceIcon3: this.bluetoothData.deviceIcon3,
        logo: this.bluetoothData.logo,
        supportBle: this.bluetoothData.supportBle,
      };
      this.bluetoothService.modifyBluetooth(input).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          this.loadData('bluetooth');
          this.hideModal('modifyBluetooth');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'addAccount') {
      const input = {
        customerId: this.accountData.customerId,
        email: this.accountData.email,
        phoneNum: this.accountData.phoneNum,
        code: this.accountData.code,
        balanceThresholds: this.accountData.balanceThresholds,
      };
      this.consumerAccountService.addConsumerAccount(input).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          this.loadData('account');
          this.hideModal('addAccount');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'modifyAccount') {
      const input = {
        customerId: this.accountData.customerId,
        email: this.accountData.email,
        phoneNum: this.accountData.phoneNum,
        code: this.accountData.code,
        balanceThresholds: this.accountData.balanceThresholds,
      };
      this.consumerAccountService.modifyConsumerAccount(input).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          this.loadData('account');
          this.hideModal('modifyAccount');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'sendMsg') {
      this.consumerAccountService.sendMsg(this.accountData.phoneNum).subscribe(res => {
        if (res.retcode === 0) {
          this.countDown();
          this.notification.blank( '提示', '发送成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '客户管理', op_page: '客户账户' , op_name: '发送短信' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'recharge') {
      const input = {
        customerId: this.accountData.customerId,
        amount: this.accountData.recharge,
        phoneNum: this.accountData.phoneNum,
        code: this.accountData.code,
      };
      console.log(input);
      this.consumerAccountService.rechargeAccount(input).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          this.loadData('account');
          this.hideModal('recharge');
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
    } else if (flag === 'deleteSerial') {
      const input = {appChannelId: this.serialData.appChannelId, id: id};
      this.consumerService.deleteSerial(input).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '客户管理', op_page: '客户管理', op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('modifySerial');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'deleteSerialBatch') {
      let arr = [];
      this.consumerDate.keys.split('\n').forEach(item => {
        if (item !== '' && item.replace(/ /g,'') !== '') { arr.push(item); }
      });
      arr = this.unique(arr); // 去重
      const input = { appChannelId: this.serialData.appChannelId, keys: arr, groupId: this.serialData.groupId };
      this.consumerService.deleteSerialBatch(input).subscribe(res => {
        if (res.retcode === 0) {
          const operationInput = { op_category: '客户管理', op_page: '客户管理', op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('deleteSerialM');
          const result = JSON.parse(res.payload);
          this.deleteSerialResult.successSns = result.successSns.join('\n');
          this.deleteSerialResult.failSns = result.failSns.join('\n');
          if (this.deleteSerialResult.successSns === '' && this.deleteSerialResult.failSns === '') {
            this.modalService.error({ nzTitle: '提示', nzContent: '您删除的序列号不在该序列号批次中，请重新检查！' });
            this.hideModal('deleteSerialResult');
          } else {
            this.showModal('deleteSerialResult', '');
          }
          console.log(this.deleteSerialResult);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'deleteMusic') {
      this.musicService.deleteMusic(id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '客户管理', op_page: '音频管理', op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('music');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'deleteBluetooth') {
      this.bluetoothService.deleteBluetooth(id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '客户管理', op_page: '蓝牙设备', op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('bluetooth');
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
      const activationInput = { id: data.appChannel, maxSnActivation: data.maxSnActivation, phone: data.phone, needGuestKey: data.needGuestKey };
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
    if (flag === 'msgArr') {
      const checked = result.checked;
      const value = result.value;
    } else if (flag === 'appChannel') {
      const ac = result.appChannel;
      const arr = [];
      this.dataCallback.forEach(item => { item.appChannel === ac ? arr.push(item.orderTypeName) : null });
      arr.length === 0 ? this.orderTypeItem.map(item => { item.visiable = true }) : (this.orderTypeItem.map(item => { arr.indexOf(item.value) > -1 ? item.visiable = false : null }) )
    } else if (flag === 'serialBatch') {
      if (result[0] !== '' || result[1] !== '') {
        if (this.datePipe.transform(result[0], 'HH:mm:ss') === this.datePipe.transform(result[1], 'HH:mm:ss')) {
          this.serialBatchStartDate = this.datePipe.transform(result[0], 'yyyy-MM-dd' + ' 00:00:00'); this.serialBatchEndDate = this.datePipe.transform(result[1], 'yyyy-MM-dd' + ' 23:59:59');
        } else {
          this.serialBatchStartDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss'); this.serialBatchEndDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
        }
      }
      if (this.serialBatchStartDate === null) { this.serialBatchStartDate = null; this.serialBatchEndDate = null; }
    } else if (flag === 'capital') {
      if (result[0] !== '' || result[1] !== '') {
        if (this.datePipe.transform(result[0], 'HH:mm:ss') === this.datePipe.transform(result[1], 'HH:mm:ss')) {
          this.capitalStartDate = this.datePipe.transform(result[0], 'yyyyMMdd'); this.capitalEndDate = this.datePipe.transform(result[1], 'yyyyMMdd');
        } else {
          this.capitalStartDate = this.datePipe.transform(result[0], 'yyyyMMdd'); this.capitalEndDate = this.datePipe.transform(result[1], 'yyyyMMdd');
        }
      }
      if (this.capitalStartDate === null) { this.capitalStartDate = null; this.capitalEndDate = null; }
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

  // 用于区分
  choosePng(flag) {
    this.bluetoothData.currentImage = flag;
  }

  // 上传image
  beforeUpload = (file: UploadFile): boolean => {
    const suffix = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
    const isPng = suffix === '.png' || suffix === '.jpeg' || suffix === '.jpg' || suffix === '.ico' ? true : false;
    const isMoreThanTen = file.size < 512000 ? true : false;
    if (!isPng) {
      this.msg.error('您只能上传.png、.jpeg、.jpg、.ico、文件');
    } else if (!isMoreThanTen) {
      this.msg.error('您只能上传不超过500K文件');
    } else {
      console.log(this.bluetoothData);
      if (this.bluetoothData.currentImage === 'logo') {
        this.bluetoothData.fileLogo.push(file);
      } else if (this.bluetoothData.currentImage === 'icon1') {
        this.bluetoothData.fileIcon1.push(file);
      } else if (this.bluetoothData.currentImage === 'icon2') {
        this.bluetoothData.fileIcon2.push(file);
      } else if (this.bluetoothData.currentImage === 'icon3') {
        this.bluetoothData.fileIcon3.push(file);
      }
      this.handleUpload();
    }
    return false;
  }

  // 点击上传
  handleUpload(): void {
    const formData = new FormData();
    if (this.bluetoothData.currentImage === 'logo') {
      this.bluetoothData.fileLogo.forEach((file: any) => { formData.append('image', file); });
    } else if (this.bluetoothData.currentImage === 'icon1') {
      this.bluetoothData.fileIcon1.forEach((file: any) => { formData.append('image', file); });
    } else if (this.bluetoothData.currentImage === 'icon2') {
      this.bluetoothData.fileIcon2.forEach((file: any) => { formData.append('image', file); });
    } else if (this.bluetoothData.currentImage === 'icon3') {
      this.bluetoothData.fileIcon3.forEach((file: any) => { formData.append('image', file); });
    }
    const req = new HttpRequest('POST', `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}/cms/bluetooth/images`, formData, {
      reportProgress: true,
      headers: new HttpHeaders({ 'App-Channel-Id': localStorage.getItem('currentAppHeader'), 'Authorization': localStorage.getItem('token') })
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe((event: HttpResponse<{ code: any, data: any, msg: any }> | any) => {
        if (event.body.retcode === 0) {
          if (this.bluetoothData.currentImage === 'logo') {
            this.bluetoothData.logo = event.body.payload;
          } else if (this.bluetoothData.currentImage === 'icon1') {
            this.bluetoothData.deviceIcon1 = event.body.payload;
          } else if (this.bluetoothData.currentImage === 'icon2') {
            this.bluetoothData.deviceIcon2 = event.body.payload;
          } else if (this.bluetoothData.currentImage === 'icon3') {
            this.bluetoothData.deviceIcon3 = event.body.payload;
          }
          this.notification.success( '提示', '上传成功' );
        } else { this.modalService.error({ nzTitle: '提示', nzContent: event.body.message, }); }
        formData.delete('image');
      }, err => { formData.delete('image'); }
    );
  }

  // 倒计时
  countDown() {
    this.accountData.countDown--;
    if (this.accountData.countDown === 0) { this.accountData.countDown = 60; return; }
    setTimeout(() => { this.countDown(); }, 1000);
  }

  // 切换面板
  changePanel(flag): void {
    if (flag !== this.currentPanel) {this.loadData(flag); }
    this.currentPanel = flag;
    const operationInput = { op_category: '客户管理', op_page: flag === 'consumer' ? '客户管理' : flag === 'callback' ? '回调地址' : flag === 'music' ? '音频管理' : flag === 'bluetooth' ? '蓝牙设备' : flag === 'account' ? '客户账户' : '', op_name: '访问' };
    this.commonService.updateOperationlog(operationInput).subscribe();
  }

}
