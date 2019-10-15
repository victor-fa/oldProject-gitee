import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalService, NzNotificationService, UploadFile } from 'ng-zorro-antd';
import { filter } from 'rxjs/operators';
import { ActivityService } from '../public/service/activity.service';
import { BatchsendService } from '../public/service/batchsend.service';
import { CommonService } from '../public/service/common.service';
import { CouponService } from '../public/service/coupon.service';
import { LocalizationService } from '../public/service/localization.service';
import { XiaowubeanService } from '../public/service/xiaowubean.service';
import { TaskService } from '../public/service/task.service';

registerLocaleData(zh);

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  visiable = {addActivity: false, coupon: false, preview: false, addCoupon: false, modifyCoupon: false,
    previewCoupon: false, addTaskCenter: false, modifyTaskCenter: false, addBatchsend: false, detailBatchsend: false,
    couponInBatchsend: false, batchsend: false, addBean: false, modifyBean: false, searchBean: false, resetTaskCenter: false,
    ensureResetTaskCenter: false, };
  loading = false;
  searchActivityForm: FormGroup;
  searchCouponInActivityForm: FormGroup;
  addActivityForm: FormGroup;
  searchCouponForm: FormGroup;
  searchTaskCenterForm: FormGroup;
  searchTaskLogsForm: FormGroup;
  searchCouponStatisticsForm: FormGroup;
  dataActivity = []; // 活动
  dataSearchCoupon = [];
  beginBaseInfoDate = ''; // 基本信息日期选择
  endBaseInfoDate = '';
  beginRuleDate = ''; // 模板1日期选择
  endRuleDate = '';
  beginCouponDate = ''; // 红包日期选择
  endCouponDate = '';
  fileList: UploadFile[] = [];
  imageUrl = '';
  showImageUrl = '';
  activityRadioValue = 'LoginOneOff';
  addMarginArr = [{ chargeThreshold: '', totalQuantity: '', perUserQuantity: '', actGiftNo: '' }];  // 模板D下的对区间数量的操作
  searchActivityItem = { actName: '', actStatus: '' };
  allSearchCouponChecked = false; // 用于table多选
  indeterminate = false; // 用于table多选
  baseInfoId = ''; // 上传图片前的Id
  couponListArr = []; // 最底部的活动奖励配置数组
  actGiftNo = ''; // 非区间重置的活动编码
  actGiftNoArr = [{ value: '', label: '---选择红包组---' }];  // 用于下拉当前有的红包组
  couponGiftNo = '';  // 修改红包组时候，传值到弹框中
  isModifyModelShow = false;  // 针对修改弹框的标识
  modifyctivityItem = { actName: '', actStartDate: '', actEndDate: '', actRuleDesc: '', actTypeStart: '', actTypeEnd: '', totalQuantity: '', perUserQuantity: '', chargeThreshold: '', actPageUrl: '' };
  now = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  cmsId = '';
  emptyAdd = ['', '', '', '', '', '', ''];  // 清空新增表单
  couponBeginDate = '';
  couponEndDate = '';
  dataTaskCenter = [{'taskAward': {'stepRule': {}, 'stepRuleFinal': {}}, checked: false, id: '' }];  // 任务中心
  dataTaskLogs = [];  // 任务日志
  beginTaskCenterDate = '';
  endTaskCenterDate = '';
  beginTaskCenterActDate = '';
  endTaskCenterActDate = '';
  beginTaskLogDate = '';
  endTaskLogDate = '';
  couponDate = { 'couponName': '', 'discountType': 'FIX_DISCOUNT', 'discountPrices': [{main: '', content: ''}], 'timeLimitValidDay': '', 'timeLimitType': 'fix_start_end', 'timeLimitStart': '', 'timeLimitEnd': '', 'couponCategory': '', 'mutualExcludeRules': '' };
  dataCoupon = []; // 内容
  couponAllChecked = false;
  displayData = [];
  searchCouponItem = { couponName: '', discountType: '', couponCategory: '', ctimeStart: '', ctimeEnd: '' };
  checkCouponOptions = [
    { label: '活动不可用', value: 'promition_unavailable', checked: false },
    { label: '仅会员可用', value: 'vip_only', checked: false }
  ];
  category = [
    { name : '飞机', value : 'flight', checked : true, disabled: false },
    { name : '酒店', value : 'hotel', checked : true, disabled: false },
    { name : '火车', value : 'train', checked : true, disabled: false },
    { name : '打车', value : 'taxi', checked : true, disabled: false }
  ];
  currentPanel = 'coupon';
  searchCouponInBatchsendForm: FormGroup;
  beginBatchsendDate = '';
  endBatchsendDate = '';
  beginCouponInBatchsendDate = null; // 红包日期选择
  endCouponInBatchsendDate = null;
  allSearchCouponInBatchsendChecked = false; // 用于table多选
  batchsendData = { 'title': '', 'description': '', 'displayMessage': '', 'errorRevL': [], 'invalidRevL': [], 'pendingRevL': '', 'pushRuleId': '', 'pushStatus': '', 'successRevL': '', 'sendTime': '', 'totalRevNum': '', 'actCouponRulePoL': [], 'tempCouponName': [] };
  dataSearchCouponInBatchsend = [];
  dataBatchsend = []; // 内容
  couponListArrInBatchsend = []; // 最底部的活动奖励配置数组
  finalBatchsendData = { 'displayMessage': '', 'errorRevL': [], 'invalidRevL': [], 'pendingRevL': [], 'pushRuleId': '', 'pushStatus': '', 'successRevL': '', 'sendTime': '', 'totalRevNum': '', 'actCouponRulePoL': [], 'tempCouponName': [] };
  beanData = [];
  beanPageSize = 100;
  isSpinning = false;
  beanItem = { 'activeStatus': '', 'beginTime': '', 'depositAmount': '', 'describe': '', 'endTime': '', 'giftPercent': 1, 'id': '', 'presentType': '', 'title': '', 'type': '', giftAmount: '' };
  addBeanForm: FormGroup;
  searchBeanForm: FormGroup;
  modifyBeanForm: FormGroup;
  beginBeanDate = null;
  endBeanDate = null;
  radioBeanValue = 'PERCENT_GIFT';  // 单选
  templateId = '';
  tabsetJson = { currentNum: 0, param: '' };
  taskCenterName = '';
  addTaskCenter = {
    taskType: 'DAILY', taskBehavior: '', checkLimitNumber: false, jumpType: 'NONE', checkBean: false, checkExperience: false, checkSkill: false, checkBeanRes: 'Fixed',
    checkExperienceRes: 'Fixed', checkSkillRes: 'Fixed', activityRule: 'recharge', checkActivityBean: false, totalTimes: '', name: '', description: '', group: '', sequence: '', pic: '',
    jump: {msg: '', page: 1, url: '', appMsg: ''}, rule: { beanValue: '', beanPreValue: '', expValue: '', perkValue: '' },
    stepRule: [{ rechargeAmount: '', checkBean: false, checkBeanRes: 'Fixed', beanValue: '', beanPreValue: '', checkExperience: false, expValue: '', checkSkill: false, perkValue: '' }],
    date: []
  };
  semdMesCodeText = 60;
  operateObject = { code: '', operator: '18682233554' }; // 操作人
  dateRange = [];
  dateRangeA = [];
  // resetTaskCenterCheckOptions = [];

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private modalService: NzModalService,
    public localizationService: LocalizationService,
    private activityService: ActivityService,
    private couponService: CouponService,
    private batchsendService: BatchsendService,
    private notification: NzNotificationService,
    private xiaowubeanService: XiaowubeanService,
    private msg: NzMessageService,
    private datePipe: DatePipe,
    private http: HttpClient,
    private taskService: TaskService,
  ) {
    this.commonService.nav[6].active = true;
    this._initForm();
    // this.resetTaskCenterCheckOptions = [
    //   { label: '新手教学', value: 'aaaaa', checked: false },
    //   { label: '听音频', value: 'bbbbb', checked: false },
    //   { label: '充话费', value: 'ccccc', checked: false },
    //   { label: '使用导航', value: 'ddddd', checked: false },
    //   { label: '打电话', value: 'eeeee', checked: false },
    //   { label: '听新闻', value: 'fffff', checked: false },
    //   { label: '购买机票', value: 'ggggg', checked: false },
    //   { label: '购买火车票', value: 'hhhhh', checked: false },
    //   { label: '订酒店', value: 'iiiii', checked: false },
    //   { label: '首次打车', value: 'jjjjj', checked: false },
    //   { label: '闪送订单', value: 'kkkkk', checked: false },
    //   { label: '星座订单', value: 'lllll', checked: false },
    //   { label: '电影票名单', value: 'mmmmm', checked: false },
    //   { label: '设置支付密码', value: 'nnnnn', checked: false },
    //   { label: '开通免密支付', value: 'nnnnn', checked: false },
    //   { label: '出行人', value: 'nnnnn', checked: false },
    //   { label: '常用联系人', value: 'nnnnn', checked: false },
    //   { label: '常用地址', value: 'nnnnn', checked: false },
    //   { label: '配送地址', value: 'nnnnn', checked: false },
    //   { label: '发票抬头', value: 'nnnnn', checked: false }
    // ];
  }

  ngOnInit() {
    const tabFlag = [{label: '优惠券配置', value: 'coupon'}, {label: '优惠券活动', value: 'activity'},
        {label: '批量发放', value: 'batchsendList'}, {label: '充值送豆', value: 'bean'},
        {label: '任务中心', value: 'taskCenter'}, {label: '任务日志', value: 'taskLogs'}];
    let targetFlag = 0;
    for (let i = 0; i < tabFlag.length; i++) {
      if (this.commonService.haveMenuPermission('children', tabFlag[i].label)) {targetFlag = i; break; }
    }
    console.log(tabFlag[targetFlag].value);
    this.loadData(tabFlag[targetFlag].value);
    this.changePanel(tabFlag[targetFlag].value);
  }

  loadData(flag) {
    this.isSpinning = true; // loading
    if (flag === 'activity') {
      this.searchActivityItem.actName = this.searchActivityForm.controls['actName'].value;
      this.searchActivityItem.actStatus = this.searchActivityForm.controls['actStatus'].value;
      this.activityService.getActivityList(this.searchActivityItem).subscribe(res => {
        if (res.retcode === 0 && res.status !== 500 && res.payload !== '') {
          this.isSpinning = false;
          this.dataActivity = JSON.parse(res.payload);
          const operationInput = { op_category: '活动管理', op_page: '活动管理', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.dataActivity.forEach(data => {
            let actGiftNo = '';
            let count = 0;
            if (data.actTypeBo && data.actTypeBo !== undefined) { actGiftNo = data.actTypeBo.actGiftNo; }
            if (data.actGiftRuleConfigL) {
              data.actGiftRuleConfigL.forEach(item => {
                if (item.actCouponRulePoL && item.actGiftNo === actGiftNo) {
                  item.actCouponRulePoL.forEach(cell => { count += cell.quantity; });
                }
              });
            }
            data.allQuantity = count;
          });
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'couponInActivity') {
      if (this.beginCouponDate === null) {
        this.beginCouponDate = this.commonService.getDayWithAcross(-7);
        this.endCouponDate = this.commonService.getDayWithAcross(-1);
      }
      const searchCouponItem = {
        couponName: encodeURI(this.searchCouponInActivityForm.controls['couponName'].value),
        discountType: this.searchCouponInActivityForm.controls['discountType'].value,
        couponCategory: this.searchCouponInActivityForm.controls['couponCategory'].value,
        ctimeStart: this.beginCouponDate + 'T00:00:00.000Z',
        ctimeEnd: this.endCouponDate + 'T23:59:59.999Z',
      };
      this.couponService.getCouponList(searchCouponItem).subscribe(res => {
        if (res.retcode === 0 && res.status === 200 && res.payload !== '') {
          this.isSpinning = false;
          if (res.payload === '') {
            this.modalService.error({ nzTitle: '提示', nzContent: res.message });
            return;
          }
          this.dataSearchCoupon = JSON.parse(res.payload);
          const operationInput = { op_category: '活动管理', op_page: '优惠券', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'newCoupon') {
      this.activityService.getNewCouponList(this.baseInfoId).subscribe(res => {
        if (res.retcode === 0 && res.status === 200 && res.payload !== '') {
          this.isSpinning = false;
          this.actGiftNoArr = [{ value: '', label: '---无---' }]; // 重置数组，因为接口返回全部
          if (res.payload === '' || res.payload === 'null') { return; }
          this.couponListArr = JSON.parse(res.payload);
          const operationInput = { op_category: '活动管理', op_page: '优惠券', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.couponListArr.forEach(item => {
            const tempObject = { value: item.actGiftNo, label: item.actGiftNo };
            this.actGiftNoArr.push(tempObject);
          });
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'coupon') {
      this.couponService.getCouponList(this.searchCouponItem).subscribe(res => {
        if (res.retcode === 0 && res.status === 200 && res.payload !== '') {
          this.isSpinning = false;
          this.dataCoupon = JSON.parse(res.payload);
          const operationInput = { op_category: '活动管理', op_page: '优惠券', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          console.log(this.dataCoupon);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'batchsendList') {
      const batchsend = { sendStartTime: this.beginBatchsendDate, sendEndTime: this.endBatchsendDate };
      this.batchsendService.getBatchsendList(batchsend).subscribe(res => {
        if (res.retcode === 0 && res.status === 200 && res.payload !== '') {
          this.isSpinning = false;
          this.dataBatchsend = JSON.parse(res.payload);
          const operationInput = { op_category: '活动管理', op_page: '批量发放', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          if (this.dataBatchsend.length > 0) {
            this.dataBatchsend.forEach(item => {
              item.totalRevNum = (item.pendingRevL !== undefined ? item.pendingRevL.length : 0) + (item.invalidRevL !== undefined ? item.invalidRevL.length : 0) + (item.errorRevL !== undefined ? item.errorRevL.length : 0) + (item.successRevL !== undefined ? item.successRevL.length : 0);
            });
          }
          console.log(this.dataBatchsend);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'couponInBatchsend') {
      if (this.beginCouponInBatchsendDate === null) {
        this.beginCouponInBatchsendDate = this.commonService.getDayWithAcross(-7);
        this.endCouponInBatchsendDate = this.commonService.getDayWithAcross(-1);
      }
      const searchCouponItem = {
        couponName: encodeURI(this.searchCouponInBatchsendForm.controls['couponName'].value),
        discountType: this.searchCouponInBatchsendForm.controls['discountType'].value,
        couponCategory: this.searchCouponInBatchsendForm.controls['couponCategory'].value,
        ctimeStart: this.beginCouponInBatchsendDate + 'T00:00:00.000Z',
        ctimeEnd: this.endCouponInBatchsendDate + 'T23:59:59.999Z',
      };
      this.couponService.getCouponList(searchCouponItem).subscribe(res => {
        if (res.retcode === 0 && res.status === 200 && res.payload !== '') {
          this.isSpinning = false;
          this.dataSearchCouponInBatchsend = JSON.parse(res.payload);
          const operationInput = { op_category: '活动管理', op_page: '优惠券', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'bean') {
      const beanInput = {
        title: this.searchBeanForm.controls['title'].value,
        beginTime: this.beginBeanDate,
        endTime: this.endBeanDate
      };
      this.xiaowubeanService.getXiaowubeanList(beanInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.beanData = JSON.parse(res.payload);
          const operationInput = { op_category: '活动管理', op_page: '充值送豆', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          const nowTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
          this.beanData.forEach((item, i) => {
            const beginTime = this.datePipe.transform(item.beginTime, 'yyyy-MM-dd HH:mm:ss');
            const endTime = this.datePipe.transform(item.endTime, 'yyyy-MM-dd HH:mm:ss');
            let result = '';
            if (this.compareDate(nowTime, beginTime)) {
              result = '未开始';
            } else if (this.compareDate(endTime, nowTime)) {
              result = '已结束';
            } else if (this.compareDate(beginTime, nowTime) && this.compareDate(nowTime, endTime)) {
              result = '进行中';
            }
            item.activeStatus = result;
          });
          this.isSpinning = false;  // loading
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'taskCenter') {
      const taskCenterInput = {
        name: this.taskCenterName,
        type: this.searchTaskCenterForm.controls['type'].value,
        createTimeFloor: this.beginTaskCenterDate,
        createTimeCeil: this.endTaskCenterDate,
      };
      this.taskService.getTaskCenterList(taskCenterInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataTaskCenter = JSON.parse(res.payload).content;
          this.dataTaskCenter.forEach(item => {
            if (item.taskAward) {
              if (item.taskAward.stepRule) {
                for (const key in item.taskAward.stepRule) {
                  item.taskAward.stepRuleFinal = item.taskAward.stepRule[key];
                }
              }
            }
          });
          console.log(this.dataTaskCenter);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
      const operationInput = { op_category: '活动管理', op_page: '任务中心', op_name: '访问' };
      this.commonService.updateOperationlog(operationInput).subscribe();
      this.isSpinning = false;
    } else if (flag === 'taskLogs') {
      const logInput = {
        finishTimeFloor: this.beginTaskLogDate,
        finishTimeCeil: this.endTaskLogDate,
        userId: this.searchTaskLogsForm.controls['userId'].value,
        userPhone: this.searchTaskLogsForm.controls['userPhone'].value,
        taskName: this.searchTaskLogsForm.controls['taskName'].value,
      };
      this.taskService.getTaskCenterLog(logInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataTaskLogs = JSON.parse(res.payload).content;
          console.log(this.dataTaskLogs);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
      const operationInput = { op_category: '活动管理', op_page: '任务日志', op_name: '访问' };
      this.commonService.updateOperationlog(operationInput).subscribe();
      this.isSpinning = false;
    }
  }

  doSearchCoupon(flag) {
    if (flag === 'coupon') {
      this.searchCouponItem.couponName = this.searchCouponForm.controls['couponName'].value;
      this.searchCouponItem.discountType = this.searchCouponForm.controls['discountType'].value;
      this.searchCouponItem.couponCategory = this.searchCouponForm.controls['couponCategory'].value;
      this.searchCouponItem.ctimeStart = this.couponBeginDate;
      this.searchCouponItem.ctimeEnd = this.couponEndDate;
      this.loadData('coupon');
    }
  }

  private _initForm(): void {
    this.searchCouponForm = this.fb.group({ couponName: [''], discountType: [''], couponCategory: [''], date: [''], });
    this.searchActivityForm = this.fb.group({ actName: [''], actStatus: [''], });
    this.searchCouponInActivityForm = this.fb.group({ couponName: [''], discountType: [''], couponCategory: [''], date: [''], });
    this.addActivityForm = this.fb.group({ actName: [''], date: [''], actRuleDesc: [''], actType: [''], chargeThreshold: [''],
      totalQuantity: [''], perUserQuantity: [''], actGiftNo: [''], temp: [''], actPageUrl: [''] });
    this.searchCouponInBatchsendForm = this.fb.group({ couponName: [''], discountType: [''], couponCategory: [''], date: [''], });
    this.searchBeanForm = this.fb.group({ title: [''], date: [''], });
    this.addBeanForm = this.fb.group({ title: [''], describe: [''], date: [''], type: [''], depositAmount: [''], giftPercent: [''],
      giftAmount: ['']});
    this.modifyBeanForm = this.fb.group({ title: [''], describe: [''], date: [''], type: [''], depositAmount: [''], giftPercent: [''],
      giftAmount: [''], });
    this.searchTaskCenterForm = this.fb.group({ name: [''], type: [''], date: [''] });
    this.searchTaskLogsForm = this.fb.group({ date: [''], userId: [''], userPhone: [''], taskName: [''] });
    this.searchCouponStatisticsForm = this.fb.group({ aaa: [''], date: [''] });
  }

  // 弹框
  showModal(flag, data) {
    if (flag === 'addActivity') { // 新增活动
      this.visiable.addActivity = true;
      this.isModifyModelShow = false;
      this.beginRuleDate = ''; // 模板1日期选择
      this.endRuleDate = '';
      this.modifyctivityItem = { actName: '', actStartDate: '', actEndDate: '', actRuleDesc: '', actTypeStart: '', actTypeEnd: '', totalQuantity: '', perUserQuantity: '', chargeThreshold: '', actPageUrl: '' };
    } else if (flag === 'modifyActivity') { // 修改活动
      console.log(data);
      this.baseInfoId = data.id;
      this.visiable.addActivity  = true;
      this.isModifyModelShow = true;
      this.modifyctivityItem = { actName: data.actName, actStartDate: data.actStartDate, actEndDate: data.actEndDate, actRuleDesc: data.actRuleDesc, actTypeStart: '', actTypeEnd: '', totalQuantity: '', perUserQuantity: '', chargeThreshold: '', actPageUrl: '' };
      if (data.actTypeBo) { // 针对活动规则配置
        this.modifyctivityItem.actTypeStart = data.actTypeBo.actTypeStartDate + ' ' + data.actTypeBo.actTypeStartTime;
        this.modifyctivityItem.actTypeEnd = data.actTypeBo.actTypeEndDate + ' ' + data.actTypeBo.actTypeEndTime;
        this.modifyctivityItem.totalQuantity = data.actTypeBo.totalQuantity;
        this.modifyctivityItem.perUserQuantity = data.actTypeBo.perUserQuantity;
        data.actTypeBo.chargeThreshold ? this.modifyctivityItem.chargeThreshold = data.actTypeBo.chargeThreshold : null;
        this.loadData('newCoupon'); // 加载红包组数据
      }
      if (data.imageResPos) { // 针对文件展示
        if (data.imageResPos.length > 0) {
          const imageUrl = `${this.commonService.baseUrl}`;
          this.showImageUrl = imageUrl.substring(0, imageUrl.indexOf('/api')) + data.imageResPos[0].relativeUri;
          const file: any = { name: data.imageResPos[0].originName };
          this.fileList.push(file);
        }
      }
      this.dateRange = [data.actStartDate, data.actEndDate];
      this.dateRangeA = [this.modifyctivityItem.actTypeStart, this.modifyctivityItem.actTypeEnd];
      data.actType ? this.activityRadioValue = data.actType : null; // 有选择活动模板
      console.log(this.modifyctivityItem);
    } else if (flag === 'addCoupon') { // 新增红包 | 活动奖励
      if (this.baseInfoId === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '基本信息未填写' });
        return;
      }
      this.visiable.coupon = true;
      this.couponGiftNo = '';
      this.loadData('couponInActivity');
    } else if (flag === 'modifyCouponInActivity') { // 修改红包 | 活动奖励
      this.couponGiftNo = data.actGiftNo;
      this.visiable.coupon = true;
      this.loadData('couponInActivity');
    } else if (flag === 'preview') { // 活动页预览
      this.visiable.preview = true;
    } else if (flag === 'coupon') { // 优惠券的展开弹框
      this.visiable.addCoupon = true;
      this.couponDate = { 'couponName': '', 'discountType': 'FIX_DISCOUNT', 'discountPrices': [{main: '', content: ''}], 'timeLimitValidDay': '', 'timeLimitType': 'fix_start_end', 'timeLimitStart': '', 'timeLimitEnd': '', 'couponCategory': '', 'mutualExcludeRules': '' };
    } else if (flag === 'modifyCoupon') { // 修改优惠券弹框
      this.visiable.modifyCoupon = true;
      console.log(data);
      this.cmsId = data.couponId;  // 用于修改
      this.couponDate = data;
      const prices = [];
      for (var item in data.discountPrices) {
        prices.push({main: item, content: data.discountPrices[item]});
      }
      this.couponDate.discountPrices = prices;
      data.mutualExcludeRules ? this.changeMutualExcludeRules(data.mutualExcludeRules) : null;
      this.changeCouponCategory(data.couponCategory);
      this.couponBeginDate = data.timeLimitStart ? data.timeLimitStart : this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.couponEndDate = data.timeLimitEnd ? data.timeLimitEnd : this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.dateRange = [data.timeLimitStart, data.timeLimitEnd];
      console.log(this.couponDate);
    } else if (flag === 'previewCoupon') {  // 查看优惠券
      this.visiable.previewCoupon = true;
      this.couponDate = data;
      const prices = [];
      for (var item in data.discountPrices) {
        prices.push({main: item, content: data.discountPrices[item]});
      }
      this.couponDate.discountPrices = prices;
      data.mutualExcludeRules ? this.changeMutualExcludeRules(data.mutualExcludeRules) : null;
      this.changeCouponCategory(data.couponCategory);
      this.couponBeginDate = data.timeLimitStart ? data.timeLimitStart : this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.couponEndDate = data.timeLimitEnd ? data.timeLimitEnd : this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      console.log(this.couponDate);
    } else if (flag === 'addBatchsend') {
      this.batchsendData = { 'title': '', 'description': '', 'displayMessage': '', 'errorRevL': [], 'invalidRevL': [], 'pendingRevL': '', 'pushRuleId': '', 'pushStatus': '', 'successRevL': '', 'sendTime': '', 'totalRevNum': '', 'actCouponRulePoL': [], 'tempCouponName': [] };  // 清空
      this.loadData('couponInBatchsend');
      this.visiable.addBatchsend = true;
    } else if (flag === 'detail') {
      this.batchsendData = data;
      if (this.batchsendData.actCouponRulePoL) {
        const tempArr = [];
        this.batchsendData.actCouponRulePoL.forEach((item, i) => { tempArr.push(item.couponRulePo.couponName); });
        this.batchsendData.tempCouponName = tempArr;
      }
      this.visiable.detailBatchsend = true;
    } else if (flag === 'addCouponInBatchsend') { // 新增红包 | 活动奖励
      this.visiable.couponInBatchsend = true;
      this.couponListArrInBatchsend = [];
      this.loadData('couponInBatchsend');
    } else if (flag === 'modifyCouponInBatchsend') { // 配置红包 | 活动奖励
      this.visiable.couponInBatchsend = true;
    } else if (flag === 'batchsend') { // 批量发送
      this.finalBatchsendData.pendingRevL = this.batchsendData.pendingRevL.split('\n');
      this.finalBatchsendData.actCouponRulePoL = this.couponListArrInBatchsend;
      this.finalBatchsendData.displayMessage = this.batchsendData.displayMessage;
      if (this.finalBatchsendData.actCouponRulePoL) {
        const tempArr = [];
        this.finalBatchsendData.actCouponRulePoL.forEach((item, i) => {
          tempArr.push(item.couponName);
        });
        this.finalBatchsendData.tempCouponName = tempArr;
      }
      this.visiable.batchsend = true;
    } else if (flag === 'addBean') {
      this.beanItem = { // 重置数据
        'activeStatus': '', 'beginTime': '', 'depositAmount': '', 'describe': '', 'endTime': '',
         'giftPercent': 1, 'id': '', 'presentType': '', 'title': '', 'type': '', giftAmount: ''
      };
      this.beginBeanDate = null;  // 重置日期
      this.endBeanDate = null;
      this.radioBeanValue = 'PERCENT_GIFT'; // 重置单选
      this.visiable.addBean = true;
    } else if (flag === 'modifyBean') {
      this.beanItem = data;
      this.beanItem.giftPercent = data.giftPercent ? (data.giftPercent * 100) : 0;
      this.beginBeanDate = data.beginTime;  // 重置日期
      this.endBeanDate = data.endTime;
      this.radioBeanValue = data.type; // 重置单选
      this.beanItem.id = data.id;
      this.visiable.modifyBean = true;
    } else if (flag === 'searchBean') {
      this.visiable.searchBean = true;
      this.beanItem = data;
      this.beanItem.giftPercent = data.giftPercent ? data.giftPercent : 0;
      this.radioBeanValue = data.type;
    } else if (flag === 'addTaskCenter') {
      this.visiable.addTaskCenter = true;
    } else if (flag === 'modifyTaskCenter') {
      this.templateId = data;
      this.taskService.getTaskCenter(data).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          const task = JSON.parse(res.payload);
          console.log(task);
          const stepRule = [];
          if (task.taskAward.stepRule) {
            for (const key in task.taskAward.stepRule) {
              stepRule.push({
                rechargeAmount: key,
                checkBean: task.taskAward.stepRule[key].beanAwardType === 'FIXED' || task.taskAward.stepRule[key].beanAwardType === 'Percentage' ? true : task.taskAward.stepRule[key].beanAwardType === 'NONE' ? false : false,
                checkBeanRes: task.taskAward.stepRule[key].beanAwardType === 'FIXED' ? 'Fixed' : task.taskAward.stepRule[key].beanAwardType === 'SCALE' ? 'Percentage' : '',
                beanValue: task.taskAward.stepRule[key].beanAwardType === 'FIXED' ? task.taskAward.stepRule[key].beanValue : '',
                beanPreValue: task.taskAward.stepRule[key].beanAwardType === 'SCALE' ? task.taskAward.stepRule[key].beanValue : '',
                checkExperience: task.taskAward.stepRule[key].expAwardType === 'FIXED' ? true : task.taskAward.stepRule[key].expAwardType === 'NONE' ? false : false,
                expValue: task.taskAward.stepRule[key].expAwardType === 'FIXED' ? task.taskAward.stepRule[key].expValue : '',
                checkSkill: task.taskAward.stepRule[key].perkAwardType === 'FIXED' ? true : task.taskAward.stepRule[key].perkAwardType === 'NONE' ? false : false,
                perkValue: task.taskAward.stepRule[key].perkAwardType === 'FIXED' ? task.taskAward.stepRule[key].perkValue : ''
              });
            };
          }
          this.addTaskCenter = {
            taskType: task.type,
            taskBehavior: task.action,
            checkLimitNumber: task.totalTimes > 0 ? true : false,
            jumpType: task.jump.type,
            checkBean: task.taskAward.rule ? task.taskAward.rule.beanAwardType === 'FIXED' || task.taskAward.rule.beanAwardType === 'Percentage' ? true : task.taskAward.rule.beanAwardType === 'NONE' ? false : false : false,
            checkExperience: task.taskAward.rule ? task.taskAward.rule.expAwardType === 'FIXED' ? true : task.taskAward.rule.expAwardType === 'NONE' ? false : false : false,
            checkSkill: task.taskAward.rule ? task.taskAward.rule.perkAwardType === 'FIXED' ? true : task.taskAward.rule.perkAwardType === 'NONE' ? false : false : false,
            checkBeanRes: task.taskAward.rule ? task.taskAward.rule.beanAwardType === 'FIXED' ? 'Fixed' : task.taskAward.rule.beanAwardType === 'SCALE' ? 'Percentage' : '' : '',
            checkExperienceRes: task.taskAward.rule ? task.taskAward.rule.expAwardType === 'FIXED' ? 'Fixed' : '' : '',
            checkSkillRes: task.taskAward.rule ? task.taskAward.rule.perkAwardType === 'FIXED' ? 'Fixed' : '' : '',
            activityRule: task.taskAward.strategy,
            checkActivityBean: false, // 活动的
            totalTimes: task.totalTimes,
            name: task.name,
            description: task.description,
            group: task.group,
            sequence: task.sequence,
            pic: task.pic,
            jump: {
              msg: task.jump.msg ? task.jump.msg : '',
              page: task.jump.page ? task.jump.page : 1,
              url: task.jump.url ? task.jump.url : '',
              appMsg: task.jump.msg && task.jump.page === 9 && task.jump.type === 'APP' ? task.jump.msg : ''
            },
            rule: {
              beanValue: task.taskAward.rule ? task.taskAward.rule.beanAwardType === 'FIXED' ? task.taskAward.rule.beanValue : '' : '',
              beanPreValue: task.taskAward.rule ? task.taskAward.rule.beanAwardType === 'SCALE' ? task.taskAward.rule.beanValue : '' : '',
              expValue: task.taskAward.rule ? task.taskAward.rule.expAwardType === 'FIXED' ? task.taskAward.rule.expValue : '' : '',
              perkValue: task.taskAward.rule ? task.taskAward.rule.perkAwardType === 'FIXED' ? task.taskAward.rule.perkValue : '' : ''
            },
            stepRule: stepRule,
            date: [task.effectiveTimeFloor, task.effectiveTimeCeil],
          };
          console.log(this.addTaskCenter);
          this.beginTaskCenterActDate = task.effectiveTimeFloor;
          this.endTaskCenterActDate = task.effectiveTimeCeil;
          const file: any = {};
          this.fileList.push(file);
          this.imageUrl = task.pic;
          this.showImageUrl = `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}/v1/tasks/photos/${task.pic}`;
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
      this.visiable.modifyTaskCenter = true;
    } else  if (flag === 'goTaskCenter') {  // 查看充值
      this.taskCenterName = data.taskName;
      setTimeout(() => { this.loadData('taskCenter'); }, 1000);
      this.tabsetJson.currentNum = 4;
    } else if (flag === 'resetTaskCenter') {  // 重置任务
      this.visiable.resetTaskCenter = true;
    } else if (flag === 'ensureResetTaskCenter') {  // 确定重置
      let count = 0;
      this.dataTaskCenter.forEach(item => { if (item.checked === true) { count++; } });
      if (count === 0) { this.modalService.error({ nzTitle: '提示', nzContent: '您未选择需要重置的任务' }); return; }
      this.hideModal('resetTaskCenter');
      this.visiable.ensureResetTaskCenter = true;
    }
  }

  hideModal(flag) {
    if (flag === 'activity') {
      this.visiable.addActivity = false;
      this.fileList.length = 0;
      this.imageUrl = '';
      this.showImageUrl = '';
      this.beginBaseInfoDate = '';
      this.endBaseInfoDate = '';
      this.activityRadioValue = 'LoginOneOff';  //
      this.baseInfoId = ''; // 清空Id
      this.actGiftNoArr = [{ value: '', label: '---无---' }]; // 重置数组，因为接口返回全部
      this.couponListArr = [];  // 重置最下面的活动奖励配置
    } else if (flag === 'couponInActivity') {
      this.visiable.coupon = false;
      this.beginCouponDate = null;
      this.endCouponDate = null;
    } else if (flag === 'preview') { // 活动页预览
      this.visiable.preview = false;
    } else if (flag === 'addCoupon') { // 隐藏优惠券
      this.visiable.addCoupon = false;
    } else if (flag === 'modifyCoupon') { // 隐藏优惠券
      this.couponDate = { 'couponName': '', 'discountType': 'FIX_DISCOUNT', 'discountPrices': [{main: '', content: ''}], 'timeLimitValidDay': '', 'timeLimitType': 'fix_start_end', 'timeLimitStart': '', 'timeLimitEnd': '', 'couponCategory': '', 'mutualExcludeRules': '' };
      this.checkCouponOptions.map(item => item.checked = false);
      this.category.map(item => item.checked = true);
      this.couponBeginDate = '';
      this.couponEndDate = '';
      this.loadData('coupon');
      this.visiable.modifyCoupon = false;
    } else if (flag === 'previewCoupon') {
      this.couponDate = { 'couponName': '', 'discountType': 'FIX_DISCOUNT', 'discountPrices': [{main: '', content: ''}], 'timeLimitValidDay': '', 'timeLimitType': 'fix_start_end', 'timeLimitStart': '', 'timeLimitEnd': '', 'couponCategory': '', 'mutualExcludeRules': '' };
      this.checkCouponOptions.map(item => item.checked = false);
      this.category.map(item => item.checked = true);
      this.couponBeginDate = '';
      this.couponEndDate = '';
      this.loadData('coupon');
      this.visiable.previewCoupon = false;
    } else if (flag === 'batchsendList') {
      this.visiable.addBatchsend = false;
      this.beginCouponInBatchsendDate = null;
      this.endCouponInBatchsendDate = null;
    } else if (flag === 'detailBatchsend') {  // 查看
      this.visiable.detailBatchsend = false;
    } else if (flag === 'couponInBatchsend') { // 新增红包
      this.visiable.couponInBatchsend = false;
      this.beginCouponInBatchsendDate = null;
      this.endCouponInBatchsendDate = null;
    } else if (flag === 'batchsend') {
      this.visiable.batchsend = false;
    } else if (flag === 'addBean') {
      this.beginBeanDate = null;  // 重置日期
      this.endBeanDate = null;
      this.loadData('bean');
      this.visiable.addBean = false;
    } else if (flag === 'modifyBean') {
      this.beginBeanDate = null;  // 重置日期
      this.endBeanDate = null;
      this.loadData('bean');
      this.visiable.modifyBean = false;
    } else if (flag === 'searchBean') {
      this.loadData('bean');
      this.visiable.searchBean = false;
    } else if (flag === 'taskCenter') {
      this.addTaskCenter = {
        taskType: 'DAILY', taskBehavior: '', checkLimitNumber: false, jumpType: 'NONE', checkBean: false, checkExperience: false, checkSkill: false,
        checkBeanRes: 'Fixed', checkExperienceRes: 'Fixed', checkSkillRes: 'Fixed', activityRule: 'recharge', checkActivityBean: false, totalTimes: '', name: '', description: '',
        group: '', sequence: '', pic: '', jump: {msg: '', page: 1, url: '', appMsg: ''}, rule: { beanValue: '', beanPreValue: '', expValue: '', perkValue: '' },
        stepRule: [{ rechargeAmount: '', checkBean: false, checkBeanRes: 'Fixed', beanValue: '', beanPreValue: '', checkExperience: false, expValue: '', checkSkill: false, perkValue: '' }],
        date: []
      };
      this.fileList.splice(0, this.fileList.length);
      this.imageUrl = '';
      this.showImageUrl = '';
      this.visiable.addTaskCenter = false;
      this.visiable.modifyTaskCenter = false;
    } else if (flag === 'resetTaskCenter') {
      this.visiable.resetTaskCenter = false;
    } else if (flag === 'ensureResetTaskCenter') {
      this.visiable.ensureResetTaskCenter = false;
    }
  }

  // 封装验证新增
  verificationAdd(flag): boolean {
    let result = true;
    if (flag === 'activity') {
      if (this.activityRadioValue === 'LoginOneOff' || this.activityRadioValue === 'LoginDaily') {
        if (this.addActivityForm.controls['totalQuantity'].value === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '奖励发放上限未填写' });
          result = false;
        } else if (this.addActivityForm.controls['perUserQuantity'].value === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '每个用户可领未填写' });
          result = false;
        } else if (this.addMarginArr[0].actGiftNo === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '下拉的活动奖励配置未选择' });
          result = false;
        }
      } else if (this.activityRadioValue === 'ChargeOneOff') {
        if (this.addActivityForm.controls['chargeThreshold'].value === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '充值额度约束未填写' });
          result = false;
        } else if (this.addActivityForm.controls['totalQuantity'].value === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '奖励发放上限未填写' });
          result = false;
        } else if (this.addActivityForm.controls['perUserQuantity'].value === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '每个用户可领未填写' });
          result = false;
        } else if (this.addMarginArr[0].actGiftNo === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '下拉的活动奖励配置未选择' });
          result = false;
        }
      } else if (this.activityRadioValue === 'ChargeMargin') {
        this.addMarginArr.forEach(item => {
          if (item.chargeThreshold === '') {
            this.modalService.error({ nzTitle: '提示', nzContent: '有充值额度约束未填写' });
            result = false;
          } else if (item.totalQuantity === '') {
            this.modalService.error({ nzTitle: '提示', nzContent: '有奖励发放上限未填写' });
            result = false;
          } else if (item.perUserQuantity === '') {
            this.modalService.error({ nzTitle: '提示', nzContent: '有每个用户可领未填写' });
            result = false;
          } else if (item.actGiftNo === '') {
            this.modalService.error({ nzTitle: '提示', nzContent: '有下拉的活动奖励配置未选择' });
            result = false;
          }
        });
      }
    } else if (flag === 'baseInfo') {
      if (this.addActivityForm.controls['actName'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '活动名称未填写' });
        result = false;
      } else if (this.addActivityForm.controls['actRuleDesc'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '活动规则未填写' });
        result = false;
      } else if (this.addActivityForm.controls['actPageUrl'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '活动链接未填写' });
        result = false;
      }
    } else if (flag === 'addCoupon') {
    } else if (flag === 'modifyCoupon') {
    } else if (flag === 'batchsend') {
      if (this.batchsendData.pendingRevL === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '发送对象未填写' });
        result = false;
      } else if (this.batchsendData.title === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '标题未填写' });
        result = false;
      } else if (this.batchsendData.description === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '摘要未填写' });
        result = false;
      } else if (this.batchsendData.displayMessage === '' || this.batchsendData.displayMessage === null) {
        this.modalService.error({ nzTitle: '提示', nzContent: '内容未填写' });
        result = false;
      } else if (this.couponListArrInBatchsend === []) {
        this.modalService.error({ nzTitle: '提示', nzContent: '发送奖励配置未选择' });
        result = false;
      }
    } else if (flag === 'activity') {
      // if (this.radioBeanValue === 'LoginOneOff' || this.radioBeanValue === 'LoginDaily') {
      //   if (this.addBeanForm.controls['totalQuantity'].value === '') {
      //     this.modalService.error({ nzTitle: '提示', nzContent: '奖励发放上限未填写' });
      //     result = false;
      //   } else if (this.addBeanForm.controls['perUserQuantity'].value === '') {
      //     this.modalService.error({ nzTitle: '提示', nzContent: '每个用户可领未填写' });
      //     result = false;
      //   } else if (this.addMarginArr[0].actGiftNo === '') {
      //     this.modalService.error({ nzTitle: '提示', nzContent: '下拉的活动奖励配置未选择' });
      //     result = false;
      //   }
      // }
    } else if (flag === 'addBean') {
      let content = '';
      this.beanData.forEach(item => {
        if (this.compareDate(item.beginTime, this.beginBeanDate) && this.compareDate(this.beginBeanDate, item.endTime)
          || this.compareDate(item.beginTime, this.endBeanDate) && this.compareDate(this.endBeanDate, item.endTime)) {
          content += (item.title + '————' + item.beginTime + '~' + item.endTime + '<br>');
        }
      });
      if (content !== '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '您输入的有效时间跟其他活动时间重叠，请重新选择时间<br>' + content });
        result = false;
      }
    } else if (flag === 'modifyBean') {
      let content = '';
      this.beanData.forEach(item => {
        if (this.beanItem.id === item.id) { return; } // 不跟自己比较
        if (this.compareDate(item.beginTime, this.beginBeanDate) && this.compareDate(this.beginBeanDate, item.endTime)
          || this.compareDate(item.beginTime, this.endBeanDate) && this.compareDate(this.endBeanDate, item.endTime)) {
          content += (item.title + '————' + item.beginTime + '~' + item.endTime + '<br>');
        }
      });
      if (content !== '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '您输入的有效时间跟其他活动时间重叠，请重新选择时间<br>' + content });
        result = false;
      }
    } else if (flag === 'taskCenter') {
      if (this.addTaskCenter.taskType === 'DAILY' || this.addTaskCenter.taskType === 'NOVICE') {  // 每日、新手
        if (this.addTaskCenter.checkLimitNumber === true) { // 勾选次数限制
          if (this.addTaskCenter.totalTimes === '') { this.modalService.error({ nzTitle: '提示', nzContent: '次数限制未填写' }); result = false; }
        }
        if (this.addTaskCenter.taskBehavior === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '任务行为未选择' }); result = false;
        } else if (this.addTaskCenter.name === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '任务名称未填写' }); result = false;
        } else if (this.addTaskCenter.description === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '任务描述未填写' }); result = false;
        } else if (this.addTaskCenter.group === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '任务排序前置数字未填写' }); result = false;
        } else if (this.addTaskCenter.sequence === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '任务排序后置数字未填写' }); result = false;
        } else if (this.imageUrl === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '任务icon未上传' }); result = false;
        }
        if (this.addTaskCenter.jumpType === 'DIALOG') {
          if (this.addTaskCenter.jump.msg === '') { this.modalService.error({ nzTitle: '提示', nzContent: '提示弹框的内容未填写' }); result = false; }
        }
        if (this.addTaskCenter.jumpType === 'WEB') {
          if (this.addTaskCenter.jump.url === '') { this.modalService.error({ nzTitle: '提示', nzContent: '跳转到网页的网页未填写' }); result = false; }
        }
        if (this.addTaskCenter.checkBean === true) {
          if (this.addTaskCenter.checkBeanRes === 'Fixed') {
            if (this.addTaskCenter.rule.beanValue === '') { this.modalService.error({ nzTitle: '提示', nzContent: '小悟豆的固定金额未填写' }); result = false; }
          }
          if (this.addTaskCenter.checkBeanRes === 'Percentage') {
            if (this.addTaskCenter.rule.beanPreValue === '') { this.modalService.error({ nzTitle: '提示', nzContent: '小悟豆的百分比未填写' }); result = false; }
          }
        }
        if (this.addTaskCenter.checkExperience === true) {
          if (this.addTaskCenter.rule.expValue === '') {this.modalService.error({nzTitle: '提示', nzContent: '经验的固定经验未填写' }); result = false; }
        }
        if (this.addTaskCenter.checkSkill === true) {
          if (this.addTaskCenter.rule.perkValue === '') {this.modalService.error({nzTitle: '提示', nzContent: '技能点的固定技能点未填写' }); result = false; }
        }
      } else if (this.addTaskCenter.taskType === 'ACTIVITY') {
        if (this.addTaskCenter.name === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '活动名称未填写' }); result = false;
        } else if (this.beginTaskCenterActDate === '' || this.endTaskCenterActDate === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '活动时间未选择' }); result = false;
        } else if (this.addTaskCenter.description === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '活动描述未填写' }); result = false;
        } else if (this.imageUrl === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '活动icon未上传' }); result = false;
        }
        this.addTaskCenter.stepRule.forEach(item => { // 循环判断是否有每填的内容
          if (item.rechargeAmount === '') {
            this.modalService.error({ nzTitle: '提示', nzContent: '充值金额未填写' }); result = false;
          }
          if (item.checkBean === true) {  // 检查小悟豆点击
            if (item.checkBeanRes === 'Fixed') {
              if (item.beanValue === '') { this.modalService.error({ nzTitle: '提示', nzContent: '小悟豆的固定金额未填写' }); result = false; }
            }
            if (item.checkBeanRes === 'Percentage') {
              if (item.beanPreValue === '') { this.modalService.error({ nzTitle: '提示', nzContent: '小悟豆的百分比未填写' }); result = false; }
            }
          }
          if (item.checkExperience === true) {  // 检查经验点击
            if (item.expValue === '') {this.modalService.error({nzTitle: '提示', nzContent: '经验的固定经验未填写' }); result = false; }
          }
          if (item.checkSkill === true) {  // 检查技能点点击
            if (item.perkValue === '') {this.modalService.error({nzTitle: '提示', nzContent: '技能点的固定技能点未填写' }); result = false; }
          }
        });
      }
    }
    return result;
  }

  // 新增操作
  doSave(flag): void {
    if (flag === 'activity') { // 保存操作
      if (!this.verificationAdd('activity')) { return; }
      let actTypeBo = {};
      if (this.activityRadioValue === 'LoginOneOff' || this.activityRadioValue === 'LoginDaily') {
        actTypeBo = {
          'actTypeStartDate': this.beginRuleDate.substring(0, this.beginRuleDate.indexOf('@')),
          'actTypeEndDate': this.endRuleDate.substring(0, this.endRuleDate.indexOf('@')),
          'actTypeStartTime': this.beginRuleDate.substring(this.beginRuleDate.indexOf('@') + 1),
          'actTypeEndTime': this.endRuleDate.substring(this.endRuleDate.indexOf('@') + 1),
          'totalQuantity': this.addActivityForm.controls['totalQuantity'].value,
          'perUserQuantity': this.addActivityForm.controls['perUserQuantity'].value,
          'actGiftNo': this.addMarginArr[0].actGiftNo, // 活动奖励包编码
        };
      } else if (this.activityRadioValue === 'ChargeOneOff') {
        actTypeBo = {
          'actTypeStartDate': this.beginRuleDate.substring(0, this.beginRuleDate.indexOf('@')),
          'actTypeEndDate': this.endRuleDate.substring(0, this.endRuleDate.indexOf('@')),
          'actTypeStartTime': this.beginRuleDate.substring(this.beginRuleDate.indexOf('@') + 1),
          'actTypeEndTime': this.endRuleDate.substring(this.endRuleDate.indexOf('@') + 1),
          'chargeThreshold': this.addActivityForm.controls['chargeThreshold'].value,
          'totalQuantity': this.addActivityForm.controls['totalQuantity'].value,
          // 'consumedQuantity': this.addActivityForm.controls['consumedQuantity'].value,  // 该字段是后台自己使用
          'perUserQuantity': this.addActivityForm.controls['perUserQuantity'].value,
          'actGiftNo': this.addMarginArr[0].actGiftNo, // 活动奖励包编码
        };
      } else if (this.activityRadioValue === 'ChargeMargin') {
        actTypeBo = {
          'actTypeStartDate': this.beginRuleDate.substring(0, this.beginRuleDate.indexOf('@')),
          'actTypeEndDate': this.endRuleDate.substring(0, this.endRuleDate.indexOf('@')),
          'actTypeStartTime': this.beginRuleDate.substring(this.beginRuleDate.indexOf('@') + 1),
          'actTypeEndTime': this.endRuleDate.substring(this.endRuleDate.indexOf('@') + 1),
          'actSubTypeL': this.addMarginArr,
        };
      }
      const activityInput = {
        'id': this.baseInfoId,
        'actName': this.addActivityForm.controls['actName'].value,
        'actStartDate': this.beginRuleDate.substring(0, this.beginRuleDate.indexOf('@')),
        'actEndDate': this.endRuleDate.substring(0, this.endRuleDate.indexOf('@')),
        'actRuleDesc': this.addActivityForm.controls['actRuleDesc'].value,
        'actPageUrl': this.addActivityForm.controls['actPageUrl'].value,
        'actType': this.activityRadioValue,
        'actTypeBo': actTypeBo
      };
      this.activityService.saveActivity(activityInput).subscribe(res => {
        if (res.retcode === 0) {
          const result = JSON.parse(res.payload).fillStatus;
          if (result === 'finished') {
            this.notification.blank( '提示', '保存成功，全部信息填写完整', { nzStyle: { color : 'green' } });
            this.hideModal('activity');
          } else if (result === 'unfinished') {
            this.notification.blank( '提示', '保存成功，但有信息未填完整', { nzStyle: { color : 'green' } });
          }
          const operationInput = { op_category: '活动管理', op_page: '活动管理', op_name: '保存' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('activity');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'couponInActivity') { // 保存红包组选择区
      const couponArr = [];
      let checkedCount = 0;
      let quantityCount = 0;
      this.dataSearchCoupon.forEach(data => {
        if (data.checked === true) {
          couponArr.push(data);
          checkedCount++;
          data.quantity ? quantityCount++ : null;
        }
      });
      if (checkedCount === 0) { // 优惠券未勾选
        this.modalService.error({ nzTitle: '提示', nzContent: '请勾选优惠券' });
        return;
      }
      if (quantityCount === 0 || checkedCount !== quantityCount) {  // 勾选的优惠券中有数量未填写
        this.modalService.error({ nzTitle: '提示', nzContent: '勾选的优惠券的数量限制不能为空' });
        return;
      }
      const couponAddInput = { 'actRuleId': this.baseInfoId, 'actCouponRulePoL': couponArr };
      const couponUpdateInput = { 'actRuleId': this.baseInfoId, 'actGiftNo': this.couponGiftNo, 'actCouponRulePoL': couponArr };
      if (this.couponGiftNo === '') { // 根据弹框前传过来的值判断是新增还是修改
        this.activityService.addCoupon(couponAddInput).subscribe(res => {
          if (res.retcode === 0) {
            this.visiable.coupon = false;
            this.notification.blank( '提示', '新增红包组成功', { nzStyle: { color : 'green' } });
            const operationInput = { op_category: '活动管理', op_page: '活动管理', op_name: '新增' };
            this.commonService.updateOperationlog(operationInput).subscribe();
            this.loadData('newCoupon');
          } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
        });
      } else { // 修改
        this.activityService.updateCoupon(couponUpdateInput).subscribe(res => {
          if (res.retcode === 0) {
            this.visiable.coupon = false;
            this.notification.blank( '提示', '配置红包组成功', { nzStyle: { color : 'green' } });
            const operationInput = { op_category: '活动管理', op_page: '优惠券', op_name: '修改' };
            this.commonService.updateOperationlog(operationInput).subscribe();
            this.loadData('newCoupon');
          } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
        });
      }
    } else if (flag === 'addCoupon') {
      if (!this.verificationAdd('addCoupon')) { return; }
      let couponInput = {};
      const prices = {};
      this.couponDate.discountPrices.map(item => { prices[item.main] = item.content; });
      if (this.couponDate.timeLimitType === 'fix_start_end') {
        couponInput = {
          'couponName': this.couponDate.couponName,
          'discountType': this.couponDate.discountType,
          'discountPrices': prices,
          'timeLimitType': this.couponDate.timeLimitType,
          'timeLimitStart': this.couponBeginDate.substring(0, 10),
          'timeLimitEnd': this.couponEndDate.substring(0, 10),
          'couponCategory': this.getCheckedCategory(),
        };
      } else if (this.couponDate.timeLimitType === 'fix_duration') {
        couponInput = {
          'couponName': this.couponDate.couponName,
          'discountType': this.couponDate.discountType,
          'discountPrices': prices,
          'timeLimitValidDay': this.couponDate.timeLimitValidDay,
          'timeLimitType': this.couponDate.timeLimitType,
          'couponCategory': this.getCheckedCategory(),
        };
      }
      console.log(couponInput);
      this.couponService.addCoupon(couponInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '活动管理', op_page: '优惠券', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('addCoupon');
          this.loadData('coupon');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'modifyCoupon') {
      if (!this.verificationAdd('modifyCoupon')) { return; }
      let couponInput = {};
      const prices = {};
      this.couponDate.discountPrices.map(item => { prices[item.main] = item.content; });
      if (this.couponDate.timeLimitType === 'fix_start_end') {
        couponInput = {
          'couponId': this.cmsId,
          'couponName': this.couponDate.couponName,
          'discountType': this.couponDate.discountType,
          'discountPrices': prices,
          'timeLimitType': this.couponDate.timeLimitType,
          'timeLimitStart': this.couponBeginDate.substring(0, 10),
          'timeLimitEnd': this.couponEndDate.substring(0, 10),
          'couponCategory': this.getCheckedCategory(),
          // 'mutualExcludeRules': this.getMutualExcludeRules(),  // 暂时去除互斥限制
        };
      } else if (this.couponDate.timeLimitType === 'fix_duration') {
        couponInput = {
          'couponId': this.cmsId,
          'couponName': this.couponDate.couponName,
          'discountType': this.couponDate.discountType,
          'discountPrices': prices,
          'timeLimitValidDay': this.couponDate.timeLimitValidDay,
          'timeLimitType': this.couponDate.timeLimitType,
          'couponCategory': this.getCheckedCategory(),
          // 'mutualExcludeRules': this.getMutualExcludeRules(),  // 暂时去除互斥限制
        };
      }
      console.log(couponInput);
      this.couponService.updateCoupon(couponInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '活动管理', op_page: '优惠券', op_name: '修改优惠券' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('modifyCoupon');
          this.loadData('coupon');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'batchsendList') {
      let count = 0;
      if (!this.verificationAdd('batchsend')) { return; }
      this.batchsendData.pendingRevL.split('\n').forEach(item => {
        if (!this.isPoneAvailable(item)) { count++; }
      });
      if (count > 0) {
        this.modalService.error({ nzTitle: '提示', nzContent: '输入的手机号码中有不符合要求的！' });
        return;
      }
      console.log(this.batchsendData);
      this.showModal('batchsend', '');  // 打开发送弹窗
    } else if (flag === 'couponInBatchsend') { // 保存红包组选择区
      const couponArr = [];
      let checkedCount = 0;
      let quantityCount = 0;
      console.log(this.dataSearchCouponInBatchsend);
      this.dataSearchCouponInBatchsend.forEach(data => {
        if (data.checked === true) {
          couponArr.push(data);
          checkedCount++;
          data.quantity ? quantityCount++ : null;
        }
      });
      if (checkedCount === 0) { // 优惠券未勾选
        this.modalService.error({ nzTitle: '提示', nzContent: '请勾选优惠券' });
        return;
      }
      if (quantityCount === 0 || checkedCount !== quantityCount) {  // 勾选的优惠券中有数量未填写
        this.modalService.error({ nzTitle: '提示', nzContent: '勾选的优惠券的数量限制不能为空' });
        return;
      }
      this.couponListArrInBatchsend = couponArr;
      this.hideModal('couponInBatchsend');
      this.notification.blank( '提示', '处理红包组成功', { nzStyle: { color : 'green' } });
    } else if (flag === 'batchsend') { // 批量发送
      // 调用新增接口
      const batchsendListInput = {
        // 'pendingRevL': this.addBatchsendForm.controls['pendingRevL'].value.split('\n'),
        // 'displayMessage': this.addBatchsendForm.controls['displayMessage'].value,
        'actCouponRulePoL': this.couponListArrInBatchsend,
      };
      this.batchsendService.addBatchsend(batchsendListInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          // 调用发送接口
          const batchsendInput = { 'pushRuleId': JSON.parse(res.payload).pushRuleId };
          this.batchsendService.batchsend(batchsendInput).subscribe(finalres => {
            if (finalres.retcode === 0) {
              this.notification.blank( '提示', '批量发送成功', { nzStyle: { color : 'green' } });
              const operationInput = { op_category: '活动管理', op_page: '批量发放', op_name: '批量发送' };
              this.commonService.updateOperationlog(operationInput).subscribe();
              this.hideModal('batchsendList');
              this.hideModal('batchsend');
              this.loadData('batchsendList');
            } else { this.modalService.error({ nzTitle: '提示', nzContent: finalres.message }); }
          });
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'addBean') { // 保存操作
      if (!this.verificationAdd('addBean')) { return; }
      let beanInput = {};
      if (this.radioBeanValue === 'PERCENT_GIFT') {
        beanInput = {
          'title': this.addBeanForm.controls['title'].value,
          'describe': this.addBeanForm.controls['describe'].value,
          'type': this.radioBeanValue,
          'depositAmount': this.addBeanForm.controls['depositAmount'].value,
          'giftPercent': (this.addBeanForm.controls['giftPercent'].value) / 100,  // 得到分数
          'beginTime': this.beginBeanDate,
          'endTime': this.endBeanDate,
        };
      } else if (this.radioBeanValue === 'FIXED_QUOTA_GIFT') {
        beanInput = {
          'title': this.addBeanForm.controls['title'].value,
          'describe': this.addBeanForm.controls['describe'].value,
          'type': this.radioBeanValue,
          'depositAmount': this.addBeanForm.controls['depositAmount'].value,
          'giftAmount': this.addBeanForm.controls['giftAmount'].value,
          'beginTime': this.beginBeanDate,
          'endTime': this.endBeanDate,
        };
      }
      this.xiaowubeanService.addXiaowubean(beanInput, this.radioBeanValue).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '活动管理', op_page: '充值送豆', op_name: '新增充值送豆' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.visiable.addBean = false;
          this.beginBeanDate = null;
          this.endBeanDate = null;
          this.loadData('bean');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'modifyBean') { // 保存操作
      if (!this.verificationAdd('modifyBean')) { return; }
      let beanInput = {};
      if (this.radioBeanValue === 'PERCENT_GIFT') {
        beanInput = {
          'id': this.beanItem.id,
          'title': this.modifyBeanForm.controls['title'].value,
          'describe': this.modifyBeanForm.controls['describe'].value,
          'type': this.radioBeanValue,
          'depositAmount': this.modifyBeanForm.controls['depositAmount'].value,
          'giftPercent': (this.modifyBeanForm.controls['giftPercent'].value) / 100,  // 得到分数
          'beginTime': this.beginBeanDate,
          'endTime': this.endBeanDate,
        };
      } else if (this.radioBeanValue === 'FIXED_QUOTA_GIFT') {
        beanInput = {
          'id': this.beanItem.id,
          'title': this.modifyBeanForm.controls['title'].value,
          'describe': this.modifyBeanForm.controls['describe'].value,
          'type': this.radioBeanValue,
          'depositAmount': this.modifyBeanForm.controls['depositAmount'].value,
          'giftAmount': this.modifyBeanForm.controls['giftAmount'].value,
          'beginTime': this.beginBeanDate,
          'endTime': this.endBeanDate,
        };
      }
      this.xiaowubeanService.updateXiaowubean(beanInput, this.radioBeanValue).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '活动管理', op_page: '批量发放', op_name: '修改充值送豆' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.visiable.modifyBean = false;
          this.beginBeanDate = null;
          this.endBeanDate = null;
          this.loadData('bean');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'taskCenter') {
      console.log(this.addTaskCenter);
      if (!this.verificationAdd('taskCenter')) { return; }
      let taskInput = {};
      if (this.addTaskCenter.taskType === 'DAILY' || this.addTaskCenter.taskType === 'NOVICE') {  // 每日、新手
        taskInput = {
          type: this.addTaskCenter.taskType,
          action: this.addTaskCenter.taskBehavior,
          totalTimes: this.addTaskCenter.checkLimitNumber === true ? this.addTaskCenter.totalTimes === '' ? 0 : Number(this.addTaskCenter.totalTimes) : '',
          name: this.addTaskCenter.name,
          description: this.addTaskCenter.description,
          group: this.addTaskCenter.group === '' ? 0 : Number(this.addTaskCenter.group),
          sequence: this.addTaskCenter.sequence === '' ? 0 : Number(this.addTaskCenter.sequence),
          pic: this.imageUrl,
          jump: {
            type: this.addTaskCenter.jumpType,
            msg: (this.addTaskCenter.jumpType === 'DIALOG' ? this.addTaskCenter.jump.msg : ((this.addTaskCenter.jumpType === 'APP' && Number(this.addTaskCenter.jump.page) === 9) ? this.addTaskCenter.jump.appMsg : '')),
            page: (this.addTaskCenter.jumpType === 'APP' ? Number(this.addTaskCenter.jump.page) : ''),
            url: (this.addTaskCenter.jumpType === 'WEB' ? this.addTaskCenter.jump.url : '')
          },
          taskAward: {
            strategy: 'DEFAULT',
            rule: {
              beanAwardType: this.addTaskCenter.checkBean === true ? (this.addTaskCenter.checkBeanRes === 'Fixed' ? 'FIXED' : 'SCALE') : 'NONE',
              beanValue: this.addTaskCenter.checkBeanRes === 'Fixed' ? (this.addTaskCenter.rule.beanValue === '' ? 0 : Number(this.addTaskCenter.rule.beanValue)) : this.addTaskCenter.checkBeanRes === 'Percentage' ? (this.addTaskCenter.rule.beanPreValue === '' ? 0 : Number(this.addTaskCenter.rule.beanPreValue))  : '',
              expAwardType: this.addTaskCenter.checkExperience === true ? 'FIXED' : 'NONE',
              expValue: this.addTaskCenter.rule.expValue === '' ? 0 : Number(this.addTaskCenter.rule.expValue),
              perkAwardType: this.addTaskCenter.checkSkill === true ? 'FIXED' : 'NONE',
              perkValue: this.addTaskCenter.rule.perkValue === '' ? 0 : Number(this.addTaskCenter.rule.perkValue)
            }
          },
        };
      } else if (this.addTaskCenter.taskType === 'ACTIVITY') {  // 活动
        const stepRule = {};
        this.addTaskCenter.stepRule.forEach(item => {
          stepRule[item.rechargeAmount] = {
            beanAwardType: item.checkBean === true ? (item.checkBeanRes === 'Fixed' ? 'FIXED' : 'SCALE') : 'NONE',
            beanValue: item.checkBeanRes === 'Fixed' ? (item.beanValue === '' ? 0 : Number(item.beanValue)) : item.checkBeanRes === 'Percentage' ? (item.beanPreValue === '' ? 0 : Number(item.beanPreValue))  : '',
            expAwardType: item.checkExperience === true ? 'FIXED' : 'NONE',
            expValue: item.expValue === '' ? 0 : Number(item.expValue),
            perkAwardType: item.checkSkill === true ? 'FIXED' : 'NONE',
            perkValue: item.perkValue === '' ? 0 : Number(item.perkValue)
          };
        });
        taskInput = {
          type: this.addTaskCenter.taskType,
          name: this.addTaskCenter.name,
          effectiveTimeCeil: this.endTaskCenterActDate,
          effectiveTimeFloor: this.beginTaskCenterActDate,
          description: this.addTaskCenter.description,
          pic: this.imageUrl,
          jump: {
            type: this.addTaskCenter.jumpType,
            msg: (this.addTaskCenter.jumpType === 'DIALOG' ? this.addTaskCenter.jump.msg : ((this.addTaskCenter.jumpType === 'APP' && Number(this.addTaskCenter.jump.page) === 9) ? this.addTaskCenter.jump.appMsg : '')),
            page: (this.addTaskCenter.jumpType === 'APP' ? Number(this.addTaskCenter.jump.page) : ''),
            url: (this.addTaskCenter.jumpType === 'WEB' ? this.addTaskCenter.jump.url : '')
          },
          taskAward: {
            strategy: 'RECHARGE',
            stepRule: stepRule
          },
        };
      }
      console.log(taskInput);
      const finalInput = this.commonService.deleteEmptyProperty(taskInput); // 删除null以及''的对象
      console.log(finalInput);
      if (this.visiable.addTaskCenter) {  // 新增弹窗
        this.taskService.addTaskCenter(finalInput).subscribe(res => {
          if (res.retcode === 0) {
            this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } });
            const operationInput = { op_category: '活动管理', op_page: '任务中心', op_name: '保存' };
            this.commonService.updateOperationlog(operationInput).subscribe();
            this.hideModal('taskCenter'); // 保存成功后，变为编辑按钮
            this.loadData('taskCenter');
          } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
        });
      } else if (this.visiable.modifyTaskCenter) {  // 修改弹窗
        this.taskService.updateTaskCenter(this.templateId, finalInput).subscribe(res => {
          if (res.retcode === 0) {
            this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } });
            const operationInput = { op_category: '活动管理', op_page: '任务中心', op_name: '保存' };
            this.commonService.updateOperationlog(operationInput).subscribe();
            this.hideModal('taskCenter'); // 保存成功后，变为编辑按钮
            this.loadData('taskCenter');
          } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
        });
      }
    } else if (flag === 'sendBatchMsg') {
      this.activityService.sendMsg(this.operateObject.operator).subscribe(res => {
        if (res.retcode === 0) {
          this.countDown();
          this.notification.blank( '提示', '发送成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '活动管理', op_page: '批量发放' , op_name: '发送短信' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'sendMsg') {
      this.taskService.sendMsg(this.operateObject.operator).subscribe(res => {
        if (res.retcode === 0) {
          this.countDown();
          this.notification.blank( '提示', '发送成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '活动管理', op_page: '任务中心' , op_name: '发送短信' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'resetTaskCenter') {
      const arr = [];
      this.dataTaskCenter.forEach(item => { if (item.checked === true) { arr.push(item.id); } }); // 获取被选中的task
      const resetInput = { code: this.operateObject.code, phone: this.operateObject.operator, taskIds: arr };
      this.taskService.resetTaskCenter(resetInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '重置成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '活动管理', op_page: '任务中心' , op_name: '重置任务' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('taskCenter');
          this.hideModal('ensureResetTaskCenter');
          this.hideModal('resetTaskCenter');
          this.operateObject = { code: '', operator: '18682233554' };
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  // 针对互斥限制
  changeMutualExcludeRules(params) {
    let mutualExcludeRules = [];
    mutualExcludeRules = params;
    if (mutualExcludeRules.length === 0) {
      this.checkCouponOptions[0].checked = false;
      this.checkCouponOptions[1].checked = false;
    } else if (mutualExcludeRules.length === 2) {
      this.checkCouponOptions[0].checked = true;
      this.checkCouponOptions[1].checked = true;
    } else {
      if (this.checkCouponOptions[0].value === 'promition_unavailable') {
        this.checkCouponOptions[0].checked = false;
        this.checkCouponOptions[1].checked = true;
      } else if (this.checkCouponOptions[0].value  === 'vip_only') {
        this.checkCouponOptions[0].checked = true;
        this.checkCouponOptions[1].checked = false;
      }
    }
  }

  // 针对品类切换状态
  changeCouponCategory(couponCategory) {
    if (couponCategory === 'all') {
      this.category[0].checked = true;
      this.category[1].checked = true;
      this.category[2].checked = true;
      this.category[3].checked = true;
    } else if (couponCategory === 'flight') {
      this.category[0].checked = true;
      this.category[1].checked = false;
      this.category[2].checked = false;
      this.category[3].checked = false;
    } else if (couponCategory === 'hotel') {
      this.category[0].checked = false;
      this.category[1].checked = true;
      this.category[2].checked = false;
      this.category[3].checked = false;
    } else if (couponCategory === 'train') {
      this.category[0].checked = false;
      this.category[1].checked = false;
      this.category[2].checked = true;
      this.category[3].checked = false;
    } else if (couponCategory === 'taxi') {
      this.category[0].checked = false;
      this.category[1].checked = false;
      this.category[2].checked = false;
      this.category[3].checked = true;
    }
  }

  // 删除 - 复用弹窗
  showDeleteModal(id, flag) { this.modalService.confirm({ nzTitle: '提示', nzContent: '您确定要删除该信息？', nzOkText: '确定', nzOnOk: () => this.doDelete(id, flag) }); }

  // 删除操作
  doDelete(data, flag) {
    if (flag === 'activity') {
      this.activityService.deleteActivity(data.id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '活动管理', op_page: '活动管理', op_name: '删除活动' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('activity');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'couponList') {
      this.activityService.deleteCouponArr(this.baseInfoId, data).subscribe(resItem => {
        if (resItem.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '活动管理', op_page: '优惠券', op_name: '删除优惠券' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('newCoupon');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: resItem.message }); }
      });
    } else if (flag === 'taskCenter') {
      this.taskService.deleteTaskCenter(data).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '活动管理', op_page: '任务中心', op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('taskCenter');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  // 上传image
  beforeUpload = (file: UploadFile): boolean => {
    if (this.currentPanel !== 'taskCenter') {
      const suffix = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
      const isPng = suffix === '.png' || suffix === '.jpeg' || suffix === '.jpg' || suffix === '.ico' ? true : false;
      const isMoreThanTen = file.size < 512000 ? true : false;  // 512000
      if (!isPng) {
        this.msg.error('您只能上传.png、.jpeg、.jpg、.ico、文件');
      } else if (!isMoreThanTen) {
        this.msg.error('您只能上传不超过500K文件');
      } else {
        if (this.isModifyModelShow) { // 修改
          this.fileList.push(file);
          this.handleUpload(this.baseInfoId);
        } else {  // 新增
          if (this.verificationAdd('baseInfo')) { // 验证
            const activityInput = {
              'actName': this.addActivityForm.controls['actName'].value,
              'actStartDate': this.beginBaseInfoDate,
              'actEndDate': this.endBaseInfoDate,
              'actRuleDesc': this.addActivityForm.controls['actRuleDesc'].value,
              'actPageUrl': this.addActivityForm.controls['actPageUrl'].value
            };
            this.activityService.addActivity(activityInput).subscribe(res => {
              if (res.retcode === 0) {
                if (res.payload === '') {
                  this.modalService.error({ nzTitle: '提示', nzContent: res.message });
                  return;
                }
                this.baseInfoId = JSON.parse(res.payload).id;
                this.fileList.push(file);
                this.handleUpload(this.baseInfoId);
                // this.notification.blank( '提示', '添加成功', { nzStyle: { color : 'green' } });
                this.loadData('activity');
              } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
            });
          }
        }
      }
     } else if (this.currentPanel === 'taskCenter') {
        const suffix = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
        const isPng = suffix === '.png' || suffix === '.jpeg' || suffix === '.jpg' || suffix === '.ico' ? true : false;
        const isMoreThanTen = file.size < 512000 ? true : false;
        this.fileList.splice(0, this.fileList.length);
        if (!isPng) {
          this.msg.error('您只能上传.png、.jpeg、.jpg、.ico、文件');
        } else if (!isMoreThanTen) {
          this.msg.error('您只能上传不超过500K文件');
        } else { this.fileList.push(file); this.handleUpload(''); }
        return false;
      }
      return false;
  }

  // 点击上传
  handleUpload(baseInfoId): void {
    let url = '';
    let flag = '';
    switch (this.currentPanel) {
      case 'activity': url = `/actrule/img/`; flag = 'imageFile'; break;
      case 'taskCenter': url = `/tasks/photos`; flag = 'file'; break;
      default: break;
    }
    // 文件数量不可超过1个，超过一个则提示
    if (this.fileList.length > 1) { this.notification.error( '提示', '您上传的文件超过一个！' ); return; }
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append(flag, file);
      if (this.currentPanel === 'activity') { formData.append('actRuleId', baseInfoId); }
    });
    const baseUrl = this.commonService.baseUrl;
    const req = new HttpRequest('POST', `${baseUrl}${url}`, formData, {
      reportProgress: true, headers: new HttpHeaders({ 'Authorization': localStorage.getItem('token') })
    });
    this.http.request(req).pipe(filter(e => e instanceof HttpResponse))
      .subscribe((event: HttpResponse<{ code: any, data: any, msg: any }> | any) => {
        if (event.body.retcode === 0) {
          if (this.currentPanel === 'activity') {
            this.imageUrl = JSON.parse(event.body.payload).relativeUri;
            this.showImageUrl = baseUrl.substring(0, baseUrl.indexOf('/api')) + this.imageUrl;
          } else if (this.currentPanel === 'taskCenter') {
            this.imageUrl = event.body.payload;
            this.showImageUrl = `${baseUrl.substring(0, baseUrl.indexOf('/admin'))}/v1${url}/${this.imageUrl}`;
          }
          this.notification.success( '提示', '上传成功' );
          const operationInput = { op_category: '活动管理', op_page: this.currentPanel === 'activity' ? '活动管理' : this.currentPanel === 'taskCenter' ? '任务中心' : '', op_name: '上传图片' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: event.body.message, }); }
        formData.delete(flag);
      },
      err => { formData.delete(flag); }
    );
  }

  // 对临时数组的操作
  clickChangeMargin(flag, target, item) {
    if (flag === 'activity') {
      if (target === 'add') {
        this.addMarginArr.push({ chargeThreshold: '', totalQuantity: '', perUserQuantity: '', actGiftNo: '' });
      } else if (target === 'delete') {
        this.addMarginArr.splice(item, 1);
      }
    }
  }

  // 针对区域重置处理的数组情况
  onMarginChange(value, site, item) {
    if (site === 'chargeThreshold') { // 充值额度门槛
      this.addMarginArr.forEach(( cell, i ) => { i === item ? cell.chargeThreshold = value : null; });
    } else if (site === 'totalQuantity') {  // 可发放总数
      this.addMarginArr.forEach(( cell, i ) => { i === item ? cell.totalQuantity = value : null; });
    } else if (site === 'perUserQuantity') {  // 每个用户可领取数量
      this.addMarginArr.forEach(( cell, i ) => { i === item ? cell.perUserQuantity = value : null; });
    } else if (site === 'actGiftNo') {  // 最终选择的红包组
      this.addMarginArr.forEach(( cell, i ) => { i === item ? cell.actGiftNo = value : null; });
    }
  }

  // 日期插件
  onChange(result, flag): void {
    if (flag === 'baseInfo') {  // 基本信息的活动时间
      if (result === []) { this.beginBaseInfoDate = ''; this.endBaseInfoDate = ''; return; }
      if (result[0] !== '' || result[1] !== '') { this.beginBaseInfoDate = this.datePipe.transform(result[0], 'yyyy-MM-dd'); this.endBaseInfoDate = this.datePipe.transform(result[1], 'yyyy-MM-dd'); }
    } else if (flag === 'rule') { // 下方的重置时间约束时间
      if (result === []) { this.beginRuleDate = ''; this.endRuleDate = ''; return; }
      if (result[0] !== '' || result[1] !== '') { this.beginRuleDate = this.datePipe.transform(result[0], 'yyyy-MM-dd') + '@' + this.datePipe.transform(result[0], 'HH:mm:ss'); this.endRuleDate = this.datePipe.transform(result[1], 'yyyy-MM-dd') + '@' + this.datePipe.transform(result[0], 'HH:mm:ss'); }
    } else if (flag === 'couponInActivity') { // 红包 活动奖励查询 时间
      if (result === []) { this.beginCouponDate = ''; this.endCouponDate = ''; return; }
      if (result[0] !== '' || result[1] !== '') { this.beginCouponDate = this.datePipe.transform(result[0], 'yyyy-MM-dd'); this.endCouponDate = this.datePipe.transform(result[1], 'yyyy-MM-dd'); }
    } else if (flag === 'coupon') { // 红包
      if (result === []) { this.couponBeginDate = ''; this.couponEndDate = ''; return; }
      if (result[0] !== '' || result[1] !== '') { this.couponBeginDate = this.datePipe.transform(result[0], 'yyyy-MM-dd') + 'T00:00:00.000Z'; this.couponEndDate = this.datePipe.transform(result[1], 'yyyy-MM-dd') + 'T23:59:59.000Z'; }
      if (this.couponBeginDate === null || this.couponEndDate === null) { this.couponBeginDate = this.commonService.getDay(-7); this.couponEndDate = this.commonService.getDay(-1); }
    } else if (flag === 'baseInfo') {  // 基本信息的活动时间
      if (result === []) { this.beginBatchsendDate = ''; this.endBatchsendDate = ''; return; }
      if (result[0] !== '' || result[1] !== '') { this.beginBatchsendDate = this.datePipe.transform(result[0], 'yyyy-MM-dd') + 'T00:00:00.000Z'; this.endBatchsendDate = this.datePipe.transform(result[1], 'yyyy-MM-dd') + 'T23:59:59.000Z'; }
    } else if (flag === 'couponInBatchsend') { // 红包 活动奖励查询 时间
      if (result === []) { this.beginCouponInBatchsendDate = ''; this.endCouponInBatchsendDate = ''; return; }
      if (result[0] !== '' || result[1] !== '') { this.beginCouponInBatchsendDate = this.datePipe.transform(result[0], 'yyyy-MM-dd'); this.endCouponInBatchsendDate = this.datePipe.transform(result[1], 'yyyy-MM-dd'); }
    } else if (flag === 'searchBean') {
      if (result === []) { this.beginBeanDate = ''; this.endBeanDate = ''; return; }
      if (result[0] !== '' || result[1] !== '') {
        if (this.datePipe.transform(result[0], 'HH:mm:ss') === this.datePipe.transform(result[1], 'HH:mm:ss')) {
          this.beginBeanDate = this.datePipe.transform(result[0], 'yyyy-MM-dd' + ' 00:00:00'); this.endBeanDate = this.datePipe.transform(result[1], 'yyyy-MM-dd' + ' 23:59:59');
        } else {
          this.beginBeanDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss'); this.endBeanDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
        }
      }
    }if (flag === 'taskCenter') {
      if (result === []) { this.beginTaskCenterDate = ''; this.endTaskCenterDate = ''; return; }
      if (result[0] !== '' || result[1] !== '') {
        if (this.datePipe.transform(result[0], 'HH:mm:ss') === this.datePipe.transform(result[1], 'HH:mm:ss')) {
          this.beginTaskCenterDate = this.datePipe.transform(result[0], 'yyyy-MM-dd' + ' 00:00:00'); this.endTaskCenterDate = this.datePipe.transform(result[1], 'yyyy-MM-dd' + ' 23:59:59');
        } else {
          this.beginTaskCenterDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss'); this.endTaskCenterDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
        }
      }
    } else if (flag === 'taskCenterAct') {
      if (result === []) { this.beginTaskCenterActDate = ''; this.endTaskCenterActDate = ''; return; }
      if (result[0] !== '' || result[1] !== '') {
        if (this.datePipe.transform(result[0], 'HH:mm:ss') === this.datePipe.transform(result[1], 'HH:mm:ss')) {
          this.beginTaskCenterActDate = this.datePipe.transform(result[0], 'yyyy-MM-dd' + ' 00:00:00'); this.endTaskCenterActDate = this.datePipe.transform(result[1], 'yyyy-MM-dd' + ' 23:59:59');
        } else {
          this.beginTaskCenterActDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss'); this.endTaskCenterActDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
        }
      }
    } else if (flag === 'taskLogs') {
      if (result === []) { this.beginTaskLogDate = ''; this.endTaskLogDate = ''; return; }
      if (result[0] !== '' || result[1] !== '') {
        if (this.datePipe.transform(result[0], 'HH:mm:ss') === this.datePipe.transform(result[1], 'HH:mm:ss')) {
          this.beginTaskLogDate = this.datePipe.transform(result[0], 'yyyy-MM-dd' + ' 00:00:00'); this.endTaskLogDate = this.datePipe.transform(result[1], 'yyyy-MM-dd' + ' 23:59:59');
        } else {
          this.beginTaskLogDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss'); this.endTaskLogDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
        }
      }
    } else if (flag === 'addStepRule') {
      this.addTaskCenter.stepRule.push({ rechargeAmount: '', checkBean: false, checkBeanRes: 'Fixed', beanValue: '', beanPreValue: '', checkExperience: false, expValue: '', checkSkill: false, perkValue: '' });
    } else if (flag === 'deleteStepRule') {
      this.addTaskCenter.stepRule.splice(result, 1);
    } else if (flag === 'addDiscountPrices') {
      this.couponDate.discountPrices.push({main: '', content: ''});
    } else if (flag === 'removeDiscountPrices') {
      this.couponDate.discountPrices.splice(result, 1);
    } else if (flag === 'taskCenter') {
      const switchInput = { 'id': result.id, 'enabled': result.enabled };
      this.taskService.updateSwitch(switchInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '活动管理', op_page: '任务中心', op_name: '启用/不启用' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
        this.loadData('taskCenter');
      });
    } else if (flag === 'couponInBatchsend') {
      console.log(result);
      this.dataSearchCoupon.forEach(item => {
        item.couponId === result.data.couponId ? item.quantity = parseInt(result.event) : null;
      });
      this.dataSearchCouponInBatchsend.forEach(item => {
        item.couponId === result.data.couponId ? item.quantity = parseInt(result.event) : null;
      });
    }
  }

  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.dataSearchCoupon = $event;
    this.refreshSearchCouponStatus();
  }

  refreshSearchCouponStatus(): void {
    const allSearchCouponChecked = this.dataSearchCoupon.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.dataSearchCoupon.filter(value => !value.disabled).every(value => !value.checked);
    this.allSearchCouponChecked = allSearchCouponChecked;
    this.indeterminate = (!allSearchCouponChecked) && (!allUnChecked);
  }

  currentPageDataCouponChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayData = $event;
    this.refreshStatus();
  }

  refreshCouponStatus(): void {
    const couponAllChecked = this.displayData.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.displayData.filter(value => !value.disabled).every(value => !value.checked);
    this.couponAllChecked = couponAllChecked;
    this.indeterminate = (!couponAllChecked) && (!allUnChecked);
  }

  checkAllSearchCoupon(value: boolean): void {
    this.dataSearchCoupon.forEach(data => { !data.disabled ? data.checked = value : null; });
    this.refreshSearchCouponStatus();
  }

  checkAll(value: boolean): void {
    this.displayData.forEach(category => { !category.disabled ? category.checked = value : null; });
    this.refreshStatus();
  }

  refreshStatus(): void {
    const allChecked = this.displayData.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.displayData.filter(value => !value.disabled).every(value => !value.checked);
    this.couponAllChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  // 获取互斥限制的数组
  getMutualExcludeRules() {
    let arr = [];
    if (this.checkCouponOptions[0].checked && this.checkCouponOptions[1].checked) {
      arr = ['promition_unavailable', 'vip_only'];
    } else if (this.checkCouponOptions[0].checked) {
      arr = ['promition_unavailable'];
    } else if (this.checkCouponOptions[1].checked) {
      arr = ['vip_only'];
    } else {
      arr = [];
    }
    return arr;
  }

  // 获取片类限制
  getCheckedCategory() {
    let flag = '';
    let count = 0;
    for (let i = 0; i < this.category.length; i++) {
      if (this.category[i].checked === true) { flag = this.category[i].value; count++; }
    }
    flag = (count === 4 ? 'all' : flag);
    return flag;
  }

  // 转换 url 的 & 字符
  dotranUrl(url) {
    return (url.indexOf('`') !== -1 ? url.replace(/`/g, '&') : url.replace(/&/g, '`'));
  }

  // 切换面板
  changePanel(flag): void {
    flag !== this.currentPanel ? this.loadData(flag) : null;
    this.currentPanel = flag;
    const operationInput = { op_category: '活动管理', op_page: flag === 'coupon' ? '权限配置' : flag === 'activity' ? '活动管理' : flag === 'batchsendList' ? '批量发放' : flag === 'bean' ? '充值送豆' : flag === 'taskCenter' ? '任务中心' : flag === 'taskCenter' ? '任务日志' : '', op_name: '访问' };
    this.commonService.updateOperationlog(operationInput).subscribe();
  }

  // 手机验证
  isPoneAvailable($poneInput) {
    const myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    return !myreg.test($poneInput) ? false : true;
  }

  // 封装时间格式转换
  compareDate(s1, s2) {
    return ((new Date(s1.toString().replace(/-/g, '\/'))) < (new Date(s2.toString().replace(/-/g, '\/'))));
  }

  parserPoint = (value: string) => value.replace('.', '');

  countDown() {
    this.semdMesCodeText--;
    if (this.semdMesCodeText === 0) { this.semdMesCodeText = 60; return; }
    setTimeout(() => { this.countDown(); }, 1000);
  }

}
