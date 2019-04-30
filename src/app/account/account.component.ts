import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { ModifyBookingInput } from '../public/model/booking.model';
import { AccountService } from '../public/service/account.service';
import { CommonService } from '../public/service/common.service';
registerLocaleData(zh);

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  dataRole = [{id: '', name: '' }];  // 权限
  dataCustomer = [{roleId: '', roleName: '' }];  // 员工
  dataOperationlog = [{roleId: '', roleName: ''}];  // 操作日志
  dataResource = [];  // 操作日志资源
  dataResourceChildren = [];  // 资源的子集
  displayData = [];
  allChecked = false;
  indeterminate = false;
  modifyItem = new ModifyBookingInput();
  total = 0;
  allSize = 0;
  changePage = 1;
  pageSize = 10;
  currentPanel = 'role';
  beginDate = '';
  endDate = '';
  dateSearch = { 'Today': [new Date(), new Date()], 'This Month': [new Date(), new Date()] };
  unCheckVisit = false; // 不看访问

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
  searchOperationlogForm: FormGroup;
  rolesItem = { name: '', desc: '' };
  customerItem = { realname: '', password: '', roleId: '', username: '' };
  customerId = '';  // 用于修改员工
  roleId = '';  // 用于修改角色
  resIdsArr = []; // 组装一级
  rootRes = []; // 组装二级
  checkOptionsChannel = [
    { label: '你好小悟', value: 'XIAOWU', checked: false },
    { label: '听听同学', value: 'LENZE', checked: false }
  ];
  /* 规则配置 */
  allChecked1 = false; // 个人中心
  checkOptions1 = [];
  allChecked2 = false;
  checkOptions2 = [];
  allChecked3 = false;
  checkOptions3 = [];
  allChecked4 = false;
  checkOptions4 = [];
  allChecked5 = false;
  checkOptions5 = [];
  allChecked6 = false;
  checkOptions6 = [];
  allChecked7 = false;
  checkOptions7 = [];
  allChecked8 = false;
  checkOptions8 = [];
  allMenu = [];
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
    this._initForm();
  }

  ngOnInit() {
    this.loadData('role');
    this.changePanel('role');
    this.loadData('resource');
  }

  loadData(flag) {
    if (flag === 'role') {
      this.accountService.getRolesList().subscribe(res => {
        this.dataRole = JSON.parse(res.payload).reverse();
        if (this.dataRole.length === 0) {
          this.dataRole = [{id: '', name: '' }];
        }
      });
    } else if (flag === 'customer') {
      const customerItem = {
        realname: this.searchCustomerForm.controls['realname'].value,
        username: this.searchCustomerForm.controls['username'].value,
        roleId: this.searchCustomerForm.controls['roleId'].value
      };
      this.accountService.getCustomerList(customerItem).subscribe(res => {
        this.dataCustomer = JSON.parse(res.payload);
        this.dataCustomer.forEach(item => {
          let roleName = '';
          this.dataRole.forEach(cell => {
            if (item.roleId === cell.id) {
              roleName = cell.name;
            }
          });
          item.roleName = roleName;
        });
      });
    } else if (flag === 'resource') {
      this.accountService.getFullResource().subscribe(res => {
        this.dataResource = JSON.parse(res.payload);  // 不要最后一个
        this.dataResource.forEach((item, i) => {
          if (item.children) {
            if (item.children.length > 0) {
              item.children.forEach(element => {
                this.dataResourceChildren.push(element);
              });
            }
          }
          if (i === 0) {
            this.allMenu.push({name: item.name, id: item.id});
            // tslint:disable-next-line:max-line-length
            item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions1.push(unit); });
          } else if (i === 1) {
            this.allMenu.push({name: item.name, id: item.id});
            // tslint:disable-next-line:max-line-length
            item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions2.push(unit); });
          } else if (i === 2) {
            this.allMenu.push({name: item.name, id: item.id});
            // tslint:disable-next-line:max-line-length
            item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions3.push(unit); });
          } else if (i === 3) {
            this.allMenu.push({name: item.name, id: item.id});
            // tslint:disable-next-line:max-line-length
            item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions4.push(unit); });
          } else if (i === 4) {
            this.allMenu.push({name: item.name, id: item.id});
            // tslint:disable-next-line:max-line-length
            item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions5.push(unit); });
          } else if (i === 5) {
            this.allMenu.push({name: item.name, id: item.id});
            // tslint:disable-next-line:max-line-length
            item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions6.push(unit); });
          } else if (i === 6) {
            this.allMenu.push({name: item.name, id: item.id});
            // tslint:disable-next-line:max-line-length
            item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions7.push(unit); });
          } else if (i === 7) {
            this.allMenu.push({name: item.name, id: item.id});
            // tslint:disable-next-line:max-line-length
            item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions8.push(unit); });
          }
        });
        console.log(this.allMenu);
        console.log(this.checkOptions1);
      });
    } else if (flag === 'operationlog') {
      const operationlogItem = {
        username: this.searchOperationlogForm.controls['username'].value,
        realname: this.searchOperationlogForm.controls['realname'].value,
        role_id: this.searchOperationlogForm.controls['role_id'].value,
        op_category: this.searchOperationlogForm.controls['op_category'].value,  // 一级
        op_page: this.searchOperationlogForm.controls['op_page'].value,  // 二级
        op_time_start: this.beginDate,  // 开始
        op_time_end: this.endDate,  // 结束
      };
      this.accountService.getOperationlogList(operationlogItem).subscribe(res => {
        let dataOperationlog = [];
        if (this.unCheckVisit) {
          JSON.parse(res.payload).reverse().forEach(item => {
            if (item.opName === '访问') { return; }
            dataOperationlog.push(item);
          });
        } else {
          dataOperationlog = JSON.parse(res.payload).reverse();
        }
        this.dataOperationlog = dataOperationlog;
      });
    }
  }

  private _initForm(): void {
    this.searchCustomerForm = this.fb.group({ realname: [''], username: [''], roleId: [''], });
    this.customerModifyForm = this.fb.group({ realname: [''], password: [''], roleId: [''], username: [''], });
    this.customerAddForm = this.fb.group({ realname: [''], password: [''], roleId: [''], username: [''], });
    this.roleAddForm = this.fb.group({ name: [''], desc: [''] });
    this.roleModifyForm = this.fb.group({ name: [''], desc: [''] });
    this.searchOperationlogForm = this.fb.group({ realname: [''], username: [''], role_id: [''], op_category: [''],
      op_page: [''], date: [''], unCheckVisit: [''], });
  }

  // 所有弹框
  showModal(flag, data): void {
    if (flag === 'addRole') {
      this.allCheckFalse(); // 清除所有所选状态
      this.isAddRoleVisible = true;
      this.rolesItem.name = '';
      this.rolesItem.desc = '';
      this.resIdsArr.splice(0, this.resIdsArr.length );
    } else if (flag === 'modifyRole') {
      this.allCheckFalse(); // 清除所有所选状态
      this.roleId = data.id;
      this.isModifyRoleVisible = true;
      this.rolesItem.name = data.name;
      this.rolesItem.desc = data.desc;
      if (data.platforms) {
        data.platforms.forEach(item => {  // 针对渠道进行遍历
          if (item === 'XIAOWU') {
            this.checkOptionsChannel[0].checked = true;
          } else if (item === 'LENZE') {
            this.checkOptionsChannel[1].checked = true;
          }
        });
      }
      this.setResArr(data.resIds);
    } else if (flag === 'deleteRole') {
      this.modalService.confirm({
        nzTitle: '权限配置删除', nzContent: '确认要删除该权限配置吗？', nzCancelText: '取消',
        nzOnCancel: () => 1, nzOkText: '确定', nzOnOk: () => { this.doDelete(data, flag); }
      });
    } else if (flag === 'addCustomer') {
      this.isAddCustomerVisible = true;
      this.customerItem = { realname: '', password: '', roleId: '', username: '' };
    } else if (flag === 'modifyCustomer') {
      this.customerId = data.id;
      this.isModifyCustomerVisible = true;
      this.customerItem.username = data.username;
      this.customerItem.password = data.password;
      this.customerItem.realname = data.realname;
      this.customerItem.roleId = data.roleId;
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

  // 验证
  verification(falg, data) {
    let result = true;
    const MOBILE_REGEXP = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
    if (falg === 'addRole') {
      if (data.name === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '角色名称未填写' }); result = false;
      }
      if (data.platforms.length === 0) {
        this.modalService.error({ nzTitle: '提示', nzContent: '权限设置未选择' }); result = false;
      }
      if (data.resIds.length === 0) {
        this.modalService.error({ nzTitle: '提示', nzContent: '一级菜单二级菜单未选择' }); result = false;
      }
      this.dataRole.forEach(item => { // 去重
        if (item.name === data.name) {
          this.modalService.error({ nzTitle: '提示', nzContent: '角色名称与现有的角色名称有重复！' }); result = false;
        }
      });
    } else if (falg === 'modifyRole') {
      if (data.name === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '角色名称未填写' }); result = false;
      }
      console.log(data);
      if (data.platforms.length === 0) {
        this.modalService.error({ nzTitle: '提示', nzContent: '权限设置未选择' }); result = false;
      }
      if (data.resIds.length === 0) {
        this.modalService.error({ nzTitle: '提示', nzContent: '一级菜单二级菜单未选择' }); result = false;
      }
      this.dataRole.forEach(item => { // 去重
        if (this.roleId !== item.id) {
          if (item.name === data.name) {
            this.modalService.error({ nzTitle: '提示', nzContent: '角色名称与现有的角色名称有重复！' }); result = false;
          }
        }
      });
    } else if (falg === 'addCustomer') {
      if (data.username === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '员工账号未填写' }); result = false;
      }
      if (!MOBILE_REGEXP.test(data.username)) {
        this.modalService.error({ nzTitle: '提示', nzContent: '员工账号格式错误，必须为11位手机号！' }); result = false;
      }
      if (data.realname === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '员工姓名未填写' }); result = false;
      }
      if (data.password === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '登录密码未填写' }); result = false;
      }
      if (data.roleId === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '角色未选择' }); result = false;
      }
      this.dataRole.forEach(item => { // 去重
        if (item.name === data.username) {
          this.modalService.error({ nzTitle: '提示', nzContent: '员工账号与现有的员工账号有重复！' }); result = false;
        }
      });
    } else if (falg === 'modifyCustomer') {
      if (data.username === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '员工账号未填写' }); result = false;
      }
      if (!MOBILE_REGEXP.test(data.username)) {
        this.modalService.error({ nzTitle: '提示', nzContent: '员工账号格式错误，必须为11位手机号！' }); result = false;
      }
      if (data.realname === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '员工姓名未填写' }); result = false;
      }
      if (data.password === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '登录密码未填写' }); result = false;
      }
      if (data.roleId === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '角色未选择' }); result = false;
      }
      this.dataRole.forEach(item => { // 去重
        if (this.customerId !== item.id) {
          if (item.name === data) {
            this.modalService.error({ nzTitle: '提示', nzContent: '员工账号与现有的员工账号有重复！' }); result = false;
          }
        }
      });
    }
    return result;
  }

  doSave(flag) {
    if (flag === 'addRole') {
      const channelArr = [];
      this.checkOptionsChannel.forEach(item => {
        if (item.checked === true) { channelArr.push(item.value); }
      });
      const rolesItem = {
        name: this.roleAddForm.controls['name'].value,
        desc: this.roleAddForm.controls['desc'].value,
        platforms: channelArr,
        resIds: this.getResArr()
      };
      if (!this.verification('addRole', rolesItem)) { return; } // 去重
      this.accountService.addRoles(rolesItem).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '权限后台', op_page: '权限配置', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('role');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
      this.hideModal('addRole');
    } else if (flag === 'modifyRole') {
      const channelArr = [];
      this.checkOptionsChannel.forEach(item => {
        if (item.checked === true) { channelArr.push(item.value); }
      });
      const resIdsArr = [];
      const rolesModifyItem = {
        id: this.roleId,
        name: this.roleModifyForm.controls['name'].value,
        desc: this.roleModifyForm.controls['desc'].value,
        platforms: channelArr,
        resIds: this.getResArr()
      };
      if (!this.verification('modifyRole', rolesModifyItem)) { return; } // 去重
      this.accountService.modifyRole(rolesModifyItem).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '权限后台', op_page: '权限配置', op_name: '修改' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('role');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
      this.hideModal('modifyRole');
    } else if (flag === 'addCustomer') {  // 添加员工
      const customerItem = {
        realname: this.customerAddForm.controls['realname'].value,
        password: this.customerAddForm.controls['password'].value,
        roleId: this.customerAddForm.controls['roleId'].value,
        username: this.customerAddForm.controls['username'].value,
      };
      if (!this.verification('addCustomer', customerItem)) { return; } // 去重
      this.accountService.addCustomer(customerItem).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '权限后台', op_page: '员工配置', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('customer');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
      this.hideModal('addCustomer');
    } else if (flag === 'modifyCustomer') { // 修改员工
      const customerItem = {
        id: this.customerId,
        realname: this.customerModifyForm.controls['realname'].value,
        password: this.customerModifyForm.controls['password'].value,
        roleId: this.customerModifyForm.controls['roleId'].value,
        username: this.customerItem.username,
      };
      if (!this.verification('modifyCustomer', customerItem)) { return; } // 去重
      this.accountService.modifyCustomer(customerItem).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '权限后台', op_page: '员工配置', op_name: '修改' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('customer');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
      this.hideModal('modifyCustomer');
    }
  }

  // 全选/全不选
  updateAllChecked(flag): void {
    // tslint:disable-next-line:max-line-length
    if (flag === 'flag1') { this.allChecked1 ? this.checkOptions1.forEach(item => item.checked = true) : this.checkOptions1.forEach(item => item.checked = false); }
    // tslint:disable-next-line:max-line-length
    if (flag === 'flag2') { this.allChecked2 ? this.checkOptions2.forEach(item => item.checked = true) : this.checkOptions2.forEach(item => item.checked = false); }
    // tslint:disable-next-line:max-line-length
    if (flag === 'flag3') { this.allChecked3 ? this.checkOptions3.forEach(item => item.checked = true) : this.checkOptions3.forEach(item => item.checked = false); }
    // tslint:disable-next-line:max-line-length
    if (flag === 'flag4') { this.allChecked4 ? this.checkOptions4.forEach(item => item.checked = true) : this.checkOptions4.forEach(item => item.checked = false); }
    // tslint:disable-next-line:max-line-length
    if (flag === 'flag5') { this.allChecked5 ? this.checkOptions5.forEach(item => item.checked = true) : this.checkOptions5.forEach(item => item.checked = false); }
    // tslint:disable-next-line:max-line-length
    if (flag === 'flag6') { this.allChecked6 ? this.checkOptions6.forEach(item => item.checked = true) : this.checkOptions6.forEach(item => item.checked = false); }
    // tslint:disable-next-line:max-line-length
    if (flag === 'flag7') { this.allChecked7 ? this.checkOptions7.forEach(item => item.checked = true) : this.checkOptions7.forEach(item => item.checked = false); }
    // tslint:disable-next-line:max-line-length
    if (flag === 'flag8') { this.allChecked8 ? this.checkOptions8.forEach(item => item.checked = true) : this.checkOptions8.forEach(item => item.checked = false); }
  }

  // 去除所有的多选
  private allCheckFalse(): void {
    this.allChecked1 = false; this.allChecked2 = false; this.allChecked3 = false; this.allChecked5 = false; this.allChecked4 = false;
    this.allChecked6 = false; this.allChecked6 = false; this.allChecked7 = false; this.allChecked8 = false;
    this.checkOptions1 = []; this.checkOptions2 = []; this.checkOptions3 = []; this.checkOptions4 = []; this.checkOptions5 = [];
    this.checkOptions6 = []; this.checkOptions7 = []; this.checkOptions8 = []; this.allMenu = [];  // 清空
    this.dataResource.forEach((item, i) => {
      // tslint:disable-next-line:max-line-length
      if (i === 1) { this.allMenu.push({name: item.name, id: item.id}); item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions1.push(unit); }); }
      // tslint:disable-next-line:max-line-length
      if (i === 2) { this.allMenu.push({name: item.name, id: item.id}); item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions2.push(unit); }); }
      // tslint:disable-next-line:max-line-length
      if (i === 3) { this.allMenu.push({name: item.name, id: item.id}); item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions3.push(unit); }); }
      // tslint:disable-next-line:max-line-length
      if (i === 4) { this.allMenu.push({name: item.name, id: item.id}); item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions4.push(unit); }); }
      // tslint:disable-next-line:max-line-length
      if (i === 5) { this.allMenu.push({name: item.name, id: item.id}); item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions5.push(unit); }); }
      // tslint:disable-next-line:max-line-length
      if (i === 6) { this.allMenu.push({name: item.name, id: item.id}); item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions6.push(unit); }); }
      // tslint:disable-next-line:max-line-length
      if (i === 7) { this.allMenu.push({name: item.name, id: item.id}); item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions7.push(unit); }); }
      // tslint:disable-next-line:max-line-length
      if (i === 8) { this.allMenu.push({name: item.name, id: item.id}); item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions8.push(unit); }); }
    });

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
          const operationInput = { op_category: '权限后台', op_page: '权限配置', op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('role');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'deleteCustomer') {
      this.accountService.deleteCustomer(data).subscribe(res => {  // 删除用户
        if (res.retcode === 0) {
          if (res.payload === '0') {
            this.notification.blank( '提示', '不可删除管理员', { nzStyle: { color : 'red' } });
          } else if (res.payload === '1') {
            this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
            const operationInput = { op_category: '权限后台', op_page: '员工配置', op_name: '删除' };
            this.commonService.updateOperationlog(operationInput).subscribe();
          }
          this.loadData('customer');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  // 切换面板
  changePanel(flag): void {
    if (flag !== this.currentPanel) { this.loadData(flag); }
    this.currentPanel = flag;
    // tslint:disable-next-line:max-line-length
    const operationInput = { op_category: '权限后台', op_page: flag === 'role' ? '权限配置' : flag === 'customer' ? '员工配置' : flag === 'operationlog' ? '操作日志' : '', op_name: '访问' };
    this.commonService.updateOperationlog(operationInput).subscribe();
  }

  // 日期插件
  onChange(result, flag): void {
    if (flag === 'operationlog') {
      if (result === []) {
        this.beginDate = '';
        this.endDate = '';
        return;
      }
      // 正确选择数据
      if (result[0] !== '' || result[1] !== '') {
        // tslint:disable-next-line:max-line-length
        this.beginDate = this.datePipe.transform(result[0], 'yyyy-MM-dd') + 'T' + this.datePipe.transform(result[0], 'HH:mm:ss.SSS') + 'Z';
        // tslint:disable-next-line:max-line-length
        this.endDate = this.datePipe.transform(result[1], 'yyyy-MM-dd') + 'T' + this.datePipe.transform(result[1], 'HH:mm:ss.SSS') + 'Z';
      }
      if (this.beginDate.indexOf('null') > -1) {  // 处理有null的情况
        this.beginDate = '';
        this.endDate = '';
      }
    }
  }

  // 获取一、二级菜单
  getResArr() {
    const finalArr = [];
    const arr1 = [], arr2 = [], arr3 = [], arr4 = [], arr5 = [], arr6 = [], arr7 = [], arr8 = [];
    this.checkOptions1.forEach(item => { if (item.checked) { finalArr.push(item.value); arr1.push(item.id); } });
    this.checkOptions2.forEach(item => { if (item.checked) { finalArr.push(item.value); arr2.push(item.id); } });
    this.checkOptions3.forEach(item => { if (item.checked) { finalArr.push(item.value); arr3.push(item.id); } });
    this.checkOptions4.forEach(item => { if (item.checked) { finalArr.push(item.value); arr4.push(item.id); } });
    this.checkOptions5.forEach(item => { if (item.checked) { finalArr.push(item.value); arr5.push(item.id); } });
    this.checkOptions6.forEach(item => { if (item.checked) { finalArr.push(item.value); arr6.push(item.id); } });
    this.checkOptions7.forEach(item => { if (item.checked) { finalArr.push(item.value); arr7.push(item.id); } });
    this.checkOptions8.forEach(item => { if (item.checked) { finalArr.push(item.value); arr8.push(item.id); } });
    if (arr1.length > 0) { finalArr.push(this.allMenu[0].id); }
    if (arr2.length > 0) { finalArr.push(this.allMenu[1].id); }
    if (arr3.length > 0) { finalArr.push(this.allMenu[2].id); }
    if (arr4.length > 0) { finalArr.push(this.allMenu[3].id); }
    if (arr5.length > 0) { finalArr.push(this.allMenu[4].id); }
    if (arr6.length > 0) { finalArr.push(this.allMenu[5].id); }
    if (arr7.length > 0) { finalArr.push(this.allMenu[6].id); }
    if (arr8.length > 0) { finalArr.push(this.allMenu[7].id); }
    return finalArr;
  }

  // 设置具体哪些勾选的权限
  setResArr(data) {
    data.forEach(element => {
      this.checkOptions1.forEach(item => { item.value === element ? item.checked = true : 1; });
      this.checkOptions2.forEach(item => { item.value === element ? item.checked = true : 1; });
      this.checkOptions3.forEach(item => { item.value === element ? item.checked = true : 1; });
      this.checkOptions4.forEach(item => { item.value === element ? item.checked = true : 1; });
      this.checkOptions5.forEach(item => { item.value === element ? item.checked = true : 1; });
      this.checkOptions6.forEach(item => { item.value === element ? item.checked = true : 1; });
      this.checkOptions7.forEach(item => { item.value === element ? item.checked = true : 1; });
      this.checkOptions8.forEach(item => { item.value === element ? item.checked = true : 1; });
    });
  }

}
