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
  dataSearchCoupon = [];
  dataSystemSymbo = []; // 操作系统
  dataChannel = []; // 渠道
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
  contentDate = {
    // tslint:disable-next-line:max-line-length
    'actName': '', 'date': '', 'actRuleDesc': ''
  };
  radioValue = 'LoginOneOff';
  addMarginArr = [{ chargeThreshold: '', totalQuantity: '', perUserQuantity: '', actGiftNo: '' }];  // 模板D下的对区间数量的操作
  searchActivityItem = {
    actName: '', status: ''
  };
  allSearchCouponChecked = false; // 用于table多选
  indeterminate = false; // 用于table多选
  baseInfoId = ''; // 上传图片前的Id
  modelId = ''; // 弹框获取当前Id
  couponListArr = []; // 最底部的活动奖励配置数组
  actGiftNo = ''; // 非区间重置的活动编码
  actGiftNoArr = [{ value: '', label: '---选择红包组---' }];  // 用于下拉当前有的红包组

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
      this.searchActivityItem.actName = this.searchContentForm.controls['actName'].value;
      this.searchActivityItem.status = this.searchContentForm.controls['status'].value;
      this.activityService.getActivityList(this.searchActivityItem).subscribe(res => {
        this.dataContent = JSON.parse(res.payload);
        this.dataContent.forEach(data => {
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
        console.log(this.dataContent);
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
        this.dataSearchCoupon = JSON.parse(res.payload);
      });
    } else if (flag === 'newCoupon') {
      this.activityService.getNewCouponList(this.baseInfoId).subscribe(res => {
        this.actGiftNoArr = [{ value: '', label: '---无---' }]; // 重置数组，因为接口返回全部
        this.couponListArr = JSON.parse(res.payload);
        this.couponListArr.forEach(item => {
          const tempObject = { value: item.actGiftNo, label: item.actGiftNo };
          this.actGiftNoArr.push(tempObject);
        });
        console.log(this.couponListArr);
      });
    }
  }

  private _initSearchContentForm(): void {
    this.searchContentForm = this.fb.group({
      actName: [''],
      status: [''],
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
      chargeThreshold: [''],
      totalQuantity: [''],
      // consumedQuantity: [''], 该字段是后台自己使用
      perUserQuantity: [''],
      actGiftNo: [''],
      temp: [''], // 临时用于不需要的字段，比如模板4上的子区间相关字段
    });
  }

  doSearchCoupon(flag) {
    if (flag === 'coupon') {
      this.loadData('coupon');
    }
  }

  // 新增内容 - 弹框
  showModal(flag, data) {
    if (flag === 'content') { // 新增活动
      this.isAddContentVisible = true;
      // this.beginBaseInfoDate = ''; // 基本信息日期选择
      // this.endBaseInfoDate = '';
      this.beginRuleDate = ''; // 模板1日期选择
      this.endRuleDate = '';
      this.contentDate = {  // 清空
        // tslint:disable-next-line:max-line-length
        'actName': '', 'date': '', 'actRuleDesc': ''
      };
    } else if (flag === 'coupon') { // 新增红包 | 活动奖励
      if (this.baseInfoId === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '基本信息未填写' });
        return;
      }
      this.isCouponVisible = true;
      this.doSearchCoupon('coupon');
    } else if (flag === 'modifyCoupon') { // 修改红包 | 活动奖励
      this.modelId = data.id;
      // this.isCouponVisible = true;
      // this.doSearchCoupon('coupon');
    }
    this.emptyAdd = ['', '', '', '', '', '', ''];
  }

  hideModal(flag) {
    if (flag === 'content') {
      this.isAddContentVisible = false;
      this.fileList.length = 0;
      this.imageUrl = '';
      this.showImageUrl = '';
      this.radioValue = 'LoginOneOff';  // 
      this.baseInfoId = ''; // 清空Id
    } else if (flag === 'coupon') {
      this.isCouponVisible = false;
      this.beginCouponDate = null;
      this.endCouponDate = null;
    }
  }

  // 封装验证新增
  verificationAdd(flag): boolean {
    let result = true;
    if (flag === 'content') {
      if (this.radioValue === 'LoginOneOff' || this.radioValue === 'LoginDaily') {
        if (this.addContentForm.controls['totalQuantity'].value === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '奖励发放上限未填写' });
          result = false;
        } else if (this.addContentForm.controls['perUserQuantity'].value === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '每个用户可领未填写' });
          result = false;
        } else if (this.addMarginArr[0].actGiftNo === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '下拉的活动奖励配置未选择' });
          result = false;
        }
      } else if (this.radioValue === 'ChargeOneOff') {
        if (this.addContentForm.controls['chargeThreshold'].value === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '充值额度约束未填写' });
          result = false;
        } else if (this.addContentForm.controls['totalQuantity'].value === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '奖励发放上限未填写' });
          result = false;
        } else if (this.addContentForm.controls['perUserQuantity'].value === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '每个用户可领未填写' });
          result = false;
        } else if (this.addMarginArr[0].actGiftNo === '') {
          this.modalService.error({ nzTitle: '提示', nzContent: '下拉的活动奖励配置未选择' });
          result = false;
        }
      } else if (this.radioValue === 'ChargeMargin') {
        addMarginArr = [{ chargeThreshold: '', totalQuantity: '', perUserQuantity: '', actGiftNo: '' }];
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
      if (this.addContentForm.controls['actName'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '活动名称未填写' });
        result = false;
      } else if (this.addContentForm.controls['actRuleDesc'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '活动规则未填写' });
        result = false;
      }
    }
    return result;
  }

  // 新增操作
  doSave(flag): void {
    if (flag === 'content') {
      if (!this.verificationAdd('content')) { return; }
      let actTypeBo = {};
      if (this.radioValue === 'LoginOneOff' || this.radioValue === 'LoginDaily') {
        actTypeBo = {
          'actTypeStartDate': this.beginRuleDate.substring(0, this.beginRuleDate.indexOf('@')),
          'actTypeEndDate': this.endRuleDate.substring(0, this.endRuleDate.indexOf('@')),
          'actTypeStartTime': this.beginRuleDate.substring(this.beginRuleDate.indexOf('@') + 1),
          'actTypeEndTime': this.endRuleDate.substring(this.endRuleDate.indexOf('@') + 1),
          'totalQuantity': this.addContentForm.controls['totalQuantity'].value,
          'perUserQuantity': this.addContentForm.controls['perUserQuantity'].value,
          'actGiftNo': this.addMarginArr[0].actGiftNo, // 活动奖励包编码
        };
      } else if (this.radioValue === 'ChargeOneOff') {
        actTypeBo = {
          'actTypeStartDate': this.beginRuleDate.substring(0, this.beginRuleDate.indexOf('@')),
          'actTypeEndDate': this.endRuleDate.substring(0, this.endRuleDate.indexOf('@')),
          'actTypeStartTime': this.beginRuleDate.substring(this.beginRuleDate.indexOf('@') + 1),
          'actTypeEndTime': this.endRuleDate.substring(this.endRuleDate.indexOf('@') + 1),
          'chargeThreshold': this.addContentForm.controls['chargeThreshold'].value,
          'totalQuantity': this.addContentForm.controls['totalQuantity'].value,
          // 'consumedQuantity': this.addContentForm.controls['consumedQuantity'].value,  // 该字段是后台自己使用
          'perUserQuantity': this.addContentForm.controls['perUserQuantity'].value,
          'actGiftNo': this.addMarginArr[0].actGiftNo, // 活动奖励包编码
        };
      } else if (this.radioValue === 'ChargeMargin') {
        actTypeBo = {
          'actSubTypeL': this.addMarginArr,
        };
      }
      const contentInput = {
        'id': this.baseInfoId,
        'actName': this.addContentForm.controls['actName'].value,
        'actStartDate': this.beginRuleDate.substring(0, this.beginRuleDate.indexOf('@')),
        'actEndDate': this.endRuleDate.substring(0, this.endRuleDate.indexOf('@')),
        'actRuleDesc': this.addContentForm.controls['actRuleDesc'].value,
        'actType': this.radioValue,
        'actTypeBo': actTypeBo
      };
      this.activityService.saveActivity(contentInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } });
          this.loadData('content');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'coupon') {
      const couponArr = [];
      let checkedCount = 0;
      let quantityCount = 0;
      this.dataSearchCoupon.forEach(data => {
        if (data.checked === true) {
          couponArr.push(data);
          checkedCount++;
          data.quantity ? quantityCount++ : 1 ;
        }
      });
      if (checkedCount === 0) {
        this.modalService.error({ nzTitle: '提示', nzContent: '请勾选优惠券' });
        return;
      }
      if (quantityCount === 0 || checkedCount !== quantityCount) {
        this.modalService.error({ nzTitle: '提示', nzContent: '勾选的优惠券的数量限制不能为空' });
        return;
      }
      const couponInput = { 'actRuleId': this.baseInfoId, 'actCouponRulePoL': couponArr };
      this.activityService.addCoupon(couponInput).subscribe(res => {
        if (res.retcode === 0) {
          this.isCouponVisible = false;
          this.loadData('newCoupon');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  doDelete(data, flag) {
    if (flag === 'content') {
      this.activityService.deleteActivity(data.id).subscribe(res => {  // 删除活动
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          this.loadData('content');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'couponList') {
      this.activityService.deleteCouponArr(this.baseInfoId, data).subscribe(resItem => { // 删除图片
        if (resItem.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
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
      if (this.verificationAdd('baseInfo')) { // 验证
        const contentInput = {
          'actName': this.addContentForm.controls['actName'].value,
          'actStartDate': this.beginBaseInfoDate,
          'actEndDate': this.endBaseInfoDate,
          'actRuleDesc': this.addContentForm.controls['actRuleDesc'].value
        };
        this.activityService.addActivity(contentInput).subscribe(res => {
          if (res.retcode === 0) {
            this.baseInfoId = JSON.parse(res.payload).id;
            this.fileList.push(file);
            this.handleUpload(this.baseInfoId);
            // this.notification.blank( '提示', '添加成功', { nzStyle: { color : 'green' } });
            this.loadData('content');
          } else {
            this.modalService.error({ nzTitle: '提示', nzContent: res.message });
          }
        });
      }
    }
    return false;
  }

  // 点击上传
  handleUpload(baseInfoId): void {
    const url = 'http://account-center-test.chewrobot.com/api/actrule/img';
    const imageUrl = 'http://account-center-test.chewrobot.com';
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
    const req = new HttpRequest('PUT', url, formData, {
      reportProgress: true
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe((event: HttpResponse<{ code: any, data: any, msg: any }> | any) => {
        if (event.body.retcode === 0) {
          this.imageUrl = JSON.parse(event.body.payload).relativeUri;
          this.showImageUrl = imageUrl + this.imageUrl;
          this.notification.success( '提示', '上传成功' );
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
    if (flag === 'content') {
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
    if (flag === 'baseInfo') {
      if (result === []) {
        this.beginBaseInfoDate = '';
        this.endBaseInfoDate = '';
        return;
      }
      if (result[0] !== '' || result[1] !== '') {
        this.beginBaseInfoDate = this.datePipe.transform(result[0], 'yyyy-MM-dd');
        this.endBaseInfoDate = this.datePipe.transform(result[1], 'yyyy-MM-dd');
      }
    } else if (flag === 'rule') {
      if (result === []) {
        this.beginRuleDate = '';
        this.endRuleDate = '';
        return;
      }
      if (result[0] !== '' || result[1] !== '') {
        this.beginRuleDate = this.datePipe.transform(result[0], 'yyyy-MM-dd') + '@' + this.datePipe.transform(result[0], 'HH:mm:ss');
        this.endRuleDate = this.datePipe.transform(result[1], 'yyyy-MM-dd') + '@' + this.datePipe.transform(result[0], 'HH:mm:ss');
      }

    } else if (flag === 'coupon') { // 红包 活动奖励查询
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
        item.quantity = parseInt(event);
      }
    });
  }
}
