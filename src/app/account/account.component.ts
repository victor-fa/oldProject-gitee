import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService, NzNotificationService, UploadFile, NzMessageService } from 'ng-zorro-antd';
import { AccountService } from '../public/service/account.service';
import { CommonService } from '../public/service/common.service';
import { HttpRequest, HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';
registerLocaleData(zh);

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  isSpinning = false;
  dataRole = [{id: '', name: '' }];  // 权限
  dataCustomer = [{roleId: '', roleName: '' }];  // 员工
  dataOperationlog = [{roleId: '', roleName: ''}];  // 操作日志
  dataResource = [];  // 操作日志资源
  dataResourceChildren = [];  // 资源的子集
  allChecked = false;
  modifyItem = {};
  dataNavConfig = []; // 导航页配置
  currentPanel = 'role';
  beginDate = '';
  endDate = '';
  unCheckVisit = false; // 不看访问
  visiable = {addCustomer: false, addRole: false, modifyRole: false, modifyCustomer: false,
    addNavConfig: false, modifyNavConfig: false };
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
  checkOptionsChannel = [
    { label: '你好小悟', value: 'XIAOWU', checked: false },
    { label: '听听同学', value: 'LENZE', checked: false },
    { label: '沃特沃德6', value: 'WATER_WORLD_6', checked: false }
  ];
  navConfigItem = { id: '', name: '', order: 1, iconFileId: '', fileList: [], elements: [{name: '', description: '', iconFileId: '', fileList: [], type: 'LINK', data: '', sort: '' }]};
  currentFile = '';
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
  allChecked9 = false;
  checkOptions9 = [];
  allChecked10 = false;
  checkOptions10 = [];
  allChecked11 = false;
  checkOptions11 = [];
  allMenu = [];
  /* 规则配置 */

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private datePipe: DatePipe,
    private modalService: NzModalService,
    private notification: NzNotificationService,
    private accountService: AccountService,
    private msg: NzMessageService,
    private http: HttpClient,
  ) {
    this.commonService.nav[7].active = true;
    this._initForm();
  }

  ngOnInit() {
    const tabFlag = [{label: '权限配置', value: 'role'}, {label: '员工配置', value: 'activity'},
        {label: '操作日志', value: 'operationlog'}];
    let targetFlag = 0;
    for (let i = 0; i < tabFlag.length; i++) {
      if (this.commonService.haveMenuPermission('children', tabFlag[i].label)) {targetFlag = i; break; }
    }
    console.log(tabFlag[targetFlag].value);
    this.loadData(tabFlag[targetFlag].value);
    this.changePanel(tabFlag[targetFlag].value);
    this.loadData('resource');
  }

  loadData(flag) {
    this.isSpinning = true;
    if (flag === 'role') {
      this.accountService.getRolesList().subscribe(res => {
        if (res.retcode === 0 && res.status !== 500) {
          this.isSpinning = false;
          this.dataRole = JSON.parse(res.payload).reverse();
          if (this.dataRole.length === 0) { this.dataRole = [{id: '', name: '' }]; }
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'customer') {
      const customerItem = {
        realname: this.searchCustomerForm.controls['realname'].value,
        username: this.searchCustomerForm.controls['username'].value,
        roleId: this.searchCustomerForm.controls['roleId'].value
      };
      this.accountService.getCustomerList(customerItem).subscribe(res => {
        console.log(res);
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataCustomer = JSON.parse(res.payload);
          this.dataCustomer.forEach(item => {
            let roleName = '';
            this.dataRole.forEach(cell => {
              if (item.roleId === cell.id) { roleName = cell.name; }
            });
            item.roleName = roleName;
          });
          console.log(this.dataCustomer);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'resource') {
      this.accountService.getFullResource().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataResource = JSON.parse(res.payload);  // 不要最后一个
          console.log(this.dataResource);
          this.dataResource.forEach((item, i) => {
            if (item.children) {
              if (item.children.length > 0) {
                item.children.forEach(element => { this.dataResourceChildren.push(element); });
              }
            }
            if (i === 0) {
              this.allMenu.push({name: item.name, id: item.id});
              item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions1.push(unit); });
            } else if (i === 1) {
              this.allMenu.push({name: item.name, id: item.id});
              item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions2.push(unit); });
            } else if (i === 2) {
              this.allMenu.push({name: item.name, id: item.id});
              item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions3.push(unit); });
            } else if (i === 3) {
              this.allMenu.push({name: item.name, id: item.id});
              item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions4.push(unit); });
            } else if (i === 4) {
              this.allMenu.push({name: item.name, id: item.id});
              item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions5.push(unit); });
            } else if (i === 5) {
              this.allMenu.push({name: item.name, id: item.id});
              item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions6.push(unit); });
            } else if (i === 6) {
              this.allMenu.push({name: item.name, id: item.id});
              item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions7.push(unit); });
            } else if (i === 7) {
              this.allMenu.push({name: item.name, id: item.id});
              item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions8.push(unit); });
            } else if (i === 8) {
              this.allMenu.push({name: item.name, id: item.id});
              item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions9.push(unit); });
            } else if (i === 9) {
              this.allMenu.push({name: item.name, id: item.id});
              item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions10.push(unit); });
            } else if (i === 10) {
              this.allMenu.push({name: item.name, id: item.id});
              item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions11.push(unit); });
            }
          });
          console.log(this.allMenu);
          console.log(this.checkOptions1);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
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
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          let dataOperationlog = [];
          if (this.unCheckVisit) {
            JSON.parse(res.payload).forEach(item => {
              if (item.opName === '访问') { return; }
              dataOperationlog.push(item);
            });
          } else {
            dataOperationlog = JSON.parse(res.payload);
          }
          this.dataOperationlog = dataOperationlog;
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'navConfig') {
      this.accountService.getNavConfigList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataNavConfig = JSON.parse(res.payload);
          console.log(this.dataNavConfig);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
      this.isSpinning = false;
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
      this.visiable.addRole = true;
      this.rolesItem.name = '';
      this.rolesItem.desc = '';
      this.resIdsArr.splice(0, this.resIdsArr.length );
    } else if (flag === 'modifyRole') {
      this.allCheckFalse(); // 清除所有所选状态
      this.roleId = data.id;
      this.visiable.modifyRole = true;
      this.rolesItem.name = data.name;
      this.rolesItem.desc = data.desc;
      if (data.platforms) {
        data.platforms.forEach(item => {  // 针对渠道进行遍历
          if (item === 'XIAOWU') {
            this.checkOptionsChannel[0].checked = true;
          } else if (item === 'LENZE') {
            this.checkOptionsChannel[1].checked = true;
          } else if (item === 'WATER_WORLD_6') {
            this.checkOptionsChannel[2].checked = true;
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
      this.visiable.addCustomer = true;
      this.customerItem = { realname: '', password: '', roleId: '', username: '' };
    } else if (flag === 'modifyCustomer') {
      this.customerId = data.id;
      this.visiable.modifyCustomer = true;
      this.customerItem.username = data.username;
      this.customerItem.password = data.password;
      this.customerItem.realname = data.realname;
      this.customerItem.roleId = data.roleId;
    } else if (flag === 'deleteCustomer') {
      this.modalService.confirm({
        nzTitle: '员工配置删除', nzContent: '确认要删除该员工配置吗？', nzCancelText: '取消',
        nzOnCancel: () => 1, nzOkText: '确定', nzOnOk: () => { this.doDelete(data, flag); }
      });
    } else if (flag === 'addNavConfig') {
      this.visiable.addNavConfig = true;
    } else if (flag === 'modifyNavConfig') {
      const arr = [];
      const file: any = { name: data.iconFileId };
      data.elements.forEach((item, index) => {
        arr.push({ name: item.name, description: item.description, iconFileId: item.iconFileId, fileList: [file], type: 'LINK', data: item.data, sort: index+1 })
      });
      this.navConfigItem = { id: data.id, name: data.name, order: data.order, iconFileId: data.iconFileId, fileList: [file], elements: arr };
      this.visiable.modifyNavConfig = true;
    } else if (flag === 'deleteNavConfig') {
      this.modalService.confirm({
        nzTitle: '导航页配置删除', nzContent: '确认要删除该导航页配置吗？', nzCancelText: '取消',
        nzOnCancel: () => 1, nzOkText: '确定', nzOnOk: () => { this.doDelete(data, flag); }
      });
    }
  }

  hideModal(flag): void {
    if (flag === 'addRole') {
      this.visiable.addRole = false;
    } else if (flag === 'modifyRole') {
      this.visiable.modifyRole = false;
    } else if (flag === 'addCustomer') {
      this.visiable.addCustomer = false;
    } else if (flag === 'modifyCustomer') {
      this.visiable.modifyCustomer = false;
    } else if (flag === 'addNavConfig') {
      this.navConfigItem = { id: '', name: '', order: 1, iconFileId: '', fileList: [], elements: [{name: '', description: '', iconFileId: '', fileList: [], type: 'LINK', data: '', sort: '' }]};
      this.visiable.addNavConfig = false;
    } else if (flag === 'modifyNavConfig') {
      this.navConfigItem = { id: '', name: '', order: 1, iconFileId: '', fileList: [], elements: [{name: '', description: '', iconFileId: '', fileList: [], type: 'LINK', data: '', sort: '' }]};
      this.visiable.modifyNavConfig = false;
    }
  }

  // 验证
  verification(flag, data) {
    let result = true;
    const MOBILE_REGEXP = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
    if (flag === 'addRole') {
      if (data.name === '') { this.modalService.error({ nzTitle: '提示', nzContent: '角色名称未填写' }); result = false; }
      if (data.platforms.length === 0) { this.modalService.error({ nzTitle: '提示', nzContent: '权限设置未选择' }); result = false; }
      if (data.resIds.length === 0) { this.modalService.error({ nzTitle: '提示', nzContent: '一级菜单二级菜单未选择' }); result = false; }
      this.dataRole.forEach(item => { // 去重
        if (item.name === data.name) { this.modalService.error({ nzTitle: '提示', nzContent: '角色名称与现有的角色名称有重复！' }); result = false; }
      });
    } else if (flag === 'modifyRole') {
      if (data.name === '') { this.modalService.error({ nzTitle: '提示', nzContent: '角色名称未填写' }); result = false; }
      if (data.platforms.length === 0) { this.modalService.error({ nzTitle: '提示', nzContent: '权限设置未选择' }); result = false; }
      if (data.resIds.length === 0) { this.modalService.error({ nzTitle: '提示', nzContent: '一级菜单二级菜单未选择' }); result = false; }
      this.dataRole.forEach(item => { // 去重
        if (this.roleId !== item.id) {
          if (item.name === data.name) { this.modalService.error({ nzTitle: '提示', nzContent: '角色名称与现有的角色名称有重复！' }); result = false; }
        }
      });
    } else if (flag === 'addCustomer') {
      if (data.username === '') { this.modalService.error({ nzTitle: '提示', nzContent: '员工账号未填写' }); result = false; }
      if (!MOBILE_REGEXP.test(data.username)) { this.modalService.error({ nzTitle: '提示', nzContent: '员工账号格式错误，必须为11位手机号！' }); result = false; }
      if (data.realname === '') { this.modalService.error({ nzTitle: '提示', nzContent: '员工姓名未填写' }); result = false; }
      if (data.password === '') { this.modalService.error({ nzTitle: '提示', nzContent: '登录密码未填写' }); result = false; }
      if (data.roleId === '') { this.modalService.error({ nzTitle: '提示', nzContent: '角色未选择' }); result = false; }
      this.dataRole.forEach(item => { // 去重
        if (item.name === data.username) { this.modalService.error({ nzTitle: '提示', nzContent: '员工账号与现有的员工账号有重复！' }); result = false; }
      });
    } else if (flag === 'modifyCustomer') {
      if (data.username === '') { this.modalService.error({ nzTitle: '提示', nzContent: '员工账号未填写' }); result = false; }
      if (!MOBILE_REGEXP.test(data.username)) { this.modalService.error({ nzTitle: '提示', nzContent: '员工账号格式错误，必须为11位手机号！' }); result = false; }
      if (data.realname === '') { this.modalService.error({ nzTitle: '提示', nzContent: '员工姓名未填写' }); result = false; }
      if (data.password === '') { this.modalService.error({ nzTitle: '提示', nzContent: '登录密码未填写' }); result = false; }
      if (data.roleId === '') { this.modalService.error({ nzTitle: '提示', nzContent: '角色未选择' }); result = false; }
      this.dataRole.forEach(item => { // 去重
        if (this.customerId !== item.id) {
          if (item.name === data) { this.modalService.error({ nzTitle: '提示', nzContent: '员工账号与现有的员工账号有重复！' }); result = false; }
        }
      });
    } else if (flag === 'navConfig') {
      if (data.name === '') { this.modalService.error({ nzTitle: '提示', nzContent: '类别名称未填写' }); result = false; }
      if (data.order === '') { this.modalService.error({ nzTitle: '提示', nzContent: '类别排序未填写' }); result = false; }
      if (data.iconFileId === '') { this.modalService.error({ nzTitle: '提示', nzContent: 'icon配置图未上传' }); result = false; }
      if (data.name === '') { this.modalService.error({ nzTitle: '提示', nzContent: '类别名称未填写' }); result = false; }
      if (data.name === '') { this.modalService.error({ nzTitle: '提示', nzContent: '类别名称未填写' }); result = false; }
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
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
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
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
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
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
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
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
      this.hideModal('modifyCustomer');
    } else if (flag === 'addNavConfig') {
      const arr = [];
      this.navConfigItem.elements = this.navConfigItem.elements.sort(this.sortBySort); // 处理排序
      this.navConfigItem.elements.forEach(item => {
        arr.push({ data: item.data, description: item.description, iconFileId: item.iconFileId, name: item.name, type: "LINK" });
      });
      const addItem = { name: this.navConfigItem.name, order: this.navConfigItem.order, iconFileId: this.navConfigItem.iconFileId, elements: JSON.stringify(arr), };
      console.log(addItem);
      if (!this.verification('navConfig', addItem)) { return; } // 去重
      this.accountService.addNavConfigList(addItem).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '权限后台', op_page: '导航页配置', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('navConfig');
          this.hideModal('addNavConfig');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'modifyNavConfig') {
      const arr = [];
      this.navConfigItem.elements = this.navConfigItem.elements.sort(this.sortBySort); // 处理排序
      this.navConfigItem.elements.forEach(item => {
        arr.push({ data: item.data, description: item.description, iconFileId: item.iconFileId, name: item.name, type: "LINK" });
      });
      const modifyItem = { id: this.navConfigItem.id, name: this.navConfigItem.name, order: this.navConfigItem.order, iconFileId: this.navConfigItem.iconFileId, elements: JSON.stringify(arr), };
      console.log(modifyItem);
      if (!this.verification('navConfig', modifyItem)) { return; } // 去重
      this.accountService.modifyNavConfigList(modifyItem).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '权限后台', op_page: '导航页配置', op_name: '修改' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('navConfig');
          this.hideModal('modifyNavConfig');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  // 全选/全不选
  updateAllChecked(flag): void {
    if (flag === 'flag1') { this.allChecked1 ? this.checkOptions1.forEach(item => item.checked = true) : this.checkOptions1.forEach(item => item.checked = false); }
    if (flag === 'flag2') { this.allChecked2 ? this.checkOptions2.forEach(item => item.checked = true) : this.checkOptions2.forEach(item => item.checked = false); }
    if (flag === 'flag3') { this.allChecked3 ? this.checkOptions3.forEach(item => item.checked = true) : this.checkOptions3.forEach(item => item.checked = false); }
    if (flag === 'flag4') { this.allChecked4 ? this.checkOptions4.forEach(item => item.checked = true) : this.checkOptions4.forEach(item => item.checked = false); }
    if (flag === 'flag5') { this.allChecked5 ? this.checkOptions5.forEach(item => item.checked = true) : this.checkOptions5.forEach(item => item.checked = false); }
    if (flag === 'flag6') { this.allChecked6 ? this.checkOptions6.forEach(item => item.checked = true) : this.checkOptions6.forEach(item => item.checked = false); }
    if (flag === 'flag7') { this.allChecked7 ? this.checkOptions7.forEach(item => item.checked = true) : this.checkOptions7.forEach(item => item.checked = false); }
    if (flag === 'flag8') { this.allChecked8 ? this.checkOptions8.forEach(item => item.checked = true) : this.checkOptions8.forEach(item => item.checked = false); }
    if (flag === 'flag9') { this.allChecked9 ? this.checkOptions9.forEach(item => item.checked = true) : this.checkOptions9.forEach(item => item.checked = false); }
    if (flag === 'flag10') { this.allChecked10 ? this.checkOptions10.forEach(item => item.checked = true) : this.checkOptions10.forEach(item => item.checked = false); }
    if (flag === 'flag11') { this.allChecked11 ? this.checkOptions11.forEach(item => item.checked = true) : this.checkOptions11.forEach(item => item.checked = false); }
  }

  // 去除所有的多选
  private allCheckFalse(): void {
    this.allChecked1 = false; this.allChecked2 = false; this.allChecked3 = false; this.allChecked5 = false; this.allChecked4 = false;
    this.allChecked6 = false; this.allChecked6 = false; this.allChecked7 = false; this.allChecked8 = false; this.allChecked9 = false;
    this.allChecked10 = false; this.allChecked11 = false;
    this.checkOptions1 = []; this.checkOptions2 = []; this.checkOptions3 = []; this.checkOptions4 = []; this.checkOptions5 = [];
    this.checkOptions6 = []; this.checkOptions7 = []; this.checkOptions8 = []; this.checkOptions9 = []; this.checkOptions10 = [];
    this.checkOptions11 = [];
    this.allMenu = [];  // 清空
    this.dataResource.forEach((item, i) => {
      if (i === 1) { this.allMenu.push({name: item.name, id: item.id}); item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions1.push(unit); }); }
      if (i === 2) { this.allMenu.push({name: item.name, id: item.id}); item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions2.push(unit); }); }
      if (i === 3) { this.allMenu.push({name: item.name, id: item.id}); item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions3.push(unit); }); }
      if (i === 4) { this.allMenu.push({name: item.name, id: item.id}); item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions4.push(unit); }); }
      if (i === 5) { this.allMenu.push({name: item.name, id: item.id}); item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions5.push(unit); }); }
      if (i === 6) { this.allMenu.push({name: item.name, id: item.id}); item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions6.push(unit); }); }
      if (i === 7) { this.allMenu.push({name: item.name, id: item.id}); item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions7.push(unit); }); }
      if (i === 8) { this.allMenu.push({name: item.name, id: item.id}); item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions8.push(unit); }); }
      if (i === 9) { this.allMenu.push({name: item.name, id: item.id}); item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions9.push(unit); }); }
      if (i === 10) { this.allMenu.push({name: item.name, id: item.id}); item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions10.push(unit); }); }
      if (i === 11) { this.allMenu.push({name: item.name, id: item.id}); item.children.forEach(cell => { const unit = { label: cell.name, value: cell.id }; this.checkOptions11.push(unit); }); }
    });
    this.checkOptionsChannel = [
      { label: '你好小悟', value: 'XIAOWU', checked: false },
      { label: '听听同学', value: 'LENZE', checked: false },
      { label: '沃特沃德6', value: 'WATER_WORLD_6', checked: false }
    ];
  }
  /* 权限配置 */

  // 删除操作
  doDelete(data, flag) {
    if (flag === 'deleteRole') {
      this.accountService.deleteRole(data).subscribe(res => {  // 删除角色
        if (res.retcode === 0) {
          if (res.payload === 'true') {
            this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
            const operationInput = { op_category: '权限后台', op_page: '权限配置', op_name: '删除' };
            this.commonService.updateOperationlog(operationInput).subscribe();
            this.loadData('role');
          } else {
            this.notification.error( '提示', '该角色下有员工账号，无法删除', { nzStyle: { color : 'red' } });
          }
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
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
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'deleteNavConfig') {
      this.accountService.deleteNavConfig(data).subscribe(res => {  // 删除用户
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '权限后台', op_page: '导航页配置', op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('navConfig');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  // 切换面板
  changePanel(flag): void {
    if (flag !== this.currentPanel) { this.loadData(flag); }
    this.currentPanel = flag;
    const operationInput = { op_category: '权限后台', op_page: flag === 'role' ? '权限配置' : flag === 'customer' ? '员工配置' : flag === 'operationlog' ? '操作日志' : flag === 'navConfig' ? '导航页配置' : '', op_name: '访问' };
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
      if (result[0] !== '' || result[1] !== '') {
        if (this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss') === this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss')) {
          this.beginDate = this.datePipe.transform(result[0], 'yyyy-MM-dd' + ' 00:00:00');
          this.endDate = this.datePipe.transform(result[1], 'yyyy-MM-dd' + ' 23:59:59');
        } else {
          this.beginDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss');
          this.endDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
        }
      }
      // if (this.beginDate.indexOf('null') > -1) { this.beginDate = ''; this.endDate = ''; }  // 处理有null的情况
    } else if (flag === 'addNavConfigItem') {
      this.navConfigItem.elements.push({name: '', description: '', iconFileId: '', fileList: [], type: 'LINK', data: '', sort: '' });
    } else if (flag === 'removeNavConfigItem') {
      this.navConfigItem.elements.splice(result, 1);
    }
  }

  // 获取一、二级菜单
  getResArr() {
    const finalArr = [];
    const arr1 = [], arr2 = [], arr3 = [], arr4 = [], arr5 = [], arr6 = [], arr7 = [], arr8 = [], arr9 = [], arr10 = [], arr11 = [];
    this.checkOptions1.forEach(item => { if (item.checked) { finalArr.push(item.value); arr1.push(item.id); } });
    this.checkOptions2.forEach(item => { if (item.checked) { finalArr.push(item.value); arr2.push(item.id); } });
    this.checkOptions3.forEach(item => { if (item.checked) { finalArr.push(item.value); arr3.push(item.id); } });
    this.checkOptions4.forEach(item => { if (item.checked) { finalArr.push(item.value); arr4.push(item.id); } });
    this.checkOptions5.forEach(item => { if (item.checked) { finalArr.push(item.value); arr5.push(item.id); } });
    this.checkOptions6.forEach(item => { if (item.checked) { finalArr.push(item.value); arr6.push(item.id); } });
    this.checkOptions7.forEach(item => { if (item.checked) { finalArr.push(item.value); arr7.push(item.id); } });
    this.checkOptions8.forEach(item => { if (item.checked) { finalArr.push(item.value); arr8.push(item.id); } });
    this.checkOptions9.forEach(item => { if (item.checked) { finalArr.push(item.value); arr9.push(item.id); } });
    this.checkOptions10.forEach(item => { if (item.checked) { finalArr.push(item.value); arr10.push(item.id); } });
    this.checkOptions11.forEach(item => { if (item.checked) { finalArr.push(item.value); arr11.push(item.id); } });
    if (arr1.length > 0) { finalArr.push(this.allMenu[0].id); }
    if (arr2.length > 0) { finalArr.push(this.allMenu[1].id); }
    if (arr3.length > 0) { finalArr.push(this.allMenu[2].id); }
    if (arr4.length > 0) { finalArr.push(this.allMenu[3].id); }
    if (arr5.length > 0) { finalArr.push(this.allMenu[4].id); }
    if (arr6.length > 0) { finalArr.push(this.allMenu[5].id); }
    if (arr7.length > 0) { finalArr.push(this.allMenu[6].id); }
    if (arr8.length > 0) { finalArr.push(this.allMenu[7].id); }
    if (arr9.length > 0) { finalArr.push(this.allMenu[8].id); }
    if (arr10.length > 0) { finalArr.push(this.allMenu[9].id); }
    if (arr11.length > 0) { finalArr.push(this.allMenu[10].id); }
    return finalArr;
  }

  // 设置具体哪些勾选的权限
  setResArr(data) {
    data.forEach(element => {
      this.checkOptions1.forEach(item => { if (item.value === element) { item.checked = true; } });
      this.checkOptions2.forEach(item => { if (item.value === element) { item.checked = true; } });
      this.checkOptions3.forEach(item => { if (item.value === element) { item.checked = true; } });
      this.checkOptions4.forEach(item => { if (item.value === element) { item.checked = true; } });
      this.checkOptions5.forEach(item => { if (item.value === element) { item.checked = true; } });
      this.checkOptions6.forEach(item => { if (item.value === element) { item.checked = true; } });
      this.checkOptions7.forEach(item => { if (item.value === element) { item.checked = true; } });
      this.checkOptions8.forEach(item => { if (item.value === element) { item.checked = true; } });
      this.checkOptions9.forEach(item => { if (item.value === element) { item.checked = true; } });
      this.checkOptions10.forEach(item => { if (item.value === element) { item.checked = true; } });
    });
  }

  // 点击switch
  clickSwitch(data, flag) {
    if (flag === 'navConfig') {
      const switchInput = { 'id': data.id };
      this.accountService.updateNavConfigSwitch(switchInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '权限后台', op_page: '导航页配置', op_name: '启用/不启用' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
        this.loadData('navConfig');
      });
    }
  }

  // 用于区分是哪种上传
  beforeUploadBut(flag) {
    this.currentFile = flag;
  }

  // 上传image
  beforeUpload = (file: UploadFile): boolean => {
    console.log(file);
    if (this.currentPanel !== 'taskCenter') {
      const suffix = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
      const isPng = suffix === '.png' || suffix === '.jpeg' || suffix === '.jpg' || suffix === '.ico' ? true : false;
      const isMoreThanTen = file.size < 512000 ? true : false;
      if (!isPng) {
        this.msg.error('您只能上传.png、.jpeg、.jpg、.ico、文件');
      } else if (!isMoreThanTen) {
        this.msg.error('您只能上传不超过500K文件');
      } else {
        if (this.currentFile === 'list') {
          this.navConfigItem.fileList.push(file);
        } else {
          const num = Number(this.currentFile);
          this.navConfigItem.elements.forEach((item, index) => {
            if (index === num) { item.fileList.push(file); }
          })
        }
        this.handleUpload();
      }
    }
    return false;
  }

  // 点击上传
  handleUpload(): void {
    let url = '';
    let flag = '';
    switch (this.currentPanel) {
      case 'navConfig': url = `/shortcut/resources/icons`; flag = 'file'; break;
      default: break;
    }
    // 文件数量不可超过1个，超过一个则提示
    if (this.navConfigItem.fileList.length > 1) { this.notification.error( '提示', '您上传的文件超过一个！' ); return; }
    const formData = new FormData();
    if (this.currentFile === 'list') {
      this.navConfigItem.fileList.forEach((file: any) => {formData.append(flag, file);});
    } else {
      const num = Number(this.currentFile);
      this.navConfigItem.elements.forEach((item, index) => {
        if (index === num) { item.fileList.forEach((file: any) => {formData.append(flag, file);}); }
      })
    }
    // const baseUrl = this.commonService.baseUrl;
    const baseUrl = 'http://account-center-test.chewrobot.com/api/test';
    const req = new HttpRequest('POST', `${baseUrl}${url}`, formData, {
      reportProgress: true, headers: new HttpHeaders({'Authorization': localStorage.getItem('token')})
    });
    this.http.request(req).pipe(filter(e => e instanceof HttpResponse))
      .subscribe((event: HttpResponse<{ code: any, data: any, msg: any }> | any) => {
        if (event.body.retcode === 0) {
          console.log(event);
          if (this.currentFile === 'list') {
            this.navConfigItem.iconFileId = event.body.payload;
          } else {
            const num = Number(this.currentFile);
            this.navConfigItem.elements.forEach((item, index) => {
              if (index === num) { item.iconFileId = event.body.payload; }
            })
          }
          this.notification.success( '提示', '上传成功' );
          const operationInput = { op_category: '权限后台', op_page: '导航页配置', op_name: '上传图片' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: event.body.message, }); }
        formData.delete(flag);
      },
      err => { formData.delete(flag); }
    );
  }

  // 根据sort排序
  sortBySort(a, b) { return a.sort - b.sort; }
}
