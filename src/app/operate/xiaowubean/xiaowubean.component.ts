import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/public/service/common.service';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { DataCenterService } from 'src/app/public/service/dataCenter.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-xiaowubean',
  templateUrl: './xiaowubean.component.html',
  styleUrls: ['./xiaowubean.component.scss']
})
export class XiaowubeanComponent implements OnInit {

  displayData = [];
  beanData = [{}];
  pageSize = 100;
  isSpinning = false;
  isAddBeanVisible = false;
  isModifyBeanVisible = false;
  isSearchBeanVisible = false;
  beanItem = {
    // tslint:disable-next-line:max-line-length
    'couponName': '', 'discountType': '', 'thresholdPrice': '', 'discountPrice': '', 'timeLimitType': '', 'timeLimitStart': '', 'timeLimitEnd': '', 'couponCategory': '', 'mutualExcludeRules': ''
  };
  addBeanForm: FormGroup;
  searchBeanForm: FormGroup;
  modifyBeanForm: FormGroup;
  beginDate = '';
  endDate = '';
  constructor(
    public commonService: CommonService,
    private notification: NzNotificationService,
    private dataCenterService: DataCenterService,
    private modalService: NzModalService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) {
    this._initSearchBeanForm();
    this._initAddBeanForm();
    this._initModifyBeanForm();
  }

  ngOnInit() {
    // this.isSpinning = true; // loading
    // this.dataCenterService.getUnitList(beginDate, endDate, '', '', 'weather-bot').subscribe(res => {
    //   if (res.retcode === 0 && res.status !== 500) {
    //     localStorage.setItem('dataCenter', res.payload);
    //     this.commonService.commonDataCenter = JSON.parse(res.payload).reverse();
    //     localStorage.setItem('dataCenterTime', currentTime);
    //     this.isSpinning = false;  // loading
    //   } else {
    //     this.modalService.error({ nzTitle: '提示', nzContent: res.message });
    //   }
    // });
  }

  private _initSearchBeanForm(): void {
    this.searchBeanForm = this.fb.group({
      couponName: [''],
      couponCategory: [''],
      date: [''],
    });
  }

  private _initAddBeanForm(): void {
    this.addBeanForm = this.fb.group({
      couponName: [''],
      date: [''],
      thresholdPrice: [''],
      discountPrice: [''],
      timeLimitType: [''],
    });
  }

  private _initModifyBeanForm(): void {
    this.modifyBeanForm = this.fb.group({
      couponName: [''],
      date: [''],
      thresholdPrice: [''],
      discountPrice: [''],
      timeLimitType: [''],
    });
  }

  // 新增内容 - 弹框
  showModal(data, flag) {
    if (flag === 'addBean') {
      this.isAddBeanVisible = true;
      this.beanItem = {  // 清空
        // tslint:disable-next-line:max-line-length
        'couponName': '', 'discountType': '', 'thresholdPrice': '', 'discountPrice': '', 'timeLimitType': '', 'timeLimitStart': '', 'timeLimitEnd': '', 'couponCategory': '', 'mutualExcludeRules': ''
      };
    } else if (flag === 'modifyBean') {
      this.isModifyBeanVisible = true;
      this.beanItem = {  // 清空
        // tslint:disable-next-line:max-line-length
        'couponName': '', 'discountType': '', 'thresholdPrice': '', 'discountPrice': '', 'timeLimitType': '', 'timeLimitStart': '', 'timeLimitEnd': '', 'couponCategory': '', 'mutualExcludeRules': ''
      };
    } else if (flag === 'searchBean') {
      this.isSearchBeanVisible = true;
      this.beanItem = {  // 清空
        // tslint:disable-next-line:max-line-length
        'couponName': '', 'discountType': '', 'thresholdPrice': '', 'discountPrice': '', 'timeLimitType': '', 'timeLimitStart': '', 'timeLimitEnd': '', 'couponCategory': '', 'mutualExcludeRules': ''
      };
    }
  }

  hideModal(flag) {
    if (flag === 'addBean') {
      this.isAddBeanVisible = false;
    } else if (flag === 'modifyBean') {
      this.isModifyBeanVisible = false;
    } else if (flag === 'searchBean') {
      this.isSearchBeanVisible = false;
    }
  }

  // 日期插件
  onChange(result, flag): void {
    if (flag === 'searchBean') {
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
    }
  }

}
