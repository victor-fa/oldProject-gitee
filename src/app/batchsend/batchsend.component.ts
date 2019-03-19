import { Component, OnInit } from '@angular/core';
import { CommonService } from '../public/service/common.service';
import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NzMessageService, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LocalizationService } from '../public/service/localization.service';
import { BatchsendService } from '../public/service/batchsend.service';
import { CouponService } from '../public/service/coupon.service';
import { ActivityService } from '../public/service/activity.service';

registerLocaleData(zh);

@Component({
  selector: 'app-batchsend',
  templateUrl: './batchsend.component.html',
  styleUrls: ['./batchsend.component.scss']
})
export class BatchsendComponent implements OnInit {

  isAddBatchsendVisible = false;
  isDetailBatchsendVisible = false;
  isCouponVisible = false;
  isBatchsendVisible = false;
  addBatchsendForm: FormGroup;
  searchCouponForm: FormGroup;
  dateSearch = { 'Today': [new Date(), new Date()], 'This Month': [new Date(), new Date()] };
  beginDate = '';
  endDate = '';
  beginCouponDate = null; // 红包日期选择
  endCouponDate = null;
  cmsId = '';
  emptyAdd = ['', '', '', '', '', '', ''];  // 清空新增表单
  allSearchCouponChecked = false; // 用于table多选
  indeterminate = false; // 用于table多选
  batchsendDate = {
    // tslint:disable-next-line:max-line-length
    'displayMessage': '', 'errorRevL': [], 'invalidRevL': [], 'pendingRevL': [], 'pushRuleId': '', 'pushStatus': '', 'successRevL': '', 'sendTime': '', 'totalRevNum': '', 'actCouponRulePoL': [], 'tempCouponName': []
  };
  dataSearchCoupon = [];
  dataBatchsend = []; // 内容
  couponListArr = []; // 最底部的活动奖励配置数组
  finalBatchsendDate = {  // 发送界面
    // tslint:disable-next-line:max-line-length
    'displayMessage': '', 'errorRevL': [], 'invalidRevL': [], 'pendingRevL': [], 'pushRuleId': '', 'pushStatus': '', 'successRevL': '', 'sendTime': '', 'totalRevNum': '', 'actCouponRulePoL': [], 'tempCouponName': []
  };
  modelId = ''; // 新增后拿到的id，用来批量发放

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private msg: NzMessageService,
    private modalService: NzModalService,
    public localizationService: LocalizationService,
    private batchsendService: BatchsendService,
    private couponService: CouponService,
    private activityService: ActivityService,
    private notification: NzNotificationService,
    private datePipe: DatePipe,
  ) {
    this.commonService.nav[8].active = true;
    this._initAddBatchsendForm();
    this._initSearchCouponForm();
  }

  ngOnInit() {
    this.loadData('batchsendList');
  }

  loadData(flag) {
    if (flag === 'batchsendList') {
      const batchsend = {
        sendStartTime: this.beginDate,
        sendEndTime: this.endDate
      };
      this.batchsendService.getBatchsendList(batchsend).subscribe(res => {
        this.dataBatchsend = JSON.parse(res.payload);
        if (this.dataBatchsend.length > 0) {
          this.dataBatchsend.forEach(item => {
            // tslint:disable-next-line:max-line-length
            item.totalRevNum = (item.pendingRevL !== undefined ? item.pendingRevL.length : 0) + (item.invalidRevL !== undefined ? item.invalidRevL.length : 0) + (item.errorRevL !== undefined ? item.errorRevL.length : 0) + (item.successRevL !== undefined ? item.successRevL.length : 0);
          });
        }
      });
    } else if (flag === 'coupon') {
      if (this.beginCouponDate === null) {
        this.beginCouponDate = this.commonService.getDayWithAcross(-7);
        this.endCouponDate = this.commonService.getDayWithAcross(-1);
      }
      const searchCouponItem = {
        couponName: encodeURI(this.searchCouponForm.controls['couponName'].value),
        discountType: this.searchCouponForm.controls['discountType'].value,
        couponCategory: this.searchCouponForm.controls['couponCategory'].value,
        ctimeStart: this.beginCouponDate + 'T00:00:00.000Z',
        ctimeEnd: this.endCouponDate + 'T23:59:59.999Z',
      };
      this.couponService.getCouponList(searchCouponItem).subscribe(res => {
        if (res.payload === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
          return;
        }
        this.dataSearchCoupon = JSON.parse(res.payload);
      });
    }
  }

  private _initAddBatchsendForm(): void {
    this.addBatchsendForm = this.fb.group({
      pendingRevL: [''],
      displayMessage: [''],
    });
  }

  private _initSearchCouponForm(): void {
    this.searchCouponForm = this.fb.group({
      couponName: [''],
      discountType: [''],
      couponCategory: [''],
      date: [''],
    });
  }

  // 新增内容 - 弹框
  showModal(flag, data) {
    if (flag === 'addBatchsend') {
      this.batchsendDate = {  // 清空
        // tslint:disable-next-line:max-line-length
        'displayMessage': '', 'errorRevL': [], 'invalidRevL': [], 'pendingRevL': [], 'pushRuleId': '', 'pushStatus': '', 'successRevL': '', 'sendTime': '', 'totalRevNum': '', 'actCouponRulePoL': [], 'tempCouponName': []
      };
      this.loadData('coupon');
      this.isAddBatchsendVisible = true;
    } else if (flag === 'detail') {
      this.batchsendDate = data;
      if (this.batchsendDate.actCouponRulePoL) {
        const tempArr = [];
        this.batchsendDate.actCouponRulePoL.forEach((item, i) => {
          tempArr.push(item.couponRulePo.couponName);
        });
        this.batchsendDate.tempCouponName = tempArr;
      }
      this.isDetailBatchsendVisible = true;
    } else if (flag === 'addCoupon') { // 新增红包 | 活动奖励
      this.isCouponVisible = true;
      this.couponListArr = [];
      this.loadData('coupon');
    } else if (flag === 'batchsend') { // 批量发送
      this.finalBatchsendDate.pendingRevL = this.addBatchsendForm.controls['pendingRevL'].value.split('\n');
      this.finalBatchsendDate.actCouponRulePoL = this.couponListArr;
      this.finalBatchsendDate.displayMessage = this.addBatchsendForm.controls['displayMessage'].value;
      if (this.finalBatchsendDate.actCouponRulePoL) {
        const tempArr = [];
        this.finalBatchsendDate.actCouponRulePoL.forEach((item, i) => {
          tempArr.push(item.couponName);
        });
        this.finalBatchsendDate.tempCouponName = tempArr;
      }
      this.isBatchsendVisible = true;
    }
    this.emptyAdd = ['', '', '', '', '', '', ''];
  }

  hideModal(flag) {
    if (flag === 'batchsendList') {
      this.isAddBatchsendVisible = false;
      this.beginCouponDate = null;
      this.endCouponDate = null;
    } else if (flag === 'detailBatchsend') {  // 查看
      this.isDetailBatchsendVisible = false;
    } else if (flag === 'coupon') { // 新增红包
      this.isCouponVisible = false;
      this.beginCouponDate = null;
      this.endCouponDate = null;
    } else if (flag === 'batchsend') {
      this.isBatchsendVisible = false;
    }
  }

  // 封装验证新增
  verificationAdd(flag): boolean {
    let result = true;
    if (flag === 'batchsend') {
      if (this.addBatchsendForm.controls['pendingRevL'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '发送对象未填写' });
        result = false;
      } else if (this.addBatchsendForm.controls['displayMessage'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '附带信息未选择' });
        result = false;
      } else if (this.couponListArr === []) {
        this.modalService.error({ nzTitle: '提示', nzContent: '发送奖励配置未选择' });
        result = false;
      }
    }
    return result;
  }

  isPoneAvailable($poneInput) {
    const myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test($poneInput)) {
        return false;
    } else {
        return true;
    }
  }

  // 新增操作
  doSave(flag): void {
    if (flag === 'batchsendList') {
      let count = 0;
      if (!this.verificationAdd('batchsend')) {
        return;
      }
      this.addBatchsendForm.controls['pendingRevL'].value.split('\n').forEach(item => {
        // tslint:disable-next-line:no-unused-expression
        !this.isPoneAvailable(item) ? count++ : 1 ;
      });
      if (count > 0) {
        this.modalService.error({ nzTitle: '提示', nzContent: '输入的手机号码中有不符合要求的！' });
        return;
      }
      this.showModal('batchsend', '');  // 打开发送弹窗
    } else if (flag === 'coupon') { // 保存红包组选择区
      const couponArr = [];
      let checkedCount = 0;
      let quantityCount = 0;
      this.dataSearchCoupon.forEach(data => {
        if (data.checked === true) {
          couponArr.push(data);
          checkedCount++;
          // tslint:disable-next-line:no-unused-expression
          data.quantity ? quantityCount++ : 1 ;
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
      this.couponListArr = couponArr;
      this.isCouponVisible = false;
      this.notification.blank( '提示', '新增红包组成功', { nzStyle: { color : 'green' } });
    } else if (flag === 'batchsend') { // 批量发送
      // 调用新增接口
      const batchsendListInput = {
        'pendingRevL': this.addBatchsendForm.controls['pendingRevL'].value.split('\n'),
        'displayMessage': this.addBatchsendForm.controls['displayMessage'].value,
        'actCouponRulePoL': this.couponListArr,
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


    }
  }

  // 日期插件
  onChange(result, flag): void {
    if (flag === 'baseInfo') {  // 基本信息的活动时间
      if (result === []) {
        this.beginDate = '';
        this.endDate = '';
        return;
      }
      // 正确选择数据
      if (result[0] !== '' || result[1] !== '') {
        this.beginDate = this.datePipe.transform(result[0], 'yyyy-MM-dd') + 'T00:00:00.000Z';
        this.endDate = this.datePipe.transform(result[1], 'yyyy-MM-dd') + 'T23:59:59.000Z';
      }
    } else if (flag === 'coupon') { // 红包 活动奖励查询 时间
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

  checkAllSearchCoupon(value: boolean): void {
    this.dataSearchCoupon.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshSearchCouponStatus();
  }

  getCouponNumber(event, data) {
    this.dataSearchCoupon.forEach(item => {
      if (item.couponId === data.couponId) {
        // tslint:disable-next-line:radix
        item.quantity = parseInt(event);
      }
    });
  }
}
