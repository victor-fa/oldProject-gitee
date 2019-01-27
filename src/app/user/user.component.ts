import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { IUserInfoItemOutput, SendMsgInput, UserSearchInput } from '../public/model/user.model';
import { CommonService } from '../public/service/common.service';
import { UserService } from '../public/service/user.service';
import { Router } from '@angular/router';
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
  firstId = 0;
  total = 0;
  allSize = 0;
  changePage = 1;
  doLast = false;
  doFirst = false;
  pageSize = 10;
  feedBackPageSize = 1000;
  feedbackInfo = [];
  isFeedBackVisible = false;
  tempFeedBack = {
    'words': '',
    'photo': '',
    'number': ''
  };
  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private modalService: NzModalService,
    private userService: UserService,
    private notification: NzNotificationService,
    private _router: Router,
  ) {
    this.commonService.nav[1].active = true;
    this._initSearchForm();
    this._initSendMsgForm();
  }

  ngOnInit() {
    this.loadData();  // 默认信息
    this.loadFeedbackInfo();  // 反馈信息
    this.sendScreenHeight = (window.screen.height - 524) + 'px';
  }

  /**
   * 查询全部
   */
  private loadData(): void {
    let id = 0;
    let flag = '';
    if (this.doLast) {
      id = this.lastId;
      flag = 'last';
    }
    if (this.doFirst) {
      id = this.firstId;
      flag = 'first';
    }
    this.userService.getUserInfoList(this.pageSize, flag, id).subscribe(res => {
      if (res.payload !== '') {
        if (res.status === 200) {
          this.data = JSON.parse(res.payload).users;
          this.total = JSON.parse(res.payload).total;
          this.allSize = JSON.parse(res.payload).allSize;
          this.firstId = JSON.parse(res.payload).users[0].userId;  // 最前面的userId
          this.lastId = JSON.parse(res.payload).users[JSON.parse(res.payload).users.length - 1].userId;  // 最后面的userId
          this.data.forEach(item => {
            item.locked === false ? item.locked = '正常' : item.locked = '已拉黑';
          });
        }
      } else if (res.retcode === 10000) {
        this.notification.blank(
          '提示',
          '您还没有登录哦！',
          {
            nzStyle: {
              color : 'red'
            }
          }
        );
        // this._router.navigate(['/login']);
      } else {
        this.modalService.confirm({
          nzTitle: '提示',
          nzContent: res.message
        });
      }
    });
    this.doLast = false;
    this.doFirst = false;
  }

  /**
   * 单条件查询单条
   * @param type
   * @param userName
   */
  private loadDataByUserName(type, userName): void {
    let id = 0;
    let flag = '';
    if (this.doLast) {
      id = this.lastId;
      flag = 'last';
    }
    if (this.doFirst) {
      id = this.firstId;
      flag = 'first';
    }
    this.userService.getUserInfoListByType(this.pageSize, flag, id, type, userName).subscribe(res => {
      if (res.retcode === 0) {
        if (res.payload !== '') {
          this.data = [];
          this.data[0] = JSON.parse(res.payload);
          this.data[0].locked === false ? this.data[0].locked = '正常' : this.data[0].locked = '已拉黑';
        }
      } else if (res.retcode === 10000) {
        this.notification.blank(
          '提示',
          '您还没有登录哦！',
          {
            nzStyle: {
              color : 'red'
            }
          }
        );
        // this._router.navigate(['/login']);
      } else {
        this.modalService.confirm({
          nzTitle: '提示',
          nzContent: res.message
        });
      }
    });
    this.doLast = false;
    this.doFirst = false;
  }

  /**
   * 上一页
   */
  lastPage(): void {
    this.changePage -= 1;
    this.doFirst = true;
    this.doSearch();
  }

  /**
   * 下一页
   */
  nextPage(): void {
    this.changePage += 1;
    this.doLast = true;
    this.doSearch();
  }

  showUserInfo(data): void {
    this.userService.getUserInfo(data.userId).subscribe(res => {
      if (res.retcode === 0) {
        if (res.payload !== '') {
          let forItem = '';
          if (JSON.parse(res.payload).length > 0) {
            for (let i = 0; i < JSON.parse(res.payload).length; i++) {
              forItem += '<br>联系人' +
              (i + 1) + '姓名：' + JSON.parse(res.payload)[i].CName +
              '<br>联系人' + (i + 1) + '证件号：' + JSON.parse(res.payload)[i].IDNumber +
              '<br>联系人' + (i + 1) + '生日年月日：' + JSON.parse(res.payload)[i].birthday +
              '<br>联系人' + (i + 1) + '电话：' + JSON.parse(res.payload)[i].contactPhone +
              '<br>联系人' + (i + 1) + '年龄段：' + this.getAgeType(JSON.parse(res.payload)[i].ageType) +
              '<br>联系人' + (i + 1) + '性别：' + this.getSex(JSON.parse(res.payload)[i].sex) + '<br>';
            }
            this.modalService.info({
              nzTitle: '常用联系人',
              nzContent: forItem
            });
          } else {
            this.modalService.info({
              nzTitle: '提示',
              nzContent: '当前用户无常用联系人'
            });
          }
        }
      } else if (res.retcode === 10000) {
        this.notification.blank(
          '提示',
          '您还没有登录哦！',
          {
            nzStyle: {
              color : 'red'
            }
          }
        );
        // this._router.navigate(['/login']);
      } else {
        this.modalService.info({
          nzTitle: '提示',
          nzContent: res.message
        });
      }
    });
  }

  /**
   * 查询反馈信息
   */
  private loadFeedbackInfo(): void {
    this.userService.getFeedBackInfo().subscribe(res => {
      if (res.payload !== '') {
        if (res.status === 200) {
          this.feedbackInfo = JSON.parse(res.payload);
        }
      } else {
        this.modalService.confirm({
          nzTitle: '提示',
          nzContent: res.message
        });
      }
    });
  }

  // 反馈详情
  showFeedbackInfo(data): void {
    this.isFeedBackVisible = true;
    this.tempFeedBack = data;
    console.log(this.tempFeedBack);
  }

  hideFeedBack(): void {
    this.isFeedBackVisible = false;
  }

  getAgeType(ageType): string {
    return ageType === 0 ? '成人' : ageType === 1 ? '儿童' : ageType === 2 ? '婴儿' : '其他';
  }

  getSex(sex): string {
    return sex === 0 ? '男' : '女' ;
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
      } else if (res.retcode === 10000) {
        this.notification.blank(
          '提示',
          '您还没有登录哦！',
          {
            nzStyle: {
              color : 'red'
            }
          }
        );
        // this._router.navigate(['/login']);
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
      } else if (res.retcode === 10000) {
        this.notification.blank(
          '提示',
          '您还没有登录哦！',
          {
            nzStyle: {
              color : 'red'
            }
          }
        );
        // this._router.navigate(['/login']);
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
