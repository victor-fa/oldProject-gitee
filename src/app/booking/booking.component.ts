import { Component, OnInit } from '@angular/core';
import { registerLocaleData, DatePipe } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormBuilder } from '@angular/forms';
import { CommonService } from '../public/service/common.service';
import { NzModalService } from 'ng-zorro-antd';
import { LocalizationService } from '../public/service/localization.service';
registerLocaleData(zh);

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  data = [];
  displayData = [];
  allChecked = false;
  indeterminate = false;
  isUserInfoVisible = false;
  isModifyVisible = false;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private modalService: NzModalService,
    private localizationService: LocalizationService,
  ) {
    this.commonService.nav[0].active = true;
  }

  ngOnInit() {
    this.loadData();
  }

  /* 加载信息 */
  private loadData(): void {
    this.data = [{
      status: '未支付',
      type: '类型1',
      date: '2018-11-08 10:15',
      orderNum: '020202020110101',
      housekeeperNum: '020202020110101',
      username: '齐小悟',
      remarks: '备注'
    }];
  }

  /* 展示用户信息 */
  showUserInfo(): void {
    this.isUserInfoVisible = true;
  }

  hideUserInfo(): void {
    this.isUserInfoVisible = false;
  }

  /* 展示修改弹框 */
  showModifyModal(data): void {
    this.isModifyVisible = true;
  }

  hideModifyModal(): void {
    this.isModifyVisible = false;
  }

  // 主面板分页表单
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

}
