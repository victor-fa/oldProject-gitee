import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalService, NzNotificationService, UploadFile } from 'ng-zorro-antd';
import { CommonService } from '../public/service/common.service';
import { PlatformService } from '../public/service/platform.service';

registerLocaleData(zh);
export interface TreeNodeInterface {
  key: number;
  name: string;
  age: number;
  level: number;
  expand: boolean;
  address: string;
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
  taggingPlatformSearchForm: FormGroup;
  manualAuditSearchForm: FormGroup;
  platformThesaurusSearchForm: FormGroup;
  platformNERSearchForm: FormGroup;
  dataSortSpeech = [{word: '', type: '', index: 0}];
  dataTaggingPlatform = [{
      key: 1,
      name: 'John Brown sr.',
      age: 60,
      address: 'New York No. 1 Lake Park',
      children: [
        {
          key: 11,
          name: 'John Brown',
          age: 42,
          address: 'New York No. 2 Lake Park'
        },
        {
          key: 12,
          name: 'John Brown jr.',
          age: 30,
          address: 'New York No. 3 Lake Park'
        },
        {
          key: 13,
          name: 'Jim Green sr.',
          age: 72,
          address: 'London No. 1 Lake Park'
        }
      ]
    },
    {
      key: 2,
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  dataManualAudit = [{}];
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
    private platformService: PlatformService,
    private notification: NzNotificationService,
    private datePipe: DatePipe,
    private msg: NzMessageService,
  ) {
    this.commonService.nav[12].active = true;
    this._initForm();
  }

  ngOnInit() {
    const tabFlag = [{label: '人工标注', value: 'taggingPlatform'}, {label: '人工审核', value: 'manualAudit'},
        {label: '新闻词库', value: 'platformThesaurus'}, {label: '新闻NER', value: 'platformNER'}];
    let targetFlag = 0;
    for (let i = 0; i < tabFlag.length; i++) {
      if (this.commonService.haveMenuPermission('children', tabFlag[i].label)) {targetFlag = i; break; }
    }
    console.log(tabFlag[targetFlag].value);
    this.loadData(tabFlag[targetFlag].value);
    this.changePanel(tabFlag[targetFlag].value);

    this.dataTaggingPlatform.forEach(item => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });
  }

  loadData(flag) {
    this.isSpinning = true;
    if (flag === 'taggingPlatform') {
      const taggingPlatformInput = {
        status: this.taggingPlatformSearchForm.controls['status'].value,
        uploadTimeCeil: this.endSortSpeechDate,
        uploadTimeFloor: this.beginSortSpeechDate,
      };
      // this.platformService.getTaggingPlatformList(taggingPlatformInput).subscribe(res => {
      //   if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
      //     this.dataTaggingPlatform = JSON.parse(res.payload).content;
      //     console.log(this.dataTaggingPlatform);
      //     const operationInput = { op_category: '新闻词库', op_page: '人工标注', op_name: '访问' };
      //     this.commonService.updateOperationlog(operationInput).subscribe();
      //   } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      // });
    } else if (flag === 'manualAudit') {
      const taggingPlatformInput = {
        status: this.taggingPlatformSearchForm.controls['status'].value,
        uploadTimeCeil: this.endSortSpeechDate,
        uploadTimeFloor: this.beginSortSpeechDate,
      };
      // this.platformService.getTaggingPlatformList(taggingPlatformInput).subscribe(res => {
      //   if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
      //     this.dataTaggingPlatform = JSON.parse(res.payload).content;
      //     console.log(this.dataTaggingPlatform);
      //     const operationInput = { op_category: '新闻词库', op_page: '人工标注', op_name: '访问' };
      //     this.commonService.updateOperationlog(operationInput).subscribe();
      //   } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      // });
    }
  }

  private _initForm(): void {
    this.taggingPlatformSearchForm = this.fb.group({ status: [''], date: [''], });
    this.manualAuditSearchForm = this.fb.group({ submitter: [''], status: [''], date: [''], });
    this.platformThesaurusSearchForm = this.fb.group({ type: [''], name: [''], date: [''], checkAccurate: [''], });
    this.platformNERSearchForm = this.fb.group({ name: [''], date: [''], });
  }

  // 弹窗
  showModal(flag, data) {
    if (flag === 'addLevelOneMenu') {
      this.visiable.addLevelOneMenu = true;
    } else if (flag === 'editLevelOneMenu') {
      this.visiable.editLevelOneMenu = true;
    } else if (flag === 'addLevelTwoMenu') {
      this.visiable.addLevelTwoMenu = true;
    } else if (flag === 'editLevelTwoMenu') {
      this.visiable.editLevelTwoMenu = true;
    } else if (flag === 'editContent') {
      this.visiable.editContent = true;
    } else if (flag === 'addAccount') {
      this.visiable.addAccount = true;
    } else if (flag === 'editAccount') {
      this.visiable.editAccount = true;
    } else if (flag === 'deletePlatformThesaurus') {
      this.modalService.confirm({
        nzTitle: '确认删除', nzContent: '确认删除该词条吗？', nzCancelText: '取消',
        nzOnCancel: () => 1, nzOkText: '确定', nzOnOk: () => { this.doSomething(data, flag); }
      });
    }

  }

  // doSomething
  doSomething(data, flag) {
    if (flag === 'submitTagAudit') {
      const submitInput = {id: data.id, };
      // this.platformService.submitSpeech(submitInput).subscribe(res => {
      //   if (res.retcode === 0) {
      //     if (res.payload !== '') {
      //       this.notification.blank( '提示', '提交成功', { nzStyle: { color : 'green' } });
      //       const operationInput = { op_category: '新闻词库', op_page: '人工标注', op_name: '提交审核' };
      //       this.commonService.updateOperationlog(operationInput).subscribe();
      //       setTimeout(() => {this.loadData('taggingPlatform'); }, 500);
      //     } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      //   } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      // });
    }
  }

  // 隐藏
  hideModal(flag) {
    if (flag === 'addLevelOneMenu') {
      this.visiable.addLevelOneMenu = false;
    } else if (flag === 'editLevelOneMenu') {
      this.visiable.editLevelOneMenu = false;
    } else if (flag === 'addLevelTwoMenu') {
      this.visiable.addLevelTwoMenu = false;
    } else if (flag === 'editLevelTwoMenu') {
      this.visiable.editLevelTwoMenu = false;
    } else if (flag === 'editContent') {
      this.visiable.editContent = false;
    } else if (flag === 'addAccount') {
      this.visiable.addAccount = false;
    } else if (flag === 'editAccount') {
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
      // } else if (this.addPlatformForm.controls['appChannelName'].value === '') {
      //   this.modalService.error({ nzTitle: '提示', nzContent: '客户名称未填写' });
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
    if (flag === 'sortSpeech') {
      const arr = [];
      this.dataSortSpeech.forEach(item => {
        arr.push({word: item.word, type: item.type });
      });
      const platformInput = {id: this.tempId, words: arr };
      console.log(platformInput);
      // this.platformService.submitWords(platformInput).subscribe(res => {
      //   if (res.retcode === 0) {
      //     this.notification.blank( '提示', '分类成功', { nzStyle: { color : 'green' } });
      //     const operationInput = { op_category: '新闻词库', op_page: (flag === 'sortSpeech' ? '人工标注' : '人工审核'), op_name: '词条分类' };
      //     this.commonService.updateOperationlog(operationInput).subscribe();
      //     this.hideModal('sortSpeech');
      //     setTimeout(() => {this.loadData('taggingPlatform'); }, 500);
      //   } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      // });
    }
  }

  // 针对中文进行排序
  sortWords(a, b) {
    return a.word.localeCompare(b.word, 'zh-Hans-CN', {sensitivity: 'accent'});
  }

  // 日期插件
  onChange(result, flag): void {
    if (flag === 'taggingPlatform') {
      if (result === []) { this.beginSortSpeechDate = ''; this.endSortSpeechDate = ''; return; }
      if (result[0] !== '' || result[1] !== '') {
        if (this.datePipe.transform(result[0], 'HH:mm:ss') === this.datePipe.transform(result[1], 'HH:mm:ss')) {
          this.beginSortSpeechDate = this.datePipe.transform(result[0], 'yyyy-MM-dd' + ' 00:00:00'); this.endSortSpeechDate = this.datePipe.transform(result[1], 'yyyy-MM-dd' + ' 23:59:59');
        } else {
          this.beginSortSpeechDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss'); this.endSortSpeechDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
        }
      }
    }
  }

  // 切换面板
  changePanel(flag): void {
    if (flag !== this.currentPanel) {this.loadData(flag); }
    this.currentPanel = flag;
    const operationInput = {
      op_category: '内容管理',
      op_page: flag === 'taggingPlatform' ? '新闻词库' : flag === 'manualAudit' ? '人工审核' : flag === 'platformThesaurus' ? '新闻词库' : flag === 'platformNER' ? '新闻NER' : '',
      op_name: '访问'
    };
    this.commonService.updateOperationlog(operationInput).subscribe();
  }

  // 跳转编辑器
  goEditor() {
    console.log('/markdown');
    window.open(`/markdown`);
  }

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

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

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: any }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }
}
