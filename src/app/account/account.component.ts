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

  dataRole = [{}];  // 权限
  dataCustomer = [{}];  // 员工
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
  displayRoleData = [];

  frameworkOption: any;
  isAddRoleVisible = false; // 新增角色
  isModifyRoleVisible = false;  // 修改角色
  isModifyCustomerVisible = false; // 修改用户信息
  roleData = [];
  rolesItem = { name: '' };
  roleAddForm: FormGroup;
  roleModifyForm: FormGroup;
  searchCustomerForm: FormGroup;
  customerAddForm: FormGroup;
  customerModifyForm: FormGroup;
  rolesAddItem = { name: '', description: '', permissions: '' };
  customerAddItem = { userName: '', password: '', nick: '', department: '', roles: [] };
  customerItem = { userName: '', nick: '', role: '', department: '' };
  customerId = '';  // 用于修改员工
  roleId = '';  // 用于修改角色
  customerModifyItem = { userName: '', password: '', nick: '', department: '', roles: '' };
  addPermission = [];
  tempRoles = [];
  tempRoleName = '';
  /* 规则配置 */
  allCheckedOne = false; // 个人中心
  indeterminateOne = false;
  checkOptionsOne = [
    { label: '个人资料', value: '个人资料', checked: false },
    { label: '重置密码', value: '重置密码', checked: false }
  ];
  checkOptionsTwo = false; // 首页监控
  checkOptionsThree = false; // 号码管理
  checkOptionsFour = false; // 模板管理
  allCheckedFive = false; // 外呼任务管理
  indeterminateFive = false;
  checkOptionsFive = [
    { label: '外呼任务', value: '外呼任务', checked: false },
    { label: '任务审核', value: '任务审核', checked: false }
  ];
  allCheckedSix = false; // 账户管理
  indeterminateSix = false;
  checkOptionsSix = [
    { label: '员工列表', value: '员工列表', checked: false },
    { label: '角色列表', value: '角色列表', checked: false }
  ];
  checkOptionsSeven = false; // 会话记录
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
    if (flag === 'customer') {
      const customerItem = {
        userName: this.searchCustomerForm.controls['userName'].value,
        nick: this.searchCustomerForm.controls['nick'].value,
        role: this.searchCustomerForm.controls['role'].value
      };
      this.accountService.getUserList(customerItem).subscribe(res => {
        this.dataRole = res.payload;
        res.payload.forEach(item => {
          item.roleName = this.changeRoleIdToName(item.roles[0]);
        });
      });
    } else if (flag === 'role') {
      this.accountService.getRolesList(this.rolesItem).subscribe(res => {
        this.dataCustomer = res.payload;
        res.payload.forEach(item => {
          this.tempRoles.push(item);
        });
        this.roleData = res.payload;
      });
    }
  }

  // 变role id为role
  changeRoleIdToName(id): string {
    let name = '';
    for (let i = 0; i < this.tempRoles.length; i++) {
      // tslint:disable-next-line:no-unused-expression
      id ===  this.tempRoles[i].id ? name = this.tempRoles[i].name : 1 ;
    }
    return name;
  }

  private _initCustomerSearchForm(): void {
    this.searchCustomerForm = this.fb.group({
      userName: [''],
      nick: [''],
      role: [''],
    });
  }

  private _initCustomerModifyForm(): void {
    this.customerModifyForm = this.fb.group({
      userName: ['', [this.commonService.rightNumValidator]],
      password: ['', [this.commonService.rightPasswordValidator]],
      nick: ['', [this.commonService.userNameValidator1]],
      roles: [''],
    });
  }

  private _initAddCustomerForm(): void {
    this.customerAddForm = this.fb.group({
      userName: ['', [this.commonService.rightNumValidator]],
      password: ['', [this.commonService.rightPasswordValidator]],
      nick: ['', [this.commonService.userNameValidator1]],
      roles: [''],
    });
  }

  private _initAddRoleForm(): void {
    this.roleAddForm = this.fb.group({
      name: ['', [Validators.required], [this.commonService.userNameValidator1]],
      description: ['', [Validators.required]],
    });
  }

  private _initRoleModifyForm(): void {
    this.roleModifyForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      // permissions: ['', [Validators.required]],
    });
  }

  // 所有弹框
  showModal(flag, data): void {
    if (flag === 'addRole') {
      this.allCheckFalse();
      this.isAddRoleVisible = true;
      this.rolesAddItem.name = '';
      this.rolesAddItem.description = '';
      this.addPermission.splice(0, this.addPermission.length );
    } else if (flag === 'modifyRole') {
      this.allCheckFalse();
      this.roleId = data.id;
      this.isModifyRoleVisible = true;
      this.rolesAddItem.name = data.name;
      this.rolesAddItem.description = data.description;
      data.permissions.forEach(item => {
        if (item === '个人资料') {
          this.checkOptionsOne[0].checked = true;
        } else if (item === '重置密码') {
          this.checkOptionsOne[1].checked = true;
        } else if (item === '首页监控') {
          this.checkOptionsTwo = true;
        } else if (item === '号码管理') {
          this.checkOptionsThree = true;
        } else if (item === '模板管理') {
          this.checkOptionsFour = true;
        } else if (item === '外呼任务') {
          this.checkOptionsFive[0].checked = true;
        } else if (item === '任务审核') {
          this.checkOptionsFive[1].checked = true;
        } else if (item === '员工列表') {
          this.checkOptionsSix[0].checked = true;
        } else if (item === '角色列表') {
          this.checkOptionsSix[1].checked = true;
        } else if (item === '会话记录') {
          this.checkOptionsSeven = true;
        }
      });
      // 根据多选定制
      this.checkOptionsOne[0].checked && this.checkOptionsOne[1].checked ?
          this.indeterminateOne = true : this.indeterminateOne = false ;
      this.checkOptionsFive[0].checked && this.checkOptionsFive[1].checked ?
          this.indeterminateFive = true : this.indeterminateFive = false ;
      this.checkOptionsSix[0].checked && this.checkOptionsSix[1].checked ?
          this.indeterminateSix = true : this.indeterminateSix = false ;
    } else if (flag === 'deleteRole') {
      this.modalService.confirm({
        nzTitle: '权限配置删除', nzContent: '确认要删除该权限配置吗？', nzCancelText: '取消',
        nzOnCancel: () => 1, nzOkText: '确定', nzOnOk: () => { this.doDelete(data, flag); }
      });
    } else if (flag === 'addCustomer') {
      this.isAddCustomerVisible = true;
      this.customerAddItem.userName = '';
      this.customerAddItem.password = '';
      this.customerAddItem.nick = '';
      if (this.customerAddItem.roles) {
        this.customerAddItem.roles.splice(0, this.customerAddItem.roles.length);
      }
      this.tempRoleName = '';
    } else if (flag === 'modifyCustomer') {
      this.customerId = data.uid;
      this.isModifyCustomerVisible = true;
      this.customerModifyItem.userName = data.userName;
      this.customerModifyItem.password = data.password;
      this.customerModifyItem.nick = data.nick;
      this.tempRoleName = data.roles[0];
    } else if (flag === 'deleteCustomer') {
      this.modalService.confirm({
        nzTitle: '员工删除', nzContent: '确认要删除该员工吗？', nzCancelText: '取消',
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
      this.rolesAddItem.name = this.roleAddForm.controls['name'].value;
      this.rolesAddItem.description = this.roleAddForm.controls['description'].value;
      this.addPermission.push();
      this.rolesAddItem.permissions = this.getPermission(); // 权限配置
      this.accountService.addRoles(this.rolesAddItem).subscribe(res => {
        if (res.retcode === 270) {
          this.modalService.error({ nzTitle: '新增失败', nzContent: res.message });
        }
      });
      // 新增成功后，数据置空，并重新加载数据
      setTimeout(() => {
        this.loadData('role');
      }, 1000);
      this.hideModal('role');
    } else if (flag === 'modifyRole') {
      this.rolesAddItem.name = this.roleModifyForm.controls['name'].value;
      this.rolesAddItem.description = this.roleModifyForm.controls['description'].value;
      this.rolesAddItem.permissions = this.getPermission(); // 权限配置
      this.accountService.modifyRole(this.roleId, this.rolesAddItem).subscribe(res => {
      });
      // 修改成功后，数据置空，并重新加载数据
      setTimeout(() => {
        this.loadData('role');
      }, 1000);
      this.hideModal('modifyRole');
    } else if (flag === 'addCustomer') {
      let salt = '';
      this.accountService.getPublicSalt().subscribe(res => {
        salt = res.payload;
      });
      this.customerAddItem.userName = this.customerAddForm.controls['userName'].value;
      // 处理成md5
      this.customerAddItem.password = Md5.hashStr(
        Md5.hashStr(this.customerAddForm.controls['password'].value + salt).toString() + salt
      ).toString();
      this.customerAddItem.nick = this.customerAddForm.controls['nick'].value;
      this.customerAddItem.roles = this.customerAddForm.controls['roles'].value;
      this.accountService.addCustomer(this.customerAddItem).subscribe();
      // 新增成功后，数据置空，并重新加载数据
      setTimeout(() => {
        this.loadData('customer');
      }, 1000);
      this.hideModal('addCustomer');
    } else if (flag === 'modifyCustomer') {
      if (this.customerModifyForm.controls['userName'].value === ''
        || this.customerModifyForm.controls['nick'].value === ''
        || this.customerModifyForm.controls['roles'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '请填写必填信息' });
        return;
      }
      const customerModifyItem = {
        userName: this.customerModifyForm.controls['userName'].value,
        password: this.customerModifyForm.controls['password'].value,
        nick: this.customerModifyForm.controls['nick'].value,
        roles: this.customerModifyForm.controls['roles'].value,
      };
      this.accountService.modifyCustomer(this.customerId, customerModifyItem).subscribe();
      // 新增成功后，数据置空，并重新加载数据
      setTimeout(() => {
        this.loadData('customer');
      }, 1000);
      this.hideModal('modifyCustomer');
    }
  }

  // 获取所有的多选
  private getPermission(): any {
    this.checkOptionsOne[0].checked ? this.addPermission.push('个人资料') : 1;
    this.checkOptionsOne[1].checked ? this.addPermission.push('重置密码') : 1;
    this.checkOptionsTwo ? this.addPermission.push('首页监控') : 1 ;
    this.checkOptionsThree ? this.addPermission.push('号码管理') : 1;
    this.checkOptionsFour ? this.addPermission.push('模板管理') : 1;
    this.checkOptionsFive[0].checked ? this.addPermission.push('外呼任务') : 1;
    this.checkOptionsFive[1].checked ? this.addPermission.push('任务审核') : 1;
    this.checkOptionsSix[0].checked ? this.addPermission.push('员工列表') : 1;
    this.checkOptionsSix[1].checked ? this.addPermission.push('角色列表') : 1;
    this.checkOptionsFour ? this.addPermission.push('会话记录') : 1;
    return this.addPermission;
  }

  /* 权限配置 */
  // 更新所有的多选
  updateAllChecked(flag): void {
    if (flag === 'one') {
      this.indeterminateOne = false;
      // tslint:disable-next-line:max-line-length
      this.allCheckedOne ? this.checkOptionsOne.forEach(item => item.checked = true) : this.checkOptionsOne.forEach(item => item.checked = false);
    } else if (flag === 'five') {
      this.indeterminateFive = false;
      // tslint:disable-next-line:max-line-length
      this.allCheckedFive ? this.checkOptionsFive.forEach(item => item.checked = true) : this.checkOptionsFive.forEach(item => item.checked = false);
    } else if (flag === 'six') {
      this.indeterminateSix = false;
      // tslint:disable-next-line:max-line-length
      this.allCheckedSix ? this.checkOptionsSix.forEach(item => item.checked = true) : this.checkOptionsSix.forEach(item => item.checked = false);
    }
  }

  // 更新单个多选的状态
  updateSingleChecked(flag): void {
    if (flag === 'one') {
      if (this.checkOptionsOne.every(item => item.checked === false)) {
        // tslint:disable-next-line:no-unused-expression
        this.allCheckedOne, this.indeterminateOne = false;
      } else if (this.checkOptionsOne.every(item => item.checked === true)) {
        // tslint:disable-next-line:no-unused-expression
        this.allCheckedOne, this.indeterminateOne = true;
      } else {
        this.indeterminateOne = true;
      }
    } else if (flag === 'five') {
      if (this.checkOptionsFive.every(item => item.checked === false)) {
        // tslint:disable-next-line:no-unused-expression
        this.allCheckedFive, this.indeterminateFive = false;
      } else if (this.checkOptionsFive.every(item => item.checked === true)) {
        // tslint:disable-next-line:no-unused-expression
        this.allCheckedFive, this.indeterminateFive = true;
      } else {
        this.indeterminateFive = true;
      }
    } else if (flag === 'six') {
      if (this.checkOptionsSix.every(item => item.checked === false)) {
        // tslint:disable-next-line:no-unused-expression
        this.allCheckedSix, this.indeterminateSix = false;
      } else if (this.checkOptionsSix.every(item => item.checked === true)) {
        // tslint:disable-next-line:no-unused-expression
        this.allCheckedSix, this.indeterminateSix = true;
      } else {
        this.indeterminateSix = true;
      }
    }
  }

  // 去除所有的多选
  private allCheckFalse(): void {
    this.allCheckedOne = false; // 个人中心
    this.indeterminateOne = false;
    this.checkOptionsOne = [
      { label: '个人资料', value: '个人资料', checked: true },
      { label: '重置密码', value: '重置密码', checked: false }
    ];
    this.checkOptionsTwo = false; // 首页监控
    this.checkOptionsThree = true; // 号码管理
    this.checkOptionsFour = true; // 模板管理
    this.allCheckedFive = false; // 外呼任务管理
    this.indeterminateFive = false;
    this.checkOptionsFive = [
      { label: '外呼任务', value: '外呼任务', checked: true },
      { label: '任务审核', value: '任务审核', checked: false }
    ];
    this.allCheckedSix = false; // 账户管理
    this.indeterminateSix = false;
    this.checkOptionsSix = [
      { label: '员工列表', value: '员工列表', checked: false },
      { label: '角色列表', value: '角色列表', checked: false }
    ];
    this.checkOptionsSeven = true; // 会话记录
  }
  /* 权限配置 */

  // 删除操作
  doDelete(data, flag) {
    if (flag === 'role') {
      this.accountService.deleteRole(data.id).subscribe(res => {  // 删除活动
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
        setTimeout(() => { this.loadData('role'); }, 500);
      });
    } else if (flag === 'customer') {
      this.accountService.deleteCustomer(data).subscribe(resItem => { // 删除图片
        if (resItem.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: resItem.message });
        }
        setTimeout(() => { this.loadData('customer'); }, 500);
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
