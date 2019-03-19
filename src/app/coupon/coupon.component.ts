import { Component, OnInit } from '@angular/core';
import { CommonService } from '../public/service/common.service';
import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NzMessageService, UploadFile, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LocalizationService } from '../public/service/localization.service';
import { ContentService } from '../public/service/content.service';
import { HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { CouponService } from '../public/service/coupon.service';

registerLocaleData(zh);

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {

  isAddCouponVisible = false;
  isModifyCouponVisible = false;
  isPreviewCouponVisible = false;
  loading = false;
  searchCouponForm: FormGroup;
  addCouponForm: FormGroup;
  modifyCouponForm: FormGroup;
  now = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  cmsId = '';
  emptyAdd = ['', '', '', '', '', '', ''];  // 清空新增表单
  beginDate = '';
  endDate = '';
  dateSearch = { 'Today': [new Date(), new Date()], 'This Month': [new Date(), new Date()] };
  couponDate = {
    // tslint:disable-next-line:max-line-length
    'couponName': '', 'discountType': '', 'thresholdPrice': '', 'discountPrice': '', 'timeLimitValidDay': '', 'timeLimitType': '', 'timeLimitStart': '', 'timeLimitEnd': '', 'couponCategory': '', 'mutualExcludeRules': ''
  };
  dataCoupon = []; // 内容
  allChecked = false;
  indeterminate = false;
  displayData = [];
  radioValue = 'fix_start_end';  // 有效时间
  searchItem = {
    couponName: '', discountType: '', couponCategory: '', ctimeStart: '', ctimeEnd: ''
  };
  checkOptions = [
    { label: '活动不可用', value: 'promition_unavailable', checked: false },
    { label: '仅会员可用', value: 'vip_only', checked: false }
  ];
  category = [
    { name : '飞机', value : 'flight', checked : true, disabled: false },
    { name : '酒店', value : 'hotel', checked : true, disabled: false },
    { name : '火车', value : 'train', checked : true, disabled: false },
    { name : '打车', value : 'taxi', checked : true, disabled: false }
  ];

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private msg: NzMessageService,
    private modalService: NzModalService,
    public localizationService: LocalizationService,
    private couponService: CouponService,
    private notification: NzNotificationService,
    private datePipe: DatePipe,
    private http: HttpClient,
  ) {
    this.commonService.nav[6].active = true;
    this._initSearchCouponForm();
    this._initAddCouponForm();
    this._initModifyCouponForm();
  }

  ngOnInit() {
    this.loadData('coupon');
  }

  loadData(flag) {
    this.couponService.getCouponList(this.searchItem).subscribe(res => {
      this.dataCoupon = JSON.parse(res.payload);
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

  doSearchCoupon(flag) {
    this.searchItem.couponName = this.searchCouponForm.controls['couponName'].value;
    this.searchItem.discountType = this.searchCouponForm.controls['discountType'].value;
    this.searchItem.couponCategory = this.searchCouponForm.controls['couponCategory'].value;
    this.searchItem.ctimeStart = this.beginDate;
    this.searchItem.ctimeEnd = this.endDate;
    this.loadData('coupon');
  }

  private _initAddCouponForm(): void {
    this.addCouponForm = this.fb.group({
      couponName: [''],
      date: [''],
      discountType: [''],
      thresholdPrice: [''],
      discountPrice: [''],
      timeLimitValidDay: [''],
      timeLimitType: [''],
    });
  }

  // 新增内容 - 弹框
  showAddModal(flag) {
    this.isAddCouponVisible = true;
    this.radioValue = 'fix_start_end';  // 重置时间限制（单选）
    this.couponDate = {  // 清空
      // tslint:disable-next-line:max-line-length
      'couponName': '', 'discountType': '', 'thresholdPrice': '', 'discountPrice': '', 'timeLimitValidDay': '', 'timeLimitType': '', 'timeLimitStart': '', 'timeLimitEnd': '', 'couponCategory': '', 'mutualExcludeRules': ''
    };
  }

  hideAddModal(flag) {
    this.isAddCouponVisible = false;
  }

  // 封装验证新增
  verificationAddCoupon(flag): boolean {
    let result = true;
    // if (this.addCouponForm.controls['title'].value === '') {
    //   this.modalService.error({ nzTitle: '提示', nzContent: '标题未填写' });
    //   result = false;
    // } else if (this.addCouponForm.controls['type'].value === '') {
    //   this.modalService.error({ nzTitle: '提示', nzContent: '类型未选择' });
    //   result = false;
    // } else if (this.addCouponForm.controls['pseudonym'].value === '') {
    //   this.modalService.error({ nzTitle: '提示', nzContent: '发布人未填写' });
    //   result = false;
    // } else if (this.addCouponForm.controls['abstractCoupon'].value === '') {
    //   this.modalService.error({ nzTitle: '提示', nzContent: '摘要未填写' });
    //   result = false;
    // } else if (this.addCouponForm.controls['publishTime'].value === '') {
    //   this.modalService.error({ nzTitle: '提示', nzContent: '发布时间未选择' });
    //   result = false;
    // }
    return result;
  }

  // 新增操作
  doSave(flag): void {
    if (!this.verificationAddCoupon('coupon')) {
      return;
    }
    let couponInput = {};
    console.log(this.radioValue);
    if (this.radioValue === 'fix_start_end') {
      couponInput = {
        'couponName': this.addCouponForm.controls['couponName'].value,
        'discountType': this.addCouponForm.controls['discountType'].value,
        'thresholdPrice': this.addCouponForm.controls['thresholdPrice'].value,
        'discountPrice': this.addCouponForm.controls['discountPrice'].value,
        'timeLimitType': this.radioValue,
        'timeLimitStart': this.beginDate.substring(0, 10),
        'timeLimitEnd': this.endDate.substring(0, 10),
        'couponCategory': this.getCheckedCategory(),
        'mutualExcludeRules': this.getMutualExcludeRules(),
      };
    } else if (this.radioValue === 'fix_duration') {
      couponInput = {
        'couponName': this.addCouponForm.controls['couponName'].value,
        'discountType': this.addCouponForm.controls['discountType'].value,
        'thresholdPrice': this.addCouponForm.controls['thresholdPrice'].value,
        'discountPrice': this.addCouponForm.controls['discountPrice'].value,
        'timeLimitValidDay': this.addCouponForm.controls['timeLimitValidDay'].value,
        'timeLimitType': this.radioValue,
        'couponCategory': this.getCheckedCategory(),
        'mutualExcludeRules': this.getMutualExcludeRules(),
      };
    }
    this.couponService.addCoupon(couponInput).subscribe(res => {
      if (res.retcode === 0) {
        this.modalService.success({ nzTitle: '提示', nzContent: '新增成功' });
        this.hideAddModal('coupon');
        this.loadData('coupon');
      } else {
        this.modalService.error({ nzTitle: '提示', nzContent: res.message });
      }
    });
  }

  getMutualExcludeRules() {
    let arr = [];
    if (this.checkOptions[0].checked && this.checkOptions[1].checked) {
      arr = ['promition_unavailable', 'vip_only'];
    } else if (this.checkOptions[0].checked) {
      arr = ['promition_unavailable'];
    } else if (this.checkOptions[1].checked) {
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

  // 修改
  _initModifyCouponForm() {
    this.modifyCouponForm = this.fb.group({
      couponName: [''],
      date: [''],
      discountType: [''],
      timeLimitValidDay: [''],
      thresholdPrice: [''],
      discountPrice: [''],
      timeLimitType: [''],
    });
  }

  // 封装验证修改表单
  verificationModify(flag): boolean {
    let result = true;
    // if (this.modifyCouponForm.controls['title'].value === '') {
    //   this.modalService.error({ nzTitle: '提示', nzContent: '标题未填写' });
    //   result = false;
    // } else if (this.modifyCouponForm.controls['type'].value === '') {
    //   this.modalService.error({ nzTitle: '提示', nzContent: '类型未选择' });
    //   result = false;
    // } else if (this.modifyCouponForm.controls['pseudonym'].value === '') {
    //   this.modalService.error({ nzTitle: '提示', nzContent: '发布人未填写' });
    //   result = false;
    // } else if (this.modifyCouponForm.controls['abstractCoupon'].value === '') {
    //   this.modalService.error({ nzTitle: '提示', nzContent: '摘要未填写' });
    //   result = false;
    // } else if (this.modifyCouponForm.controls['publishTime'].value === '') {
    //   this.modalService.error({ nzTitle: '提示', nzContent: '发布时间未选择' });
    //   result = false;
    // }
    return result;
  }

  // 修改 - 弹框
  showModifyModal(data, flag) {
    const id = data.couponId;
    this.isModifyCouponVisible = true;
    this.cmsId = id;  // 用于修改
    this.couponService.getCoupon(id).subscribe(res => {
      // 处理异常处理
      this.couponDate = JSON.parse(res.payload);
      this.radioValue = JSON.parse(res.payload).timeLimitType;
      this.changeMutualExcludeRules(JSON.parse(res.payload).mutualExcludeRules);
      this.changeCouponCategory(JSON.parse(res.payload).couponCategory);
      this.beginDate = JSON.parse(res.payload).timeLimitStart;
      this.endDate = JSON.parse(res.payload).timeLimitEnd;
    });
  }

  hideModifyModal(flag) {
    this.isModifyCouponVisible = false;
  }

  // 修改操作
  doModify(flag) {
    if (!this.verificationModify('coupon')) {
      return;
    }
    // const couponInput = {
    //   'couponId': this.cmsId,
    //   'couponName': this.modifyCouponForm.controls['couponName'].value,
    //   'discountType': this.dotranUrl(this.modifyCouponForm.controls['discountType'].value),
    //   'thresholdPrice': this.modifyCouponForm.controls['thresholdPrice'].value,
    //   'discountPrice': this.modifyCouponForm.controls['discountPrice'].value,
    //   'timeLimitType': this.modifyCouponForm.controls['timeLimitType'].value,
    //   'timeLimitStart': this.beginDate.substring(0, 10),
    //   'timeLimitEnd': this.endDate.substring(0, 10),
    //   'couponCategory': this.getCheckedCategory(),
    //   'mutualExcludeRules': this.getMutualExcludeRules(),
    // };
    let couponInput = {};
    if (this.radioValue === 'fix_start_end') {
      couponInput = {
        'couponId': this.cmsId,
        'couponName': this.modifyCouponForm.controls['couponName'].value,
        'discountType': this.dotranUrl(this.modifyCouponForm.controls['discountType'].value),
        'thresholdPrice': this.modifyCouponForm.controls['thresholdPrice'].value,
        'discountPrice': this.modifyCouponForm.controls['discountPrice'].value,
        'timeLimitType': this.modifyCouponForm.controls['timeLimitType'].value,
        'timeLimitStart': this.beginDate.substring(0, 10),
        'timeLimitEnd': this.endDate.substring(0, 10),
        'couponCategory': this.getCheckedCategory(),
        'mutualExcludeRules': this.getMutualExcludeRules(),
      };
    } else if (this.radioValue === 'fix_duration') {
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
        this.hideModifyModal('coupon');
        this.loadData('coupon');
      } else {
        this.modalService.error({ nzTitle: '提示', nzContent: res.message });
      }
    });
  }

  // 查看 - 弹框
  showPreviewModal(data, flag) {
    const id = data.couponId;
    this.isPreviewCouponVisible = true;
    this.couponService.getCoupon(id).subscribe(res => {
      // 处理异常处理
      this.couponDate = JSON.parse(res.payload);
      this.changeMutualExcludeRules(JSON.parse(res.payload).mutualExcludeRules);
      this.changeCouponCategory(JSON.parse(res.payload).couponCategory);
      this.beginDate = JSON.parse(res.payload).timeLimitStart;
      this.endDate = JSON.parse(res.payload).timeLimitEnd;
    });
  }

  // 针对互斥限制
  changeMutualExcludeRules(params) {
    let mutualExcludeRules = [];
    mutualExcludeRules = params;
    if (mutualExcludeRules.length === 0) {
      this.checkOptions[0].checked = false;
      this.checkOptions[1].checked = false;
    } else if (mutualExcludeRules.length === 2) {
      this.checkOptions[0].checked = true;
      this.checkOptions[1].checked = true;
    } else {
      if (this.checkOptions[0].value === 'promition_unavailable') {
        this.checkOptions[0].checked = false;
        this.checkOptions[1].checked = true;
      } else if (this.checkOptions[0].value  === 'vip_only') {
        this.checkOptions[0].checked = true;
        this.checkOptions[1].checked = false;
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

  hidePreviewModal(flag) {
    this.isPreviewCouponVisible = false;
  }













  // 日期插件
  onChange(result): void {
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
    // 手动点击清空
    if (this.beginDate === null || this.endDate === null) {
      this.beginDate = this.commonService.getDay(-7);
      this.endDate = this.commonService.getDay(-1);
    }
  }


  // 转换 url 的 & 字符
  dotranUrl(url) {
    if (url.indexOf('`') !== -1) {
      url = url.replace(/`/g, '&');
    } else {
      url = url.replace(/&/g, '`');
    }
    return url;
  }

  // 转换 html 为 json
  dotran(str) {
    return str;
  }

  // 转换 json 为 html
  dotranJson(str) {
    str = str.replace(/\/\/"/g, '"', str);
    str = str.replace(/\/\/r\/\/n/g, '/r/n', str);
    str = str.replace(/\/\/t/g, '/t', str);
    str = str.replace(/\/\/b/g, '/b', str);
    return str;
  }







  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    const allChecked = this.displayData.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.displayData.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  checkAll(value: boolean): void {
    this.displayData.forEach(category => {
      if (!category.disabled) {
        category.checked = value;
      }
    });
    this.refreshStatus();
  }
}
