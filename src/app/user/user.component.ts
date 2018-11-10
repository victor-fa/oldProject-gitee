import { Component, OnInit } from '@angular/core';
import { registerLocaleData, DatePipe } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from '../public/service/common.service';
import { NzModalService } from 'ng-zorro-antd';
import { LocalizationService } from '../public/service/localization.service';
import { UserService } from '../public/service/user.service';
import { IUserInfoItemOutput, UserSearchInput, SendMsgInput } from '../public/model/user.model';
registerLocaleData(zh);

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  data: IUserInfoItemOutput[];
  displayData = [];
  allChecked = false;
  indeterminate = false;
  phoneNum = '';
  searchForm: FormGroup;  // 查询表单
  searchItem = new UserSearchInput();
  sendMsgForm: FormGroup;  // 发送短信表单
  sendMsgItem = new SendMsgInput();
  infoId = '';
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private modalService: NzModalService,
    private localizationService: LocalizationService,
    private userService: UserService,
  ) {
    this.commonService.nav[1].active = true;
    this._initSearchForm();
    this._initSendMsgForm();
  }

  ngOnInit() {
    this.loadData();
  }

  /**
   * 查询全部
   */
  private loadData(): void {
    this.userService.getUserInfoList(0).subscribe(res => {
      if (res.status === 200) {
        this.data = JSON.parse(res.payload).users;
        this.data.forEach(item => {
          item.locked === false ? item.locked = '正常' : item.locked = '已拉黑';
        });
      }
    });
  }

  /**
   * 单条件查询单条
   * @param type
   * @param userName
   */
  private loadDataByUserName(type, userName): void {
    this.userService.getUserInfoListByType(type, userName).subscribe(res => {
      if (res.retcode === 0) {
        if (res.payload !== '') {
          this.data = [];
          this.data[0] = JSON.parse(res.payload);
          this.data[0].locked === false ? this.data[0].locked = '正常' : this.data[0].locked = '已拉黑';
        }
      } else {
        this.modalService.confirm({
          nzTitle: '提示',
          nzContent: res.message
        });
      }
    });
  }

  doSearch(e) {
    e.preventDefault();
    this.searchItem.userName = this.searchForm.controls['userName'].value;
    this.searchItem.phoneNum = this.searchForm.controls['phoneNum'].value;
    if (this.searchItem.userName === '' && this.searchItem.phoneNum === '') {
      this.loadData();
    } else if (this.searchItem.userName !== '' && this.searchItem.phoneNum === '') {
      this.loadDataByUserName('infoId', this.searchItem.userName);
    } else if (this.searchItem.userName === '' && this.searchItem.phoneNum !== '') {
      this.loadDataByUserName('phone', this.searchItem.phoneNum);
    } else {
      this.modalService.confirm({
        nzTitle: '提示',
        nzContent: '查询条件只能选一个查询'
      });
    }
  }

  private _initSearchForm(): void {
    this.searchForm = this.fb.group({
      userName: [''],
      phoneNum: [''],
    });
  }

  /* 展示拉入黑名单 */
  showBlacklistModal(data): void {
    this.infoId = data.userId;
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: '确定将该用户拉入黑名单吗？',
      nzOkText: '确定',
      nzOnOk: () => this.doBlacklist()
    });
  }

  /* 设为拉黑状态 */
  doBlacklist(): void {
    this.userService.updateUserInfo(this.infoId).subscribe(res => {
      if (res.status === 200) {
        setTimeout(() => {
          this.loadData();
        }, 1000);
      }
    });
  }

  /* 显示发送提示 */
  showSendMsgModal(): void {
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: '确定发送验证码给该用户吗？',
      nzOkText: '确定',
      nzOnOk: () => this.doSendMsg()
    });
  }

  /* 发送短息 */
  doSendMsg(): void {
    const Base64 = require('js-base64').Base64;
    const phoneNum = 'Basic ' + Base64.encode(this.sendMsgForm.controls['phoneNum'].value);
    console.log(phoneNum);
    this.userService.sendMsg(phoneNum).subscribe(res => {
      if (res.retcode === 10000) {
        this.modalService.error({
          nzTitle: '提示',
          nzContent: res.message
        });
      }
    });
  }

  private _initSendMsgForm(): void {
    this.sendMsgForm = this.fb.group({
      phoneNum: [''],
    });
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
