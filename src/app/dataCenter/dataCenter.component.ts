import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { CommonService } from '../public/service/common.service';
import { DataCenterService } from '../public/service/dataCenter.service';

registerLocaleData(zh);

@Component({
  selector: 'app-dataCenter',
  templateUrl: './dataCenter.component.html',
  styleUrls: ['./dataCenter.component.scss']
})
export class DataCenterComponent implements OnInit {

  visiable = {explain: false, sessionLine: false, orign: false };
  searchDataCenterForm: FormGroup;
  pageSize = 100;
  beginDate = '';
  endDate = '';
  isSpinning = false;
  currentPanel = 'dataApp';
  commonDataCenter = [{bot: '', totalUsers: 0, orderRecommend: 0, orderQuery: 0, orderCommit: 0, orderCheckout: 0, total: 0, totalAwaken: 0, totalTurnover: 0}];
  dataCenterStatus = 'all';
  currentTitle = 'APP总览';
  checkDataOptions = {};
  coreOperation = {};
  currentTabNum = 0;
  currentSessionBusiness = 1; // 对话日志下的类型
  checkAllChannel = false;
  chartData = { name: [], awake: [], order: [], amount: [] };
  checkOrign = {
    allApp: false,
    allSdk: false,
    allApi: false,
    allTest: false,
    phone: {xiaowu: false,tingting: false,wotewode: false,},
    car: {botai: false,tongxingApi: false,tongxingSdk: false,tongxingTest: false,},
    watch: {weiteSdk: false,weiteTest: false,},
    robot: {xiaohaSdk: false,xiaohaTest: false,},
    other: {k11Api: false,k11Test: false,}
  };
  constructor(
    public commonService: CommonService,
    private dataCenterService: DataCenterService,
    private modalService: NzModalService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private routerParams: ActivatedRoute,
    public el: ElementRef,
  ) {
    this.commonService.nav[0].active = true;
    this._initForm();
    this.beginDate = this.commonService.getDay(-7);
    this.endDate = this.commonService.getDay(-1);
    this.checkDataOptions = {
      'dataApp': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }],
      'keepApp': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true } ],
      'overview': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, ],
      'product': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, ],
      'error': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, ],
      'ticket': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, ],
      'train': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, ],
      'hotel': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, ],
      'weather': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, ],
      'navigate': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, ],
      'taxi': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, ],
      'music': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }],
      'horoscope': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }],
      'recharge': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }],
      'errand': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }],
      'movie': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }],
      'tts': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }],
      'reminder': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }],
      'news': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }],
      'equip': [{ 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }, { 'checked': true }],
    };
  }

  ngOnInit() {
    this.initData();
  }

  initData(): void {
    this.routerParams.queryParams.subscribe((params: ParamMap) => {
      this.currentTabNum = params['currentTab'] - 1;
    });
    switch (Number(this.currentTabNum) + 1) {
      case 1: this.currentPanel = 'dataApp'; break;
      case 2: this.currentPanel = 'keepApp'; break;
      case 3: this.currentPanel = 'overview'; break;
      case 4: this.currentPanel = 'product'; break;
      case 5: this.currentPanel = 'error'; break;
      case 6: this.currentPanel = 'ticket'; break;
      case 7: this.currentPanel = 'train'; break;
      case 8: this.currentPanel = 'hotel'; break;
      case 9: this.currentPanel = 'weather'; break;
      case 10: this.currentPanel = 'navigate'; break;
      case 11: this.currentPanel = 'taxi'; break;
      case 12: this.currentPanel = 'music'; break;
      case 13: this.currentPanel = 'horoscope'; break;
      case 14: this.currentPanel = 'recharge'; break;
      case 15: this.currentPanel = 'errand'; break;
      case 16: this.currentPanel = 'movie'; break;
      case 17: this.currentPanel = 'tts'; break;
      case 18: this.currentPanel = 'reminder'; break;
      case 19: this.currentPanel = 'news'; break;
      case 20: this.currentPanel = 'equip'; break;
      default: break;
    }
    this.doSearch('dataCenter');
  }

  // 获取单元数据
  loadUnitData(platform): void {
    let flag = 'operate-data';
    switch (this.currentPanel) {
      // case 'dataApp': flag = 'user-behavior'; break; // 变更暂时去除
      case 'dataApp': flag = 'operate-data'; break;
      // case 'overview': flag = 'bot-awaken'; break; // 变更暂时去除
      case 'overview': flag = 'bot-data'; break;
      case 'keepApp': flag = 'retentions'; break;
      case 'product': flag = 'user-behavior'; break;
      case 'error': flag = 'bot-exception'; break;
      case 'ticket': flag = 'flight-bot'; break;
      case 'train': flag = 'train-bot'; break;
      case 'hotel': flag = 'hotel-bot'; break;
      case 'weather': flag = 'weather-bot'; break;
      case 'navigate': flag = 'navigation-bot'; break;
      case 'taxi': flag = 'taxi-bot'; break;
      case 'music': flag = 'music-bot'; break;
      case 'horoscope': flag = 'horoscope-bot'; break;
      case 'recharge': flag = 'recharge-bot'; break;
      case 'errand': flag = 'errand-bot'; break;
      case 'movie': flag = 'movie-bot'; break;
      case 'tts': flag = 'tts-switch'; break;
      case 'reminder': flag = 'matter-bot'; break;
      case 'news': flag = 'news-bot'; break;
      case 'equip': flag = 'bluetooth-link'; break;
      default: break;
    }
    this.isSpinning = true; // loading
    const input = {
      begin: this.beginDate,
      end: this.endDate,
      platform: platform,
      origin: this.getAppKeys().join(','),
      flag: flag,
      checkAllChannel: this.checkAllChannel,
    };
    this.dataCenterService.getUnitList(input).subscribe(res => {
      this.commonDataCenter.splice(0, this.commonDataCenter.length);  // 清空
      if (res.retcode === 0 && res.status !== 500) {
        if (flag === 'operate-data') {
          this.commonDataCenter = JSON.parse(JSON.parse(res.payload).detail);
          console.log(this.commonDataCenter);
          this.coreOperation = JSON.parse(res.payload).all;
          console.log(this.coreOperation);
        } else {
          if (flag === 'bot-data') {
            this.commonDataCenter = JSON.parse(res.payload);
            let total = 0;
            let orderRecommend = 0;
            let orderQuery = 0;
            let orderCommit = 0;
            let orderCheckout = 0;
            this.commonDataCenter.forEach(item => {
              if (item.bot === '总计') {
                total = item.totalUsers;
                orderRecommend = item.orderRecommend;
                orderQuery = item.orderQuery;
                orderCommit = item.orderCommit;
                orderCheckout = item.orderCheckout;
              }
            });
            const recommend = [];
            recommend.push( {value: orderRecommend, name:'订单推荐数'}, {value: orderQuery, name:'订单请求数'}, {value: orderCommit, name:'订单提交数'}, {value: orderCheckout, name:'订单成交数'} );
            this.commonDataCenter.map(item => { item.total = total; this.chartData.order = recommend; });
            this.commonDataCenter.forEach(item => {
              if (item.bot !== '总计') {
                this.chartData.name.push(item.bot);
                this.chartData.awake.push({ value: item.totalAwaken, name: item.bot });
              }
              if (item.bot === '火车' || item.bot === '机票' || item.bot === '酒店' || item.bot === '打车' || item.bot === '充话费' || item.bot === '电影票' || item.bot === '闪送') {
                this.chartData.amount.push({ value: item.totalTurnover, name: item.bot });
              }
            })
            console.log(this.chartData);
            setTimeout(() => { this.loadEchart(); }, 300);
          } else {
            this.commonDataCenter = JSON.parse(res.payload).reverse();
          }
          console.log(this.commonDataCenter);

        }

        this.isSpinning = false;  // loading
        const operationInput = { op_category: '数据中心', op_page: this.currentTitle, op_name: '访问' };
        this.commonService.updateOperationlog(operationInput).subscribe();
      } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
    });
  }

  // 查询
  doSearch(flag): void {
    if (flag === 'dataCenter') {
      this.chartData = { name: [], awake: [], order: [], amount: [] };  // 清空数据
      this.coreOperation = {};  // 清空数据
      const params = this.searchDataCenterForm.controls['status'].value === '' ? 'all' : this.searchDataCenterForm.controls['status'].value;
      this.dataCenterStatus = params;
      if (params === 'all') {
        this.loadUnitData('');
        localStorage.setItem('isDataCenterSearch', 'true');
      } else {
        const platform = params.indexOf('IOS') > -1 ? 'IOS' : params.indexOf('Android') > -1 ? 'Android' : '';
        this.loadUnitData(platform);
      }
    }
  }

  // 日期插件
  onChange(flag, result): void {
    if (flag === 'date') {
      // 正确选择数据
      if (result[0] !== '' || result[1] !== '') {
        this.beginDate = this.datePipe.transform(result[0], 'yyyyMMdd');
        this.endDate = this.datePipe.transform(result[1], 'yyyyMMdd');
      }
      // 手动点击清空
      if (this.beginDate === null || this.endDate === null) {
        this.beginDate = this.commonService.getDay(-7);
        this.endDate = this.commonService.getDay(-1);
      }
    } else if (flag === 'allApp' || flag === 'allSdk' || flag === 'allApi' || flag === 'allTest') {
      if (flag === 'allApp') {
        this.checkOrign.phone.xiaowu = result;
        this.checkOrign.phone.tingting = result;
        this.checkOrign.phone.wotewode = result;
      } else if (flag === 'allSdk') {
        this.checkOrign.car.tongxingSdk = result;
        this.checkOrign.watch.weiteSdk = result;
        this.checkOrign.watch.weiteTest = result;
        this.checkOrign.robot.xiaohaSdk = result;
        this.checkOrign.robot.xiaohaTest = result;
        this.checkOrign.other.k11Test = result;
      } else if (flag === 'allApi') {
        this.checkOrign.car.botai = result;
        this.checkOrign.car.tongxingApi = result;
        this.checkOrign.car.tongxingTest = result;
        this.checkOrign.other.k11Api  = result;
      } else if (flag === 'allTest') {
        this.checkOrign.car.tongxingSdk = result;
        this.checkOrign.car.tongxingTest = result;
        this.checkOrign.watch.weiteTest = result;
        this.checkOrign.robot.xiaohaTest  = result;
        this.checkOrign.other.k11Api  = result;
        this.checkOrign.other.k11Test  = result;
      }
    }
  }

  private _initForm(): void {
    this.searchDataCenterForm = this.fb.group({ date: [''], status: [''], });
  }

  // 展开数据说明
  shouSomething(flag) {
    if (flag === 'explain') {
      this.visiable.explain = true;
    }
  }

  // 关闭数据说明
  hideSomething(flag) {
    if (flag === 'explain') {
      this.visiable.explain = false;
    }
  }

  // 切换面板
  changePanel(flag): void {
    if (flag !== this.currentPanel) { this.currentPanel = flag; this.doSearch('dataCenter'); }
    localStorage.setItem('dataCenterTab', flag);
    this.currentTitle = flag === 'dataApp' ? 'APP总览' : flag === 'keepApp' ? 'App留存' : flag === 'overview' ? 'BOT总览' :
     flag === 'product' ? '产品权限' : flag === 'error' ? '异常表述' : flag === 'ticket' ? '机票BOT' : flag === 'train' ? '火车BOT'
     : flag === 'hotel' ? '酒店BOT' : flag === 'weather' ? '天气BOT' : flag === 'navigate' ? '导航BOT' : flag === 'taxi' ? '打车BOT' :
     flag === 'music' ? '音乐BOT' : flag === 'horoscope' ? '星座BOT' : flag === 'recharge' ? '闪送BOT' : flag === 'errand' ? '充话费BOT' :
      flag === 'movie' ? '电影BOT' : flag === 'tts' ? '语音切换BOT' : flag === 'reminder' ? '事项提醒BOT' : flag === 'news' ? '新闻BOT' :
       flag === 'equip' ? '设备接入BOT' : '';
  }

  // 选择对话日志的业务类型
  chooseSessionBusiness(val, flag) {
    console.log(val);
    this.currentSessionBusiness = flag;
  }

  // 展开数据说明
  showSomething(flag) {
    if (flag === 'orign') {
      this.visiable.orign = this.visiable.orign === true ? false : true;
    }
  }

  // 获取所有来源
  getAppKeys() {
    const arr = [];
    this.checkOrign.phone.xiaowu ? arr.push('XIAOWU') : null;
    this.checkOrign.phone.tingting ? arr.push('LENZE') : null;
    this.checkOrign.phone.wotewode ? arr.push('WATER_WORLD_6') : null;
    this.checkOrign.car.botai ? arr.push('pateo-carconsole-api-pro') : null;
    this.checkOrign.car.tongxingApi ? arr.push('txzing-carconsole-api-pro') : null;
    this.checkOrign.car.tongxingSdk ? arr.push('txzing-sdk-test') : null;
    this.checkOrign.car.tongxingTest ? arr.push('txzing-carconsole-api-test') : null;
    this.checkOrign.watch.weiteSdk ? arr.push('weitezhineng') : null;
    this.checkOrign.watch.weiteTest ? arr.push('weitezhineng-test') : null;
    this.checkOrign.robot.xiaohaSdk ? arr.push('honeybot') : null;
    this.checkOrign.robot.xiaohaTest ? arr.push('honey-test') : null;
    this.checkOrign.other.k11Api ? arr.push('K11-publicscreen-api-pro') : null;
    this.checkOrign.other.k11Test ? arr.push('K11-test') : null;
    return arr;
  }

  loadEchart(): void {
    const chartAwakeOption = {
      title : { text: 'BOT 总唤醒数', subtext: '', x:'left' },
      tooltip : { trigger: 'item', formatter: "{a} <br/>{b} : {c}" },
      legend: { orient: 'vertical', left: '.', show: false, data: this.chartData.name },
      color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      series : [
        {
          name: '访问来源', type: 'pie', radius : '55%', center: ['50%', '50%'],
          data: this.chartData.awake,
          itemStyle: { emphasis: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
        }
      ]
    };
    const mychartsAwake = echarts.init(this.el.nativeElement.querySelector('#echartsAwake'));
    mychartsAwake.setOption(chartAwakeOption);

    const chartOrderOption = {
      title: { text: '订单漏斗', subtext: '', left: 'left', top: 'bottom' },
      tooltip: { trigger: 'item', formatter: "{a} <br/>{b} : {c}" },
      toolbox: { orient: 'vertical', top: 'center', feature: { dataView: {readOnly: true}, restore: {}, saveAsImage: {} } },
      legend: { orient: 'vertical', left: '20', top: '120', show: false, data: ['订单推荐数', '订单请求数', '订单提交数', '订单成交数'] },
      color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      calculable: true,
      series: [
        {
          name: '漏斗图', type:'funnel', width: '25', height: '65%', left: '15%', top: '60%',
          label: { normal: { position: 'left' } },
          data: this.chartData.order
        }
      ]
    };
    const mychartsOrder = echarts.init(this.el.nativeElement.querySelector('#echartsOrder'));
    mychartsOrder.setOption(chartOrderOption);

    const chartAmountOption = {
      title : { text: '订单金额', subtext: '', x:'left' },
      tooltip : { trigger: 'item', formatter: "{a} <br/>{b} : {c}" },
      legend: { orient: 'vertical', left: '.', show: false, data: this.chartData.name },
      color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      series : [
        {
          name: '访问来源', type: 'pie', radius : '55%', center: ['50%', '50%'],
          data: this.chartData.amount,
          itemStyle: { emphasis: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
        }
      ]
    };
    const mychartsAmount = echarts.init(this.el.nativeElement.querySelector('#echartsAmount'));
    mychartsAmount.setOption(chartAmountOption);

  }

}
