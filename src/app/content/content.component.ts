import { Component, OnInit } from '@angular/core';
import { CommonService } from '../public/service/common.service';
import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NzMessageService, UploadFile, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalizationService } from '../public/service/localization.service';
import { ContentService } from '../public/service/content.service';
import { HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';

registerLocaleData(zh);

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  isAddVisible = false;
  isModifyVisible = false;
  loading = false;
  avatarUrl: string;
  addForm: FormGroup;  // 新增表单
  modifyForm: FormGroup;  // 修改表单
  now = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  contentId = '';
  emptyAdd = ['', '', '', '', '', '', ''];  // 清空新增表单
  fileList: UploadFile[] = [];
  imageUrl = '';
  showImageUrl = '';
  contentDate = {
    'title': '',
    'type': '',
    'url': '',
    'abstractContent': '',
    'content': '',
    'publishTime': '',
    'pseudonym': ''
  };
  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
      [{ 'size': ['0.26rem', '0.31rem', '0.37rem', '0.41rem', '0.47rem', '0.52rem'] }], // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                         // remove formatting button
      ['link', 'video']                         // link and image, video
    ]
  };
  dataSet = [];

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private msg: NzMessageService,
    private modalService: NzModalService,
    public localizationService: LocalizationService,
    private contentService: ContentService,
    private notification: NzNotificationService,
    private datePipe: DatePipe,
    private http: HttpClient,
  ) {
    this.commonService.nav[2].active = true;
    this._initAddForm();
    this._initModifyForm();
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.contentService.getContentList().subscribe(res => {
      this.dataSet = JSON.parse(res.payload);
      console.log(this.dataSet);
    });
  }

  // 预览文章
  doPreview(data) {
    if (data.url) {
      data.url.indexOf('`') !== -1 ? window.open(this.dotranUrl(data.url)) : window.open(data.url) ;
    } else {
      const title = '<h1><strong>' + data.title + '</strong></h1>';
      const pseudonym = '<p><strong>﻿</strong></p><p>创建人：<span style="color: rgb(102, 163, 224);">'
          + data.pseudonym + '</span>'
          + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.publishTime + '</p><p><br></p>';
      this.localizationService.setPreview = title + pseudonym + data.content;
      window.open('preview');
    }
  }

  private _initAddForm(): void {
    this.addForm = this.fb.group({
      title: [''],
      type: [''],
      url: [''],
      abstractContent: [''],
      content: [''],
      publishTime: [''],
      pseudonym: [''],
    });
  }

  // 新增 - 弹框
  showAddModal() {
    this.isAddVisible = true;
    this.fileList.splice(0, this.fileList.length);
    this.imageUrl = '';
    this.showImageUrl = '';
    this.emptyAdd = ['', '', '', '', '', '', ''];
    this.contentDate = {  // 清空
      'title': '',
      'type': '',
      'url': '',
      'abstractContent': '',
      'content': '',
      'publishTime': '',
      'pseudonym': ''
    };
  }

  hideAddModal() {
    this.isAddVisible = false;
    this.fileList.splice(0, this.fileList.length);
    this.imageUrl = '';
    this.showImageUrl = '';
  }

  // 封装验证新增
  verificationAdd(): boolean {
    let result = true;
    if (this.addForm.controls['title'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '标题未填写' });
      result = false;
    } else if (this.addForm.controls['type'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '类型未选择' });
      result = false;
    } else if (this.addForm.controls['pseudonym'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '发布人未填写' });
      result = false;
    } else if (this.addForm.controls['abstractContent'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '摘要未填写' });
      result = false;
    } else if (this.addForm.controls['publishTime'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '发布时间未选择' });
      result = false;
    }
    return result;
  }

  // 新增操作
  doSave(): void {
    if (!this.verificationAdd()) {
      return;
    }
    const contentInput = {
      'title': this.addForm.controls['title'].value,
      'url': this.dotranUrl(this.addForm.controls['url'].value),
      'content': this.addForm.controls['content'].value,
      'abstractContent': this.addForm.controls['abstractContent'].value,
      'pseudonym': this.addForm.controls['pseudonym'].value,
      'publishTime': this.datePipe.transform(this.addForm.controls['publishTime'].value, 'yyyy-MM-dd HH:mm:ss'),
      'type': this.addForm.controls['type'].value,
      'thumbnail': this.imageUrl
    };
    this.contentService.addContent(contentInput).subscribe(res => {
      if (res.retcode === 0) {
        this.modalService.success({
          nzTitle: '提示',
          nzContent: '新增成功'
        });
        this.hideAddModal();
        this.loadData();
      } else {
        this.modalService.error({
          nzTitle: '提示',
          nzContent: res.message
        });
      }
    });
  }

  // 预览新增
  doPreviewAdd() {
    if (!this.verificationAdd()) {
      return;
    }
    const url = this.addForm.controls['url'].value;
    if (url) {
      url.indexOf('`') !== -1 ? window.open(this.dotranUrl(url)) : window.open(url) ;
    } else {
      const title = '<h1><strong>' + this.addForm.controls['title'].value + '</strong></h1>';
      const pseudonym = '<p><strong>﻿</strong></p><p>创建人：<span style="color: rgb(102, 163, 224);">'
          + this.addForm.controls['pseudonym'].value + '</span>'
          + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
          + this.datePipe.transform(this.addForm.controls['publishTime'].value, 'yyyy-MM-dd HH:mm:ss')
          + '</p><p><br></p>';
      this.localizationService.setPreview = title + pseudonym + this.addForm.controls['content'].value;
      window.open('preview');
    }
  }

  // 上传image
  beforeUpload = (file: UploadFile): boolean => {
    const suffix = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
    const isPng = suffix === '.png' || suffix === '.jpeg' || suffix === '.jpg' || suffix === '.ico' ? true : false;
    const isMoreThanTen = file.size < 10485760 ? true : false;
    if (!isPng) {
      this.msg.error('您只能上传.png、.jpeg、.jpg、.ico、文件');
    } else if (!isMoreThanTen) {
      this.msg.error('您只能上传不超过10M文件');
    } else {
      this.fileList.push(file);
      this.handleUpload();
    }
    return false;
  }

  // 点击上传
  handleUpload(): void {
    // 文件数量不可超过1个，超过一个则提示
    if (this.fileList.length > 1) {
      this.notification.error(
        '提示', '您上传的文件超过一个！'
      );
      return;
    }
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('thumbnail', file);
    });
    const req = new HttpRequest('POST', `http://account-center-test.chewrobot.com/api/notices/thumbnails`, formData, {
      reportProgress: true
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe((event: HttpResponse<{ code: any, data: any, msg: any }> | any) => {
        if (event.body.retcode === 0) {
          this.imageUrl = event.body.payload;
          this.showImageUrl = 'http://account-center-test.chewrobot.com/api/notices/thumbnails/' + this.imageUrl;
          this.notification.success(
            '提示', '上传成功'
          );
        } else {
          this.modalService.error({
            nzTitle: '提示',
            nzContent: event.body.message,
          });
        }
        formData.delete('thumbnail');
      },
      err => {
        formData.delete('thumbnail');
      }
    );
  }

  // 修改
  _initModifyForm() {
    this.modifyForm = this.fb.group({
      title: [''],
      type: [''],
      url: [''],
      abstractContent: [''],
      content: [''],
      publishTime: [''],
      pseudonym: [''],
    });
  }

  // 封装验证修改表单
  verificationModify(): boolean {
    let result = true;
    if (this.modifyForm.controls['title'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '标题未填写' });
      result = false;
    } else if (this.modifyForm.controls['type'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '类型未选择' });
      result = false;
    } else if (this.modifyForm.controls['pseudonym'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '发布人未填写' });
      result = false;
    } else if (this.modifyForm.controls['abstractContent'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '摘要未填写' });
      result = false;
    } else if (this.modifyForm.controls['publishTime'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '发布时间未选择' });
      result = false;
    }
    return result;
  }

  // 预览修改
  doPreviewModify() {
    if (!this.verificationModify()) {
      return;
    }
    const url = this.modifyForm.controls['url'].value;
    if (url) {
      url.indexOf('`') !== -1 ? window.open(this.dotranUrl(url)) : window.open(url) ;
    } else {
      const title = '<h1><strong>' + this.modifyForm.controls['title'].value + '</strong></h1>';
      const pseudonym = '<p><strong>﻿</strong></p><p>创建人：<span style="color: rgb(102, 163, 224);">'
          + this.modifyForm.controls['pseudonym'].value + '</span>'
          + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
          + this.datePipe.transform(this.modifyForm.controls['publishTime'].value, 'yyyy-MM-dd HH:mm:ss')
          + '</p><p><br></p>';
      this.localizationService.setPreview = title + pseudonym + this.modifyForm.controls['content'].value;
      window.open('preview');
    }
  }

  // 修改 - 弹框
  showModifyModal(data) {
    console.log(data.content);
    const id = data.id;
    this.isModifyVisible = true;
    this.contentId = id;  // 用于修改
    this.contentService.getContent(id).subscribe(res => {
      // 处理异常处理
      this.contentDate = JSON.parse(res.payload);
      this.contentDate.url = this.dotranUrl(JSON.parse(res.payload).url);
      this.imageUrl = JSON.parse(res.payload).thumbnail;
      const file: any = {
        name: JSON.parse(res.payload).thumbnail
      };
      this.fileList.push(file);
      this.showImageUrl = 'http://account-center-test.chewrobot.com/api/notices/thumbnails/' + JSON.parse(res.payload).thumbnail;
    });
  }

  hideModifyModal() {
    this.isModifyVisible = false;
    this.fileList.splice(0, this.fileList.length);
    this.imageUrl = '';
    this.showImageUrl = '';
  }

  // 修改操作
  doModify(): void {
    if (!this.verificationModify()) {
      return;
    }
    const contentInput = {
      'id': this.contentId,
      'title': this.modifyForm.controls['title'].value,
      'url': this.dotranUrl(this.modifyForm.controls['url'].value),
      'content': this.dotran(this.modifyForm.controls['content'].value),
      'abstractContent': this.modifyForm.controls['abstractContent'].value,
      'pseudonym': this.modifyForm.controls['pseudonym'].value,
      'publishTime': this.datePipe.transform(this.modifyForm.controls['publishTime'].value, 'yyyy-MM-dd HH:mm:ss'),
      'type': this.modifyForm.controls['type'].value,
      'thumbnail': this.imageUrl
    };
    this.contentService.updateContent(contentInput).subscribe(res => {
      if (res.retcode === 0) {
        this.modalService.success({
          nzTitle: '提示',
          nzContent: '修改成功'
        });
        this.hideModifyModal();
        this.loadData();
      } else {
        this.modalService.error({
          nzTitle: '提示',
          nzContent: res.message
        });
      }
    });
  }

  // 转换 url 的 & 字符
  dotranUrl(url) {
    if (url.indexOf('`') !== -1) {
      url = url.replace(/`/g, '&');
    } else {
      url = url.replace(/&/g, '`');
    }
    return url;
  }

  // 转换 html 为 json
  dotran(str) {
    // str = str.replace(/"/g, '//"', str);
    // str = str.replace(/\/r\/n/g, '//r//n', str);
    // str = str.replace(/\/t/g, '//t', str);
    // str = str.replace(/\/\//g, '//', str);
    // str = str.replace(/\/b/g, '//b', str);
    return str;
  }

  // 转换 json 为 html
  dotranJson(str) {
    str = str.replace(/\/\/"/g, '"', str);
    str = str.replace(/\/\/r\/\/n/g, '/r/n', str);
    str = str.replace(/\/\/t/g, '/t', str);
    str = str.replace(/\/\/b/g, '/b', str);
    return str;
  }

  // 删除 - 弹框
  showDeleteModal(data) {
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: '您确定要删除该内容？',
      nzOkText: '确定',
      nzOnOk: () => this.doDelete(data.id)
    });
  }

  doDelete(id) {
    this.contentService.deleteContent(id).subscribe(res => {
      if (res.retcode === 0) {
        this.modalService.success({
          nzTitle: '提示',
          nzContent: '删除成功'
        });
        this.loadData();
      } else {
        this.modalService.error({
          nzTitle: '提示',
          nzContent: res.message
        });
      }
    });
  }

}
