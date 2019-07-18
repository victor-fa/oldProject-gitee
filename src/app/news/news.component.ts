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

  @Input()
  private sortSpeechPage = 0;
  isSortSpeechVisible = false;
  isManualAuditVisible = false;
  isUploadAuditVisible = false;
  isNewsThesaurusVisible = false;
  taggingNewsSearchForm: FormGroup;
  manualAuditSearchForm: FormGroup;
  newsThesaurusSearchForm: FormGroup;
  newsNERSearchForm: FormGroup;
  sortSpeechDate = { 'type': '' };
  dataSortSpeech = [{word: '', type: '', index: 0}];
  dataTaggingNews = [];
  dataManualAudit = [];
  dataNewsThesaurus = [];
  uploadMarkedData = {type: 'PERSON'};
  newsThesaurusData = {type: 'PERSON'};
  isSpinning = false;
  beginSortSpeechDate = '';
  endSortSpeechDate = '';
  beginTaggingNewsDate = '';
  endTaggingNewsDate = '';
  tempId = '';
  currentPanel = 'taggingNews';
  fileList: UploadFile[] = [];

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
    this.loadData('taggingNews');
  }

  loadData(flag) {
    this.isSpinning = true;
    if (flag === 'taggingNews') {
      const taggingNewsInput = {
        status: this.taggingNewsSearchForm.controls['status'].value,
        uploadTimeCeil: this.beginSortSpeechDate,
        uploadTimeFloor: this.endSortSpeechDate,
      };
      this.newsService.getTaggingNewsList(taggingNewsInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataTaggingNews = JSON.parse(res.payload).content;
          console.log(this.dataTaggingNews);
          const operationInput = { op_category: '新闻词库', op_page: '人工标注', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'manualAudit') {
      const manualAuditInput = {
        submitter: this.manualAuditSearchForm.controls['submitter'].value,
        status: this.manualAuditSearchForm.controls['status'].value,
        submitTimeCeil: this.beginTaggingNewsDate,
        submitTimeFloor: this.endTaggingNewsDate,
      };
      this.newsService.getManualAuditList(manualAuditInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataManualAudit = JSON.parse(res.payload).content;
          console.log(this.dataManualAudit);
          const operationInput = { op_category: '新闻词库', op_page: '人工标注', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'newsThesaurus') {
      const newsThesaurusInput = {
        name: this.newsThesaurusSearchForm.controls['name'].value,
        type: this.newsThesaurusSearchForm.controls['type'].value,
        submitTimeCeil: this.beginTaggingNewsDate,
        submitTimeFloor: this.endTaggingNewsDate,
      };
      this.newsService.getNewsThesaurusList(newsThesaurusInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataNewsThesaurus = JSON.parse(res.payload).content;
          console.log(this.dataNewsThesaurus);
          const operationInput = { op_category: '新闻词库', op_page: '人工标注', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  private _initForm(): void {
    this.taggingNewsSearchForm = this.fb.group({ status: [''], date: [''], });
    this.manualAuditSearchForm = this.fb.group({ submitter: [''], status: [''], date: [''], });
    this.newsThesaurusSearchForm = this.fb.group({ type: [''], name: [''], date: [''], });
    this.newsNERSearchForm = this.fb.group({ aaa: [''], date: [''], });
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
          this.dataSortSpeech = JSON.parse(res.payload).words;
          this.dataSortSpeech.forEach((item, index) => {
            item.index = index;
          });
          const operationInput = { op_category: '新闻词库', op_page: '人工标注', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
      this.isSortSpeechVisible = true;
    } else if (flag === 'submitTagAudit') {
      this.modalService.confirm({
        nzTitle: '提交审核', nzContent: '确认提交审核吗？', nzCancelText: '取消',
        nzOnCancel: () => 1, nzOkText: '确定', nzOnOk: () => { this.doSomething(data, flag); }
      });
    } else if (flag === 'uploadAudit') {  // 上传审核
      this.isUploadAuditVisible = true;
    } else if (flag === 'manualAudit') {
      this.tempId = data.id;
      const taggingNewsInput = {
        id: data.id,
      };
      this.newsService.getTaggingNewsById(taggingNewsInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataSortSpeech = JSON.parse(res.payload).words;
          this.dataSortSpeech.forEach((item, index) => {
            item.index = index;
          });
          const operationInput = { op_category: '新闻词库', op_page: '人工标注', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
      this.isManualAuditVisible = true;
    } else if (flag === 'updateLoading') {
      this.modalService.confirm({
        nzTitle: '确认更新', nzContent: '确认更新到词库吗？', nzCancelText: '取消',
        nzOnCancel: () => 1, nzOkText: '确定', nzOnOk: () => { this.doSomething(data, flag); }
      });
    } else if (flag === 'modifyNewsThesaurus') {  // 修改词性
      this.tempId = data.word;
      this.newsThesaurusData.type = data.type;
      this.isNewsThesaurusVisible = true;
    } else if (flag === 'deleteNewsThesaurus') {
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
      this.newsService.submitSpeech(submitInput).subscribe(res => {
        if (res.retcode === 0) {
          if (res.payload !== '') {
            this.notification.blank( '提示', '提交成功', { nzStyle: { color : 'green' } });
            const operationInput = { op_category: '新闻词库', op_page: '人工标注', op_name: '提交审核' };
            this.commonService.updateOperationlog(operationInput).subscribe();
            setTimeout(() => {this.loadData('taggingNews'); }, 500);
          } else {
            this.modalService.error({ nzTitle: '提示', nzContent: res.message });
          }
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
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
          } else {
            this.modalService.error({ nzTitle: '提示', nzContent: res.message });
          }
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
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
          } else {
            this.modalService.error({ nzTitle: '提示', nzContent: res.message });
          }
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  // 隐藏
  hideModal(flag) {
    if (flag === 'sortSpeech') {
      this.isSortSpeechVisible = false;
    } else if (flag === 'manualAudit') {
      this.isManualAuditVisible = false;
    } else if (flag === 'uploadMarked') {
      this.isUploadAuditVisible = false;
    } else if (flag === 'modifyNewsThesaurus') {
      this.isNewsThesaurusVisible = false;
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
  doSave(flag): void {
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
          this.loadData('sortSpeech');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'manualAudit') {
      const arr = [];
      this.dataSortSpeech.forEach(item => {
        arr.push({word: item.word, type: item.type });
      });
      const confirmInput = {id: this.tempId, words: arr };
      console.log(confirmInput);
      this.newsService.confirmSpeech(confirmInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '审核通过成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '新闻词库', op_page: (flag === 'sortSpeech' ? '人工标注' : '人工审核'), op_name: '审核通过' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('manualAudit');
          this.loadData('manualAudit');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'modifyNewsThesaurus') {
      const deleteInput = {newsWord: {type: this.newsThesaurusData.type, word: this.tempId}, };
      this.newsService.updateNewWords(deleteInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '新闻词库', op_page: '人工标注', op_name: '更新审核进度' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('modifyNewsThesaurus');
          setTimeout(() => {this.loadData('newsThesaurus'); }, 500);
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  // 上传image
  beforeUpload = (file: UploadFile): boolean => {
    const suffix = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
    // const isPng = suffix === '.doc' || suffix === '.docx' ? true : false;
    const isPng = suffix === '.txt' ? true : false;
    const isMoreThanTen = file.size < 512000 ? true : false;  // 512000
    if (!isPng) {
      // this.msg.error('您只能上传.doc、.docx文件');
      this.msg.error('您只能上传.txt文件');
    } else if (!isMoreThanTen) {
      this.msg.error('您只能上传不超过500K文件');
    } else {
      this.fileList.push(file);
      this.handleUpload();
      this.hideModal('uploadMarked');
      setTimeout(() => {
        this.loadData('manualAudit');
      }, 500);
    }
    return false;
  }

  // 点击上传
  handleUpload(): void {
    const url = `${this.commonService.baseUrl}/news/word-sets/marked/${this.uploadMarkedData.type}`;
    const flag = 'file';
    // 文件数量不可超过1个，超过一个则提示
    if (this.fileList.length > 1) {
      this.notification.error(
        '提示', '您上传的文件超过一个！'
      );
      return;
    }
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append(flag, file);
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
          console.log(event);
          this.notification.success( '提示', '上传成功' );
          const operationInput = { op_category: '新闻词库', op_page: '人工审核', op_name: '上传审核文件' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: event.body.message, });
        }
        formData.delete(flag);
      },
      err => { formData.delete(flag); }
    );
  }

  // 日期插件
  onChange(result, flag): void {
    if (flag === 'taggingNews') {
      if (result === []) {
        this.beginSortSpeechDate = '';
        this.endSortSpeechDate = '';
        return;
      }
      // 正确选择数据
      if (result[0] !== '' || result[1] !== '') {
        this.beginSortSpeechDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss');
        this.endSortSpeechDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
      }
    } else if (flag === 'sortPage') {
      console.log(result);
    } else if (flag === 'sortCell') {
      console.log(result);
    } else if (flag === 'manualAudit') {
      if (result === []) {
        this.beginTaggingNewsDate = '';
        this.endTaggingNewsDate = '';
        return;
      }
      // 正确选择数据
      if (result[0] !== '' || result[1] !== '') {
        this.beginTaggingNewsDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss');
        this.endTaggingNewsDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
      }
    }
  }

  // 切换面板
  changePanel(flag): void {
    if (flag !== this.currentPanel) { this.loadData(flag); }
    this.currentPanel = flag;
    const operationInput = {
      op_category: '内容管理',
      // tslint:disable-next-line:max-line-length
      op_page: flag === 'taggingNews' ? '新闻词库' : flag === 'manualAudit' ? '人工审核' : flag === 'newsThesaurus' ? '新闻词库' : flag === 'newsNER' ? '新闻NER' : '',
      op_name: '访问'
    };
    this.commonService.updateOperationlog(operationInput).subscribe();
  }

}
