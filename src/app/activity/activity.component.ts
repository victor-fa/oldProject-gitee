import { Component, OnInit } from '@angular/core';
import { CommonService } from '../public/service/common.service';
import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NzModalService, NzNotificationService, UploadFile, NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LocalizationService } from '../public/service/localization.service';
import { HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { ActivityService } from '../public/service/activity.service';
import { CouponService } from '../public/service/coupon.service';

registerLocaleData(zh);

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  isAddContentVisible = false;
  isCouponVisible = false;
  searchContentForm: FormGroup;
  searchCouponForm: FormGroup;
  addContentForm: FormGroup;
  now = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  emptyAdd = ['', '', '', '', '', '', ''];  // 清空新增表单
  currentPanel = '';  // 当前面板
  dataContent = []; // 内容
  dataCoupon = [{}, {}];
  dataSearchCoupon = [];
  dataSystemSymbo = []; // 操作系统
  dataChannel = []; // 渠道
  beginDate = '';
  endDate = '';
  dateSearch = { 'Today': [new Date(), new Date()], 'This Month': [new Date(), new Date()] };
  fileList: UploadFile[] = [];
  imageUrl = '';
  showImageUrl = '';
  contentDate = {
    // tslint:disable-next-line:max-line-length
    'actName': '', 'date': '', 'actRuleDesc': ''
  };
  radioValue = 'LoginOneOff';
  addMarginArr = [{}];  // 模板D下的对区间数量的操作
  // addMarginArr = [{}];  // 模板D下的对区间数量的操作
  searchCouponItem = {
    couponName: '', discountType: '', couponCategory: '', ctimeStart: '', ctimeEnd: ''
  };
  allSearchCouponChecked = false; // 用于table多选
  indeterminate = false; // 用于table多选

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private modalService: NzModalService,
    public localizationService: LocalizationService,
    private activityService: ActivityService,
    private couponService: CouponService,
    private notification: NzNotificationService,
    private msg: NzMessageService,
    private datePipe: DatePipe,
    private http: HttpClient,
  ) {
    this.commonService.nav[5].active = true;
    this._initSearchContentForm();
    this._initSearchCouponForm();
    this._initAddContentForm();
  }

  ngOnInit() {
    this.loadData('content');
  }

  loadData(flag) {
    if (flag === 'content') {
      const actName = this.searchContentForm.controls['actName'].value;
      this.activityService.getActivityList(actName).subscribe(res => {
        this.dataContent = JSON.parse(res.payload);
        console.log(this.dataContent);
      });
    } else if (flag === 'coupon') {
      // const actName = this.searchContentForm.controls['actName'].value;
      // this.activityService.getActivityList(actName).subscribe(res => {
      //   this.dataContent = JSON.parse(res.payload);
      // });
      this.couponService.getCouponList(this.searchCouponItem).subscribe(res => {
        this.dataSearchCoupon = JSON.parse(res.payload);
      });
    }
  }

  private _initSearchContentForm(): void {
    this.searchContentForm = this.fb.group({
      actName: [''],
      bbb: [''],
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

  private _initAddContentForm(): void {
    this.addContentForm = this.fb.group({
      actName: [''],
      date: [''],
      actRuleDesc: [''],
      actType: [''],
    });
  }

  doSearchCoupon(flag) {
    if (flag === 'coupon') {
      this.searchCouponItem.couponName = this.searchCouponForm.controls['couponName'].value;
      this.searchCouponItem.discountType = this.searchCouponForm.controls['discountType'].value;
      this.searchCouponItem.couponCategory = this.searchCouponForm.controls['couponCategory'].value;
      this.searchCouponItem.ctimeStart = this.beginDate;
      this.searchCouponItem.ctimeEnd = this.endDate;
      this.loadData('coupon');
    }
  }


  // 新增内容 - 弹框
  showModal(flag) {
    if (flag === 'content') {
      this.isAddContentVisible = true;
      this.contentDate = {  // 清空
          // tslint:disable-next-line:max-line-length
    'actName': '', 'date': '', 'actRuleDesc': ''
        };
    } else if (flag === 'coupon') {
      this.isCouponVisible = true;
      this.doSearchCoupon('coupon');
    }
    this.emptyAdd = ['', '', '', '', '', '', ''];
  }

  hideModal(flag) {
    if (flag === 'content') {
      this.isAddContentVisible = false;
    } else if (flag === 'coupon') {
      this.isCouponVisible = false;
    }
  }

  // 封装验证新增
  verificationAdd(flag): boolean {
    let result = true;
    if (flag === 'content') {
      if (this.addContentForm.controls['version'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '版本未填写' });
        result = false;
      } else if (this.addContentForm.controls['title'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '标题未选择' });
        result = false;
      } else if (this.addContentForm.controls['description'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '描述未填写' });
        result = false;
      } else if (this.addContentForm.controls['size'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '大小未填写' });
        result = false;
      } else if (this.addContentForm.controls['file'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '文件地址未填写' });
        result = false;
      } else if (this.addContentForm.controls['system_symbol'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '操作系统未选择' });
        result = false;
      } else if (this.addContentForm.controls['version_allowed'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '允许的最低版本未填写' });
        result = false;
      } else if (this.addContentForm.controls['sub_title'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '副标题未填写' });
        result = false;
      } else if (this.addContentForm.controls['channel'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '渠道未选择' });
        result = false;
      }
    }
    return result;
  }

  // 新增操作
  doSave(flag): void {
    if (flag === 'content') {
      if (!this.verificationAdd('content')) {
        return;
      }
      const contentInput = {
        'version': this.addContentForm.controls['version'].value,
        'title': this.addContentForm.controls['title'].value,
        'description': this.addContentForm.controls['description'].value,
        'size': this.addContentForm.controls['size'].value,
        'file': this.addContentForm.controls['file'].value,
        'system_symbol': this.addContentForm.controls['system_symbol'].value,
        'version_allowed': this.addContentForm.controls['version_allowed'].value,
        'sub_title': this.addContentForm.controls['sub_title'].value,
        'channel': this.addContentForm.controls['channel'].value
      };
      this.activityService.addActivity(contentInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          this.hideModal('content');
          this.loadData('content');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  // 上传image
  beforeUpload = (file: UploadFile): boolean => {
    const suffix = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
    const isPng = suffix === '.png' || suffix === '.jpeg' || suffix === '.jpg' || suffix === '.ico' ? true : false;
    const isMoreThanTen = file.size < 512000 ? true : false;
    if (!isPng) {
      this.msg.error('您只能上传.png、.jpeg、.jpg、.ico、文件');
    } else if (!isMoreThanTen) {
      this.msg.error('您只能上传不超过500K文件');
    } else {
      this.fileList.push(file);
      this.handleUpload();
    }
    return false;
  }

  // 点击上传
  handleUpload(): void {
    const url = 'http://account-center-test.chewrobot.com/api/cms/notices/thumbnails/';
    const flag = 'thumbnail';
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
    });
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe((event: HttpResponse<{ code: any, data: any, msg: any }> | any) => {
        if (event.body.retcode === 0) {
          this.imageUrl = event.body.payload;
          this.showImageUrl = url + this.imageUrl;
          this.notification.success( '提示', '上传成功' );
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: event.body.message, });
        }
        formData.delete(flag);
      },
      err => { formData.delete(flag); }
    );
  }

  clickChangeMargin(flag, target) {
    if (flag === 'content') {
      if (target === 'add') {
        this.addMarginArr.push({});
      } else if (target === 'delete') {
        this.addMarginArr.pop();
      }
    }
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
      this.beginDate = this.datePipe.transform(result[0], 'yyyyMMdd');
      this.endDate = this.datePipe.transform(result[1], 'yyyyMMdd');
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
}
