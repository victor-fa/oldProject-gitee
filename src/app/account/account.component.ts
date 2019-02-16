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
import { CustomerItem, AddCustomerItem, AddRolesItem, RolesItem } from '../public/model/account.model';
import { Md5 } from 'ts-md5';
registerLocaleData(zh);

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  data = [];
  dataDetail = [];
  dataOrder = {};
  displayData = [];
  allChecked = false;
  indeterminate = false;
  isBookingDetailVisible = false;
  isExternalDetailVisible = false;
  isModifyVisible = false;
  isInvoiceVisible = false;
  orderId = '';
  orderStatus = '';
  searchForm: FormGroup;  // 查询表单
  searchItem = new SearchBookingInput();
  modifyForm: FormGroup;  // 修改表单
  modifyItem = new ModifyBookingInput();
  isFlightOrder = false;
  isHotelOrder = false;
  isTrainOrder = false;
  lastId = 0;
  firstId = 0;
  total = 0;
  allSize = 0;
  changePage = 1;
  doLast = false;
  doFirst = false;
  pageSize = 10;



  allRoleChecked = false;
  indeterminateRole = false;
  isAddCustomerVisible = false;
  displayRoleData = [];

  frameworkOption: any;
  isAddVisible = false; // 新增角色
  isModifyRoleVisible = false;  // 修改角色
  isModifyCustomerVisible = false; // 修改用户信息
  roleData = [];
  searchRoleForm: FormGroup;  // 查询角色表单
  rolesItem = new RolesItem();
  roleAddForm: FormGroup;
  rolesAddItem = new AddRolesItem();
  customerAddForm: FormGroup;
  customerAddItem = new AddCustomerItem();
  searchCustomerForm: FormGroup;  // 查询员工表单
  customerItem = new CustomerItem();
  customerId = '';
  roleId = '';
  customerModifyForm: FormGroup;  // 修改员工
  customerModifyItem = new AddCustomerItem();
  roleModifyForm: FormGroup;  // 修改员工
  roleList = [];
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
    private bookingService: BookingService,
    private notification: NzNotificationService,
    private _router: Router,
    private accountService: AccountService,
  ) {
    this.commonService.nav[0].active = true;
    this._initRoleSearchForm();
    this._initAddRoleForm();
    this._initAddCustomerForm();
    this._initCustomerSearchForm();
    this._initCustomerModifyForm();
    this._initRoleModifyForm();
  }

  ngOnInit() {
    this.loadRoleData();
    this.loadCustomerData();
    this.commonService.havePermission();  // 获取权限
  }

  loadCustomerData(customerItem?): void {
    this.accountService.getUserList(customerItem).subscribe(res => {
      this.data = res.payload;
      res.payload.forEach(item => {
        item.roleName = this.changeRoleIdToName(item.roles[0]);
      });
    });
  }

  loadRoleData(rolesItem?): void {
    this.accountService.getRolesList(rolesItem).subscribe(res => {
      if (res.payload) {
        res.payload.forEach(item => {
          this.tempRoles.push(item);
        });
      }
      this.roleData = res.payload;
    });
  }

  // 变role id为role
  changeRoleIdToName(id): string {
    let name = '';
    for (let i = 0; i < this.tempRoles.length; i++) {
      if (id ===  this.tempRoles[i].id) {
        name = this.tempRoles[i].name;
      }
    }
    return name;
  }

  // 查询员工表单的内容
  doSearchCustomer(e, { value, valid }) {
    e.preventDefault();
    this.customerItem.userName = this.searchCustomerForm.controls['userName'].value;
    this.customerItem.nick = this.searchCustomerForm.controls['nick'].value;
    this.customerItem.role = this.searchCustomerForm.controls['role'].value;
    this.loadCustomerData(this.customerItem);
  }

  private _initCustomerSearchForm(): void {
    this.searchCustomerForm = this.fb.group({
      userName: [''],
      nick: [''],
      role: [''],
    });
  }

  // 重置
  doResetCustomer(): void {
    this.customerItem.userName = '';
    this.customerItem.nick = '';
    this.customerItem.role = '';
    this.loadCustomerData(this.customerItem);
  }

  // 修改 —— 修改用户信息
  showModifyCustomerModal(data): void {
    this.customerId = data.uid;
    this.isModifyCustomerVisible = true;
    this.customerModifyItem.userName = data.userName;
    this.customerModifyItem.password = data.password;
    this.customerModifyItem.nick = data.nick;
    this.tempRoleName = data.roles[0];
    console.log(this.roleData);
    console.log(this.tempRoleName);
  }

  hideModifyCustomerModal(): void {
    this.isModifyCustomerVisible = false;
  }

  doModifyCustomer(e, { value, valid }) {
    e.preventDefault();
    // tslint:disable-next-line:forin
    for (const key in this.customerModifyForm.controls) {
      this.customerModifyForm.controls[key].markAsDirty();
    }
    if (this.customerModifyForm.controls['userName'].value === ''
      || this.customerModifyForm.controls['nick'].value === ''
      || this.customerModifyForm.controls['roles'].value === '') {
      this.modalService.error({
        nzTitle: '提示',
        nzContent: '请填写必填信息'
      });
      return;
    }
    this.customerModifyItem.userName = this.customerModifyForm.controls['userName'].value;
    this.customerModifyItem.password = this.customerModifyForm.controls['password'].value;
    this.customerModifyItem.nick = this.customerModifyForm.controls['nick'].value;
    this.customerModifyItem.roles = this.customerModifyForm.controls['roles'].value;
    this.accountService.modifyCustomer(this.customerId, this.customerModifyItem).subscribe();
    // 新增成功后，数据置空，并重新加载数据
    setTimeout(() => {
      this.loadCustomerData(this.customerItem);
    }, 1000);
    this.hideModifyCustomerModal();
  }

  private _initCustomerModifyForm(): void {
    this.customerModifyForm = this.fb.group({
      userName: ['', [this.commonService.rightNumValidator]],
      password: ['', [this.commonService.rightPasswordValidator]],
      nick: ['', [this.commonService.userNameValidator1]],
      roles: [''],
    });
  }

  getModifyFormControl = (name) => {
    return this.customerModifyForm.controls[name];
  }

  // 新增 —— 新增员工
  showAddCustomerModal(): void {
    this.isAddCustomerVisible = true;
    this.customerAddItem.userName = '';
    this.customerAddItem.password = '';
    this.customerAddItem.nick = '';
    if (this.customerAddItem.roles) {
      this.customerAddItem.roles.splice(0, this.customerAddItem.roles.length);
    }
    this.tempRoleName = '';
  }

  hideAddCustomerModal(): void {
    this.isAddCustomerVisible = false;
  }

  doAddCustomer(e, { value, valid }): void {
    e.preventDefault();
    // tslint:disable-next-line:forin
    for (const key in this.customerAddForm.controls) {
      this.customerAddForm.controls[key].markAsDirty();
    }
    if (this.getAddFormControl('userName').hasError('rightNum')
      || this.getAddFormControl('userName').value === ''
      // || this.getAddFormControl('password').hasError('rightNum')
      || this.getAddFormControl('password').value === ''
      // || this.getAddFormControl('nick').hasError('userName')
      || this.getAddFormControl('nick').value === ''
      || this.getAddFormControl('roles').value === '') {
      this.modalService.error({
        nzTitle: '提示',
        nzContent: '请填写必填信息'
      });
      return;
    }
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
      this.loadCustomerData(this.customerItem);
    }, 1000);
    this.hideAddCustomerModal();
  }

  getAddFormControl = (name) => {
    return this.customerAddForm.controls[name];
  }

  private _initAddCustomerForm(): void {
    this.customerAddForm = this.fb.group({
      userName: ['', [this.commonService.rightNumValidator]],
      password: ['', [this.commonService.rightPasswordValidator]],
      nick: ['', [this.commonService.userNameValidator1]],
      roles: [''],
    });
  }

  // 新增 —— 新增角色
  showAddRoleModal(): void {
    this.allCheckFalse();
    this.isAddVisible = true;
    this.rolesAddItem.name = '';
    this.rolesAddItem.description = '';
    this.addPermission.splice(0, this.addPermission.length );
  }

  hideAddRoleModal(): void {
    this.isAddVisible = false;
  }

  doAddRole(e, { value, valid }): void {
    e.preventDefault();
    // tslint:disable-next-line:forin
    for (const key in this.roleAddForm.controls) {
      this.roleAddForm.controls[key].markAsDirty();
    }
    if (!valid) {
      this.modalService.error({
        nzTitle: '提示',
        nzContent: '请填写必填信息'
      });
      return;
    }
    this.rolesAddItem.name = this.roleAddForm.controls['name'].value;
    this.rolesAddItem.description = this.roleAddForm.controls['description'].value;
    this.addPermission.push();
    this.rolesAddItem.permissions = this.getPermission(); // 权限配置
    this.accountService.addRoles(this.rolesAddItem).subscribe(res => {
      if (res.retcode === 270) {
        this.modalService.error({
          nzTitle: '新增失败',
          nzContent: res.message
        });
      }
    });
    // 新增成功后，数据置空，并重新加载数据
    setTimeout(() => {
      this.loadRoleData(this.rolesItem);
    }, 1000);
    this.hideAddRoleModal();
  }

  private _initAddRoleForm(): void {
    this.roleAddForm = this.fb.group({
      name: ['', [Validators.required], [this.commonService.userNameValidator1]],
      description: ['', [Validators.required]],
    });
  }

  getAddControl = (name) => {
    return this.roleAddForm.controls[name];
  }

  // 获取所有的多选
  private getPermission(): any {
    this.checkOptionsOne[0].checked ? this.addPermission.push('个人资料') : console.log('无 个人资料');
    this.checkOptionsOne[1].checked ? this.addPermission.push('重置密码') : console.log('无 重置密码');
    this.checkOptionsTwo ? this.addPermission.push('首页监控') : console.log('无 首页监控');
    this.checkOptionsThree ? this.addPermission.push('号码管理') : console.log('无 号码管理');
    this.checkOptionsFour ? this.addPermission.push('模板管理') : console.log('无 模板管理');
    this.checkOptionsFive[0].checked ? this.addPermission.push('外呼任务') : console.log('无 外呼任务');
    this.checkOptionsFive[1].checked ? this.addPermission.push('任务审核') : console.log('无 任务审核');
    this.checkOptionsSix[0].checked ? this.addPermission.push('员工列表') : console.log('无 员工列表');
    this.checkOptionsSix[1].checked ? this.addPermission.push('角色列表') : console.log('无 角色列表');
    this.checkOptionsFour ? this.addPermission.push('会话记录') : console.log('无 会话记录');
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

  // 修改 —— 修改角色
  showModifyRoleModal(data): void {
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
  }

  hideModifyRoleModal(): void {
    this.isModifyRoleVisible = false;
  }

  doModifyRole(e, { value, valid }) {
    e.preventDefault();
    // tslint:disable-next-line:forin
    for (const key in this.roleModifyForm.controls) {
      this.roleModifyForm.controls[key].markAsDirty();
    }
    if (!valid) {
      this.modalService.error({
        nzTitle: '提示',
        nzContent: '请填写必填信息'
      });
      return;
    }
    this.rolesAddItem.name = this.roleModifyForm.controls['name'].value;
    this.rolesAddItem.description = this.roleModifyForm.controls['description'].value;
    this.rolesAddItem.permissions = this.getPermission(); // 权限配置
    this.accountService.modifyRole(this.roleId, this.rolesAddItem).subscribe(res => {
    });
    // 修改成功后，数据置空，并重新加载数据
    setTimeout(() => {
      this.loadRoleData(this.rolesItem);
    }, 1000);
    this.hideModifyRoleModal();
  }

  private _initRoleModifyForm(): void {
    this.roleModifyForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      // permissions: ['', [Validators.required]],
    });
  }

  // 删除 —— 删除用户
  showDeleteRoleModal(id): void {
    this.modalService.confirm({
      nzTitle: '用户删除',
      nzContent: '确认要删除该用户吗？',
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel'),
      nzOkText: '确定',
      nzOnOk: () => {
        this.accountService.deleteCustomer(id).subscribe(res => {
        });
        // 新增成功后，数据置空，并重新加载数据
        setTimeout(() => {
          this.loadCustomerData(this.customerItem);
        }, 1000);
      }
    });
  }

  // 删除 —— 删除角色
  doDeleteRole(id): void {
    this.modalService.confirm({
      nzTitle: '角色删除',
      nzContent: '确认要删除该角色吗？',
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel'),
      nzOkText: '确定',
      nzOnOk: () => {
        this.accountService.deleteRole(id).subscribe(res => {
          if (res.retcode === 280) {
            this.modalService.error({
              nzTitle: '刪除失败',
              nzContent: res.message
            });
          }
        });
        // 新增成功后，数据置空，并重新加载数据
        setTimeout(() => {
          this.loadRoleData(this.rolesItem);
        }, 1000);
      }
    });
  }

  // 查询表单的内容
  doSearch(e, { value, valid }) {
    e.preventDefault();
    this.rolesItem.name = this.searchRoleForm.controls['name'].value;
    this.loadRoleData(this.rolesItem);
  }

  private _initRoleSearchForm(): void {
    this.searchRoleForm = this.fb.group({
      name: [''],
    });
  }

  // 重置
  doReset(): void {
    this.rolesItem.name = '';
    this.loadRoleData(this.rolesItem);
  }

  // 用户列表主面板
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

  // 组织架构 - 角色列表
  currentRolePageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayRoleData = $event;
    this.refreshRoleStatus();
  }

  refreshRoleStatus(): void {
    const allRoleChecked = this.displayRoleData.filter(value => !value.disabled).every(value => value.checked === true);
    const allRoleUnChecked = this.displayRoleData.filter(value => !value.disabled).every(value => !value.checked);
    this.allRoleChecked = allRoleChecked;
    this.indeterminateRole = (!allRoleChecked) && (!allRoleUnChecked);
  }
}
