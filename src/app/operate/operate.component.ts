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

registerLocaleData(zh);

@Component({
  selector: 'app-operate',
  templateUrl: './operate.component.html',
  styleUrls: ['./operate.component.scss']
})
export class OperateComponent implements OnInit {

  isTaxiDetailVisible = false;
  searchTaxiForm: FormGroup;
  searchTaxiStateForm: FormGroup;
  now = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  emptyAdd = ['', '', '', '', '', '', ''];  // 清空新增表单
  dataTaxi = [];  // 打车路径
  dataVoice = [];  // 语音配置
  dataTaxiState = [];  // 打车路径
  // tslint:disable-next-line:max-line-length
  currentTaxi = { 'orderId': '', 'originName': '', 'createDate': '', 'destinationName': '', 'nowPrice': '', 'userNickName': '', 'userPhone': '', 'driverPhone': '', 'availableAmount': '', 'availableBeans': '', 'estimate_price': '', 'source': '', 'monitorType': 0 };
  taxiItem = { 'orderId': '', 'startTime': '', 'endTime': '' };
  beginTaxiDate = '';
  endTaxiDate = '';
  beginTaxiStateDate = '';
  endTaxiStateDate = '';
  dateSearch = { 'Today': [new Date(), new Date()], 'This Month': [new Date(), new Date()] };
  currentPanel = 'content';  // 当前面板 默认
  currentChannelName = '你好小悟';
  currentIOSVoiceId = ''; // 拿到id
  currentANDROIDVoiceId = ''; // 拿到id
  isSaveIOSVoiceButton = false;
  isSaveANDROIDVoiceButton = false;
  voiceIOSRadioValue = 'baidu';
  voiceANDROIDRadioValue = 'baidu';
  isSpinning = false;
  private timerList;
  private timerDetail;
  taxiOrderState = '';

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    public voiceService: VoiceService,
    private modalService: NzModalService,
    public localizationService: LocalizationService,
    private appversionService: AppversionService,
    private notification: NzNotificationService,
    private datePipe: DatePipe,
    private router: Router,
  ) {
    this.commonService.nav[4].active = true;
    this._initForm();
    this.timerList = setInterval(() => {
      this.loadData('taxi');
    }, 20000);
  }

  ngOnInit() {
    this.loadData('content');
    this.loadData('system');
    this.loadData('channel');
    this.loadData('taxi');
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    if (this.timerList) {
      clearInterval(this.timerList);
    }
    if (this.timerDetail) {
      clearInterval(this.timerDetail);
    }
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
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'voice') {
      this.voiceService.getVoiceList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataVoice = JSON.parse(res.payload);
          const operationInput = { op_category: '运维后台', op_page: '语音配置' , op_name: '访问' };
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
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'taxiState') {
      const taxiStateInput = {
        startTime: this.beginTaxiStateDate,
        endTime: this.endTaxiStateDate,
        orderId: this.searchTaxiStateForm.controls['orderId'].value,
        state: this.searchTaxiStateForm.controls['state'].value,
      };
      this.appversionService.getTaxiStateList(taxiStateInput).subscribe(res => {
        if (res.retcode === 0) {
          this.isSpinning = false;
          this.dataTaxiState = JSON.parse(res.payload).reverse();
          console.log(this.dataTaxiState);
          const operationInput = { op_category: '运维后台', op_page: '打车监控' , op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  private _initForm(): void {
    this.searchTaxiForm = this.fb.group({ orderId: [''], date: [''] });
    this.searchTaxiStateForm = this.fb.group({ orderId: [''], date: [''], state: [''] });
  }

  // 弹框
  showModal(flag, data) {
    if (flag === 'taxi') {
      this.isTaxiDetailVisible = true;
      this.currentTaxi = data;
      console.log(this.currentTaxi);
      if (this.timerList) {
        clearInterval(this.timerList);
      }
      this.loadData('taxi');
      let mainMap, mainRoute;
      let mainPoints = [];
      for (let i = 0; i < this.dataTaxi.length; i++) {
        if (this.dataTaxi[i].orderId === data.orderId) {
          mainPoints = this.dataTaxi[i].path.points;
        }
      }
      // 基本地图加载
      mainMap = new AMap.Map('container', {
        resizeEnable: true
      });
      // 绘制初始路径
      const mainPath = this.getPointRoute(mainPoints);
      mainMap.plugin('AMap.DragRoute', function() {
        mainRoute = new AMap.DragRoute(mainMap, mainPath, AMap.DrivingPolicy.LEAST_FEE); // 构造拖拽导航类
        mainRoute.search(); // 查询导航路径并开启拖拽导航
      });
      this.timerDetail = setInterval(() => {
        let map, route;
        let points = [];
        for (let i = 0; i < this.dataTaxi.length; i++) {
          if (this.dataTaxi[i].orderId === data.orderId) {
            points = this.dataTaxi[i].path.points;
          }
        }
        // 基本地图加载
        map = new AMap.Map('container', {
          resizeEnable: true
        });
        // 绘制初始路径
        const path = this.getPointRoute(points);
        map.plugin('AMap.DragRoute', function() {
          route = new AMap.DragRoute(map, path, AMap.DrivingPolicy.LEAST_FEE); // 构造拖拽导航类
          route.search(); // 查询导航路径并开启拖拽导航
        });
      }, 15000);
    }
    this.emptyAdd = ['', '', '', '', '', '', ''];
  }

  // 处理后台传过来的经纬度数据
  getPointRoute(points) {
    const path = [];
    for (let i = 0; i < points.length; i++) {
      path.push(points[i].split(',').reverse());
    }
    return path;
  }

  hideModal(flag) {
    if (flag === 'taxi') {
      this.isTaxiDetailVisible = false;
      if (this.timerDetail) {
        clearInterval(this.timerDetail);
      }
      this.timerList = setInterval(() => {
        this.loadData('taxi');
      }, 15000);
    } else if (flag === 'voicceIOS') {
      this.isSaveIOSVoiceButton = false;
    } else if (flag === 'voicceANDROID') {
      this.isSaveANDROIDVoiceButton = false;
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
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
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
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  // 跳转到实体订单
  goTaxtOrder(data) {
    this.router.navigateByUrl('/user?taxiOrderId=' + data.orderId);
  }

  // 日期插件
  onChange(result, flag): void {
    if (flag === 'taxi') {
      if (result === []) {
        this.beginTaxiDate = '';
        this.endTaxiDate = '';
        return;
      }
      // 正确选择数据
      if (result[0] !== '' || result[1] !== '') {
        this.beginTaxiDate = this.datePipe.transform(result[0], 'yyyyMMdd');
        this.endTaxiDate = this.datePipe.transform(result[1], 'yyyyMMdd');
      }
    } else if (flag === 'taxiState') {
      if (result === []) {
        this.beginTaxiStateDate = '';
        this.endTaxiStateDate = '';
        return;
      }
      // 正确选择数据
      if (result[0] !== '' || result[1] !== '') {
        this.beginTaxiStateDate = this.datePipe.transform(result[0], 'yyyyMMdd');
        this.endTaxiStateDate = this.datePipe.transform(result[1], 'yyyyMMdd');
      }
    }
  }

  // 切换面板
  changePanel(flag): void {
    if (flag !== this.currentPanel) { this.loadData(flag); }
    if (flag !== 'voice') {
      this.isSaveIOSVoiceButton = false;
      this.isSaveANDROIDVoiceButton = false;
    }
    // tslint:disable-next-line:max-line-length
    this.currentChannelName = localStorage.getItem('currentAppHeader') === 'XIAOWU' ? '你好小悟' : localStorage.getItem('currentAppHeader') === 'LENZE' ? '听听同学' : '沃特沃德6';
    this.currentPanel = flag;
    // tslint:disable-next-line:max-line-length
    const operationInput = { op_category: '运维后台', op_page: flag === 'taxi' ? '打车监控' : flag === 'voice' ? '语音配置' : flag === 'taxiState' ? '打车状态监控' : '', op_name: '访问' };
    this.commonService.updateOperationlog(operationInput).subscribe();
  }

}
