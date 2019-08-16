import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { AppversionService } from '../public/service/appVersion.service';
import { CommonService } from '../public/service/common.service';
import { LocalizationService } from '../public/service/localization.service';
import { VoiceService } from '../public/service/voice.service';
import { Router } from '@angular/router';
import { WhiteListService } from '../public/service/whiteList.service';
import * as XLSX from 'xlsx';

registerLocaleData(zh);

@Component({
  selector: 'app-operate',
  templateUrl: './operate.component.html',
  styleUrls: ['./operate.component.scss']
})
export class OperateComponent implements OnInit {

  visiable = {taxiDetail: false, orderStateSetting: false, whiteList: false, codeView: false };
  searchTaxiForm: FormGroup;
  searchOrderStateForm: FormGroup;
  now = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  emptyAdd = ['', '', '', '', '', '', ''];  // 清空新增表单
  dataTaxi = [];  // 打车路径
  dataVoice = [];  // 语音配置
  dataOrderState = [];  // 打车路径
  dataOrderStateSetting = []; // 订单状态设置
  dataWhiteList = []; // 白名单
  currentTaxi = { 'orderId': '', 'originName': '', 'createDate': '', 'destinationName': '', 'nowPrice': '', 'userNickName': '', 'userPhone': '', 'driverPhone': '', 'availableAmount': '', 'availableBeans': '', 'estimate_price': '', 'source': '', 'monitorType': 0 };
  currentOrderStateSetting = { 'id': '', 'orderType': '', 'state': '', 'lowTime': '', 'highTime': '', 'time1': '0', 'time2': '0' };
  taxiItem = { 'orderId': '', 'startTime': '', 'endTime': '' };
  whiteListDate = {keys: ''};
  operateObject = { code: '', operator: '18682233554' };
  semdMesCodeText = 60;
  beginTaxiDate = '';
  endTaxiDate = '';
  beginOrderStateDate = '';
  endOrderStateDate = '';
  currentPanel = 'taxi';  // 当前面板 默认
  currentChannelName = '你好小悟';
  currentIOSVoiceId = ''; // 拿到id
  currentANDROIDVoiceId = ''; // 拿到id
  isSaveIOSVoiceButton = false;
  isSaveANDROIDVoiceButton = false;
  voiceIOSRadioValue = 'baidu';
  voiceANDROIDRadioValue = 'baidu';
  isSpinning = false;
  taxiOrderState = '';
  taxiOrderType = '';

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    public voiceService: VoiceService,
    private modalService: NzModalService,
    public localizationService: LocalizationService,
    private appversionService: AppversionService,
    private whiteListService: WhiteListService,
    private notification: NzNotificationService,
    private datePipe: DatePipe,
    private router: Router,
  ) {
    this.commonService.nav[4].active = true;
    this._initForm();
  }

  ngOnInit() {
    const tabFlag = [{label: '打车监控', value: 'taxi'}, {label: 'ASR语音切换', value: 'voice'},
        {label: '订单状态监控', value: 'orderState'}, {label: '订单状态设置', value: 'orderStateSetting'}];
    let targetFlag = 0;
    for (let i = 0; i < tabFlag.length; i++) {
      if (this.commonService.haveMenuPermission('children', tabFlag[i].label)) {targetFlag = i; break; }
    }
    console.log(tabFlag[targetFlag].value);
    this.loadData(tabFlag[targetFlag].value);
    this.changePanel(tabFlag[targetFlag].value);
  }

  loadData(flag) {
    this.isSpinning = true;
    if (flag === 'taxi') {
      this.taxiItem.orderId = this.searchTaxiForm.controls['orderId'].value;
      this.taxiItem.startTime = this.beginTaxiDate;
      this.taxiItem.endTime = this.endTaxiDate;
      this.appversionService.getTaxiList(this.taxiItem).subscribe(res => {
        if (res.retcode === 0) {
          this.isSpinning = false;
          this.dataTaxi = JSON.parse(res.payload).reverse();
          const operationInput = { op_category: '运维后台', op_page: '打车监控' , op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'voice') {
      this.voiceService.getVoiceList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataVoice = JSON.parse(res.payload);
          const operationInput = { op_category: '运维后台', op_page: 'ASR语音配置' , op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.dataVoice.forEach(item => {
            if (item.system === 'IOS') {
              this.currentIOSVoiceId = item.id;
              this.voiceIOSRadioValue = item.supplier;
            } else if (item.system === 'ANDROID') {
              this.currentANDROIDVoiceId = item.id;
              this.voiceANDROIDRadioValue = item.supplier;
            }
          });
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'orderState') {
      const orderStateInput = {
        startTime: this.beginOrderStateDate,
        endTime: this.endOrderStateDate,
        orderId: this.searchOrderStateForm.controls['orderId'].value,
        state: this.searchOrderStateForm.controls['state'].value,
        orderType: this.searchOrderStateForm.controls['orderType'].value,
      };
      this.appversionService.getOrderStateList(orderStateInput).subscribe(res => {
        if (res.retcode === 0) {
          this.isSpinning = false;
          this.dataOrderState = JSON.parse(res.payload);
          console.log(this.dataOrderState);
          const operationInput = { op_category: '运维后台', op_page: '订单状态监控' , op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'orderStateSetting') {
      this.appversionService.getOrderStateSettingList().subscribe(res => {
        if (res.retcode === 0) {
          this.isSpinning = false;
          this.dataOrderStateSetting = JSON.parse(res.payload).reverse().sort(this.sortOrderType);
          this.dataOrderStateSetting.forEach(item => {
            item.lowTimeDes = this.getDuration(item.lowTime);
            item.lowTime = Math.round(item.lowTime / 60000);
            item.highTimeDes = this.getDuration(item.highTime);
            item.highTime = Math.round(item.highTime / 60000);
          });
          console.log(this.dataOrderStateSetting);
          const operationInput = { op_category: '运维后台', op_page: '订单状态设置' , op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'whiteList') {
      this.whiteListService.getWhiteList().subscribe(res => {
        if (res.retcode === 0) {
          this.isSpinning = false;
          this.dataWhiteList = JSON.parse(res.payload).content;
          console.log(this.dataWhiteList);
          const operationInput = { op_category: '运维后台', op_page: '白名单管理' , op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  private _initForm(): void {
    this.searchTaxiForm = this.fb.group({ orderId: [''], date: [''] });
    this.searchOrderStateForm = this.fb.group({ orderId: [''], date: [''], state: [''], orderType: [''] });
  }

  // 弹框
  showModal(flag, data) {
    if (flag === 'taxi') {
      this.visiable.taxiDetail = true;
      this.currentTaxi = data;
      this.loadData('taxi');
      let mainMap, mainRoute;
      let mainPoints = [];
      for (let i = 0; i < this.dataTaxi.length; i++) {
        if (this.dataTaxi[i].orderId === data.orderId) {
          mainPoints = this.dataTaxi[i].path.points;
        }
      }
      console.log(mainPoints);
      mainMap = new AMap.Map('container', { resizeEnable: true });
      // const centerPoint = mainPoints[0].split(',');
      // // 基本地图加载
      // mainMap = new AMap.Map('container', {
      //   resizeEnable: true,
      //   // center: centerPoint,
      //   // zoom: 2
      // });
      // 绘制初始路径
      const mainPath = this.getPointRoute(mainPoints);
      console.log(mainPath);
      mainMap.plugin('AMap.DragRoute', function() {
        mainRoute = new AMap.DragRoute(mainMap, mainPath, AMap.DrivingPolicy.LEAST_FEE); // 构造拖拽导航类
        mainRoute.search(); // 查询导航路径并开启拖拽导航
      });
      setTimeout(() => {this.refreshMap(); }, 500);
    } else if (flag === 'orderStateSetting') {
      this.visiable.orderStateSetting = true;
      this.currentOrderStateSetting = data;
      this.currentOrderStateSetting.time1 = '0';
      this.currentOrderStateSetting.time2 = '0';
    } else if (flag === 'deleteWhiteList') {
      this.modalService.confirm({
        nzTitle: '确认删除', nzContent: '确认删除吗？', nzCancelText: '取消',
        nzOnCancel: () => 1, nzOkText: '确定', nzOnOk: () => { this.doSomething(data, flag); }
      });
    } else if (flag === 'codeView') {
      if (!this.verification('codeView')) { return; }
      this.visiable.codeView = true;
    } else if (flag === 'addWhiteList') {
      this.visiable.whiteList = true;
    }
    this.emptyAdd = ['', '', '', '', '', '', ''];
  }

  // doSomething
  doSomething(data, flag) {
    if (flag === 'deleteWhiteList') {
      this.whiteListService.deleteWhiteList(data.id).subscribe(res => {
        if (res.retcode === 0) {
          if (res.payload !== '') {
            this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
            const operationInput = { op_category: '运维后台', op_page: '白名单管理', op_name: '删除' };
            this.commonService.updateOperationlog(operationInput).subscribe();
            this.loadData('whiteList');
          } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  // 处理后台传过来的经纬度数据
  getPointRoute(points) {
    const path = [];
    for (let i = 0; i < points.length; i++) { path.push(points[i].split(',').reverse()); }
    return path;
  }

  hideModal(flag) {
    if (flag === 'taxi') {
      this.visiable.taxiDetail = false;
      this.loadData('taxi');
    } else if (flag === 'voicceIOS') {
      this.isSaveIOSVoiceButton = false;
    } else if (flag === 'voicceANDROID') {
      this.isSaveANDROIDVoiceButton = false;
    } else if (flag === 'orderStateSetting') {
      this.visiable.orderStateSetting = false;
    } else if (flag === 'codeView') {
      this.visiable.codeView = false;
    } else if (flag === 'addWhiteList') {
      this.visiable.whiteList = false;
    }
  }

  // 新增操作
  doSave(flag, id): void {
    if (flag === 'editVoiceIOS') {
      this.isSaveIOSVoiceButton = true;  // 点击编辑按钮，变成保存按钮
    } else if (flag === 'editVoiceANDROID') {
      this.isSaveANDROIDVoiceButton = true;  // 点击编辑按钮，变成保存按钮
    } else if (flag === 'saveVoicceIOS') {
      const voiceInput = {
        'id': this.currentIOSVoiceId,
        'supplier': this.voiceIOSRadioValue
      };
      this.voiceService.updateVoice(voiceInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '运维后台', op_page: '语音配置IOS' , op_name: '修改' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.isSaveIOSVoiceButton = false; // 保存成功后，变为编辑按钮
          this.loadData('voice');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'saveVoicceANDROID') {
      const voiceInput = {
        'id': this.currentANDROIDVoiceId,
        'supplier': this.voiceANDROIDRadioValue
      };
      this.voiceService.updateVoice(voiceInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '运维后台', op_page: '语音配置ANDROID' , op_name: '修改' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.isSaveANDROIDVoiceButton = false; // 保存成功后，变为编辑按钮
          this.loadData('voice');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'modifyOrderStateSetting') {
      const time1 = this.currentOrderStateSetting.time1;
      const time2 = this.currentOrderStateSetting.time2;
      const lowTime = Number(this.currentOrderStateSetting.lowTime);
      const highTime = Number(this.currentOrderStateSetting.highTime);
      const input = {
        'id': this.currentOrderStateSetting.id,
        'low': time1 === '0' ? lowTime * 60000 : time1 === '1' ? lowTime * 3600000 : time1 === '2' ? lowTime * 86400000 : '',
        'high': time2 === '0' ? highTime * 60000 : time2 === '1' ? highTime * 3600000 : time2 === '2' ? highTime * 86400000 : '',
      };
      this.appversionService.modifyOrderStateSetting(input).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '运维后台', op_page: '订单状态设置' , op_name: '修改状态监控' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('orderStateSetting');
          this.loadData('orderStateSetting');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'addWhiteList') {
      if (!this.verification('addWhiteList')) { return; }
      let arr = [];
      this.whiteListDate.keys.split('\n').forEach(item => {
        if (item !== '' && item.replace(/ /g,'') !== '') { arr.push(item); }
      });
      arr = this.unique(arr); // 去重
      const keysInput = {
        code: this.operateObject.code,
        memPhones: arr,
        phone: this.operateObject.operator,
      };
      this.whiteListService.addWhiteList(keysInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          this.hideModal('codeView');
          this.hideModal('addWhiteList');
          this.loadData('whiteList');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'sendMsg') {
      this.whiteListService.sendMsg(this.operateObject.operator).subscribe(res => {
        if (res.retcode === 0) {
          this.countDown();
          this.notification.blank( '提示', '发送成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '用户管理', op_page: '数据调整' , op_name: '发送短信' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  // 倒计时
  countDown() {
    this.semdMesCodeText--;
    if (this.semdMesCodeText === 0) { this.semdMesCodeText = 60; return; }
    setTimeout(() => { this.countDown(); }, 1000);
  }

  // 封装验证新增
  verification(flag): boolean {
    let result = true;
    if (flag === 'addWhiteList' || flag === 'codeView') {
      if (this.whiteListDate.keys === '' || this.whiteListDate.keys.length === 0 || this.whiteListDate.keys.replace(/ /g,'') === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '白名单不得为空' });
        result = false;
      }
    }
    return result;
  }

  // 跳转到实体订单
  goTaxtOrder(data) {
    this.router.navigateByUrl('/user?taxiOrderId=' + data.orderId);
  }

  // 跳转到用户信息
  goUserInfo(data) {
    this.router.navigateByUrl('/user?phone=' + data.phone);
  }

  // 日期插件
  onChange(result, flag): void {
    if (flag === 'taxi') {
      if (result === []) { this.beginTaxiDate = ''; this.endTaxiDate = ''; return; }
      if (result[0] !== '' || result[1] !== '') { this.beginTaxiDate = this.datePipe.transform(result[0], 'yyyyMMdd'); this.endTaxiDate = this.datePipe.transform(result[1], 'yyyyMMdd'); }
    } else if (flag === 'orderState') {
      if (result === []) { this.beginOrderStateDate = ''; this.endOrderStateDate = ''; return; }
      if (result[0] !== '' || result[1] !== '') { this.beginOrderStateDate = this.datePipe.transform(result[0], 'yyyy-MM-dd'); this.endOrderStateDate = this.datePipe.transform(result[1], 'yyyy-MM-dd'); }
    }
  }

  // 针对orderType进行排序
  sortOrderType(a, b) {
    return b.orderType.charCodeAt(0) - a.orderType.charCodeAt(0);
  }

  // 切换面板
  changePanel(flag): void {
    if (flag !== this.currentPanel) { this.loadData(flag); }
    if (flag !== 'voice') {
      this.isSaveIOSVoiceButton = false;
      this.isSaveANDROIDVoiceButton = false;
    }
    this.currentChannelName = localStorage.getItem('currentAppHeader') === 'XIAOWU' ? '你好小悟' : localStorage.getItem('currentAppHeader') === 'LENZE' ? '听听同学' : '沃特沃德6';
    this.currentPanel = flag;
    const operationInput = { op_category: '运维后台', op_page: flag === 'taxi' ? '打车监控' : flag === 'voice' ? '语音配置' : flag === 'orderState' ? '订单状态监控' : flag === 'orderStateSetting' ? '订单状态设置' : '', op_name: '访问' };
    this.commonService.updateOperationlog(operationInput).subscribe();
  }

  // 刷新地图
  refreshMap() {
    let map, route;
    let points = [];
    for (let i = 0; i < this.dataTaxi.length; i++) {
      if (this.dataTaxi[i].orderId === this.currentTaxi.orderId) {
        points = this.dataTaxi[i].path.points;
      }
    }
    // 基本地图加载
    map = new AMap.Map('container', { resizeEnable: true });
    // const centerPoint = points[0].split(',');
    // // 基本地图加载
    // map = new AMap.Map('container', {
    //   resizeEnable: true,
    //   center: centerPoint,
    //   zoom: 14
    // });
    // 绘制初始路径
    const path = this.getPointRoute(points);
    map.plugin('AMap.DragRoute', function() {
      route = new AMap.DragRoute(map, path, AMap.DrivingPolicy.LEAST_FEE); // 构造拖拽导航类
      route.search(); // 查询导航路径并开启拖拽导航
    });
  }

  // 毫秒转换
  getDuration(my_time) {
    const days    = my_time / 1000 / 60 / 60 / 24;
    const daysRound = Math.floor(days);
    const hours = my_time / 1000 / 60 / 60 - (24 * daysRound);
    const hoursRound = Math.floor(hours);
    const minutes = my_time / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
    const minutesRound = Math.floor(minutes);
    const seconds = my_time / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
    // const time = hoursRound + '小时' + minutesRound + '分' + seconds;
    const time = (daysRound === 0 ? '' : daysRound + '天') + (hoursRound === 0 ? '' : hoursRound + '小时') + (minutesRound === 0 ? '' : minutesRound + '分钟');
    return time;
  }

  // 获取Excel
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
      this.whiteListDate.keys = this.whiteListDate.keys.length > 0 ? (this.whiteListDate.keys + '\n' + arr.join('\n')) : (this.whiteListDate.keys + arr.join('\n'));
      evt.target.value="" // 清空
    };
    reader.readAsBinaryString(target.files[0]);
  }

  // 去重
  unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) { if (!hash[elem]) { result.push(elem); hash[elem] = true; } }
    return result;
  }

}
