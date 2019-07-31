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

registerLocaleData(zh);

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  isAddActivityVisible = false;
  isCouponVisible = false;
  isPreviewVisible = false;
  isAddCouponVisible = false;
  isModifyCouponVisible = false;
  isPreviewCouponVisible = false;
  loading = false;
  searchActivityForm: FormGroup;
  searchCouponInActivityForm: FormGroup;
  addActivityForm: FormGroup;
  searchCouponForm: FormGroup;
  addCouponForm: FormGroup;
  modifyCouponForm: FormGroup;
  dataActivity = []; // 活动
  dataSearchCoupon = [];
  beginBaseInfoDate = ''; // 基本信息日期选择
  endBaseInfoDate = '';
  beginRuleDate = ''; // 模板1日期选择
  endRuleDate = '';
  beginCouponDate = ''; // 红包日期选择
  endCouponDate = '';
  dateSearch = { 'Today': [new Date(), new Date()], 'This Month': [new Date(), new Date()] };
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
  modifyctivityItem = { actName: '', actStartDate: '', actEndDate: '', actRuleDesc: '', actTypeStart: '', actTypeEnd: '', totalQuantity: '', perUserQuantity: '', chargeThreshold: '' };
  now = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  cmsId = '';
  emptyAdd = ['', '', '', '', '', '', ''];  // 清空新增表单
  couponBeginDate = '';
  couponEndDate = '';
  couponDate = { 'couponName': '', 'discountType': '', 'thresholdPrice': '', 'discountPrice': '', 'timeLimitValidDay': '', 'timeLimitType': '', 'timeLimitStart': '', 'timeLimitEnd': '', 'couponCategory': '', 'mutualExcludeRules': '' };
  dataCoupon = []; // 内容
  couponAllChecked = false;
  displayData = [];
  couponRadioValue = 'fix_start_end';  // 有效时间
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
  isAddBatchsendVisible = false;
  isDetailBatchsendVisible = false;
  isCouponInBatchsendVisible = false;
  isBatchsendVisible = false;
  addBatchsendForm: FormGroup;
  searchCouponInBatchsendForm: FormGroup;
  beginBatchsendDate = '';
  endBatchsendDate = '';
  beginCouponInBatchsendDate = null; // 红包日期选择
  endCouponInBatchsendDate = null;
  allSearchCouponInBatchsendChecked = false; // 用于table多选
  batchsendData = { 'displayMessage': '', 'errorRevL': [], 'invalidRevL': [], 'pendingRevL': [], 'pushRuleId': '', 'pushStatus': '', 'successRevL': '', 'sendTime': '', 'totalRevNum': '', 'actCouponRulePoL': [], 'tempCouponName': [] };
  dataSearchCouponInBatchsend = [];
  dataBatchsend = []; // 内容
  couponListArrInBatchsend = []; // 最底部的活动奖励配置数组
  finalBatchsendData = { 'displayMessage': '', 'errorRevL': [], 'invalidRevL': [], 'pendingRevL': [], 'pushRuleId': '', 'pushStatus': '', 'successRevL': '', 'sendTime': '', 'totalRevNum': '', 'actCouponRulePoL': [], 'tempCouponName': [] };
  beanData = [];
  beanPageSize = 100;
  isSpinning = false;
  isAddBeanVisible = false;
  isModifyBeanVisible = false;
  isSearchBeanVisible = false;
  beanItem = { 'activeStatus': '', 'beginTime': '', 'depositAmount': '', 'describe': '', 'endTime': '', 'giftPercent': 1, 'id': '', 'presentType': '', 'title': '', 'type': '', giftAmount: '' };
  addBeanForm: FormGroup;
  searchBeanForm: FormGroup;
  modifyBeanForm: FormGroup;
  beginBeanDate = null;
  endBeanDate = null;
  radioBeanValue = 'PERCENT_GIFT';  // 单选

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
  ) {
    this.commonService.nav[6].active = true;
    this._initForm();
  }

  ngOnInit() {
    const tabFlag = [{label: '优惠券配置', value: 'coupon'}, {label: '优惠券活动', value: 'activity'},
        {label: '批量发放', value: 'batchsendList'}, {label: '充值送豆', value: 'bean'}];
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
            if (data.actTypeBo && data.actTypeBo !== undefined) {
              actGiftNo = data.actTypeBo.actGiftNo;
            }
            if (data.actGiftRuleConfigL) {
              data.actGiftRuleConfigL.forEach(item => {
                if (item.actCouponRulePoL && item.actGiftNo === actGiftNo) {
                  item.actCouponRulePoL.forEach(cell => {
                    count += cell.quantity;
                  });
                }
              });
            }
            data.allQuantity = count;
          });
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
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
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'newCoupon') {
      this.activityService.getNewCouponList(this.baseInfoId).subscribe(res => {
        if (res.retcode === 0 && res.status === 200 && res.payload !== '') {
          this.isSpinning = false;
          this.actGiftNoArr = [{ value: '', label: '---无---' }]; // 重置数组，因为接口返回全部
          if (res.payload === '' || res.payload === 'null') {
            return;
          }
          this.couponListArr = JSON.parse(res.payload);
          const operationInput = { op_category: '活动管理', op_page: '优惠券', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.couponListArr.forEach(item => {
            const tempObject = { value: item.actGiftNo, label: item.actGiftNo };
            this.actGiftNoArr.push(tempObject);
          });
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'coupon') {
      this.couponService.getCouponList(this.searchCouponItem).subscribe(res => {
        if (res.retcode === 0 && res.status === 200 && res.payload !== '') {
          this.isSpinning = false;
          this.dataCoupon = JSON.parse(res.payload);
          const operationInput = { op_category: '活动管理', op_page: '优惠券', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          console.log(this.dataCoupon);
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'batchsendList') {
      const batchsend = {
        sendStartTime: this.beginBatchsendDate,
        sendEndTime: this.endBatchsendDate
      };
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
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
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
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
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
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
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
      totalQuantity: [''], perUserQuantity: [''], actGiftNo: [''], temp: [''], });
    this.addCouponForm = this.fb.group({ couponName: [''], date: [''], discountType: [''], thresholdPrice: [''], discountPrice: [''],
      timeLimitValidDay: [''], timeLimitType: [''], });
    this.addBatchsendForm = this.fb.group({ pendingRevL: [''], displayMessage: [''], });
    this.searchCouponInBatchsendForm = this.fb.group({ couponName: [''], discountType: [''], couponCategory: [''], date: [''], });
    this.searchBeanForm = this.fb.group({ title: [''], date: [''], });
    this.addBeanForm = this.fb.group({ title: [''], describe: [''], date: [''], type: [''], depositAmount: [''], giftPercent: [''],
      giftAmount: ['']});
    this.modifyBeanForm = this.fb.group({ title: [''], describe: [''], date: [''], type: [''], depositAmount: [''], giftPercent: [''],
      giftAmount: [''], });
    this.modifyCouponForm = this.fb.group({ couponName: [''], date: [''], discountType: [''], timeLimitValidDay: [''], thresholdPrice: [''],
      discountPrice: [''], timeLimitType: [''], });
  }

  // 弹框
  showModal(flag, data) {
    if (flag === 'addActivity') { // 新增活动
      this.isAddActivityVisible = true;
      this.isModifyModelShow = false;
      this.beginRuleDate = ''; // 模板1日期选择
      this.endRuleDate = '';
      this.modifyctivityItem = { actName: '', actStartDate: '', actEndDate: '', actRuleDesc: '', actTypeStart: '', actTypeEnd: '', totalQuantity: '', perUserQuantity: '', chargeThreshold: '' };
    } else if (flag === 'modifyActivity') { // 修改活动
      this.baseInfoId = data.id;
      this.isAddActivityVisible = true;
      this.isModifyModelShow = true;
      this.modifyctivityItem = {
        actName: data.actName,
        actStartDate: data.actStartDate,
        actEndDate: data.actEndDate,
        actRuleDesc: data.actRuleDesc,
        actTypeStart: '',
        actTypeEnd: '',
        totalQuantity: '',  // 奖励发放上限
        perUserQuantity: '',  // 每个用户可领
        chargeThreshold: '' // 充值额度
      };
      if (data.actTypeBo) { // 针对活动规则配置
        this.modifyctivityItem.actTypeStart = data.actTypeBo.actTypeStartDate + ' ' + data.actTypeBo.actTypeStartTime;
        this.modifyctivityItem.actTypeEnd = data.actTypeBo.actTypeEndDate + ' ' + data.actTypeBo.actTypeEndTime;
        this.modifyctivityItem.totalQuantity = data.actTypeBo.totalQuantity;
        this.modifyctivityItem.perUserQuantity = data.actTypeBo.perUserQuantity;
        if (data.actTypeBo.chargeThreshold) {
          this.modifyctivityItem.chargeThreshold = data.actTypeBo.chargeThreshold;
        }
        this.loadData('newCoupon'); // 加载红包组数据
      }
      if (data.imageResPos) { // 针对文件展示
        if (data.imageResPos.length > 0) {
          const imageUrl = `${this.commonService.baseUrl}`;
          this.showImageUrl = imageUrl.substring(0, imageUrl.indexOf('/api')) + data.imageResPos[0].relativeUri;
          const file: any = {
            name: data.imageResPos[0].originName
          };
          this.fileList.push(file);
        }
      }
      if (data.actType) { // 有选择活动模板
        this.activityRadioValue = data.actType;
      }
    } else if (flag === 'addCoupon') { // 新增红包 | 活动奖励
      if (this.baseInfoId === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '基本信息未填写' });
        return;
      }
      this.isCouponVisible = true;
      this.couponGiftNo = '';
      this.loadData('couponInActivity');
    } else if (flag === 'modifyCouponInActivity') { // 修改红包 | 活动奖励
      this.couponGiftNo = data.actGiftNo;
      this.isCouponVisible = true;
      this.loadData('couponInActivity');
    } else if (flag === 'preview') { // 活动页预览
      this.isPreviewVisible = true;
    } else if (flag === 'coupon') { // 优惠券的展开弹框
      this.isAddCouponVisible = true;
      this.couponRadioValue = 'fix_start_end';  // 重置时间限制（单选）

      this.couponDate = { 'couponName': '', 'discountType': '', 'thresholdPrice': '', 'discountPrice': '', 'timeLimitValidDay': '', 'timeLimitType': '', 'timeLimitStart': '', 'timeLimitEnd': '', 'couponCategory': '', 'mutualExcludeRules': '' };
    } else if (flag === 'modifyCoupon') { // 修改优惠券弹框
      const id = data.couponId;
      this.isModifyCouponVisible = true;
      this.cmsId = id;  // 用于修改
      this.couponService.getCoupon(id).subscribe(res => {
        // 处理异常处理
        this.couponDate = JSON.parse(res.payload);
        this.couponRadioValue = JSON.parse(res.payload).timeLimitType;
        this.changeMutualExcludeRules(JSON.parse(res.payload).mutualExcludeRules);
        this.changeCouponCategory(JSON.parse(res.payload).couponCategory);
        this.couponBeginDate = JSON.parse(res.payload).timeLimitStart;
        this.couponEndDate = JSON.parse(res.payload).timeLimitEnd;
      });
    } else if (flag === 'previewCoupon') {  // 查看优惠券
      const id = data.couponId;
      this.isPreviewCouponVisible = true;
      this.couponService.getCoupon(id).subscribe(res => {
        // 处理异常处理
        this.couponDate = JSON.parse(res.payload);
        this.changeMutualExcludeRules(JSON.parse(res.payload).mutualExcludeRules);
        this.changeCouponCategory(JSON.parse(res.payload).couponCategory);
        this.couponBeginDate = JSON.parse(res.payload).timeLimitStart;
        this.couponEndDate = JSON.parse(res.payload).timeLimitEnd;
      });
    } else if (flag === 'addBatchsend') {
      this.batchsendData = {  // 清空
        'displayMessage': '', 'errorRevL': [], 'invalidRevL': [], 'pendingRevL': [], 'pushRuleId': '', 'pushStatus': '', 'successRevL': '', 'sendTime': '', 'totalRevNum': '', 'actCouponRulePoL': [], 'tempCouponName': []
      };
      this.loadData('couponInBatchsend');
      this.isAddBatchsendVisible = true;
    } else if (flag === 'detail') {
      this.batchsendData = data;
      if (this.batchsendData.actCouponRulePoL) {
        const tempArr = [];
        this.batchsendData.actCouponRulePoL.forEach((item, i) => {
          tempArr.push(item.couponRulePo.couponName);
        });
        this.batchsendData.tempCouponName = tempArr;
      }
      this.isDetailBatchsendVisible = true;
    } else if (flag === 'addCouponInBatchsend') { // 新增红包 | 活动奖励
      this.isCouponInBatchsendVisible = true;
      this.couponListArrInBatchsend = [];
      this.loadData('couponInBatchsend');
    } else if (flag === 'batchsend') { // 批量发送
      this.finalBatchsendData.pendingRevL = this.addBatchsendForm.controls['pendingRevL'].value.split('\n');
      this.finalBatchsendData.actCouponRulePoL = this.couponListArrInBatchsend;
      this.finalBatchsendData.displayMessage = this.addBatchsendForm.controls['displayMessage'].value;
      if (this.finalBatchsendData.actCouponRulePoL) {
        const tempArr = [];
        this.finalBatchsendData.actCouponRulePoL.forEach((item, i) => {
          tempArr.push(item.couponName);
        });
        this.finalBatchsendData.tempCouponName = tempArr;
      }
      this.isBatchsendVisible = true;
    } else if (flag === 'addBean') {
      this.beanItem = { // 重置数据
        'activeStatus': '', 'beginTime': '', 'depositAmount': '', 'describe': '', 'endTime': '',
         'giftPercent': 1, 'id': '', 'presentType': '', 'title': '', 'type': '', giftAmount: ''
      };
      this.beginBeanDate = null;  // 重置日期
      this.endBeanDate = null;
      this.radioBeanValue = 'PERCENT_GIFT'; // 重置单选
      this.isAddBeanVisible = true;
    } else if (flag === 'modifyBean') {
      this.beanItem = data;
      this.beanItem.giftPercent = data.giftPercent ? (data.giftPercent * 100) : 0;
      this.beginBeanDate = data.beginTime;  // 重置日期
      this.endBeanDate = data.endTime;
      this.radioBeanValue = data.type; // 重置单选
      this.beanItem.id = data.id;
      this.isModifyBeanVisible = true;
    } else if (flag === 'searchBean') {
      this.isSearchBeanVisible = true;
      this.beanItem = data;
      this.beanItem.giftPercent = data.giftPercent ? data.giftPercent : 0;
      this.radioBeanValue = data.type;
    }
  }

  hideModal(flag) {
    if (flag === 'activity') {
      this.isAddActivityVisible = false;
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
      this.isCouponVisible = false;
      this.beginCouponDate = null;
      this.endCouponDate = null;
    } else if (flag === 'preview') { // 活动页预览
      this.isPreviewVisible = false;
    } else if (flag === 'coupon') { // 隐藏优惠券
      this.isAddCouponVisible = false;
    } else if (flag === 'modifyCoupon') { // 隐藏优惠券
      this.isModifyCouponVisible = false;
    } else if (flag === 'previewCoupon') {
      this.isPreviewCouponVisible = false;
    } else if (flag === 'batchsendList') {
      this.isAddBatchsendVisible = false;
      this.beginCouponInBatchsendDate = null;
      this.endCouponInBatchsendDate = null;
    } else if (flag === 'detailBatchsend') {  // 查看
      this.isDetailBatchsendVisible = false;
    } else if (flag === 'couponInBatchsend') { // 新增红包
      this.isCouponInBatchsendVisible = false;
      this.beginCouponInBatchsendDate = null;
      this.endCouponInBatchsendDate = null;
    } else if (flag === 'batchsend') {
      this.isBatchsendVisible = false;
    } else if (flag === 'addBean') {
      this.beginBeanDate = null;  // 重置日期
      this.endBeanDate = null;
      this.loadData('bean');
      this.isAddBeanVisible = false;
    } else if (flag === 'modifyBean') {
      this.beginBeanDate = null;  // 重置日期
      this.endBeanDate = null;
      this.loadData('bean');
      this.isModifyBeanVisible = false;
    } else if (flag === 'searchBean') {
      this.loadData('bean');
      this.isSearchBeanVisible = false;
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
      }
    } else if (flag === 'coupon') {
      // if (this.addCouponForm.controls['title'].value === '') {
      //   this.modalService.error({ nzTitle: '提示', nzContent: '标题未填写' });
      //   result = false;
      // }
    } else if (flag === 'modifyCoupon') {
      // if (this.addCouponForm.controls['title'].value === '') {
      //   this.modalService.error({ nzTitle: '提示', nzContent: '标题未填写' });
      //   result = false;
      // }
    } else if (flag === 'batchsend') {
      if (this.addBatchsendForm.controls['pendingRevL'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '发送对象未填写' });
        result = false;
      } else if (this.addBatchsendForm.controls['displayMessage'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '附带信息未选择' });
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
        'actType': this.activityRadioValue,
        'actTypeBo': actTypeBo
      };
      this.activityService.saveActivity(activityInput).subscribe(res => {
        if (res.retcode === 0) {
          const result = JSON.parse(res.payload).fillStatus;
          if (result === 'finished') {
            this.notification.blank( '提示', '保存成功，全部信息填写完整', { nzStyle: { color : 'green' } });
            this.isAddActivityVisible = false;  // 全部填写完毕则关闭弹窗
          } else if (result === 'unfinished') {
            this.notification.blank( '提示', '保存成功，但有信息未填完整', { nzStyle: { color : 'green' } });
          }
          const operationInput = { op_category: '活动管理', op_page: '活动管理', op_name: '保存' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('activity');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'couponInActivity') { // 保存红包组选择区
      const couponArr = [];
      let checkedCount = 0;
      let quantityCount = 0;
      this.dataSearchCoupon.forEach(data => {
        if (data.checked === true) {
          couponArr.push(data);
          checkedCount++;
          if (data.quantity) { quantityCount++; }
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
            this.isCouponVisible = false;
            this.notification.blank( '提示', '新增红包组成功', { nzStyle: { color : 'green' } });
            const operationInput = { op_category: '活动管理', op_page: '活动管理', op_name: '新增' };
            this.commonService.updateOperationlog(operationInput).subscribe();
            this.loadData('newCoupon');
          } else {
            this.modalService.error({ nzTitle: '提示', nzContent: res.message });
          }
        });
      } else { // 修改
        this.activityService.updateCoupon(couponUpdateInput).subscribe(res => {
          if (res.retcode === 0) {
            this.isCouponVisible = false;
            this.notification.blank( '提示', '配置红包组成功', { nzStyle: { color : 'green' } });
            const operationInput = { op_category: '活动管理', op_page: '优惠券', op_name: '修改' };
            this.commonService.updateOperationlog(operationInput).subscribe();
            this.loadData('newCoupon');
          } else {
            this.modalService.error({ nzTitle: '提示', nzContent: res.message });
          }
        });
      }
    } else if (flag === 'coupon') {
      if (!this.verificationAdd('coupon')) {
        return;
      }
      let couponInput = {};
      if (this.couponRadioValue === 'fix_start_end') {
        couponInput = {
          'couponName': this.addCouponForm.controls['couponName'].value,
          'discountType': this.addCouponForm.controls['discountType'].value,
          'thresholdPrice': this.addCouponForm.controls['thresholdPrice'].value,
          'discountPrice': this.addCouponForm.controls['discountPrice'].value,
          'timeLimitType': this.couponRadioValue,
          'timeLimitStart': this.couponBeginDate.substring(0, 10),
          'timeLimitEnd': this.couponEndDate.substring(0, 10),
          'couponCategory': this.getCheckedCategory(),
          'mutualExcludeRules': this.getMutualExcludeRules(),
        };
      } else if (this.couponRadioValue === 'fix_duration') {
        couponInput = {
          'couponName': this.addCouponForm.controls['couponName'].value,
          'discountType': this.addCouponForm.controls['discountType'].value,
          'thresholdPrice': this.addCouponForm.controls['thresholdPrice'].value,
          'discountPrice': this.addCouponForm.controls['discountPrice'].value,
          'timeLimitValidDay': this.addCouponForm.controls['timeLimitValidDay'].value,
          'timeLimitType': this.couponRadioValue,
          'couponCategory': this.getCheckedCategory(),
          'mutualExcludeRules': this.getMutualExcludeRules(),
        };
      }
      this.couponService.addCoupon(couponInput).subscribe(res => {
        if (res.retcode === 0) {
          this.modalService.success({ nzTitle: '提示', nzContent: '新增成功' });
          const operationInput = { op_category: '活动管理', op_page: '优惠券', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('coupon');
          this.loadData('coupon');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'batchsendList') {
      let count = 0;
      if (!this.verificationAdd('batchsend')) {
        return;
      }
      this.addBatchsendForm.controls['pendingRevL'].value.split('\n').forEach(item => {
        if (!this.isPoneAvailable(item)) { count++; }
      });
      if (count > 0) {
        this.modalService.error({ nzTitle: '提示', nzContent: '输入的手机号码中有不符合要求的！' });
        return;
      }
      this.showModal('batchsend', '');  // 打开发送弹窗
    } else if (flag === 'couponInBatchsend') { // 保存红包组选择区
      const couponArr = [];
      let checkedCount = 0;
      let quantityCount = 0;
      this.dataSearchCouponInBatchsend.forEach(data => {
        if (data.checked === true) {
          couponArr.push(data);
          checkedCount++;
          if (data.quantity) { quantityCount++; }
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
      this.isCouponInBatchsendVisible = false;
      this.notification.blank( '提示', '新增红包组成功', { nzStyle: { color : 'green' } });
      const operationInput = { op_category: '活动管理', op_page: '批量发放', op_name: '新增红包组' };
      this.commonService.updateOperationlog(operationInput).subscribe();
    } else if (flag === 'batchsend') { // 批量发送
      // 调用新增接口
      const batchsendListInput = {
        'pendingRevL': this.addBatchsendForm.controls['pendingRevL'].value.split('\n'),
        'displayMessage': this.addBatchsendForm.controls['displayMessage'].value,
        'actCouponRulePoL': this.couponListArrInBatchsend,
      };
      this.batchsendService.addBatchsend(batchsendListInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          // 调用发送接口
          const batchsendInput = {
            'pushRuleId': JSON.parse(res.payload).pushRuleId
          };
          this.batchsendService.batchsend(batchsendInput).subscribe(finalres => {
            if (finalres.retcode === 0) {
              this.notification.blank( '提示', '批量发送成功', { nzStyle: { color : 'green' } });
              const operationInput = { op_category: '活动管理', op_page: '批量发放', op_name: '批量发送' };
              this.commonService.updateOperationlog(operationInput).subscribe();
              this.hideModal('batchsendList');
              this.hideModal('batchsend');
              this.loadData('batchsendList');
            } else {
              this.modalService.error({ nzTitle: '提示', nzContent: finalres.message });
            }
          });
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
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
          this.isAddBeanVisible = false;
          this.beginBeanDate = null;
          this.endBeanDate = null;
          this.loadData('bean');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
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
          this.isModifyBeanVisible = false;
          this.beginBeanDate = null;
          this.endBeanDate = null;
          this.loadData('bean');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  // 修改操作
  doModify(flag) {
    if (flag === 'coupon') {
      if (!this.verificationAdd('modifyCoupon')) {
        return;
      }
      let couponInput = {};
      if (this.couponRadioValue === 'fix_start_end') {
        couponInput = {
          'couponId': this.cmsId,
          'couponName': this.modifyCouponForm.controls['couponName'].value,
          'discountType': this.dotranUrl(this.modifyCouponForm.controls['discountType'].value),
          'thresholdPrice': this.modifyCouponForm.controls['thresholdPrice'].value,
          'discountPrice': this.modifyCouponForm.controls['discountPrice'].value,
          'timeLimitType': this.modifyCouponForm.controls['timeLimitType'].value,
          'timeLimitStart': this.couponBeginDate.substring(0, 10),
          'timeLimitEnd': this.couponEndDate.substring(0, 10),
          'couponCategory': this.getCheckedCategory(),
          'mutualExcludeRules': this.getMutualExcludeRules(),
        };
      } else if (this.couponRadioValue === 'fix_duration') {
        couponInput = {
          'couponId': this.cmsId,
          'couponName': this.modifyCouponForm.controls['couponName'].value,
          'discountType': this.dotranUrl(this.modifyCouponForm.controls['discountType'].value),
          'thresholdPrice': this.modifyCouponForm.controls['thresholdPrice'].value,
          'discountPrice': this.modifyCouponForm.controls['discountPrice'].value,
          'timeLimitValidDay': this.addCouponForm.controls['timeLimitValidDay'].value,
          'timeLimitType': this.modifyCouponForm.controls['timeLimitType'].value,
          'couponCategory': this.getCheckedCategory(),
          'mutualExcludeRules': this.getMutualExcludeRules(),
        };
      }
      this.couponService.updateCoupon(couponInput).subscribe(res => {
        if (res.retcode === 0) {
          this.modalService.success({ nzTitle: '提示', nzContent: '修改成功' });
          const operationInput = { op_category: '活动管理', op_page: '优惠券', op_name: '修改优惠券' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('modifyCoupon');
          this.loadData('coupon');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
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

  doDelete(data, flag) {
    if (flag === 'activity') {
      this.activityService.deleteActivity(data.id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '活动管理', op_page: '活动管理', op_name: '删除活动' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('activity');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'couponList') {
      this.activityService.deleteCouponArr(this.baseInfoId, data).subscribe(resItem => {
        if (resItem.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '活动管理', op_page: '优惠券', op_name: '删除优惠券' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('newCoupon');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: resItem.message });
        }
      });
    }
  }

  // 上传image
  beforeUpload = (file: UploadFile): boolean => {
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
            'actRuleDesc': this.addActivityForm.controls['actRuleDesc'].value
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
            } else {
              this.modalService.error({ nzTitle: '提示', nzContent: res.message });
            }
          });
        }
      }
    }
    return false;
  }

  // 点击上传
  handleUpload(baseInfoId): void {
    const url = `${this.commonService.baseUrl}/actrule/img`;
    const imageUrl = `${this.commonService.baseUrl}`;
    const flag = 'imageFile';
    // 文件数量不可超过1个，超过一个则提示
    if (this.fileList.length > 1) {
      this.notification.error(
        '提示', '您上传的文件超过一个！'
      );
      return;
    }
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append(flag, file);
      formData.append('actRuleId', baseInfoId);
    });
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('token') })
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe((event: HttpResponse<{ code: any, data: any, msg: any }> | any) => {
        if (event.body.retcode === 0) {
          this.imageUrl = JSON.parse(event.body.payload).relativeUri;
          this.showImageUrl = imageUrl.substring(0, imageUrl.indexOf('/api')) + this.imageUrl;
          this.notification.success( '提示', '上传成功' );
          const operationInput = { op_category: '活动管理', op_page: '活动管理', op_name: '上传活动图片' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: event.body.message, });
        }
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
      this.addMarginArr.forEach(( cell, i ) => {
        if (i === item) {
          cell.chargeThreshold = value ;
        }
      });
    } else if (site === 'totalQuantity') {  // 可发放总数
      this.addMarginArr.forEach(( cell, i ) => {
        if (i === item) {
          cell.totalQuantity = value ;
        }
      });
    } else if (site === 'perUserQuantity') {  // 每个用户可领取数量
      this.addMarginArr.forEach(( cell, i ) => {
        if (i === item) {
          cell.perUserQuantity = value ;
        }
      });
    } else if (site === 'actGiftNo') {  // 最终选择的红包组
      this.addMarginArr.forEach(( cell, i ) => {
        if (i === item) {
          cell.actGiftNo = value;
        }
      });
    }
  }

  // 日期插件
  onChange(result, flag): void {
    if (flag === 'baseInfo') {  // 基本信息的活动时间
      if (result === []) {
        this.beginBaseInfoDate = '';
        this.endBaseInfoDate = '';
        return;
      }
      if (result[0] !== '' || result[1] !== '') {
        this.beginBaseInfoDate = this.datePipe.transform(result[0], 'yyyy-MM-dd');
        this.endBaseInfoDate = this.datePipe.transform(result[1], 'yyyy-MM-dd');
      }
    } else if (flag === 'rule') { // 下方的重置时间约束时间
      if (result === []) {
        this.beginRuleDate = '';
        this.endRuleDate = '';
        return;
      }
      if (result[0] !== '' || result[1] !== '') {
        this.beginRuleDate = this.datePipe.transform(result[0], 'yyyy-MM-dd') + '@' + this.datePipe.transform(result[0], 'HH:mm:ss');
        this.endRuleDate = this.datePipe.transform(result[1], 'yyyy-MM-dd') + '@' + this.datePipe.transform(result[0], 'HH:mm:ss');
      }

    } else if (flag === 'couponInActivity') { // 红包 活动奖励查询 时间
      if (result === []) {
        this.beginCouponDate = '';
        this.endCouponDate = '';
        return;
      }
      // 正确选择数据
      if (result[0] !== '' || result[1] !== '') {
        this.beginCouponDate = this.datePipe.transform(result[0], 'yyyy-MM-dd');
        this.endCouponDate = this.datePipe.transform(result[1], 'yyyy-MM-dd');
      }
    } else if (flag === 'coupon') { // 红包
      if (result === []) {
        this.couponBeginDate = '';
        this.couponEndDate = '';
        return;
      }
      // 正确选择数据
      if (result[0] !== '' || result[1] !== '') {
        this.couponBeginDate = this.datePipe.transform(result[0], 'yyyy-MM-dd') + 'T00:00:00.000Z';
        this.couponEndDate = this.datePipe.transform(result[1], 'yyyy-MM-dd') + 'T23:59:59.000Z';
      }
      // 手动点击清空
      if (this.couponBeginDate === null || this.couponEndDate === null) {
        this.couponBeginDate = this.commonService.getDay(-7);
        this.couponEndDate = this.commonService.getDay(-1);
      }
    } else if (flag === 'baseInfo') {  // 基本信息的活动时间
      if (result === []) {
        this.beginBatchsendDate = '';
        this.endBatchsendDate = '';
        return;
      }
      // 正确选择数据
      if (result[0] !== '' || result[1] !== '') {
        this.beginBatchsendDate = this.datePipe.transform(result[0], 'yyyy-MM-dd') + 'T00:00:00.000Z';
        this.endBatchsendDate = this.datePipe.transform(result[1], 'yyyy-MM-dd') + 'T23:59:59.000Z';
      }
    } else if (flag === 'couponInBatchsend') { // 红包 活动奖励查询 时间
      if (result === []) {
        this.beginCouponInBatchsendDate = '';
        this.endCouponInBatchsendDate = '';
        return;
      }
      // 正确选择数据
      if (result[0] !== '' || result[1] !== '') {
        this.beginCouponInBatchsendDate = this.datePipe.transform(result[0], 'yyyy-MM-dd');
        this.endCouponInBatchsendDate = this.datePipe.transform(result[1], 'yyyy-MM-dd');
      }
    } else if (flag === 'searchBean') {
      if (result === []) {
        this.beginBeanDate = '';
        this.endBeanDate = '';
        return;
      }
      // 正确选择数据
      if (result[0] !== '' || result[1] !== '') {
        this.beginBeanDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss');
        this.endBeanDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
      }
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
    this.dataSearchCoupon.forEach(data => {
      if (!data.disabled) { data.checked = value; }
    });
    this.refreshSearchCouponStatus();
  }

  checkAll(value: boolean): void {
    this.displayData.forEach(category => {
      if (!category.disabled) { category.checked = value; }
    });
    this.refreshStatus();
  }

  refreshStatus(): void {
    const allChecked = this.displayData.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.displayData.filter(value => !value.disabled).every(value => !value.checked);
    this.couponAllChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  getCouponNumber(event, data) {
    this.dataSearchCoupon.forEach(item => {
      if (item.couponId === data.couponId) {
        item.quantity = parseInt(event);
      }
    });
  }

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
      if (this.category[i].checked === true) {
        flag = this.category[i].value;
        count++;
      }
    }
    flag = count === 4 ? 'all' : flag;
    return flag;
  }

  // 转换 url 的 & 字符
  dotranUrl(url) {
    url = url.indexOf('`') !== -1 ? url.replace(/`/g, '&') : url.replace(/&/g, '`');
    return url;
  }

  // 切换面板
  changePanel(flag): void {
    if (flag !== this.currentPanel) { this.loadData(flag); }
    this.currentPanel = flag;
    const operationInput = { op_category: '活动管理', op_page: flag === 'coupon' ? '权限配置' : flag === 'activity' ? '活动管理' : flag === 'batchsendList' ? '批量发放' : flag === 'bean' ? '充值送豆' : '', op_name: '访问' };
    this.commonService.updateOperationlog(operationInput).subscribe();
  }

  isPoneAvailable($poneInput) {
    const myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    return !myreg.test($poneInput) ? false : true;
  }

  // 封装时间格式转换
  compareDate(s1, s2) {
    return ((new Date(s1.toString().replace(/-/g, '\/'))) < (new Date(s2.toString().replace(/-/g, '\/'))));
  }

  parserPoint = (value: string) => value.replace('.', '');
}
