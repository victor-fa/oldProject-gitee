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
  loading = false;
  avatarUrl: string;
  searchCouponForm: FormGroup;
  addCouponForm: FormGroup;
  modifyCouponForm: FormGroup;
  now = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  cmsId = '';
  emptyAdd = ['', '', '', '', '', '', ''];  // 清空新增表单
  fileList: UploadFile[] = [];
  imageUrl = '';
  showImageUrl = '';
  currentPanel = '';  // 当前面板
  beginDate = '';
  endDate = '';
  dateSearch = { 'Today': [new Date(), new Date()], 'This Month': [new Date(), new Date()] };
  couponDate = {
    'title': '',
    'type': '',
    'url': '',
    'abstractCoupon': '',
    'coupon': '',
    'publishTime': '',
    'pseudonym': ''
  };
  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
      [{ 'size': ['0.26rem', '0.31rem', '0.37rem', '0.41rem', '0.47rem', '0.52rem'] }], // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                         // remove formatting button
      ['link', 'video']                         // link and image, video
    ]
  };
  dataCoupon = []; // 内容
  allChecked = false;
  indeterminate = false;
  displayData = [];
  checkOptions = [
    { label: '活动不可用', value: '活动不可用', checked: true },
    { label: '仅会员可用', value: '仅会员可用' }
  ];
  category = [
    {
      name    : '飞机',
      checked : true,
      disabled: false
    },
    {
      name    : '酒店',
      checked : true,
      disabled: false
    },
    {
      name    : '火车',
      checked : true,
      disabled: false
    },
    {
      name    : '打车',
      checked : true,
      disabled: false
    }
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
    this.commonService.nav[4].active = true;
    this._initSearchForm();
    this._initAddCouponForm();
    this._initModifyCouponForm();
  }

  ngOnInit() {
    this.loadData('coupon');
  }

  loadData(flag) {
    this.couponService.getCouponList().subscribe(res => {
      this.dataCoupon = JSON.parse(res.payload);
    });
  }

  private _initSearchForm(): void {
    this.searchCouponForm = this.fb.group({
      couponName: [''],
      discountType: [''],
      couponCategory: [''],
      data: [''],
    });
  }

  doSearch(flag) {

  }

  private _initAddCouponForm(): void {
    this.addCouponForm = this.fb.group({
      title: [''],
      type: [''],
      url: [''],
      abstractCoupon: [''],
      coupon: [''],
      publishTime: [''],
      pseudonym: [''],
    });
  }

  // 新增内容 - 弹框
  showAddModal(flag) {
    this.isAddCouponVisible = true;
    this.couponDate = {  // 清空
      'title': '', 'type': '', 'url': '', 'abstractCoupon': '', 'coupon': '', 'publishTime': '', 'pseudonym': ''
    };
    this.fileList.splice(0, this.fileList.length);
    this.imageUrl = '';
    this.showImageUrl = '';
    this.emptyAdd = ['', '', '', '', '', '', ''];
  }

  hideAddModal(flag) {
    this.isAddCouponVisible = false;
    this.fileList.splice(0, this.fileList.length);
    this.imageUrl = '';
    this.showImageUrl = '';
  }

  // 封装验证新增
  verificationAddCoupon(flag): boolean {
    let result = true;
    if (this.addCouponForm.controls['title'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '标题未填写' });
      result = false;
    } else if (this.addCouponForm.controls['type'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '类型未选择' });
      result = false;
    } else if (this.addCouponForm.controls['pseudonym'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '发布人未填写' });
      result = false;
    } else if (this.addCouponForm.controls['abstractCoupon'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '摘要未填写' });
      result = false;
    } else if (this.addCouponForm.controls['publishTime'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '发布时间未选择' });
      result = false;
    }
    return result;
  }

  // 新增操作
  doSave(flag): void {
    if (!this.verificationAddCoupon('coupon')) {
      return;
    }
    const couponInput = {
      'title': this.addCouponForm.controls['title'].value,
      'url': this.dotranUrl(this.addCouponForm.controls['url'].value),
      'coupon': this.addCouponForm.controls['coupon'].value,
      'abstractCoupon': this.addCouponForm.controls['abstractCoupon'].value,
      'pseudonym': this.addCouponForm.controls['pseudonym'].value,
      'publishTime': this.datePipe.transform(this.addCouponForm.controls['publishTime'].value, 'yyyy-MM-dd HH:mm:ss'),
      'type': this.addCouponForm.controls['type'].value,
      'thumbnail': this.imageUrl
    };
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

  // 修改
  _initModifyCouponForm() {
    this.modifyCouponForm = this.fb.group({
      title: [''],
      type: [''],
      url: [''],
      abstractCoupon: [''],
      coupon: [''],
      publishTime: [''],
      pseudonym: [''],
    });
  }

  // 封装验证修改表单
  verificationModify(flag): boolean {
    let result = true;
    if (this.modifyCouponForm.controls['title'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '标题未填写' });
      result = false;
    } else if (this.modifyCouponForm.controls['type'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '类型未选择' });
      result = false;
    } else if (this.modifyCouponForm.controls['pseudonym'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '发布人未填写' });
      result = false;
    } else if (this.modifyCouponForm.controls['abstractCoupon'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '摘要未填写' });
      result = false;
    } else if (this.modifyCouponForm.controls['publishTime'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '发布时间未选择' });
      result = false;
    }
    return result;
  }

  // 预览修改
  doPreviewCouponModify() {
    if (!this.verificationModify('coupon')) {
      return;
    }
    const url = this.modifyCouponForm.controls['url'].value;
    if (url) {
      url.indexOf('`') !== -1 ? window.open(this.dotranUrl(url)) : window.open(url) ;
    } else {
      const title = '<h1><strong>' + this.modifyCouponForm.controls['title'].value + '</strong></h1>';
      const pseudonym = '<p><strong>﻿</strong></p><p>创建人：<span style="color: rgb(102, 163, 224);">'
          + this.modifyCouponForm.controls['pseudonym'].value + '</span>'
          + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
          + this.datePipe.transform(this.modifyCouponForm.controls['publishTime'].value, 'yyyy-MM-dd HH:mm:ss')
          + '</p><p><br></p>';
      this.localizationService.setPreview = title + pseudonym + this.modifyCouponForm.controls['coupon'].value;
      window.open('preview');
    }
  }

  // 修改 - 弹框
  showModifyModal(data, flag) {
    const id = data.id;
    this.isModifyCouponVisible = true;
    this.cmsId = id;  // 用于修改
    this.couponService.getCoupon(id).subscribe(res => {
      // 处理异常处理
      this.couponDate = JSON.parse(res.payload);
      this.couponDate.url = this.dotranUrl(JSON.parse(res.payload).url);
      this.imageUrl = JSON.parse(res.payload).thumbnail;
      const file: any = {
        name: JSON.parse(res.payload).thumbnail
      };
      this.fileList.push(file);
      this.showImageUrl = 'http://account-center-test.chewrobot.com/api/cms/notices/thumbnails/' + JSON.parse(res.payload).thumbnail;
    });
  }

  hideModifyModal(flag) {
    this.isModifyCouponVisible = false;
    this.fileList.splice(0, this.fileList.length);
    this.imageUrl = '';
    this.showImageUrl = '';
  }

  // 修改操作
  doModify(flag) {
    if (!this.verificationModify('coupon')) {
      return;
    }
    const couponInput = {
      'id': this.cmsId,
      'title': this.modifyCouponForm.controls['title'].value,
      'url': this.dotranUrl(this.modifyCouponForm.controls['url'].value),
      'coupon': this.dotran(this.modifyCouponForm.controls['coupon'].value),
      'abstractCoupon': this.modifyCouponForm.controls['abstractCoupon'].value,
      'pseudonym': this.modifyCouponForm.controls['pseudonym'].value,
      'publishTime': this.datePipe.transform(this.modifyCouponForm.controls['publishTime'].value, 'yyyy-MM-dd HH:mm:ss'),
      'type': this.modifyCouponForm.controls['type'].value,
      'thumbnail': this.imageUrl
    };
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

  // 删除 - 复用弹框
  showDeleteModal(data, flag) {
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: '您确定要删除该信息？',
      nzOkText: '确定',
      nzOnOk: () => this.doDelete(data.id, flag)
    });
  }

  doDelete(id, flag) {
    this.couponService.deleteCoupon(id).subscribe(res => {
      if (res.retcode === 0) {
        this.modalService.success({ nzTitle: '提示', nzContent: '删除成功' });
        this.loadData('coupon');
      } else {
        this.modalService.error({ nzTitle: '提示', nzContent: res.message });
      }
    });
  }












  // 日期插件
  onChange(result: Date): void {
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

  // 切换面板
  changePanel(flag): void {
    this.currentPanel = flag;
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
