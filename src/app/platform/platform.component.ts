import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalService, NzNotificationService, UploadFile } from 'ng-zorro-antd';
import { CommonService } from '../public/service/common.service';
import { PlatformService } from '../public/service/platform.service';
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
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss']
})
export class PlatformComponent implements OnInit {

  visiable = {addLevelOneMenu: false, editLevelOneMenu: false, addLevelTwoMenu: false,
    editLevelTwoMenu: false, editContent: false, addAccount: false, editAccount: false, };
  dataSortSpeech = [{word: '', type: '', index: 0}];
  dataTaggingPlatform = [];
  dataCategoryO = {parentId: '', name: '', id: '', };
  dataCategoryS = {parentId: '', name: '', id: '', content: '', parent: {id: ''}};
  mapOfExpandedData: { [id: string]: TreeNodeInterface[] } = {};
  userData = [];
  dataUser = {customerId: '', accountName: '', password: '', categorieNums: [], userId: ''};
  dataConsumer = [];
  isSpinning = false;
  checkAccurate = false;
  beginSortSpeechDate = '';
  endSortSpeechDate = '';
  tempId = '';
  currentPanel = 'taggingPlatform';

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private modalService: NzModalService,
    private consumerService: ConsumerService,
    private platformService: PlatformService,
    private notification: NzNotificationService,
    private datePipe: DatePipe,
    private msg: NzMessageService,
  ) {
    this.commonService.nav[12].active = true;
  }

  ngOnInit() {
    const tabFlag = [{label: '人工标注', value: 'taggingPlatform'}, {label: '人工审核', value: 'user'},
        {label: '开放平台', value: 'platformThesaurus'}, {label: '新闻NER', value: 'platformNER'}];
    let targetFlag = 0;
    for (let i = 0; i < tabFlag.length; i++) {
      if (this.commonService.haveMenuPermission('children', tabFlag[i].label)) {targetFlag = i; break; }
    }
    console.log(tabFlag[targetFlag].value);
    this.loadData(tabFlag[targetFlag].value);
    // this.changePanel(tabFlag[targetFlag].value);
  }

  loadData(flag) {
    this.isSpinning = true;
    if (flag === 'taggingPlatform') {
      this.platformService.getcategoryList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataTaggingPlatform = JSON.parse(res.payload);
          if (this.dataTaggingPlatform !== null) {
            this.dataTaggingPlatform.forEach(item => {
              this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
            });
          }
          console.log(this.dataTaggingPlatform);
          // const operationInput = { op_category: '开放平台', op_page: '人工标注', op_name: '访问' };
          // this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'user') {
      this.platformService.getUserList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.userData = JSON.parse(res.payload);
          console.log(this.userData);
          // const operationInput = { op_category: '开放平台', op_page: '人工标注', op_name: '访问' };
          // this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'consumer') {
      this.consumerService.getConsumerList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataConsumer = JSON.parse(res.payload);
          console.log(this.dataConsumer);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  // 弹窗
  showModal(flag, data) {
    if (flag === 'addLevelOneMenu') {
      this.visiable.addLevelOneMenu = true;
    } else if (flag === 'editLevelOneMenu') {
      this.dataCategoryO = data;
      this.visiable.editLevelOneMenu = true;
    } else if (flag === 'addLevelTwoMenu') {
      this.dataCategoryO = data;
      this.visiable.addLevelTwoMenu = true;
    } else if (flag === 'editLevelTwoMenu') {
      this.dataCategoryS = data;
      this.visiable.editLevelTwoMenu = true;
    } else if (flag === 'editContent') {
      this.dataCategoryS = data;
      this.visiable.editContent = true;
    } else if (flag === 'addAccount') {
      this.loadData('consumer');
      this.visiable.addAccount = true;
    } else if (flag === 'editAccount') {
      console.log(data);
      this.dataUser = data;
      this.visiable.editAccount = true;
    } else if (flag === 'deleteLevelOneMenu' || flag === 'deleteLevelTwoMenu' || flag === 'deleteUser') {
      this.modalService.confirm({
        nzTitle: '确认删除', nzContent: '确认删除该信息吗？', nzCancelText: '取消',
        nzOnCancel: () => 1, nzOkText: '确定', nzOnOk: () => { this.doSomething(data, flag); }
      });
    } else if (flag === 'preview') {
      console.log(data);
    }
  }

  // doSomething
  doSomething(data, flag) {
    if (flag === 'deleteLevelOneMenu' || flag === 'deleteLevelTwoMenu') {
      this.platformService.deleteCategory(data.id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          // const operationInput = { op_category: '开放平台', op_page: '人工标注', op_name: '提交审核' };
          // this.commonService.updateOperationlog(operationInput).subscribe();
          this.dataCategoryO = {parentId: '', name: '', id: '', };
          this.dataCategoryS = {parentId: '', name: '', id: '', content: '', parent: {id: ''}};
          this.loadData('taggingPlatform');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag == 'deleteUser') {
      this.platformService.deleteUser(data.id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          // const operationInput = { op_category: '开放平台', op_page: '人工标注', op_name: '提交审核' };
          // this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('user');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  // 隐藏
  hideModal(flag) {
    if (flag === 'addLevelOneMenu') {
      this.dataCategoryO = {parentId: '', name: '', id: '', };
      this.visiable.addLevelOneMenu = false;
    } else if (flag === 'editLevelOneMenu') {
      this.dataCategoryO = {parentId: '', name: '', id: '', };
      this.visiable.editLevelOneMenu = false;
    } else if (flag === 'addLevelTwoMenu') {
      this.dataCategoryO = {parentId: '', name: '', id: '', };
      this.visiable.addLevelTwoMenu = false;
    } else if (flag === 'editLevelTwoMenu') {
      this.dataCategoryS = {parentId: '', name: '', id: '', content: '', parent: {id: ''}};
      this.visiable.editLevelTwoMenu = false;
    } else if (flag === 'editContent') {
      this.dataCategoryS = {parentId: '', name: '', id: '', content: '', parent: {id: ''}};
      this.visiable.editContent = false;
    } else if (flag === 'addAccount') {
      this.dataUser = {customerId: '', accountName: '', password: '', categorieNums: [], userId: ''};
      this.visiable.addAccount = false;
    } else if (flag === 'editAccount') {
      this.dataUser = {customerId: '', accountName: '', password: '', categorieNums: [], userId: ''};
      this.visiable.editAccount = false;
    }
  }

  // 封装验证新增
  verificationAdd(flag): boolean {
    let result = true;
    if (flag === 'platform') {
      // if (this.addPlatformForm.controls['appChannel'].value === '') {
      //   this.modalService.error({ nzTitle: '提示', nzContent: '客户ID未填写' });
      //   result = false;
      // } else if (this.addPlatformForm.controls['robot'].value === '') {
      //   this.modalService.error({ nzTitle: '提示', nzContent: 'BOT名称未填写' });
        result = false;
      // }
    }
    return result;
  }

  // 新增操作
  doSave(flag, data): void {
    if (flag === 'addLevelOneMenu') {
      const categoryInput = {parentId: 0, name: this.dataCategoryO.name, id: this.dataCategoryO.id, };
      this.platformService.addCategory(categoryInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          // const operationInput = { op_category: '开放平台', op_page: (flag === 'sortSpeech' ? '人工标注' : '人工审核'), op_name: '词条分类' };
          // this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('addLevelOneMenu');
          this.loadData('taggingPlatform');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'editLevelOneMenu') {
      const categoryInput = {parentId: 0, name: this.dataCategoryO.name, id: this.dataCategoryO.id, };
      this.platformService.updateCategory(categoryInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          // const operationInput = { op_category: '开放平台', op_page: (flag === 'sortSpeech' ? '人工标注' : '人工审核'), op_name: '词条分类' };
          // this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('editLevelOneMenu');
          this.loadData('taggingPlatform');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'addLevelTwoMenu') {
      const categoryInput = {parentId: this.dataCategoryO.id, name: this.dataCategoryS.name, id: this.dataCategoryO.id + '-' + this.dataCategoryS.id, };
      this.platformService.addCategory(categoryInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          // const operationInput = { op_category: '开放平台', op_page: (flag === 'sortSpeech' ? '人工标注' : '人工审核'), op_name: '词条分类' };
          // this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('addLevelTwoMenu');
          this.loadData('taggingPlatform');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'editLevelTwoMenu') {
      const categoryInput = {parentId: this.dataCategoryS.parent.id, name: this.dataCategoryS.name, id: this.dataCategoryS.id, };
      this.platformService.updateCategory(categoryInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          // const operationInput = { op_category: '开放平台', op_page: (flag === 'sortSpeech' ? '人工标注' : '人工审核'), op_name: '词条分类' };
          // this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('editLevelTwoMenu');
          this.loadData('taggingPlatform');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'editContent') {
      const categoryInput = {parentId: this.dataCategoryS.parent.id, name: this.dataCategoryS.name, id: this.dataCategoryS.id, content: this.dataCategoryS.content };
      this.platformService.updateCategory(categoryInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } });
          // const operationInput = { op_category: '开放平台', op_page: (flag === 'sortSpeech' ? '人工标注' : '人工审核'), op_name: '词条分类' };
          // this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('editContent');
          this.loadData('taggingPlatform');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'addAccount') {
      const categorieArr = [];
      this.dataTaggingPlatform.forEach(item => {
        item.children.forEach(cell => cell.checked && cell.checked === true ? categorieArr.push(cell.id) : null );
        item.children.some(cell => cell.checked && cell.checked === true ? categorieArr.push(item.id) : null);
      });
      const userInput = {
        accountName: this.dataUser.accountName,
        categorieNums: categorieArr,
        customerId: this.dataUser.customerId,
        operator: localStorage.getItem('currentUser'),
        password: this.dataUser.password,
        userId: Date.parse(new Date().toString()) + ''
      };
      console.log(userInput);
      this.platformService.addUser(userInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          // const operationInput = { op_category: '开放平台', op_page: (flag === 'sortSpeech' ? '人工标注' : '人工审核'), op_name: '词条分类' };
          // this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('addAccount');
          this.loadData('user');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'editAccount') {
      const categorieArr = [];
      this.dataTaggingPlatform.forEach(item => {
        item.children.forEach(cell => cell.checked && cell.checked === true ? categorieArr.push(cell.id) : null );
        item.children.some(cell => cell.checked && cell.checked === true ? categorieArr.push(item.id) : null);
      });
      const userInput = {
        accountName: this.dataUser.accountName,
        categorieNums: categorieArr,
        customerId: this.dataUser.customerId,
        operator: localStorage.getItem('currentUser'),
        password: this.dataUser.password,
        userId: this.dataUser.userId
      };
      console.log(userInput);
      this.platformService.addUser(userInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          // const operationInput = { op_category: '开放平台', op_page: (flag === 'sortSpeech' ? '人工标注' : '人工审核'), op_name: '词条分类' };
          // this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('editAccount');
          this.loadData('user');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  // 日期插件
  onChange(result, flag) {
    if (flag === 'categoryOne') {
      const checked = result.checked;
      const id = result.id;
      this.dataTaggingPlatform.forEach(item => {
        if (item.id === id) {
          item.children.forEach(cell => cell.checked = checked );
        }
      });
    } else if (flag === 'categoryTwo') {
      const checked = result.checked;
      const id = result.id;
      const parentId = result.parentId;
      this.dataTaggingPlatform.forEach(item => {
        if (item.id === parentId) {
          item.children.forEach(cell => { cell.id === id ? cell.checked = checked : null; })
          item.checked = item.children.every(cell => cell.checked) ? true : false;
        }
      });
    }
  }

  // 切换面板
  changePanel(flag): void {
    if (flag !== this.currentPanel) {this.loadData(flag); }
    this.currentPanel = flag;
    const operationInput = {
      op_category: '开放平台',
      op_page: flag === 'taggingPlatform' ? '开放平台' : flag === 'user' ? '客户账号' : '',
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
