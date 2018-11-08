import { Component, OnInit } from '@angular/core';
import { registerLocaleData, DatePipe } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormBuilder } from '@angular/forms';
import { CommonService } from '../public/service/common.service';
import { NzModalService } from 'ng-zorro-antd';
import { LocalizationService } from '../public/service/localization.service';
registerLocaleData(zh);

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  data = [];
  displayData = [];
  allChecked = false;
  indeterminate = false;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private modalService: NzModalService,
    private localizationService: LocalizationService,
  ) {
  }

  ngOnInit() {
    this.loadData();
  }

  private loadData(): void {
    this.data = [{
      username: '齐小悟',
      isBlackList: '是',
      systemStatus: '未激活',
      msgTime: '3',
      firstRegisterDate: '2018-11-08 10:15',
      lastLoginDate: '2018-11-08 10:15',
      mobileNumber: '18888888888',
      sex: '男',
      CName: '齐小悟',
      laseName: '齐',
      name: '小悟',
      iDType: '身份证',
      iDNumber: '440508111111111111',
      birthday: '2018-11-08 10:15',
      contactsPhone: '18888888888',
      ageType: '当妈'
    }];
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
