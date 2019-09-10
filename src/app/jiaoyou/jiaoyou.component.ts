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

  visiable = {addFree: false, editFree: false, addPay: false, editPay: false, };
  freeData = [];
  dataFree = {id: '', appChannelIds: '', channelType: 'CUSTOMER', freeCount: '', freeMode: 'BY_ACCOUNT', appCheck: [
    { label: 'XIAOWU-App Store', value: 'IOS', checked: false },
    { label: 'XIAOWU-Android', value: 'ANDROID', checked: false },
  ]};
  payData = [];
  dataPay = {id: '', appChannelId: '', freeCount: '', freeMode: 'BY_ACCOUNT', single: '', gameName: '', gamePrice: '', tempGamePrice: '' };
  searchFreeForm: FormGroup;
  searchPayForm: FormGroup;
  checkFreeOptions = [];
  checkPayOptions = [];
  isSpinning = false;
  beginFreeDate = '';
  endFreeDate = '';
  beginPayDate = '';
  endPayDate = '';
  currentPanel = 'free';

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
        gameName: this.searchPayForm.controls['gameName'].value,
        appChannelId: this.searchPayForm.controls['appChannelId'].value,
      };
      this.jiaoyouService.getPayList(payInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.payData = JSON.parse(res.payload);
          this.payData.map(item => {
            item.single = item.gamePrice[0];
            let result = [];
            Object.keys(item.gamePrice).forEach(cell => {
              if (cell !== '0') {
                result.push(cell + '/' + item.gamePrice[cell]);
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
      this.jiaoyouService.getFreeChannelList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          JSON.parse(res.payload).forEach(item => {
            this.checkFreeOptions.push({ label: item, value: item });
          });
          console.log(this.checkFreeOptions);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'payChannel') {
      this.jiaoyouService.getPayChannelList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          console.log(JSON.parse(res.payload));
          JSON.parse(res.payload).forEach(item => {
            this.checkPayOptions.push({ label: item.appChannel, value: item.appChannel, freeMode: item.freeMode });
          });
          console.log(this.checkPayOptions);
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
      this.dataFree.appChannelIds = data.appChannel;
      this.visiable.editFree = true;
    } else if (flag === 'addPay') {
      this.loadData('payChannel');
      this.visiable.addPay = true;
    } else if (flag === 'editPay') {
      this.dataPay = data;
      this.dataPay.appChannelId = data.appChannel;
      this.dataPay.tempGamePrice = data.gamePrice;
      let gamePrice = [];
      let keys = Object.keys(this.dataPay.gamePrice);
      this.dataPay.single = this.dataPay.gamePrice[0];
      keys.forEach(item => {
        item !== '0' ? gamePrice.push(item + ','+ this.dataPay.gamePrice[item]) : null;
      });
      this.dataPay.gamePrice = gamePrice.join('\n');
      console.log(this.dataPay);
      this.visiable.editPay = true;
    } else if (flag === 'deleteFree' || flag === 'deletePay') {
      this.modalService.confirm({
        nzTitle: '确认删除', nzContent: '确认删除该信息吗？', nzCancelText: '取消',
        nzOnCancel: () => 1, nzOkText: '确定', nzOnOk: () => { this.doSomething(data, flag); }
      });
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
    }
  }

  // 隐藏
  hideModal(flag) {
    if (flag === 'addFree') {
      this.dataFree = {id: '', appChannelIds: '', channelType: 'CUSTOMER', freeCount: '', freeMode: 'BY_ACCOUNT', appCheck: [
        { label: 'XIAOWU-App Store', value: 'IOS', checked: false },
        { label: 'XIAOWU-Android', value: 'ANDROID', checked: false },
      ]};
      this.checkFreeOptions = [];
      this.loadData('free');
      this.visiable.addFree = false;
    } else if (flag === 'editFree') {
      this.dataFree = {id: '', appChannelIds: '', channelType: 'CUSTOMER', freeCount: '', freeMode: 'BY_ACCOUNT', appCheck: [
        { label: 'XIAOWU-App Store', value: 'IOS', checked: false },
        { label: 'XIAOWU-Android', value: 'ANDROID', checked: false },
      ]};
      this.loadData('free');
      this.visiable.editFree = false;
    } else if (flag === 'addPay') {
      this.dataPay = {id: '', appChannelId: '', freeCount: '', freeMode: 'BY_ACCOUNT', single: '', gameName: '', gamePrice: '', tempGamePrice: '' };
      this.checkPayOptions = [];
      this.loadData('pay');
      this.visiable.addPay = false;
    } else if (flag === 'editPay') {
      this.dataPay = {id: '', appChannelId: '', freeCount: '', freeMode: 'BY_ACCOUNT', single: '', gameName: '', gamePrice: '', tempGamePrice: '' };
      this.loadData('pay');
      this.visiable.editPay = false;
    }
  }

  // 新增操作
  doSave(flag, data): void {
    if (flag === 'addFree') {
      let appChannelIds = [];
      if (this.dataFree.channelType === 'CUSTOMER') {
        appChannelIds = this.checkFreeOptions.filter(item => item.checked === true).map(cell => cell.value);
      } else if (this.dataFree.channelType === 'XIAOWU') {
        appChannelIds = this.dataFree.appCheck.filter(item => item.checked === true).map(cell => cell.value);
      }
      const freeInput = { appChannelIds: appChannelIds, channelType: this.dataFree.channelType, freeCount: this.dataFree.freeCount, freeMode: this.dataFree.freeMode };
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
          this.hideModal('editFree');
          this.loadData('free');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'addPay') {
      let tempArr = [];
      tempArr = this.dataPay.gamePrice.split('\n');
      const tempJson = {};
      tempJson[0 + ''] = Number(this.dataPay.single);
      for (let i = 0; i < tempArr.length; i++) {
        tempJson[tempArr[i].split(',')[0] + ''] = Number(tempArr[i].split(',')[1]);
      }
      const payInput = { appChannelId: this.dataPay.appChannelId, freeCount: this.dataPay.freeCount, freeMode: this.dataPay.freeMode, gameName: this.dataPay.gameName, gamePrice: tempJson };
      payInput.freeCount === '' || payInput.freeMode === 'BY_ACCOUNT' ? delete payInput.freeCount : null;
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
      tempArr = this.dataPay.gamePrice.split('\n');
      const tempJson = {};
      tempJson[0 + ''] = Number(this.dataPay.single);
      for (let i = 0; i < tempArr.length; i++) {
        tempJson[tempArr[i].split(',')[0] + ''] = Number(tempArr[i].split(',')[1]);
      }
      const payInput = { id: this.dataPay.id, freeCount: this.dataPay.freeCount, freeMode: this.dataPay.freeMode, gamePrice: tempJson };
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
    }
  }

  private _initForm(): void {
    this.searchFreeForm = this.fb.group({ appChannelId: [''], date: [''], });
    this.searchPayForm = this.fb.group({ gameName: [''], appChannelId: [''], date: [''], });
  }

  // 日期插件
  onChange(result, flag) {
    if (flag === 'free') {  // 基本信息的活动时间
      if (result === []) { this.beginFreeDate = ''; this.endFreeDate = ''; return; }
      if (result[0] !== '' || result[1] !== '') { this.beginFreeDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss'); this.endFreeDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss'); }
    } else if (flag === 'pay') {  // 基本信息的活动时间
      if (result === []) { this.beginPayDate = ''; this.endPayDate = ''; return; }
      if (result[0] !== '' || result[1] !== '') { this.beginPayDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss'); this.endPayDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss'); }
    } else if (flag === 'freeMode') {
      this.dataPay.freeMode = result.freeMode;
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
