import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalService, NzNotificationService, UploadFile } from 'ng-zorro-antd';
import { CommonService } from '../public/service/common.service';
import { JiaoyouService } from '../public/service/jiaoyou.service';
import { ConsumerService } from '../public/service/consumer.service';

registerLocaleData(zh);
export interface TreeNodeInterface {
  id: number;
  name: string;
  parentId: number;
  level: number;
  expand: boolean;
  children?: TreeNodeInterface[];
}

@Component({
  selector: 'app-jiaoyou',
  templateUrl: './jiaoyou.component.html',
  styleUrls: ['./jiaoyou.component.scss']
})
export class JiaoyouComponent implements OnInit {

  visiable = {addFree: false, editFree: false, addPay: false, editPay: false, addSkill: false, };
  freeData = [];
  dataFree = {id: '', appChannelIds: '', channelType: 'CUSTOMER', freeCount: '', freeMode: 'BY_ACCOUNT'};
  payData = [];
  dataPay = {id: '', appChannelId: '', freeCount: '', freeMode: 'BY_ACCOUNT', single: '', skillName: '', skillPrice: '', tempSkillPrice: '', skillTypeId: '' };
  skillData = [];
  dataSkill = {skillTypeIds: ''};
  searchFreeForm: FormGroup;
  searchPayForm: FormGroup;
  searchSkillForm: FormGroup;
  checkFreeOptions = [];
  checkPayOptions = [];
  isSpinning = false;
  beginFreeDate = '';
  endFreeDate = '';
  beginPayDate = '';
  endPayDate = '';
  beginSkillDate = '';
  endSkillDate = '';
  currentPanel = 'free';
  tabsetJson = { currentNum: 0, param: '' };
  appChannelId = ''; // 免费配资跳付费配置传值

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private modalService: NzModalService,
    private jiaoyouService: JiaoyouService,
    private notification: NzNotificationService,
    private datePipe: DatePipe,
    private msg: NzMessageService,
  ) {
    this.commonService.nav[13].active = true;
    this._initForm();
  }

  ngOnInit() {
    const tabFlag = [{label: '免费配置', value: 'free'}, {label: '付费配置', value: 'pay'},
        {label: '用户反馈', value: 'free'},];
    let targetFlag = 0;
    for (let i = 0; i < tabFlag.length; i++) {
      if (this.commonService.haveMenuPermission('children', tabFlag[i].label)) {targetFlag = i; break; }
    }
    console.log(tabFlag[targetFlag].value);
    this.loadData(tabFlag[targetFlag].value);
    this.changePanel(tabFlag[targetFlag].value);
  }

  loadData(flag) {
    this.isSpinning = true;
    if (flag === 'free') {
      const freeInput = {
        startTime: this.beginFreeDate, endTime: this.endFreeDate,
        appChannelId: this.searchFreeForm.controls['appChannelId'].value,
      };
      this.jiaoyouService.getFreeList(freeInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.freeData = JSON.parse(res.payload);
          console.log(this.freeData);
          const operationInput = { op_category: '交游天下', op_page: '免费配置', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'pay') {
      const payInput = {
        startTime: this.beginPayDate, endTime: this.endPayDate,
        skillName: this.searchPayForm.controls['skillName'].value,
        appChannelId: this.appChannelId,
      };
      this.jiaoyouService.getPayList(payInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.payData = JSON.parse(res.payload);
          this.payData.map(item => {
            item.single = item.skillPrice[0];
            let result = [];
            Object.keys(item.skillPrice).forEach(cell => {
              if (cell !== '0') {
                result.push(cell + '/' + item.skillPrice[cell]);
              }
            })
            item.multiple = result.join(',');
          });
          console.log(this.payData);
          const operationInput = { op_category: '交游天下', op_page: '付费配置', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'freeChannel') {
      this.checkFreeOptions = []; // 清空
      this.jiaoyouService.getFreeChannelList(this.dataFree.channelType).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          JSON.parse(res.payload).forEach(item => {
            this.checkFreeOptions.push({ label: item, value: item });
          });
          console.log(this.checkFreeOptions);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'payChannel') {
      this.checkPayOptions.length = 0;
      this.jiaoyouService.getPayChannelList(this.dataPay.skillTypeId).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          console.log(JSON.parse(res.payload));
          JSON.parse(res.payload).forEach(item => {
            this.checkPayOptions.push({ label: item.appChannelId, value: item.appChannelId, freeMode: item.freeMode });
          });
          console.log(this.checkPayOptions);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'skill') {
      const skillInput = {
        startTime: this.beginSkillDate, endTime: this.endSkillDate,
        skillTypeId: this.searchSkillForm.controls['skillTypeId'].value
      };
      this.jiaoyouService.getSkillList(skillInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.skillData = JSON.parse(res.payload).reverse();
          console.log(this.skillData);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  // 弹窗
  showModal(flag, data) {
    if (flag === 'addFree') {
      this.loadData('freeChannel');
      this.visiable.addFree = true;
    } else if (flag === 'editFree') {
      this.dataFree = data;
      this.dataFree.appChannelIds = data.appChannelId;
      this.visiable.editFree = true;
    } else if (flag === 'addPay') {
      this.loadData('skill');
      this.visiable.addPay = true;
    } else if (flag === 'editPay') {
      this.dataPay = data;
      this.loadData('skill');
      this.dataPay.appChannelId = data.appChannelId;
      this.dataPay.tempSkillPrice = data.skillPrice;
      let skillPrice = [];
      let keys = Object.keys(this.dataPay.skillPrice);
      this.dataPay.single = this.dataPay.skillPrice[0];
      keys.forEach(item => {
        item !== '0' ? skillPrice.push(item + ','+ this.dataPay.skillPrice[item]) : null;
      });
      this.dataPay.skillPrice = skillPrice.join('\n');
      console.log(this.dataPay);
      this.visiable.editPay = true;
    } else if (flag === 'deleteFree' || flag === 'deletePay') {
      this.modalService.confirm({
        nzTitle: '确认删除', nzContent: '确认删除该信息吗？', nzCancelText: '取消',
        nzOnCancel: () => 1, nzOkText: '确定', nzOnOk: () => { this.doSomething(data, flag); }
      });
    } else if (flag === 'goPay') {
      this.modalService.confirm({
        nzTitle: '修改付费配置提醒', nzContent: `您修改了${data}渠道的免费方式，您可能需要修改该渠道下游戏的付费配置，现在去修改吗？`, nzCancelText: '取消',
        nzOnCancel: () => 1, nzOkText: '确定', nzOnOk: () => { this.doSomething(data, flag); }
      });
    } else if (flag === 'addSkill') {
      this.loadData('skill');
      this.visiable.addSkill = true;
    }
  }

  // doSomething
  doSomething(data, flag) {
    if (flag === 'deleteFree') {
      this.jiaoyouService.deleteFree(data.id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '交游天下', op_page: '免费配置', op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('free');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag == 'deletePay') {
      this.jiaoyouService.deletePay(data.id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '交游天下', op_page: '付费配置', op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('pay');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag == 'goPay') {
      console.log(data);
      this.appChannelId = data;
      setTimeout(() => { this.loadData('pay'); }, 1000);
      this.tabsetJson.currentNum = 2;
    }
  }

  // 隐藏
  hideModal(flag) {
    if (flag === 'addFree') {
      this.dataFree = {id: '', appChannelIds: '', channelType: 'CUSTOMER', freeCount: '', freeMode: 'BY_ACCOUNT'};
      this.checkFreeOptions = [];
      this.loadData('free');
      this.visiable.addFree = false;
    } else if (flag === 'editFree') {
      this.dataFree = {id: '', appChannelIds: '', channelType: 'CUSTOMER', freeCount: '', freeMode: 'BY_ACCOUNT'};
      this.loadData('free');
      this.visiable.editFree = false;
    } else if (flag === 'addPay') {
      this.dataPay = {id: '', appChannelId: '', freeCount: '', freeMode: 'BY_ACCOUNT', single: '', skillName: '', skillPrice: '', tempSkillPrice: '', skillTypeId: '' };
      this.checkPayOptions = [];
      this.loadData('pay');
      this.visiable.addPay = false;
    } else if (flag === 'editPay') {
      this.dataPay = {id: '', appChannelId: '', freeCount: '', freeMode: 'BY_ACCOUNT', single: '', skillName: '', skillPrice: '', tempSkillPrice: '', skillTypeId: '' };
      this.loadData('pay');
      this.visiable.editPay = false;
    } else if (flag === 'addSkill') {
      // this.dataPay = {id: '', appChannelId: '', freeCount: '', freeMode: 'BY_ACCOUNT', single: '', skillName: '', skillPrice: '', tempSkillPrice: '' };
      // this.loadData('skill');
      this.visiable.addSkill = false;
    }
  }

  // 封装验证新增
  verification(flag, data): boolean {
    let result = true;
    if (flag === 'addFree') {
      if (data.appChannelIds.length === 0) { this.modalService.error({ nzTitle: '提示', nzContent: '未选择渠道名称' }); result = false; }
      if (data.freeMode === 'BY_ACCOUNT') {
        if (data.freeCount === '') { this.modalService.error({ nzTitle: '提示', nzContent: '未填写免费次数' }); result = false; }
      }
    }
    if (flag === 'addPay') {
      if (data.skillName === '') { this.modalService.error({ nzTitle: '提示', nzContent: '未填写付费技能名称' }); result = false; }
      if (data.appChannelId === '') { this.modalService.error({ nzTitle: '提示', nzContent: '未选择渠道名称' }); result = false; }
      if (this.dataPay.single === '') { this.modalService.error({ nzTitle: '提示', nzContent: '未填写单次进入游戏的价格' }); result = false; }
      if (this.dataPay.skillPrice === '') { this.modalService.error({ nzTitle: '提示', nzContent: '未填写周期进入定价' }); result = false; }
    }
    return result;
  }

  // 新增操作
  doSave(flag, data): void {
    if (flag === 'addFree') {
      let appChannelIds = [];
      appChannelIds = this.checkFreeOptions.filter(item => item.checked === true).map(cell => cell.value);
      const freeInput = { appChannelIds: appChannelIds, channelType: this.dataFree.channelType, freeCount: this.dataFree.freeCount, freeMode: this.dataFree.freeMode };
      if (!this.verification(flag, freeInput)) { return; }
      console.log(freeInput);
      this.jiaoyouService.addFree(freeInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '交游天下', op_page: '免费配置', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('addFree');
          this.loadData('free');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'editFree') {
      const freeInput = { freeCount: this.dataFree.freeCount, freeMode: this.dataFree.freeMode, id: this.dataFree.id };
      console.log(freeInput);
      this.jiaoyouService.modifyFree(freeInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '交游天下', op_page: '免费配置', op_name: '修改' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          const appChannelId = this.dataFree.appChannelIds;
          this.showModal('goPay', appChannelId);
          this.hideModal('editFree');
          this.loadData('free');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'addPay') {
      let tempArr = [];
      tempArr = this.dataPay.skillPrice.split('\n');
      const tempJson = {};
      tempJson[0 + ''] = Number(this.dataPay.single);
      for (let i = 0; i < tempArr.length; i++) {
        tempJson[tempArr[i].split(',')[0] + ''] = Number(tempArr[i].split(',')[1]);
      }
      const payInput = { appChannelId: this.dataPay.appChannelId, freeCount: this.dataPay.freeCount, freeMode: this.dataPay.freeMode, skillName: this.dataPay.skillName, skillPrice: tempJson, skillTypeId: this.dataPay.skillTypeId };
      payInput.freeCount === '' || payInput.freeMode === 'BY_ACCOUNT' ? delete payInput.freeCount : null;
      if (!this.verification(flag, payInput)) { return; }
      console.log(payInput);
      this.jiaoyouService.addPay(payInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '交游天下', op_page: '付费配置', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('addPay');
          this.loadData('pay');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'editPay') {
      let tempArr = [];
      tempArr = this.dataPay.skillPrice.split('\n');
      const tempJson = {};
      tempJson[0 + ''] = Number(this.dataPay.single);
      for (let i = 0; i < tempArr.length; i++) {
        tempJson[tempArr[i].split(',')[0] + ''] = Number(tempArr[i].split(',')[1]);
      }
      const payInput = { id: this.dataPay.id, freeCount: this.dataPay.freeCount, freeMode: this.dataPay.freeMode, skillPrice: tempJson };
      payInput.freeCount === '' || payInput.freeMode === 'BY_ACCOUNT' ? delete payInput.freeCount : null;
      payInput.freeMode === 'BY_ACCOUNT' ? delete payInput.freeMode : null;
      console.log(payInput);
      this.jiaoyouService.modifyPay(payInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '交游天下', op_page: '付费配置', op_name: '修改' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('editPay');
          this.loadData('pay');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'addSkill') {
      const skillInput = this.dataSkill.skillTypeIds.split('\n');
      // if (!this.verification(flag, skillInput)) { return; }
      console.log(skillInput);
      this.jiaoyouService.addSkill(skillInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '交游天下', op_page: '付费技能', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('addSkill');
          this.loadData('skill');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  private _initForm(): void {
    this.searchFreeForm = this.fb.group({ appChannelId: [''], date: [''], });
    this.searchPayForm = this.fb.group({ skillName: [''], appChannelId: [''], date: [''], });
    this.searchSkillForm = this.fb.group({ skillTypeId: [''], date: [''], });
  }

  // 日期插件
  onChange(result, flag) {
    if (flag === 'free') {  // 基本信息的活动时间
      if (result === []) { this.beginFreeDate = ''; this.endFreeDate = ''; return; }
      if (result[0] !== '' || result[1] !== '') {
        if (this.datePipe.transform(result[0], 'HH:mm:ss') === this.datePipe.transform(result[1], 'HH:mm:ss')) {
          this.beginFreeDate = this.datePipe.transform(result[0], 'yyyy-MM-dd' + ' 00:00:00'); this.endFreeDate = this.datePipe.transform(result[1], 'yyyy-MM-dd' + ' 23:59:59');
        } else {
          this.beginFreeDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss'); this.endFreeDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
        }
      }
    } else if (flag === 'pay') {  // 基本信息的活动时间
      if (result === []) { this.beginPayDate = ''; this.endPayDate = ''; return; }
      if (result[0] !== '' || result[1] !== '') {
        if (this.datePipe.transform(result[0], 'HH:mm:ss') === this.datePipe.transform(result[1], 'HH:mm:ss')) {
          this.beginPayDate = this.datePipe.transform(result[0], 'yyyy-MM-dd' + ' 00:00:00'); this.endPayDate = this.datePipe.transform(result[1], 'yyyy-MM-dd' + ' 23:59:59');
        } else {
          this.beginPayDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss'); this.endPayDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
        }
      }
    } else if (flag === 'skill') {  // 付费技能的活动时间
      if (result === []) { this.beginSkillDate = ''; this.endSkillDate = ''; return; }
      if (result[0] !== '' || result[1] !== '') {
        if (this.datePipe.transform(result[0], 'HH:mm:ss') === this.datePipe.transform(result[1], 'HH:mm:ss')) {
          this.beginSkillDate = this.datePipe.transform(result[0], 'yyyy-MM-dd' + ' 00:00:00'); this.endSkillDate = this.datePipe.transform(result[1], 'yyyy-MM-dd' + ' 23:59:59');
        } else {
          this.beginSkillDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss'); this.endSkillDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
        }
      }
    } else if (flag === 'freeMode') {
      this.dataPay.freeMode = result.freeMode;
    } else if (flag === 'skillMode') {
      this.dataPay.skillTypeId = result.skillTypeId;
      this.loadData('payChannel');
    }
  }

  // 切换面板
  changePanel(flag): void {
    if (flag !== this.currentPanel) {this.loadData(flag); }
    this.currentPanel = flag;
    const operationInput = {
      op_category: '交游天下',
      op_page: flag === 'free' ? '免费配置' : flag === 'user' ? '付费配置' : '',
      op_name: '访问'
    };
    this.commonService.updateOperationlog(operationInput).subscribe();
  }

  // 跳转编辑器
  goEditor() { window.open(`/markdown`); }

  // 展开/收缩
  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.id === d.id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  // 转换树结构为列表
  convertTreeToList(root: object): TreeNodeInterface[] {
    const stack: any[] = [];
    const array: any[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });
    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level + 1, expand: false, parent: node });
        }
      }
    }
    return array;
  }

  // 访问树状图
  visitNode(node: TreeNodeInterface, hashMap: { [id: string]: any }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }
}
