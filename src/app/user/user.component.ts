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
  indeterminate = false;
  phoneNum = '';
  searchForm: FormGroup;  // 查询表单
  searchItem = new UserSearchInput();
  sendMsgForm: FormGroup;  // 发送短信表单
  sendMsgItem = new SendMsgInput();
  infoId = '';
  sendScreenHeight = '';
  lastId = 0;
  nextId = 0;
  total = 0;
  allSize = 0;
  changePage = 1;
  doLast = false;
  doNext = false;
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
    this.sendScreenHeight = (window.screen.height - 524) + 'px';
  }

  /**
   * 查询全部
   */
  private loadData(): void {
    let lastId = 0;
    if (this.doLast) {
      lastId = this.lastId;
    }
    if (this.doNext) {
      lastId = this.nextId;
    }
    this.userService.getUserInfoList(this.lastId).subscribe(res => {
      if (res.status === 200) {
        this.data = JSON.parse(res.payload).users;
        this.total = JSON.parse(res.payload).total;
        this.allSize = JSON.parse(res.payload).allSize;
        this.nextId = this.data[0].userId;  // 最前面的userId
        this.lastId = this.data[this.data.length - 1].userId;  // 最前面的userId
        this.data.forEach(item => {
          item.locked === false ? item.locked = '正常' : item.locked = '已拉黑';
        });
      }
    });
    this.doLast = false;
    this.doNext = false;
  }

  /**
   * 上一页
   */
  lastPage(): void {
    this.changePage -= 1;
    this.doSearch();
    this.doLast = true;
  }

  /**
   * 下一页
   */
  nextPage(): void {
    this.changePage += 1;
    this.doSearch();
    this.doNext = true;
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

  doSearch() {
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
    const phoneNum = this.sendMsgForm.controls['phoneNum'].value;
    if (phoneNum === '') {
      this.modalService.error({
        nzTitle: '提示',
        nzContent: '请填写手机号'
      });
      return;
    }
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: '确定发送验证码给该手机号：' + phoneNum + '的用户吗？',
      nzOkText: '确定',
      nzOnOk: () => this.doSendMsg()
    });
  }

  /* 发送短息 */
  doSendMsg(): void {
    const Base64 = require('js-base64').Base64;
    const phoneNum = 'Basic ' + Base64.encode(this.sendMsgForm.controls['phoneNum'].value);
    this.userService.sendMsg(phoneNum).subscribe(res => {
      if (res.retcode === 0) {
        this.modalService.success({
          nzTitle: '获取成功',
          nzContent: '验证码为： ' + res.message,
          nzOkText: '知道了',
        });
      } else {
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
}
