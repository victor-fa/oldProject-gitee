import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/public/service/common.service';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { XiaowubeanService } from 'src/app/public/service/xiaowubean.service';

@Component({
  selector: 'app-xiaowubean',
  templateUrl: './xiaowubean.component.html',
  styleUrls: ['./xiaowubean.component.scss']
})
export class XiaowubeanComponent implements OnInit {

  displayData = [];
  beanData = [];
  pageSize = 100;
  isSpinning = false;
  isAddBeanVisible = false;
  isModifyBeanVisible = false;
  isSearchBeanVisible = false;
  beanItem = {
    'activeStatus': '', 'beginTime': '', 'depositAmount': '', 'describe': '', 'endTime': '',
     'giftPercent': 0, 'id': '', 'presentType': '', 'title': '', 'type': '', giftAmount: ''
  };
  dateSearch = { 'Today': [new Date(), new Date()], 'This Month': [new Date(), new Date()] };
  addBeanForm: FormGroup;
  searchBeanForm: FormGroup;
  modifyBeanForm: FormGroup;
  beginDate = '';
  endDate = '';
  radioValue = 'PERCENT_GIFT';  // 单选

  constructor(
    public commonService: CommonService,
    private notification: NzNotificationService,
    private modalService: NzModalService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private xiaowubeanService: XiaowubeanService,
  ) {
    this._initSearchBeanForm();
    this._initAddBeanForm();
    this._initModifyBeanForm();
  }

  ngOnInit() {
    this.loadData('bean');
  }

  loadData(flag) {
    if (flag === 'bean') {
      this.isSpinning = true; // loading
      const beanInput = {
        title: this.searchBeanForm.controls['title'].value,
        beginTime: this.beginDate,
        endTime: this.endDate
      };
      this.xiaowubeanService.getXiaowubeanList(beanInput).subscribe(res => {
        if (res.retcode === 0 && res.status !== 500) {
          this.beanData = JSON.parse(res.payload);
          const nowTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm');
          this.beanData.forEach((item, i) => {
            const beginTime = this.compareDate(item.beginTime, 'yyyy-MM-dd HH:mm');
            const endTime = this.compareDate(item.endTime, 'yyyy-MM-dd HH:mm');
            let result = '';
            if (this.compareDate(nowTime, beginTime)) {
              result = '未开始';
            } else if (this.compareDate(endTime, nowTime)) {
              result = '已结束';
            } else {
              result = '进行中';
            }
            item.activeStatus = result;
          });
          console.log(this.beanData);
          this.isSpinning = false;  // loading
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  private _initSearchBeanForm(): void {
    this.searchBeanForm = this.fb.group({
      title: [''],
      date: [''],
    });
  }

  private _initAddBeanForm(): void {
    this.addBeanForm = this.fb.group({
      title: [''],
      describe: [''],
      date: [''],
      type: [''],
      depositAmount: [''],
      giftPercent: [''],  // 百分比
      giftAmount: [''], // 固定值
    });
  }

  private _initModifyBeanForm(): void {
    this.modifyBeanForm = this.fb.group({
      title: [''],
      describe: [''],
      date: [''],
      type: [''],
      depositAmount: [''],
      giftPercent: [''],  // 百分比
      giftAmount: [''], // 固定值
    });
  }

  // 新增内容 - 弹框
  showModal(data, flag) {
    if (flag === 'addBean') {
      this.beanItem = { // 重置数据
        'activeStatus': '', 'beginTime': '', 'depositAmount': '', 'describe': '', 'endTime': '',
         'giftPercent': 0, 'id': '', 'presentType': '', 'title': '', 'type': '', giftAmount: ''
      };
      this.beginDate = '';  // 重置日期
      this.endDate = '';
      this.radioValue = 'PERCENT_GIFT'; // 重置单选
      this.isAddBeanVisible = true;
    } else if (flag === 'modifyBean') {
      this.beanItem = data;
      this.beginDate = data.beginTime;  // 重置日期
      this.endDate = data.endTime;
      this.radioValue = data.type; // 重置单选
      this.beanItem.id = data.id;
      this.isModifyBeanVisible = true;
    } else if (flag === 'searchBean') {
      this.isSearchBeanVisible = true;
      this.beanItem = data;
      this.radioValue = data.type;
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

  // 封装验证新增
  verification(flag): boolean {
    let result = true;
    // if (flag === 'activity') {
    //   if (this.radioValue === 'LoginOneOff' || this.radioValue === 'LoginDaily') {
    //     if (this.addBeanForm.controls['totalQuantity'].value === '') {
    //       this.modalService.error({ nzTitle: '提示', nzContent: '奖励发放上限未填写' });
    //       result = false;
    //     } else if (this.addBeanForm.controls['perUserQuantity'].value === '') {
    //       this.modalService.error({ nzTitle: '提示', nzContent: '每个用户可领未填写' });
    //       result = false;
    //     } else if (this.addMarginArr[0].actGiftNo === '') {
    //       this.modalService.error({ nzTitle: '提示', nzContent: '下拉的活动奖励配置未选择' });
    //       result = false;
    //     }
    //   }
    // }
    return result;
  }

  // 新增操作
  doSave(flag) {
    if (flag === 'addBean') { // 保存操作
      if (!this.verification('activity')) { return; }
      let beanInput = {};
      if (this.radioValue === 'PERCENT_GIFT') {
        beanInput = {
          'title': this.addBeanForm.controls['title'].value,
          'describe': this.addBeanForm.controls['describe'].value,
          'type': this.radioValue,
          'depositAmount': this.addBeanForm.controls['depositAmount'].value,
          'giftPercent': (this.addBeanForm.controls['giftPercent'].value) / 100,  // 得到分数
          'beginTime': this.beginDate,
          'endTime': this.endDate,
        };
      } else if (this.radioValue === 'FIXED_QUOTA_GIFT') {
        beanInput = {
          'title': this.addBeanForm.controls['title'].value,
          'describe': this.addBeanForm.controls['describe'].value,
          'type': this.radioValue,
          'depositAmount': this.addBeanForm.controls['depositAmount'].value,
          'giftAmount': this.addBeanForm.controls['giftAmount'].value,
          'beginTime': this.beginDate,
          'endTime': this.endDate,
        };
      }
      this.xiaowubeanService.addXiaowubean(beanInput, this.radioValue).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } });
          this.isAddBeanVisible = false;
          this.loadData('activity');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'modifyBean') { // 保存操作
      if (!this.verification('activity')) { return; }
      let beanInput = {};
      if (this.radioValue === 'PERCENT_GIFT') {
        beanInput = {
          'id': this.beanItem.id,
          'title': this.modifyBeanForm.controls['title'].value,
          'describe': this.modifyBeanForm.controls['describe'].value,
          'type': this.radioValue,
          'depositAmount': this.modifyBeanForm.controls['depositAmount'].value,
          'giftPercent': (this.modifyBeanForm.controls['giftPercent'].value) / 100,  // 得到分数
          'beginTime': this.beginDate,
          'endTime': this.endDate,
        };
      } else if (this.radioValue === 'FIXED_QUOTA_GIFT') {
        beanInput = {
          'id': this.beanItem.id,
          'title': this.modifyBeanForm.controls['title'].value,
          'describe': this.modifyBeanForm.controls['describe'].value,
          'type': this.radioValue,
          'depositAmount': this.modifyBeanForm.controls['depositAmount'].value,
          'giftAmount': this.modifyBeanForm.controls['giftAmount'].value,
          'beginTime': this.beginDate,
          'endTime': this.endDate,
        };
      }
      this.xiaowubeanService.updateXiaowubean(beanInput, this.radioValue).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } });
          this.isAddBeanVisible = false;
          this.loadData('activity');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
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
        this.beginDate = this.datePipe.transform(result[0], 'yyyy-MM-dd hh:mm:ss');
        this.endDate = this.datePipe.transform(result[1], 'yyyy-MM-dd hh:mm:ss');
      }
    }
  }

  // 封装时间格式转换
  compareDate(s1, s2) {
    return ((new Date(s1.toString().replace(/-/g, '\/'))) < (new Date(s2.toString().replace(/-/g, '\/'))));
  }

}
