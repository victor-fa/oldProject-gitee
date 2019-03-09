import { Component, OnInit } from '@angular/core';
import { CommonService } from '../public/service/common.service';
import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NzMessageService, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LocalizationService } from '../public/service/localization.service';
import { BatchsendService } from '../public/service/batchsend.service';

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
  addBatchsendForm: FormGroup;
  dateSearch = { 'Today': [new Date(), new Date()], 'This Month': [new Date(), new Date()] };
  beginDate = '';
  endDate = '';
  beginCouponDate = ''; // 红包日期选择
  endCouponDate = '';
  cmsId = '';
  emptyAdd = ['', '', '', '', '', '', ''];  // 清空新增表单
  batchsendDate = {
    // tslint:disable-next-line:max-line-length
    'displayMessage': '', 'errorRevL': [], 'invalidRevL': [], 'pendingRevL': [], 'pushRuleId': '', 'pushStatus': '', 'successRevL': '', 'sendTime': '', 'totalRevNum': ''
  };
  dataSearchCoupon = [];
  dataBatchsend = []; // 内容

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private msg: NzMessageService,
    private modalService: NzModalService,
    public localizationService: LocalizationService,
    private batchsendService: BatchsendService,
    private notification: NzNotificationService,
    private datePipe: DatePipe,
  ) {
    this.commonService.nav[7].active = true;
    this._initAddBatchsendForm();
  }

  ngOnInit() {
    this.loadData('batchsend');
  }

  loadData(flag) {
    if (flag === 'batchsend') {
      const batchsend = {
        sendStartTime: this.beginDate,
        sendEndTime: this.endDate
      };
      this.batchsendService.getBatchsendList(batchsend).subscribe(res => {
        this.dataBatchsend = JSON.parse(res.payload);
        if (this.dataBatchsend.length > 0) {
          this.dataBatchsend.forEach(item => {
            // tslint:disable-next-line:max-line-length
            item.totalRevNum = (item.pendingRevL !== undefined ? item.pendingRevL.length : 0) + (item.invalidRevL !== undefined ? item.invalidRevL.length : 0) + (item.errorRevL !== undefined ? item.errorRevL.length : 0) + (item.successRevL !== undefined ? item.successRevL.length : 0)
          });
        }
        console.log(this.dataBatchsend);
      });
    } else if (flag === 'coupon') {
      // if (this.beginCouponDate === null) {
      //   this.beginCouponDate = this.commonService.getDayWithAcross(-7);
      //   this.endCouponDate = this.commonService.getDayWithAcross(-1);
      // }
      // const searchCouponItem = {
      //   couponName: encodeURI(this.searchCouponForm.controls['couponName'].value),
      //   discountType: this.searchCouponForm.controls['discountType'].value,
      //   couponCategory: this.searchCouponForm.controls['couponCategory'].value,
      //   ctimeStart: this.beginCouponDate + 'T00:00:00.000Z',
      //   ctimeEnd: this.endCouponDate + 'T23:59:59.999Z',
      // };
      // this.couponService.getCouponList(searchCouponItem).subscribe(res => {
      //   if (res.payload === '') {
      //     this.modalService.error({ nzTitle: '提示', nzContent: res.message });
      //     return;
      //   }
      //   this.dataSearchCoupon = JSON.parse(res.payload);
      // });
    }
  }

  private _initAddBatchsendForm(): void {
    this.addBatchsendForm = this.fb.group({
      title: [''],
      type: [''],
      url: [''],
      abstractContent: [''],
      content: [''],
      publishTime: [''],
      pseudonym: [''],
    });
  }

  // 新增内容 - 弹框
  showModal(flag, data) {
    if (flag === 'batchsend') {
      this.batchsendDate = {  // 清空
        // tslint:disable-next-line:max-line-length
        'displayMessage': '', 'errorRevL': [], 'invalidRevL': [], 'pendingRevL': [], 'pushRuleId': '', 'pushStatus': '', 'successRevL': '', 'sendTime': '', 'totalRevNum': ''
      };
      this.loadData('coupon');
      this.isAddBatchsendVisible = true;
    } else if (flag === 'detail') {
      this.batchsendDate = data;
      this.isDetailBatchsendVisible = true;
      console.log(this.batchsendDate);
    } else if (flag === 'addCoupon') { // 新增红包 | 活动奖励
      this.isCouponVisible = true;
      // this.couponGiftNo = '';
      // this.loadData('coupon');
    }
    this.emptyAdd = ['', '', '', '', '', '', ''];
  }

  hideModal(flag) {
    if (flag === 'addBatchsend') {
      this.isAddBatchsendVisible = false;
      this.beginCouponDate = null;
      this.endCouponDate = null;
    } else if (flag === 'detailBatchsend') {
      this.isDetailBatchsendVisible = false;
    }
  }

  // 封装验证新增
  verificationAdd(flag): boolean {
    let result = true;
    if (flag === 'batchsend') {
      if (this.addBatchsendForm.controls['title'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '标题未填写' });
        result = false;
      } else if (this.addBatchsendForm.controls['type'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '类型未选择' });
        result = false;
      } else if (this.addBatchsendForm.controls['pseudonym'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '发布人未填写' });
        result = false;
      } else if (this.addBatchsendForm.controls['abstractContent'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '摘要未填写' });
        result = false;
      } else if (this.addBatchsendForm.controls['publishTime'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '发布时间未选择' });
        result = false;
      }
    }
    return result;
  }

  // 新增操作
  doSave(flag): void {
    if (flag === 'batchsend') {
      if (!this.verificationAdd('batchsend')) {
        return;
      }
      const batchsendInput = {
        'title': this.addBatchsendForm.controls['title'].value,
        'abstractContent': this.addBatchsendForm.controls['abstractContent'].value,
        'pseudonym': this.addBatchsendForm.controls['pseudonym'].value,
        'publishTime': this.datePipe.transform(this.addBatchsendForm.controls['publishTime'].value, 'yyyy-MM-dd HH:mm:ss'),
        'type': this.addBatchsendForm.controls['type'].value,
      };
      this.batchsendService.addBatchsend(batchsendInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          this.hideModal('batchsend');
          this.loadData('batchsend');
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

}
