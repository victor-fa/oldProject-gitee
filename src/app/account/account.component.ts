import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { ModifyBookingInput, SearchBookingInput } from '../public/model/booking.model';
import { BookingService } from '../public/service/booking.service';
import { CommonService } from '../public/service/common.service';
import { Router } from '@angular/router';
import { AccountService } from '../public/service/account.service';
import { Md5 } from 'ts-md5';
registerLocaleData(zh);

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  dataRole = [{id: '', name: '' }];  // 权限
  dataCustomer = [{roleIds: [], roleName: ''}];  // 员工
  displayData = [];
  allChecked = false;
  indeterminate = false;
  modifyItem = new ModifyBookingInput();
  total = 0;
  allSize = 0;
  changePage = 1;
  pageSize = 10;
  currentPanel = 'role';

  allRoleChecked = false;
  indeterminateRole = false;
  isAddCustomerVisible = false;

  frameworkOption: any;
  isAddRoleVisible = false; // 新增角色
  isModifyRoleVisible = false;  // 修改角色
  isModifyCustomerVisible = false; // 修改用户信息
  roleAddForm: FormGroup;
  roleModifyForm: FormGroup;
  searchCustomerForm: FormGroup;
  customerAddForm: FormGroup;
  customerModifyForm: FormGroup;
  rolesItem = { name: '', desc: '' };
  customerItem = { realname: '', password: '', roleIds: [], username: '' };
  customerId = '';  // 用于修改员工
  roleId = '';  // 用于修改角色
  addPermission = [];
  checkOptionsChannel = [
    { label: '你好小悟', value: 'XIAOWU', checked: false },
    { label: '听听同学', value: 'LENZE', checked: false }
  ];
  /* 规则配置 */
  allCheckedOne = false; // 个人中心
  indeterminateOne = false;
  checkOptionsOne = [
    { label: '版本强制更新', value: '版本强制更新', checked: false },
    { label: '协议管理', value: '协议管理', checked: false },
    { label: '分享管理', value: '分享管理', checked: false },
    { label: '帮助管理', value: '帮助管理', checked: false },
    { label: '新手引导', value: '新手引导', checked: false },
    { label: '定价管理', value: '定价管理', checked: false },
    { label: '客服QQ', value: '客服QQ', checked: false }
  ];
  allCheckedTwo = false;
  indeterminateTwo = false;
  checkOptionsTwo = [
    { label: '用户反馈', value: '用户反馈', checked: false },
    { label: '点踩对话日志', value: '点踩对话日志', checked: false },
    { label: '点赞对话日志', value: '点赞对话日志', checked: false },
    { label: '开票时间管理', value: '开票时间管理', checked: false }
  ];
  allCheckedThree = false;
  indeterminateThree = false;
  checkOptionsThree = [
    { label: '用户管理', value: '用户管理', checked: false },
    { label: '数据调整', value: '数据调整', checked: false },
    { label: '订单查询', value: '订单查询', checked: false }
  ];
  allCheckedFour = false;
  indeterminateFour = false;
  checkOptionsFour = [
    { label: '内容发布', value: '内容发布', checked: false },
    { label: '开屏启动', value: '开屏启动', checked: false },
    { label: '首页弹框', value: '首页弹框', checked: false }
  ];
  allCheckedFive = false;
  indeterminateFive = false;
  checkOptionsFive = [
    { label: '优惠券配置', value: '优惠券配置', checked: false },
    { label: '活动管理', value: '活动管理', checked: false },
    { label: '充值送豆', value: '充值送豆', checked: false },
    { label: '消费返豆', value: '消费返豆', checked: false },
    { label: '批量发放', value: '批量发放', checked: false },
    { label: '邀请好友', value: '邀请好友', checked: false },
    { label: '新手任务', value: '新手任务', checked: false }
  ];
  allCheckedSix = false;
  indeterminateSix = false;
  checkOptionsSix = [
    { label: '打车监控', value: '打车监控', checked: false },
    { label: '对话log分析', value: '对话log分析', checked: false },
    { label: '生产白名单', value: '生产白名单', checked: false }
  ];
  allCheckedSeven = false;
  indeterminateSeven = false;
  checkOptionsSeven = [
    { label: '员工列表', value: '员工列表', checked: false },
    { label: '角色列表', value: '角色列表', checked: false }
  ];
  allCheckedEight = false;
  indeterminateEight = false;
  checkOptionsEight = [
    { label: 'APP', value: 'APP', checked: false },
    { label: '留存', value: '留存', checked: false },
    { label: 'BOT总览', value: 'BOT总览', checked: false },
    { label: '产品', value: '产品', checked: false },
    { label: '异常表述', value: '异常表述', checked: false },
    { label: '机票BOT', value: '机票BOT', checked: false },
    { label: '酒店BOT', value: '酒店BOT', checked: false },
    { label: '天气BOT', value: '天气BOT', checked: false },
    { label: '导航BOT', value: '导航BOT', checked: false },
    { label: '打车BOT', value: '打车BOT', checked: false },
    { label: '音乐BOT', value: '音乐BOT', checked: false },
    { label: '火车BOT', value: '火车BOT', checked: false }
  ];
  /* 规则配置 */

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private datePipe: DatePipe,
    private modalService: NzModalService,
    private notification: NzNotificationService,
    private _router: Router,
    private accountService: AccountService,
  ) {
    this.commonService.nav[7].active = true;
    this._initAddRoleForm();
    this._initAddCustomerForm();
    this._initCustomerSearchForm();
    this._initCustomerModifyForm();
    this._initRoleModifyForm();
  }

  ngOnInit() {
    this.loadData('role');  // 权限
    this.commonService.havePermission();  // 获取权限
  }

  loadData(flag) {
    if (flag === 'role') {
      this.accountService.getRolesList().subscribe(res => {
        this.dataRole = JSON.parse(res.payload);
        console.log(this.dataRole);
      });
    } else if (flag === 'customer') {
      const customerItem = {
        realname: this.searchCustomerForm.controls['realname'].value,
        username: this.searchCustomerForm.controls['username'].value,
        roleIds: this.searchCustomerForm.controls['roleIds'].value
      };
      this.accountService.getCustomerList(customerItem).subscribe(res => {
        this.dataCustomer = JSON.parse(res.payload);
        this.dataCustomer.forEach(item => {
          const roleName = [];
          if (item.roleIds.length > 0) {
            item.roleIds.forEach(info => {
              this.dataRole.forEach(cell => {
                // tslint:disable-next-line:no-unused-expression
                info === cell.id ? roleName.push(cell.name) : 1;
              });
            });
          }
          item.roleName = roleName.length > 0 ? roleName.join(', ') : 'null';
        });
        console.log(this.dataCustomer);
      });
    }
  }

  private _initCustomerSearchForm(): void {
    this.searchCustomerForm = this.fb.group({
      realname: [''],
      username: [''],
      roleIds: [''],
    });
  }

  private _initCustomerModifyForm(): void {
    this.customerModifyForm = this.fb.group({
      realname: [''],
      password: [''],
      roleIds: [''],
      username: [''],
    });
  }

  private _initAddCustomerForm(): void {
    this.customerAddForm = this.fb.group({
      realname: [''],
      password: [''],
      roleIds: [''],
      username: [''],
    });
  }

  private _initAddRoleForm(): void {
    this.roleAddForm = this.fb.group({ name: [''], desc: [''] });
  }

  private _initRoleModifyForm(): void {
    this.roleModifyForm = this.fb.group({ name: [''], desc: [''] });
  }

  // 所有弹框
  showModal(flag, data): void {
    if (flag === 'addRole') {
      this.allCheckFalse(); // 清除所有所选状态
      this.isAddRoleVisible = true;
      this.rolesItem.name = '';
      this.rolesItem.desc = '';
      this.addPermission.splice(0, this.addPermission.length );
    } else if (flag === 'modifyRole') {
      console.log(data);
      this.allCheckFalse(); // 清除所有所选状态
      this.roleId = data.id;
      this.isModifyRoleVisible = true;
      this.rolesItem.name = data.name;
      this.rolesItem.desc = data.desc;
      data.platforms.forEach(item => {  // 针对渠道进行遍历
        if (item === 'XIAOWU') {
          this.checkOptionsChannel[0].checked = true;
        } else if (item === 'LENZE') {
          this.checkOptionsChannel[1].checked = true;
        }
      });
      // data.permissions.forEach(item => {
      //   if (item === '个人资料') {
      //     this.checkOptionsOne[0].checked = true;
      //   } else if (item === '重置密码') {
      //     this.checkOptionsOne[1].checked = true;
      //   } else if (item === '首页监控') {
      //     this.checkOptionsTwo = true;
      //   } else if (item === '号码管理') {
      //     this.checkOptionsThree = true;
      //   } else if (item === '模板管理') {
      //     this.checkOptionsFour = true;
      //   } else if (item === '外呼任务') {
      //     this.checkOptionsFive[0].checked = true;
      //   } else if (item === '任务审核') {
      //     this.checkOptionsFive[1].checked = true;
      //   } else if (item === '员工列表') {
      //     this.checkOptionsSix[0].checked = true;
      //   } else if (item === '角色列表') {
      //     this.checkOptionsSix[1].checked = true;
      //   } else if (item === '会话记录') {
      //     this.checkOptionsSeven = true;
      //   }
      // });
      // 根据多选定制
      // this.checkOptionsOne[0].checked && this.checkOptionsOne[1].checked ?
      //     this.indeterminateOne = true : this.indeterminateOne = false ;
      // this.checkOptionsFive[0].checked && this.checkOptionsFive[1].checked ?
      //     this.indeterminateFive = true : this.indeterminateFive = false ;
      // this.checkOptionsSix[0].checked && this.checkOptionsSix[1].checked ?
      //     this.indeterminateSix = true : this.indeterminateSix = false ;
    } else if (flag === 'deleteRole') {
      this.modalService.confirm({
        nzTitle: '权限配置删除', nzContent: '确认要删除该权限配置吗？', nzCancelText: '取消',
        nzOnCancel: () => 1, nzOkText: '确定', nzOnOk: () => { this.doDelete(data, flag); }
      });
    } else if (flag === 'addCustomer') {
      this.isAddCustomerVisible = true;
      this.customerItem = { realname: '', password: '', roleIds: [], username: '' };
    } else if (flag === 'modifyCustomer') {
      this.customerId = data.id;
      this.isModifyCustomerVisible = true;
      this.customerItem.username = data.username;
      this.customerItem.password = data.password;
      this.customerItem.realname = data.realname;
      this.customerItem.roleIds = data.roleIds;
    } else if (flag === 'deleteCustomer') {
      this.modalService.confirm({
        nzTitle: '员工配置删除', nzContent: '确认要删除该员工配置吗？', nzCancelText: '取消',
        nzOnCancel: () => 1, nzOkText: '确定', nzOnOk: () => { this.doDelete(data, flag); }
      });
    }
  }

  hideModal(flag): void {
    if (flag === 'addRole') {
      this.isAddRoleVisible = false;
    } else if (flag === 'modifyRole') {
      this.isModifyRoleVisible = false;
    } else if (flag === 'addCustomer') {
      this.isAddCustomerVisible = false;
    } else if (flag === 'modifyCustomer') {
      this.isModifyCustomerVisible = false;
    }
  }

  doSave(flag) {
    if (flag === 'addRole') {
      const channelArr = [];
      this.checkOptionsChannel.forEach(item => {
        // tslint:disable-next-line:no-unused-expression
        item.checked === true ? channelArr.push(item.value) : 1;
      });
      const resIdsArr = [];
      const rolesItem = {
        name: this.roleAddForm.controls['name'].value,
        desc: this.roleAddForm.controls['desc'].value,
        platforms: channelArr,
        resIds: resIdsArr
      };
      this.accountService.addRoles(rolesItem).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          this.loadData('role');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
      this.hideModal('addRole');
    } else if (flag === 'modifyRole') {
      const channelArr = [];
      this.checkOptionsChannel.forEach(item => {
        // tslint:disable-next-line:no-unused-expression
        item.checked === true ? channelArr.push(item.value) : 1;
      });
      const resIdsArr = [];
      const rolesModifyItem = {
        id: this.roleId,
        name: this.roleModifyForm.controls['name'].value,
        desc: this.roleModifyForm.controls['desc'].value,
        platforms: channelArr,
        resIds: resIdsArr
      };
      this.accountService.modifyRole(rolesModifyItem).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          this.loadData('role');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
      this.hideModal('modifyRole');
    } else if (flag === 'addCustomer') {  // 添加员工
      const roleIds = [];
      roleIds[0] = this.customerAddForm.controls['roleIds'].value;
      console.log(roleIds);
      const customerItem = {
        realname: this.customerAddForm.controls['realname'].value,
        password: this.customerAddForm.controls['password'].value,
        roleIds: roleIds,
        username: this.customerAddForm.controls['username'].value,
      };
      console.log(customerItem);
      this.accountService.addCustomer(customerItem).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          this.loadData('customer');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
      this.hideModal('addCustomer');
    } else if (flag === 'modifyCustomer') { // 修改员工
      // if (this.customerModifyForm.controls['realname'].value === ''
      //   || this.customerModifyForm.controls['password'].value === ''
      //   || this.customerModifyForm.controls['username'].value === '') {
      //   this.modalService.error({ nzTitle: '提示', nzContent: '请填写必填信息' });
      //   return;
      // }
      const roleIds = [];
      roleIds[0] = this.customerModifyForm.controls['roleIds'].value;
      console.log(roleIds);
      const customerItem = {
        id: this.customerId,
        realname: this.customerModifyForm.controls['realname'].value,
        password: this.customerModifyForm.controls['password'].value,
        roleIds: roleIds,
        username: this.customerModifyForm.controls['username'].value,
      };
      console.log(customerItem);
      this.accountService.modifyCustomer(customerItem).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          this.loadData('customer');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
      this.hideModal('modifyCustomer');
    }
  }

  // 获取所有的多选
  private getPermission(): any {
    // this.checkOptionsOne[0].checked ? this.addPermission.push('个人资料') : 1;
    // this.checkOptionsOne[1].checked ? this.addPermission.push('重置密码') : 1;
    // this.checkOptionsTwo ? this.addPermission.push('首页监控') : 1 ;
    // this.checkOptionsThree ? this.addPermission.push('号码管理') : 1;
    // this.checkOptionsFour ? this.addPermission.push('模板管理') : 1;
    // this.checkOptionsFive[0].checked ? this.addPermission.push('外呼任务') : 1;
    // this.checkOptionsFive[1].checked ? this.addPermission.push('任务审核') : 1;
    // this.checkOptionsSix[0].checked ? this.addPermission.push('员工列表') : 1;
    // this.checkOptionsSix[1].checked ? this.addPermission.push('角色列表') : 1;
    // this.checkOptionsFour ? this.addPermission.push('会话记录') : 1;
    return this.addPermission;
  }

  /* 权限配置 */
  // 更新所有的多选
  updateAllChecked(flag): void {
    if (flag === 'one') {
      this.indeterminateOne = false;
      // tslint:disable-next-line:max-line-length
      this.allCheckedOne ? this.checkOptionsOne.forEach(item => item.checked = true) : this.checkOptionsOne.forEach(item => item.checked = false);
    } else if (flag === 'two') {
      this.indeterminateTwo = false;
      // tslint:disable-next-line:max-line-length
      this.allCheckedTwo ? this.checkOptionsTwo.forEach(item => item.checked = true) : this.checkOptionsTwo.forEach(item => item.checked = false);
    } else if (flag === 'three') {
      this.indeterminateThree = false;
      // tslint:disable-next-line:max-line-length
      this.allCheckedThree ? this.checkOptionsThree.forEach(item => item.checked = true) : this.checkOptionsThree.forEach(item => item.checked = false);
    } else if (flag === 'four') {
      this.indeterminateFour = false;
      // tslint:disable-next-line:max-line-length
      this.allCheckedFour ? this.checkOptionsFour.forEach(item => item.checked = true) : this.checkOptionsFour.forEach(item => item.checked = false);
    } else if (flag === 'five') {
      this.indeterminateFive = false;
      // tslint:disable-next-line:max-line-length
      this.allCheckedFive ? this.checkOptionsFive.forEach(item => item.checked = true) : this.checkOptionsFive.forEach(item => item.checked = false);
    } else if (flag === 'six') {
      this.indeterminateSix = false;
      // tslint:disable-next-line:max-line-length
      this.allCheckedSix ? this.checkOptionsSix.forEach(item => item.checked = true) : this.checkOptionsSix.forEach(item => item.checked = false);
    } else if (flag === 'seven') {
      this.indeterminateSeven = false;
      // tslint:disable-next-line:max-line-length
      this.allCheckedSeven ? this.checkOptionsSeven.forEach(item => item.checked = true) : this.checkOptionsSeven.forEach(item => item.checked = false);
    } else if (flag === 'eight') {
      this.indeterminateEight = false;
      // tslint:disable-next-line:max-line-length
      this.allCheckedEight ? this.checkOptionsEight.forEach(item => item.checked = true) : this.checkOptionsEight.forEach(item => item.checked = false);
    }
  }

  // 去除所有的多选
  private allCheckFalse(): void {
    this.allCheckedOne = false; // 个人中心
    this.indeterminateOne = false;
    this.checkOptionsOne = [
      { label: '版本强制更新', value: '版本强制更新', checked: false },
      { label: '协议管理', value: '协议管理', checked: false },
      { label: '分享管理', value: '分享管理', checked: false },
      { label: '帮助管理', value: '帮助管理', checked: false },
      { label: '新手引导', value: '新手引导', checked: false },
      { label: '定价管理', value: '定价管理', checked: false },
      { label: '客服QQ', value: '客服QQ', checked: false }
    ];
    this.allCheckedTwo = false;
    this.indeterminateTwo = false;
    this.checkOptionsTwo = [
      { label: '用户反馈', value: '用户反馈', checked: false },
      { label: '点踩对话日志', value: '点踩对话日志', checked: false },
      { label: '点赞对话日志', value: '点赞对话日志', checked: false },
      { label: '开票时间管理', value: '开票时间管理', checked: false }
    ];
    this.allCheckedThree = false;
    this.indeterminateThree = false;
    this.checkOptionsThree = [
      { label: '用户管理', value: '用户管理', checked: false },
      { label: '数据调整', value: '数据调整', checked: false },
      { label: '订单查询', value: '订单查询', checked: false }
    ];
    this.allCheckedFive = false;
    this.indeterminateFive = false;
    this.checkOptionsFour = [
      { label: '内容发布', value: '内容发布', checked: false },
      { label: '开屏启动', value: '开屏启动', checked: false },
      { label: '首页弹框', value: '首页弹框', checked: false }
    ];
    this.allCheckedFour = false;
    this.indeterminateFour = false;
    this.checkOptionsFive = [
      { label: '优惠券配置', value: '优惠券配置', checked: false },
      { label: '活动管理', value: '活动管理', checked: false },
      { label: '充值送豆', value: '充值送豆', checked: false },
      { label: '消费返豆', value: '消费返豆', checked: false },
      { label: '批量发放', value: '批量发放', checked: false },
      { label: '邀请好友', value: '邀请好友', checked: false },
      { label: '新手任务', value: '新手任务', checked: false }
    ];
    this.allCheckedSix = false;
    this.indeterminateSix = false;
    this.checkOptionsSix = [
      { label: '打车监控', value: '打车监控', checked: false },
      { label: '对话log分析', value: '对话log分析', checked: false },
      { label: '生产白名单', value: '生产白名单', checked: false }
    ];
    this.allCheckedSix = false;
    this.indeterminateSix = false;
    this.checkOptionsSix = [
      { label: '打车监控', value: '打车监控', checked: false },
      { label: '对话log分析', value: '对话log分析', checked: false },
      { label: '生产白名单', value: '生产白名单', checked: false }
    ];
    this.allCheckedSeven = false;
    this.indeterminateSeven = false;
    this.checkOptionsSeven = [
      { label: '员工列表', value: '员工列表', checked: false },
      { label: '角色列表', value: '角色列表', checked: false }
    ];
    this.allCheckedEight = false;
    this.indeterminateEight = false;
    this.checkOptionsEight = [
      { label: 'APP', value: 'APP', checked: false },
      { label: '留存', value: '留存', checked: false },
      { label: 'BOT总览', value: 'BOT总览', checked: false },
      { label: '产品', value: '产品', checked: false },
      { label: '异常表述', value: '异常表述', checked: false },
      { label: '机票BOT', value: '机票BOT', checked: false },
      { label: '酒店BOT', value: '酒店BOT', checked: false },
      { label: '天气BOT', value: '天气BOT', checked: false },
      { label: '导航BOT', value: '导航BOT', checked: false },
      { label: '打车BOT', value: '打车BOT', checked: false },
      { label: '音乐BOT', value: '音乐BOT', checked: false },
      { label: '火车BOT', value: '火车BOT', checked: false }
    ];

    this.checkOptionsChannel = [
      { label: '你好小悟', value: 'XIAOWU', checked: false },
      { label: '听听同学', value: 'LENZE', checked: false }
    ];
  }
  /* 权限配置 */

  // 删除操作
  doDelete(data, flag) {
    if (flag === 'deleteRole') {
      this.accountService.deleteRole(data).subscribe(res => {  // 删除角色
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          this.loadData('role');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'deleteCustomer') {
      this.accountService.deleteCustomer(data).subscribe(res => {  // 删除用户
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          this.loadData('customer');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  // 切换面板
  changePanel(flag): void {
    // tslint:disable-next-line:no-unused-expression
    flag !== this.currentPanel ? this.loadData(flag) : 1;
    this.currentPanel = flag;
  }

}
