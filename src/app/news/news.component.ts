import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from '../public/service/common.service';
import { NzModalService, NzNotificationService, UploadFile, NzMessageService } from 'ng-zorro-antd';
import { NewsService } from '../public/service/news.service';
import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { HttpHeaders, HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';

registerLocaleData(zh);

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  visiable = {sortSpeech: false, manualAudit: false, uploadAudit: false, addNewsThesaurus: false,
    newsNERTest: false, newsNERResult: false, addNewsThesaurusResult: false, };
  taggingNewsSearchForm: FormGroup;
  manualAuditSearchForm: FormGroup;
  newsThesaurusSearchForm: FormGroup;
  newsNERSearchForm: FormGroup;
  sortSpeechDate = { 'type': '' };
  dataSortSpeech = [{word: '', type: '', index: 0}];
  dataManualAuditModel = [{word: '', type: ''}];
  dataManualAuditModelFinal = [{word: '', type: ''}];
  dataTaggingNews = [];
  dataManualAudit = [];
  dataNewsThesaurus = [];
  dataNewsNER = [{createDate: '', createDateFinal: ''}];
  dataNewsNERResult = [];
  paramNewsThesaurus = {person: 0, address: 0, event: 0, invalid: 0};
  uploadMarkedData = {type: 'PERSON'};
  addNewsThesaurusData = {type: 'PERSON', content: '', success: '', fail: '', successArr: [], failArr: [], successNum: 0, failNum: ''};
  isSpinning = false;
  checkAccurate = false;
  beginSortSpeechDate = '';
  endSortSpeechDate = '';
  beginTaggingNewsDate = '';
  endTaggingNewsDate = '';
  beginNewNERDate = '';
  endNewNERDate = '';
  tempId = '';
  currentPanel = 'taggingNews';
  fileList: UploadFile[] = [];
  pageNum = {
    dataSortPage: 1,
    dataManualAuditPage: 1,
    dataNewsThesaurusPage: 1, // 当前前端页码
    dataNewsThesaurusTotal: 1,  // 总页数
    dataNewsThesaurusNumber: 0, // 后台页数
  };
  manualAuditSearchData = {word: '', type: ''};
  newsNERDara = {id: '', nerUrl: ''};

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private modalService: NzModalService,
    private newsService: NewsService,
    private notification: NzNotificationService,
    private datePipe: DatePipe,
    private msg: NzMessageService,
    private http: HttpClient,
  ) {
    this.commonService.nav[10].active = true;
    this._initForm();
  }

  ngOnInit() {
    const tabFlag = [{label: '人工标注', value: 'taggingNews'}, {label: '人工审核', value: 'manualAudit'},
        {label: '新闻词库', value: 'newsThesaurus'}, {label: '新闻NER', value: 'newsNER'}];
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
    if (flag === 'taggingNews') {
      const taggingNewsInput = {
        status: this.taggingNewsSearchForm.controls['status'].value,
        uploadTimeCeil: this.endSortSpeechDate,
        uploadTimeFloor: this.beginSortSpeechDate,
      };
      this.newsService.getTaggingNewsList(taggingNewsInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataTaggingNews = JSON.parse(res.payload).content;
          console.log(this.dataTaggingNews);
          const operationInput = { op_category: '新闻词库', op_page: '人工标注', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'manualAudit') {
      const manualAuditInput = {
        submitter: this.manualAuditSearchForm.controls['submitter'].value,
        status: this.manualAuditSearchForm.controls['status'].value,
        submitTimeCeil: this.endTaggingNewsDate,
        submitTimeFloor: this.beginTaggingNewsDate,
      };
      this.pageNum.dataManualAuditPage = this.pageNum.dataManualAuditPage === 0 ? 1 : this.pageNum.dataManualAuditPage;
      this.newsService.getManualAuditList(manualAuditInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataManualAudit = JSON.parse(res.payload).content;
          console.log(this.dataManualAudit);
          const operationInput = { op_category: '新闻词库', op_page: '人工标注', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'newsThesaurus' || flag === 'newsThesaurusPage') {
      if (flag === 'newsThesaurus') {
        this.pageNum.dataNewsThesaurusPage = 1;
        this.pageNum.dataNewsThesaurusNumber = 0;
      }
      const newsThesaurusInput = {
        name: this.newsThesaurusSearchForm.controls['name'].value,
        type: this.newsThesaurusSearchForm.controls['type'].value,
        submitTimeCeil: this.endTaggingNewsDate,
        submitTimeFloor: this.beginTaggingNewsDate,
        number: (flag === 'newsThesaurusPage' ? this.pageNum.dataNewsThesaurusNumber : 0),
        fullMatch: this.checkAccurate
      };
      this.pageNum.dataNewsThesaurusPage = this.pageNum.dataNewsThesaurusPage === 0 ? 1 : this.pageNum.dataNewsThesaurusPage;
      this.newsService.getNewsThesaurusList(newsThesaurusInput).subscribe(res => {
        console.log(JSON.parse(res.payload));
        if (res.retcode === 0 && res.status === 200) {
          this.pageNum.dataNewsThesaurusTotal = JSON.parse(res.payload).totalPages;
          this.isSpinning = false;
          this.dataNewsThesaurus = JSON.parse(res.payload).content;
          // this.dataNewsThesaurus = JSON.parse(res.payload).content.sort(this.sortWords);
          this.paramNewsThesaurus = {
            person: JSON.parse(res.payload).personElements,
            address: JSON.parse(res.payload).addressElements,
            event: JSON.parse(res.payload).eventElements,
            invalid: JSON.parse(res.payload).invalidElements
          };
          console.log(this.dataNewsThesaurus);
          const operationInput = { op_category: '新闻词库', op_page: '人工标注', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'newsNER') {
      const newsNERInput = {
        name: this.newsNERSearchForm.controls['name'].value,
        startDate: this.beginNewNERDate,
        endDate: this.endNewNERDate,
      };
      this.pageNum.dataManualAuditPage = this.pageNum.dataManualAuditPage === 0 ? 1 : this.pageNum.dataManualAuditPage;
      this.newsService.getNerList(newsNERInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataNewsNER = JSON.parse(res.payload);
          console.log(this.dataNewsNER);
          const operationInput = { op_category: '新闻词库', op_page: '新闻NER', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  private _initForm(): void {
    this.taggingNewsSearchForm = this.fb.group({ status: [''], date: [''], });
    this.manualAuditSearchForm = this.fb.group({ submitter: [''], status: [''], date: [''], });
    this.newsThesaurusSearchForm = this.fb.group({ type: [''], name: [''], date: [''], checkAccurate: [''], });
    this.newsNERSearchForm = this.fb.group({ name: [''], date: [''], });
  }

  // 弹窗
  showModal(flag, data) {
    if (flag === 'sortSpeech') {
      this.tempId = data.id;
      const taggingNewsInput = {
        id: data.id,
      };
      this.newsService.getTaggingNewsById(taggingNewsInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;

          this.dataSortSpeech = JSON.parse(res.payload).words.sort(this.sortWords);
          console.log(this.dataSortSpeech);
          this.dataSortSpeech.forEach((item, index) => {
            item.index = index;
          });
          const operationInput = { op_category: '新闻词库', op_page: '人工标注', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
      this.visiable.sortSpeech = true;
    } else if (flag === 'submitTagAudit') {
      this.modalService.confirm({
        nzTitle: '提交审核', nzContent: '确认提交审核吗？', nzCancelText: '取消',
        nzOnCancel: () => 1, nzOkText: '确定', nzOnOk: () => { this.doSomething(data, flag); }
      });
    } else if (flag === 'uploadAudit') {  // 上传审核
      this.fileList.splice(0, this.fileList.length);
      this.visiable.uploadAudit = true;
    } else if (flag === 'manualAudit' || flag === 'manualAuditModel') {
      this.tempId = flag === 'manualAuditModel' ? this.tempId : data.id;
      this.dataManualAuditModel.splice(0, this.dataManualAuditModel.length);
      const taggingNewsInput = {
        id: this.tempId,
      };
      const word = this.manualAuditSearchData.word;
      const type = this.manualAuditSearchData.type;
      this.newsService.getTaggingNewsById(taggingNewsInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          const dataManualAuditModel = JSON.parse(res.payload).words.sort(this.sortWords);
          if (word !== '' || type !== '') { // 有查询条件
            const tempData = [];
            if (word === '' && type !== '') { // 只有type
              dataManualAuditModel.forEach((item, index) => { if (item.type === type) { tempData.push(item); } });
            } else if (word !== '' && type === '') { // 只有word
              dataManualAuditModel.forEach((item, index) => { if (item.word === word) { tempData.push(item); } });
            } else if (word !== '' && type !== '') { // 有type有word
              dataManualAuditModel.forEach((item, index) => { if (item.word === word && item.type === type) { tempData.push(item); } });
            }
            this.dataManualAuditModel = tempData;
          } else {
            this.dataManualAuditModel = dataManualAuditModel;
          }
          this.dataManualAuditModelFinal = dataManualAuditModel;
          console.log(this.dataManualAuditModel);
          // const operationInput = { op_category: '新闻词库', op_page: '人工标注', op_name: '访问' };
          // this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
      flag === 'manualAuditModel' ? '' : this.visiable.manualAudit = true;
    } else if (flag === 'updateLoading') {
      this.modalService.confirm({
        nzTitle: '确认更新', nzContent: '确认更新到词库吗？', nzCancelText: '取消',
        nzOnCancel: () => 1, nzOkText: '确定', nzOnOk: () => { this.doSomething(data, flag); }
      });
    } else if (flag === 'deleteNewsThesaurus') {
      this.modalService.confirm({
        nzTitle: '确认删除', nzContent: '确认删除该词条吗？', nzCancelText: '取消',
        nzOnCancel: () => 1, nzOkText: '确定', nzOnOk: () => { this.doSomething(data, flag); }
      });
    } else if (flag === 'deleteManualAudit') {
      this.modalService.confirm({
        nzTitle: '确认删除', nzContent: '确认删除该审核来源吗？', nzCancelText: '取消',
        nzOnCancel: () => 1, nzOkText: '确定', nzOnOk: () => { this.doSomething(data, flag); }
      });
    } else if (flag === 'addNewsThesaurus') {
      this.visiable.addNewsThesaurus = true;
    } else if (flag === 'newsNERTest') {
      this.newsNERDara.id = data.id;
      this.visiable.newsNERTest = true;
    } else if (flag === 'newsNERResult') {
      this.visiable.newsNERResult = true;
    } else if (flag === 'addNewsThesaurusResult') {
      this.visiable.addNewsThesaurusResult = true;
    }
  }

  // doSomething
  doSomething(data, flag) {
    if (flag === 'submitTagAudit') {
      const submitInput = {id: data.id, };
      this.newsService.submitSpeech(submitInput).subscribe(res => {
        if (res.retcode === 0) {
          if (res.payload !== '') {
            this.notification.blank( '提示', '提交成功', { nzStyle: { color : 'green' } });
            const operationInput = { op_category: '新闻词库', op_page: '人工标注', op_name: '提交审核' };
            this.commonService.updateOperationlog(operationInput).subscribe();
            setTimeout(() => {this.loadData('taggingNews'); }, 500);
          } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'updateLoading') {
      const submitInput = {id: data.id, };
      this.newsService.updateLoading(submitInput).subscribe(res => {
        if (res.retcode === 0) {
          if (res.payload !== '') {
            this.notification.blank( '提示', '更新成功', { nzStyle: { color : 'green' } });
            const operationInput = { op_category: '新闻词库', op_page: '人工标注', op_name: '更新审核进度' };
            this.commonService.updateOperationlog(operationInput).subscribe();
            setTimeout(() => {this.loadData('manualAudit'); }, 500);
          } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'deleteNewsThesaurus') {
      const deleteInput = {newsWord: {type: 'INVALID', word: data.word}, };
      this.newsService.updateNewWords(deleteInput).subscribe(res => {
        if (res.retcode === 0) {
          if (res.payload !== '') {
            this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
            const operationInput = { op_category: '新闻词库', op_page: '人工标注', op_name: '更新审核进度' };
            this.commonService.updateOperationlog(operationInput).subscribe();
            setTimeout(() => {this.loadData('newsThesaurus'); }, 500);
          } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'deleteManualAudit') {
      const deleteInput = {id: data.id };
      this.newsService.deleteManualAudit(deleteInput).subscribe(res => {
        if (res.retcode === 0) {
          if (res.payload !== '') {
            this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
            const operationInput = { op_category: '新闻词库', op_page: '人工审核', op_name: '删除词库' };
            this.commonService.updateOperationlog(operationInput).subscribe();
            this.loadData('manualAudit');
          } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  // 隐藏
  hideModal(flag) {
    if (flag === 'sortSpeech') {
      this.visiable.sortSpeech = false;
    } else if (flag === 'manualAudit') {
      this.visiable.manualAudit = false;
      this.manualAuditSearchData = {word: '', type: ''};  // 重置
    } else if (flag === 'uploadMarked') {
      this.visiable.uploadAudit = false;
    } else if (flag === 'addNewsThesaurus') {
      this.visiable.addNewsThesaurus = false;
    } else if (flag === 'newsNERTest') {
      this.visiable.newsNERTest = false;
    } else if (flag === 'newsNERResult') {
      this.visiable.newsNERResult = false;
    } else if (flag === 'addNewsThesaurusResult') {
      this.addNewsThesaurusData = {type: 'PERSON', content: '', success: '', fail: '', successArr: [], failArr: [], successNum: 0, failNum: ''};
      this.visiable.addNewsThesaurusResult = false;
      this.loadData('newsThesaurus');
    }
  }

  // 封装验证新增
  verificationAdd(flag): boolean {
    let result = true;
    if (flag === 'news') {
      // if (this.addNewsForm.controls['appChannel'].value === '') {
      //   this.modalService.error({ nzTitle: '提示', nzContent: '客户ID未填写' });
      //   result = false;
      // } else if (this.addNewsForm.controls['appChannelName'].value === '') {
      //   this.modalService.error({ nzTitle: '提示', nzContent: '客户名称未填写' });
      //   result = false;
      // } else if (this.addNewsForm.controls['robot'].value === '') {
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
      const newsInput = {id: this.tempId, words: arr };
      console.log(newsInput);
      this.newsService.submitWords(newsInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '分类成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '新闻词库', op_page: (flag === 'sortSpeech' ? '人工标注' : '人工审核'), op_name: '词条分类' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('sortSpeech');
          setTimeout(() => {this.loadData('taggingNews'); }, 500);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'manualAudit') {
      for (let i = 0; i < this.dataManualAuditModelFinal.length; i++) {
        for (let j = 0; j < this.dataManualAuditModel.length; j++) {
          if (this.dataManualAuditModelFinal[i].word === this.dataManualAuditModel[j].word) {
            this.dataManualAuditModelFinal[i].type = this.dataManualAuditModel[j].type;
          }
        }
      }
      const confirmInput = {id: this.tempId, words: this.dataManualAuditModelFinal };
      console.log(confirmInput);
      this.newsService.confirmSpeech(confirmInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '审核通过成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '新闻词库', op_page: (flag === 'sortSpeech' ? '人工标注' : '人工审核'), op_name: '审核通过' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('manualAudit');
          this.loadData('manualAudit');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'modifyNewsThesaurus') {
      const modifyInput = {newsWord: {type: data.type, word: data.word} };
      console.log(modifyInput);
      this.newsService.updateNewWords(modifyInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '新闻词库', op_page: '人工标注', op_name: '更新审核进度' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          // setTimeout(() => {this.loadData('newsThesaurus'); }, 500);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'addNewsThesaurus') {
      const arr = this.addNewsThesaurusData.content.split('\n');
      if (arr.length === 1 && arr[0] === '') { this.modalService.error({ nzTitle: '提示', nzContent: '词条不能为空' }); return; }
      const addInput = {type: this.addNewsThesaurusData.type, words: arr };
      this.newsService.addWord(addInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '新闻词库', op_page: '新闻词库', op_name: '新增词条' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          const result = JSON.parse(res.payload);
          const successRes = [];
          const failRes = [];
          result.successList.map(item => successRes.push(item.word));
          result.failList.map(item => failRes.push(item.word));
          this.addNewsThesaurusData.success = successRes.join('\n');
          this.addNewsThesaurusData.fail = failRes.join('\n');
          this.addNewsThesaurusData.successArr = result.successList;
          this.addNewsThesaurusData.failArr = result.failList;
          this.addNewsThesaurusData.successNum = result.successList.length;
          this.addNewsThesaurusData.failNum = result.failList.length;
          console.log(this.addNewsThesaurusData);
          this.hideModal('addNewsThesaurus');
          this.showModal('addNewsThesaurusResult', '');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'newsNERTest') {
      const testInput = {id: this.newsNERDara.id, nerUrl: this.newsNERDara.nerUrl };
      this.newsService.testNewsNER(testInput).subscribe(res => {
        console.log(res);
        if (res.retcode === 0) {
          this.notification.blank( '提示', '测试成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '新闻词库', op_page: '新闻NER', op_name: '测试NER' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('newsNERTest');
          this.loadData('newsNER');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  // 上传image
  beforeUpload = (file: UploadFile): boolean => {
    const suffix = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
    // const isPng = suffix === '.doc' || suffix === '.docx' ? true : false;
    const isPng = suffix === '.txt' || suffix === '.TXT' || suffix === '.csv' || suffix === '.CSV' ? true : false;
    const isMoreThanTen = file.size < 512000 ? true : false;  // 512000
    if (!isPng) {
      // this.msg.error('您只能上传.doc、.docx文件');
      this.msg.error('您只能上传.txt或.csv文件');
    } else if (!isMoreThanTen) {
      this.msg.error('您只能上传不超过500K文件');
    } else {
      this.fileList.push(file);
      this.handleUpload();
      this.hideModal('uploadMarked');
      setTimeout(() => {this.loadData('manualAudit'); }, 500);
    }
    return false;
  }

  // 点击上传
  handleUpload() {
    const url = `${this.commonService.baseUrl}/news/word-sets/marked/${this.uploadMarkedData.type}`;
    const flag = 'file';
    for (let i = 0; i < this.fileList.length; i++) {
      const formData = new FormData();
      this.fileList.forEach((file: any, index) => {
        if (index === i) {
          formData.append(flag, file);
        }
      });
      const req = new HttpRequest('POST', url, formData, {
        reportProgress: true,
        headers: new HttpHeaders({ 'Authorization': localStorage.getItem('token') })
      });
      this.http
        .request(req)
        .pipe(filter(e => e instanceof HttpResponse))
        .subscribe((event: HttpResponse<{ code: any, data: any, msg: any }> | any) => {
          if (event.body.retcode === 0) {
            this.notification.success( '提示', '上传成功' );
            const operationInput = { op_category: '新闻词库', op_page: '人工审核', op_name: '上传审核文件' };
            this.commonService.updateOperationlog(operationInput).subscribe();
          } else { this.modalService.error({ nzTitle: '提示', nzContent: event.body.message }); }
          formData.delete(flag);
        },
        err => { formData.delete(flag); }
      );
    }
  }

  // 针对中文进行排序
  sortWords(a, b) {
    return a.word.localeCompare(b.word, 'zh-Hans-CN', {sensitivity: 'accent'});
  }

  // 日期插件
  onChange(result, flag): void {
    if (flag === 'taggingNews') {
      if (result === []) { this.beginSortSpeechDate = ''; this.endSortSpeechDate = ''; return; }
      if (result[0] !== '' || result[1] !== '') {
        if (this.datePipe.transform(result[0], 'HH:mm:ss') === this.datePipe.transform(result[1], 'HH:mm:ss')) {
          this.beginSortSpeechDate = this.datePipe.transform(result[0], 'yyyy-MM-dd' + ' 00:00:00'); this.endSortSpeechDate = this.datePipe.transform(result[1], 'yyyy-MM-dd' + ' 23:59:59');
        } else {
          this.beginSortSpeechDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss'); this.endSortSpeechDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
        }
      }
    } else if (flag === 'sortPage') {
      const begin = this.pageNum.dataSortPage * 10 - 10;
      const end = this.pageNum.dataSortPage * 10 - 1;
      this.dataSortSpeech.forEach((item, index) => { if (index >= begin && index <= end) { item.type = result; } });
    } else if (flag === 'manualAudit') {
      if (result === []) { this.beginTaggingNewsDate = ''; this.endTaggingNewsDate = ''; return; }
      if (result[0] !== '' || result[1] !== '') {
        if (this.datePipe.transform(result[0], 'HH:mm:ss') === this.datePipe.transform(result[1], 'HH:mm:ss')) {
          this.beginTaggingNewsDate = this.datePipe.transform(result[0], 'yyyy-MM-dd' + ' 00:00:00'); this.endTaggingNewsDate = this.datePipe.transform(result[1], 'yyyy-MM-dd' + ' 23:59:59');
        } else {
          this.beginTaggingNewsDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss'); this.endTaggingNewsDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
        }
      }
    } else if (flag === 'newsThesaurusLast') {
      this.pageNum.dataNewsThesaurusNumber -= 1;  // 后台当前页-1
      this.pageNum.dataNewsThesaurusPage = 0;
      this.loadData('newsThesaurusPage');
    } else if (flag === 'newsThesaurusNext') {
      this.pageNum.dataNewsThesaurusNumber += 1;  // 后台当前页+1
      this.pageNum.dataNewsThesaurusPage = 0;
      this.loadData('newsThesaurusPage');
    } else if (flag === 'sortSpeechPage') {
      this.sortSpeechDate.type = '';
    } else if (flag === 'newsNER') {
      if (result === []) { this.beginNewNERDate = ''; this.endNewNERDate = ''; return; }
      if (result[0] !== '' || result[1] !== '') {
        if (this.datePipe.transform(result[0], 'HH:mm:ss') === this.datePipe.transform(result[1], 'HH:mm:ss')) {
          this.beginNewNERDate = this.datePipe.transform(result[0], 'yyyy-MM-dd' + ' 00:00:00'); this.endNewNERDate = this.datePipe.transform(result[1], 'yyyy-MM-dd' + ' 23:59:59');
        } else {
          this.beginNewNERDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss'); this.endNewNERDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
        }
      }
    }
  }

  // 切换面板
  changePanel(flag): void {
    if (flag !== this.currentPanel) {this.loadData(flag); }
    this.currentPanel = flag;
    const operationInput = {
      op_category: '新闻词库',
      op_page: flag === 'taggingNews' ? '人工标注' : flag === 'manualAudit' ? '人工审核' : flag === 'newsThesaurus' ? '新闻词库' : flag === 'newsNER' ? '新闻NER' : '',
      op_name: '访问'
    };
    this.commonService.updateOperationlog(operationInput).subscribe();
  }

}
