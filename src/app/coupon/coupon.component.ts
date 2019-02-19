import { Component, OnInit } from '@angular/core';
import { CommonService } from '../public/service/common.service';
import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NzMessageService, UploadFile, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LocalizationService } from '../public/service/localization.service';
import { ContentService } from '../public/service/content.service';
import { HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';

registerLocaleData(zh);

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {

  isAddContentVisible = false;
  isModifyContentVisible = false;
  loading = false;
  avatarUrl: string;
  searchContentForm: FormGroup;
  addContentForm: FormGroup;
  modifyContentForm: FormGroup;
  now = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  cmsId = '';
  emptyAdd = ['', '', '', '', '', '', ''];  // 清空新增表单
  fileList: UploadFile[] = [];
  imageUrl = '';
  showImageUrl = '';
  currentPanel = '';  // 当前面板
  beginDate = '';
  endDate = '';
  dateSearch = { 'Today': [new Date(), new Date()], 'This Month': [new Date(), new Date()] };
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
  dataContent = []; // 内容
  allChecked = false;
  indeterminate = false;
  displayData = [];
  checkOptions = [
    { label: '活动不可用', value: '活动不可用', checked: true },
    { label: '仅会员可用', value: '仅会员可用' }
  ];
  category = [
    {
      name    : '飞机',
      checked : true,
      disabled: false
    },
    {
      name    : '酒店',
      checked : true,
      disabled: false
    },
    {
      name    : '火车',
      checked : true,
      disabled: false
    },
    {
      name    : '打车',
      checked : true,
      disabled: false
    }
  ];

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
    this.commonService.nav[4].active = true;
    this._initSearchForm();
    this._initAddContentForm();
    this._initModifyContentForm();
  }

  ngOnInit() {
    this.loadData('content');
  }

  loadData(flag) {
    this.contentService.getContentList().subscribe(res => {
      this.dataContent = JSON.parse(res.payload);
    });
  }

  private _initSearchForm(): void {
    this.searchContentForm = this.fb.group({
      aaa: [''],
      bbb: [''],
      ccc: [''],
      ddd: [''],
    });
  }

  doSearch(flag) {

  }

  private _initAddContentForm(): void {
    this.addContentForm = this.fb.group({
      title: [''],
      type: [''],
      url: [''],
      abstractContent: [''],
      content: [''],
      publishTime: [''],
      pseudonym: [''],
    });
  }

  // 新增内容 - 弹框
  showAddModal(flag) {
    this.isAddContentVisible = true;
    this.contentDate = {  // 清空
      'title': '', 'type': '', 'url': '', 'abstractContent': '', 'content': '', 'publishTime': '', 'pseudonym': ''
    };
    this.fileList.splice(0, this.fileList.length);
    this.imageUrl = '';
    this.showImageUrl = '';
    this.emptyAdd = ['', '', '', '', '', '', ''];
  }

  hideAddModal(flag) {
    this.isAddContentVisible = false;
    this.fileList.splice(0, this.fileList.length);
    this.imageUrl = '';
    this.showImageUrl = '';
  }

  // 封装验证新增
  verificationAddContent(flag): boolean {
    let result = true;
    if (this.addContentForm.controls['title'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '标题未填写' });
      result = false;
    } else if (this.addContentForm.controls['type'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '类型未选择' });
      result = false;
    } else if (this.addContentForm.controls['pseudonym'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '发布人未填写' });
      result = false;
    } else if (this.addContentForm.controls['abstractContent'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '摘要未填写' });
      result = false;
    } else if (this.addContentForm.controls['publishTime'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '发布时间未选择' });
      result = false;
    }
    return result;
  }

  // 新增操作
  doSave(flag): void {
    if (!this.verificationAddContent('content')) {
      return;
    }
    const contentInput = {
      'title': this.addContentForm.controls['title'].value,
      'url': this.dotranUrl(this.addContentForm.controls['url'].value),
      'content': this.addContentForm.controls['content'].value,
      'abstractContent': this.addContentForm.controls['abstractContent'].value,
      'pseudonym': this.addContentForm.controls['pseudonym'].value,
      'publishTime': this.datePipe.transform(this.addContentForm.controls['publishTime'].value, 'yyyy-MM-dd HH:mm:ss'),
      'type': this.addContentForm.controls['type'].value,
      'thumbnail': this.imageUrl
    };
    this.contentService.addContent(contentInput).subscribe(res => {
      if (res.retcode === 0) {
        this.modalService.success({ nzTitle: '提示', nzContent: '新增成功' });
        this.hideAddModal('content');
        this.loadData('content');
      } else {
        this.modalService.error({ nzTitle: '提示', nzContent: res.message });
      }
    });
  }

  // 修改
  _initModifyContentForm() {
    this.modifyContentForm = this.fb.group({
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
  verificationModify(flag): boolean {
    let result = true;
    if (this.modifyContentForm.controls['title'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '标题未填写' });
      result = false;
    } else if (this.modifyContentForm.controls['type'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '类型未选择' });
      result = false;
    } else if (this.modifyContentForm.controls['pseudonym'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '发布人未填写' });
      result = false;
    } else if (this.modifyContentForm.controls['abstractContent'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '摘要未填写' });
      result = false;
    } else if (this.modifyContentForm.controls['publishTime'].value === '') {
      this.modalService.error({ nzTitle: '提示', nzContent: '发布时间未选择' });
      result = false;
    }
    return result;
  }

  // 预览修改
  doPreviewContentModify() {
    if (!this.verificationModify('content')) {
      return;
    }
    const url = this.modifyContentForm.controls['url'].value;
    if (url) {
      url.indexOf('`') !== -1 ? window.open(this.dotranUrl(url)) : window.open(url) ;
    } else {
      const title = '<h1><strong>' + this.modifyContentForm.controls['title'].value + '</strong></h1>';
      const pseudonym = '<p><strong>﻿</strong></p><p>创建人：<span style="color: rgb(102, 163, 224);">'
          + this.modifyContentForm.controls['pseudonym'].value + '</span>'
          + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
          + this.datePipe.transform(this.modifyContentForm.controls['publishTime'].value, 'yyyy-MM-dd HH:mm:ss')
          + '</p><p><br></p>';
      this.localizationService.setPreview = title + pseudonym + this.modifyContentForm.controls['content'].value;
      window.open('preview');
    }
  }

  // 修改 - 弹框
  showModifyModal(data, flag) {
    const id = data.id;
    this.isModifyContentVisible = true;
    this.cmsId = id;  // 用于修改
    this.contentService.getContent(id).subscribe(res => {
      // 处理异常处理
      this.contentDate = JSON.parse(res.payload);
      this.contentDate.url = this.dotranUrl(JSON.parse(res.payload).url);
      this.imageUrl = JSON.parse(res.payload).thumbnail;
      const file: any = {
        name: JSON.parse(res.payload).thumbnail
      };
      this.fileList.push(file);
      this.showImageUrl = 'http://account-center-test.chewrobot.com/api/cms/notices/thumbnails/' + JSON.parse(res.payload).thumbnail;
    });
  }

  hideModifyModal(flag) {
    this.isModifyContentVisible = false;
    this.fileList.splice(0, this.fileList.length);
    this.imageUrl = '';
    this.showImageUrl = '';
  }

  // 修改操作
  doModify(flag) {
    if (!this.verificationModify('content')) {
      return;
    }
    const contentInput = {
      'id': this.cmsId,
      'title': this.modifyContentForm.controls['title'].value,
      'url': this.dotranUrl(this.modifyContentForm.controls['url'].value),
      'content': this.dotran(this.modifyContentForm.controls['content'].value),
      'abstractContent': this.modifyContentForm.controls['abstractContent'].value,
      'pseudonym': this.modifyContentForm.controls['pseudonym'].value,
      'publishTime': this.datePipe.transform(this.modifyContentForm.controls['publishTime'].value, 'yyyy-MM-dd HH:mm:ss'),
      'type': this.modifyContentForm.controls['type'].value,
      'thumbnail': this.imageUrl
    };
    this.contentService.updateContent(contentInput).subscribe(res => {
      if (res.retcode === 0) {
        this.modalService.success({ nzTitle: '提示', nzContent: '修改成功' });
        this.hideModifyModal('content');
        this.loadData('content');
      } else {
        this.modalService.error({ nzTitle: '提示', nzContent: res.message });
      }
    });
  }

  // 删除 - 复用弹框
  showDeleteModal(data, flag) {
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: '您确定要删除该信息？',
      nzOkText: '确定',
      nzOnOk: () => this.doDelete(data.id, flag)
    });
  }

  doDelete(id, flag) {
    this.contentService.deleteContent(id).subscribe(res => {
      if (res.retcode === 0) {
        this.modalService.success({ nzTitle: '提示', nzContent: '删除成功' });
        this.loadData('content');
      } else {
        this.modalService.error({ nzTitle: '提示', nzContent: res.message });
      }
    });
  }












  // 日期插件
  onChange(result: Date): void {
    // 正确选择数据
    if (result[0] !== '' || result[1] !== '') {
      this.beginDate = this.datePipe.transform(result[0], 'yyyyMMdd');
      this.endDate = this.datePipe.transform(result[1], 'yyyyMMdd');
    }
    // 手动点击清空
    if (this.beginDate === null || this.endDate === null) {
      this.beginDate = this.commonService.getDay(-7);
      this.endDate = this.commonService.getDay(-1);
    }
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

  // 切换面板
  changePanel(flag): void {
    this.currentPanel = flag;
  }







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

  checkAll(value: boolean): void {
    this.displayData.forEach(category => {
      if (!category.disabled) {
        category.checked = value;
      }
    });
    this.refreshStatus();
  }
}
