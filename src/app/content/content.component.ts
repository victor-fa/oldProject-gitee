import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalService, NzNotificationService, UploadFile } from 'ng-zorro-antd';
import { filter } from 'rxjs/operators';
import { BannerService } from '../public/service/banner.service';
import { CommonService } from '../public/service/common.service';
import { ContentService } from '../public/service/content.service';
import { LocalizationService } from '../public/service/localization.service';
import { OpenService } from '../public/service/open.service';
import { ScreenService } from '../public/service/screen.service';
import { PersonalService } from '../public/service/personal.service';

registerLocaleData(zh);

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
/**
 *
 * 删除是统一入口，通过flag区分没有
 */
export class ContentComponent implements OnInit {

  isAddContentVisible = false;
  isModifyContentVisible = false;
  isAddScreenVisible = false;
  isModifyScreenVisible = false;
  isAddOpenVisible = false;
  isModifyOpenVisible = false;
  isAddBannerVisible = false;
  isModifyBannerVisible = false;
  isAddPersonalVisible = false;
  isModifyPersonalVisible = false;
  avatarUrl: string;
  addContentForm: FormGroup;
  addScreenForm: FormGroup;
  addOpenForm: FormGroup;
  addBannerForm: FormGroup;
  addPersonalForm: FormGroup;
  modifyContentForm: FormGroup;
  modifyScreenForm: FormGroup;
  modifyOpenForm: FormGroup;
  modifyBannerForm: FormGroup;
  modifyPersonalForm: FormGroup;
  jumpForScreen = 'DISABLED';
  jumpForOpen = 'DISABLED';
  jumpForBanner = 'DISABLED';
  jumpForPersonal = 'DISABLED';
  displayModeForOpen = 'ONCE';
  now = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  cmsId = '';
  emptyAdd = ['', '', '', '', '', '', '', '', ''];  // 清空新增表单
  fileList: UploadFile[] = [];
  imageUrl = '';
  showImageUrl = '';
  currentPanel = 'content';  // 当前面板 默认内容管理
  contentDate = { 'title': '', 'type': '', 'url': '', 'abstractContent': '', 'content': '', 'publishTime': '', 'pseudonym': '' };
  screenDate = { 'title': '', 'site': '', 'enabled': '', 'jump': '', 'image': '', 'skip': '', 'duration': '', 'url': '', 'expireTime': '' };
  openDate = { 'title': '', 'enabled': '', 'jump': '', 'site': '', 'order': '', 'image': '', 'url': '', 'expireTime': '' };
  bannerDate = { 'title': '', 'jump': '', 'enabled': '', 'site': '', 'order': '', 'image': '', 'url': '', 'expireTime': '' };
  personalDate = { 'title': '', 'jump': '', 'enabled': '', 'site': '', 'image': '', 'url': '', 'expireTime': '' };
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
  dataScreen = [];  // 首屏
  dataOpen = [];  // 弹窗
  dataBanner = [];  // 轮播
  dataPersonal = [];  // 个人中心
  currentCopywritingImage = '';
  currentAppId = '';  // 当前默认的APP信息
  isSpinning = false;

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private msg: NzMessageService,
    private modalService: NzModalService,
    public localizationService: LocalizationService,
    private contentService: ContentService,
    private screenService: ScreenService,
    private bannerService: BannerService,
    private personalService: PersonalService,
    private openService: OpenService,
    private notification: NzNotificationService,
    private datePipe: DatePipe,
    private http: HttpClient,
  ) {
    this.commonService.nav[5].active = true;
    this._initForm();
  }

  ngOnInit() {
    this.loadData('content');
    this.changePanel('content');
  }

  loadData(flag) {
    this.isSpinning = true;
    if (flag === 'content') {
      this.contentService.getContentList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataContent = JSON.parse(res.payload).reverse();
          const operationInput = { op_category: '内容管理', op_page: '内容发布', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'screen') {
      this.screenService.getScreenList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataScreen = JSON.parse(res.payload).reverse();
          const operationInput = { op_category: '内容管理', op_page: '开屏启动', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'open') {
      this.openService.getOpenList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataOpen = JSON.parse(res.payload).reverse();
          const operationInput = { op_category: '内容管理', op_page: '首页弹窗', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          console.log(this.dataOpen);
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'banner') {
      this.bannerService.getBannerList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataBanner = JSON.parse(res.payload).reverse();
          const operationInput = { op_category: '内容管理', op_page: '轮播图', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'personal') {
      this.personalService.getPersonalList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataPersonal = JSON.parse(res.payload).reverse();
          console.log(this.dataPersonal);
          const operationInput = { op_category: '内容管理', op_page: '个人中心', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  private _initForm(): void {
    this.addContentForm = this.fb.group({
      title: [''], type: [''], url: [''], abstractContent: [''], content: [''], publishTime: [''], pseudonym: [''],
    });
    this.addScreenForm = this.fb.group({ title: [''], jump: [''], skip: [''], site: [''], duration: [''], url: [''], expireTime: [''] });
    this.addOpenForm = this.fb.group({
      title: [''], jump: [''], site: [''], order: [''], url: [''], displayModeForOpen: [''], maxDisplay: [''], expireTime: ['']
    });
    this.addBannerForm = this.fb.group({ jump: [''], title: [''], site: [''], order: [''], url: [''], expireTime: [''] });
    this.addPersonalForm = this.fb.group({ jump: [''], title: [''], site: [''], url: [''], expireTime: [''] });
    this.modifyContentForm = this.fb.group({
      title: [''], type: [''], url: [''], abstractContent: [''], content: [''], publishTime: [''], pseudonym: [''],
    });
    this.modifyScreenForm = this.fb.group({ title: [''], jump: [''], site: [''], skip: [''], duration: [''], url: [''], expireTime: [''] });
    this.modifyOpenForm = this.fb.group({
      title: [''], jump: [''], site: [''], order: [''], url: [''], displayModeForOpen: [''], maxDisplay: [''], expireTime: ['']
    });
    this.modifyBannerForm = this.fb.group({ jump: [''], title: [''], site: [''], order: [''], url: [''], expireTime: [''] });
    this.modifyPersonalForm = this.fb.group({ jump: [''], title: [''], site: [''], url: [''], expireTime: [''] });
  }

  // 新增内容 - 弹窗
  showAddModal(flag) {
    if (flag === 'content') {
      this.isAddContentVisible = true;
      this.contentDate = {  // 清空
        'title': '', 'type': '', 'url': '', 'abstractContent': '', 'content': '', 'publishTime': '', 'pseudonym': ''
      };
    } else if (flag === 'screen') {
      this.isAddScreenVisible = true;
      this.screenDate = {  // 清空
        'title': '', 'site': '', 'enabled': '', 'jump': '', 'image': '', 'skip': '', 'duration': '', 'url': '', 'expireTime': ''
      };
    } else if (flag === 'open') {
      this.isAddOpenVisible = true;
      this.openDate = {  // 清空
        'title': '', 'enabled': '', 'jump': '', 'site': '', 'order': '', 'image': '', 'url': '', 'expireTime': ''
      };
    } else if (flag === 'banner') {
      this.isAddBannerVisible = true;
      this.bannerDate = { // 清空
        'title': '', 'jump': '', 'enabled': '', 'site': '', 'order': '', 'image': '', 'url': '', 'expireTime': ''
      };
    } else if (flag === 'personal') {
      this.isAddPersonalVisible = true;
      this.personalDate = { // 清空
        'title': '', 'jump': '', 'enabled': '', 'site': '', 'image': '', 'url': '', 'expireTime': ''
      };
    }
    this.fileList.splice(0, this.fileList.length);
    this.imageUrl = '';
    this.showImageUrl = '';
    this.emptyAdd = ['', '', '', '', '', '', ''];
  }

  hideAddModal(flag) {
    if (flag === 'content') {
      this.isAddContentVisible = false;
    } else if (flag === 'screen') {
      this.isAddScreenVisible = false;
    } else if (flag === 'open') {
      this.isAddOpenVisible = false;
    } else if (flag === 'banner') {
      this.isAddBannerVisible = false;
    } else if (flag === 'personal') {
      this.isAddPersonalVisible = false;
    }
    this.fileList.splice(0, this.fileList.length);
    this.imageUrl = '';
    this.showImageUrl = '';
  }

  // 封装验证新增
  verificationAdd(flag): boolean {
    let result = true;
    if (flag === 'content') {
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
    } else if (flag === 'screen') {
      if (this.addScreenForm.controls['title'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '开屏标题未填写' });
        result = false;
      } else if (this.addScreenForm.controls['duration'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '持续时间未填写' });
        result = false;
      } else if (this.addScreenForm.controls['jump'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '链接跳转状态未选择' });
        result = false;
      }
    } else if (flag === 'open') {
      if (this.addOpenForm.controls['title'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '弹窗标题未填写' });
        result = false;
      } else if (this.addOpenForm.controls['jump'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '跳转位置未选择' });
        result = false;
      }
      // } else if (this.addOpenForm.controls['order'].value === '') {
      //   this.modalService.error({ nzTitle: '提示', nzContent: '排序状态未填写' });
      //   result = false;
      // }
    } else if (flag === 'banner') {
      if (this.addBannerForm.controls['title'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '轮播图标题未填写' });
        result = false;
      } else if (this.addBannerForm.controls['jump'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '跳转位置未选择' });
        result = false;
      } else if (this.addBannerForm.controls['order'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '排序状态未填写' });
        result = false;
      }
    } else if (flag === 'banner') {
      if (this.addPersonalForm.controls['title'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '轮播图标题未填写' });
        result = false;
      } else if (this.addPersonalForm.controls['jump'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '跳转位置未选择' });
        result = false;
      }
    }
    if (this.fileList.length !== 1) {
      this.modalService.error({ nzTitle: '提示', nzContent: '未上传图片' });
      result = false;
    }
    return result;
  }

  // 替换所有奇怪字符
  replaceHtmlStr(str) {
    return str = str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, '\'')
          .replace(/&quot;/g, '"').replace(/&nbsp;/g, '<br>').replace(/&ensp;/g, '   ')
          .replace(/&emsp;/g, '    ').replace(/%/g, '%').replace(/&amp;/g, '&');
  }

  // 新增操作
  doSave(flag): void {
    if (flag === 'content') {
      if (!this.verificationAdd('content')) {
        return;
      }
      const contentInput = {
        'title': this.addContentForm.controls['title'].value,
        'url': this.dotranUrl(this.addContentForm.controls['url'].value),
        'content': encodeURI(this.replaceHtmlStr(this.addContentForm.controls['content'].value)).replace(/&/g, '%26'),
        'abstractContent': this.addContentForm.controls['abstractContent'].value,
        'pseudonym': this.addContentForm.controls['pseudonym'].value,
        'publishTime': this.datePipe.transform(this.addContentForm.controls['publishTime'].value, 'yyyy-MM-dd HH:mm:ss'),
        'type': this.addContentForm.controls['type'].value,
        'thumbnail': this.imageUrl
      };
      this.contentService.addContent(contentInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '内容管理', op_page: '内容发布', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideAddModal('content');
          this.loadData('content');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'screen') {
      if (!this.verificationAdd('screen')) {
        return;
      }
      const screenInput = {
        'enabled': false, // 默认不可启用
        'title': this.addScreenForm.controls['title'].value,
        'site': this.addScreenForm.controls['site'].value,
        'jump': this.addScreenForm.controls['jump'].value,
        'image': this.imageUrl,
        'skip': this.addScreenForm.controls['skip'].value,
        'duration': this.addScreenForm.controls['duration'].value,
        'url': this.addScreenForm.controls['url'].value,
        'expireTime': this.datePipe.transform(this.addScreenForm.controls['expireTime'].value, 'yyyy-MM-dd HH:mm:ss')
      };
      this.screenService.addScreen(screenInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '内容管理', op_page: '开屏启动', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideAddModal('screen');
          this.loadData('screen');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'open') {
      if (!this.verificationAdd('open')) {
        return;
      }
      const maxDisplay = this.addOpenForm.controls['maxDisplay'].value;
      const openInput = {
        'enabled': false, // 默认不可启用
        'title': this.addOpenForm.controls['title'].value,
        'site': this.addOpenForm.controls['site'].value,
        'jump': this.addOpenForm.controls['jump'].value,
        'image': this.imageUrl,
        'order': this.addOpenForm.controls['order'].value,
        'url': this.addOpenForm.controls['url'].value,
        'displayMode': this.displayModeForOpen,
        'maxDisplay': maxDisplay === undefined ? 0 : maxDisplay,
        'expireTime': this.datePipe.transform(this.addOpenForm.controls['expireTime'].value, 'yyyy-MM-dd HH:mm:ss')
      };
      this.openService.addOpen(openInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '内容管理', op_page: '首页弹窗', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideAddModal('open');
          this.loadData('open');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'banner') {
      if (!this.verificationAdd('banner')) {
        return;
      }
      const bannerInput = {
        'enabled': false, // 默认不可启用
        'title': this.addBannerForm.controls['title'].value,
        'site': this.addBannerForm.controls['site'].value,
        'jump': this.addBannerForm.controls['jump'].value,
        'image': this.imageUrl,
        'order': this.addBannerForm.controls['order'].value,
        'url': this.addBannerForm.controls['url'].value,
        'expireTime': this.datePipe.transform(this.addBannerForm.controls['expireTime'].value, 'yyyy-MM-dd HH:mm:ss')
      };
      this.bannerService.addBanner(bannerInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '内容管理', op_page: '轮播图', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideAddModal('banner');
          this.loadData('banner');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'personal') {
      if (!this.verificationAdd('personal')) {
        return;
      }
      const personalInput = {
        'enabled': false, // 默认不可启用
        'title': this.addPersonalForm.controls['title'].value,
        'site': this.addPersonalForm.controls['site'].value,
        'jump': this.addPersonalForm.controls['jump'].value,
        'image': this.imageUrl,
        'url': this.addPersonalForm.controls['url'].value,
        // tslint:disable-next-line:max-line-length
        'expireTime': this.datePipe.transform(this.addPersonalForm.controls['expireTime'].value, 'yyyy-MM-dd') + 'T' + this.datePipe.transform(this.addPersonalForm.controls['expireTime'].value, 'HH:mm:ss') + 'Z'
      };
      this.personalService.addPersonal(personalInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '内容管理', op_page: '个人中心', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideAddModal('personal');
          this.loadData('personal');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  // 封装验证修改表单
  verificationModify(flag): boolean {
    let result = true;
    if (flag === 'content') {
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
    } else if (flag === 'screen') {
      if (this.modifyScreenForm.controls['title'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '开屏标题未填写' });
        result = false;
      } else if (this.modifyScreenForm.controls['duration'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '持续时间未填写' });
        result = false;
      } else if (this.modifyScreenForm.controls['jump'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '链接跳转状态未选择' });
        result = false;
      }
    } else if (flag === 'open') {
      if (this.modifyOpenForm.controls['title'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '弹窗标题未填写' });
        result = false;
      } else if (this.modifyOpenForm.controls['jump'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '跳转位置未选择' });
        result = false;
      }
      // } else if (this.modifyOpenForm.controls['order'].value === '') {
      //   this.modalService.error({ nzTitle: '提示', nzContent: '排序状态未填写' });
      //   result = false;
      // }
    } else if (flag === 'banner') {
      if (this.modifyBannerForm.controls['title'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '轮播图标题未填写' });
        result = false;
      } else if (this.modifyBannerForm.controls['jump'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '跳转位置未选择' });
        result = false;
      } else if (this.modifyBannerForm.controls['order'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '排序状态未填写' });
        result = false;
      }
    } else if (flag === 'personal') {
      if (this.modifyPersonalForm.controls['title'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '广告图标题未填写' });
        result = false;
      } else if (this.modifyPersonalForm.controls['jump'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '跳转位置未选择' });
        result = false;
      }
    }
    if (this.fileList.length !== 1) {
      this.modalService.error({ nzTitle: '提示', nzContent: '未上传图片' });
      result = false;
    }
    return result;
  }

  // 预览修改
  doPreviewContentModify() {
    if (!this.verificationModify('content')) { return; }
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

  // 修改 - 弹窗
  showModifyModal(data, flag) {
    if (flag === 'content') {
      const id = data.id;
      this.isModifyContentVisible = true;
      this.cmsId = id;  // 用于修改
      this.contentService.getContent(id).subscribe(res => {
        // 处理异常处理
        this.contentDate = JSON.parse(res.payload);
        const operationInput = { op_category: '内容管理', op_page: '内容发布', op_name: '访问' };
        this.commonService.updateOperationlog(operationInput).subscribe();
        this.contentDate.url = this.dotranUrl(JSON.parse(res.payload).url);
        this.imageUrl = JSON.parse(res.payload).thumbnail;
        const file: any = {
          name: JSON.parse(res.payload).thumbnail
        };
        this.fileList.push(file);
        // tslint:disable-next-line:max-line-length
        this.showImageUrl = `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}/v1/cms/notices/thumbnails/${this.imageUrl}`;
      });
    } else if (flag === 'screen') {
      const id = data.id;
      this.isModifyScreenVisible = true;
      this.cmsId = id;  // 用于修改
      this.screenService.getScreen(id).subscribe(res => {
        // 处理异常处理
        this.screenDate = JSON.parse(res.payload);
        const operationInput = { op_category: '内容管理', op_page: '开屏弹窗', op_name: '访问' };
        this.commonService.updateOperationlog(operationInput).subscribe();
        this.screenDate.url = JSON.parse(res.payload).url;
        this.imageUrl = JSON.parse(res.payload).image;
        const file: any = {
          name: JSON.parse(res.payload).image
        };
        this.fileList.push(file);
        // tslint:disable-next-line:max-line-length
        this.showImageUrl = `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}/v1/cms/start-page-ads/images/${this.imageUrl}`;
      });
    } else if (flag === 'open') {
      const id = data.id;
      this.isModifyOpenVisible = true;
      this.cmsId = id;  // 用于修改
      this.displayModeForOpen = data.displayMode;
      this.openService.getOpen(id).subscribe(res => {
        // 处理异常处理
        this.openDate = JSON.parse(res.payload);
        const operationInput = { op_category: '内容管理', op_page: '首页弹窗', op_name: '访问' };
        this.commonService.updateOperationlog(operationInput).subscribe();
        this.openDate.url = JSON.parse(res.payload).url;
        this.imageUrl = JSON.parse(res.payload).image;
        const file: any = {
          name: JSON.parse(res.payload).image
        };
        this.fileList.push(file);
        // tslint:disable-next-line:max-line-length
        this.showImageUrl = `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}/v1/cms/main-page-ads/images/${this.imageUrl}`;
      });
    } else if (flag === 'banner') {
      const id = data.id;
      this.isModifyBannerVisible = true;
      this.cmsId = id;  // 用于修改
      this.bannerService.getBanner(id).subscribe(res => {
        // 处理异常处理
        this.bannerDate = JSON.parse(res.payload);
        const operationInput = { op_category: '内容管理', op_page: '轮播图', op_name: '访问' };
        this.commonService.updateOperationlog(operationInput).subscribe();
        this.bannerDate.url = JSON.parse(res.payload).url;
        this.imageUrl = JSON.parse(res.payload).image;
        const file: any = {
          name: JSON.parse(res.payload).image
        };
        this.fileList.push(file);
        // tslint:disable-next-line:max-line-length
        this.showImageUrl = `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}/v1/cms/banner-ads/images/${this.imageUrl}`;
      });
    } else if (flag === 'personal') {
      const id = data.id;
      this.isModifyPersonalVisible = true;
      this.cmsId = id;  // 用于修改
      // 处理异常处理
      this.personalDate = data;
      this.imageUrl = data.image;
      const file: any = {
        name: data.image
      };
      this.fileList.push(file);
      // tslint:disable-next-line:max-line-length
      this.showImageUrl = `${this.imageUrl}`;
    }

  }

  hideModifyModal(flag) {
    if (flag === 'content') {
      this.isModifyContentVisible = false;
    } else if (flag === 'screen') {
      this.isModifyScreenVisible = false;
    } else if (flag === 'open') {
      this.isModifyOpenVisible = false;
    } else if (flag === 'banner') {
      this.isModifyBannerVisible = false;
    } else if (flag === 'personal') {
      this.isModifyPersonalVisible = false;
    }
    this.fileList.splice(0, this.fileList.length);
    this.imageUrl = '';
    this.showImageUrl = '';
  }

  // 修改操作
  doModify(flag) {
    if (flag === 'content') {
      if (!this.verificationModify('content')) {
        return;
      }
      const contentInput = {
        'id': this.cmsId,
        'title': this.modifyContentForm.controls['title'].value,
        'url': this.dotranUrl(this.modifyContentForm.controls['url'].value),
        'content': encodeURI(this.replaceHtmlStr(this.modifyContentForm.controls['content'].value)).replace(/&/g, '%26'),
        'abstractContent': this.modifyContentForm.controls['abstractContent'].value,
        'pseudonym': this.modifyContentForm.controls['pseudonym'].value,
        'publishTime': this.datePipe.transform(this.modifyContentForm.controls['publishTime'].value, 'yyyy-MM-dd HH:mm:ss'),
        'type': this.modifyContentForm.controls['type'].value,
        'thumbnail': this.imageUrl
      };
      this.contentService.updateContent(contentInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '内容管理', op_page: '内容发布', op_name: '修改' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModifyModal('content');
          this.loadData('content');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'screen') {
      if (!this.verificationModify('screen')) {
        return;
      }
      const jump = this.modifyScreenForm.controls['jump'].value;
      const screenInput = {
        'id': this.cmsId,
        'title': this.modifyScreenForm.controls['title'].value,
        'jump': this.modifyScreenForm.controls['jump'].value,
        'site': jump === 'APP' ? this.modifyScreenForm.controls['site'].value : '',  // 安卓 IOS 标识
        'duration': this.modifyScreenForm.controls['duration'].value,
        'url': jump === 'HTML' ? this.modifyScreenForm.controls['url'].value : '',
        'skip': this.modifyScreenForm.controls['skip'].value,
        'image': this.imageUrl,
        'expireTime': this.datePipe.transform(this.modifyScreenForm.controls['expireTime'].value, 'yyyy-MM-dd HH:mm:ss')
      };
      this.screenService.updateScreen(screenInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '内容管理', op_page: '开屏启动', op_name: '修改' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModifyModal('screen');
          this.loadData('screen');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'open') {
      if (!this.verificationModify('open')) {
        return;
      }
      const jump = this.modifyOpenForm.controls['jump'].value;
      const maxDisplay = this.modifyOpenForm.controls['maxDisplay'].value;
      const openInput = {
        'id': this.cmsId,
        'title': this.modifyOpenForm.controls['title'].value,
        'jump': this.modifyOpenForm.controls['jump'].value,
        'site': jump === 'APP' ? this.modifyOpenForm.controls['site'].value : '',  // 安卓 IOS 标识
        'url': jump === 'HTML' ? this.modifyOpenForm.controls['url'].value : '',
        'order': this.modifyOpenForm.controls['order'].value,
        'image': this.imageUrl,
        'displayMode': this.displayModeForOpen,
        'maxDisplay': maxDisplay === undefined ? 0 : maxDisplay,
        'expireTime': this.datePipe.transform(this.modifyOpenForm.controls['expireTime'].value, 'yyyy-MM-dd HH:mm:ss')
      };
      this.openService.updateOpen(openInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '内容管理', op_page: '首页弹窗', op_name: '修改' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModifyModal('open');
          this.loadData('open');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'banner') {
      if (!this.verificationModify('banner')) {
        return;
      }
      const jump = this.modifyBannerForm.controls['jump'].value;
      const bannerInput = {
        'id': this.cmsId,
        'title': this.modifyBannerForm.controls['title'].value,
        'jump': this.modifyBannerForm.controls['jump'].value,
        'site': jump === 'APP' ? this.modifyBannerForm.controls['site'].value : '',  // 安卓 IOS 标识
        'url': jump === 'HTML' ? this.modifyBannerForm.controls['url'].value : '',
        'order': this.modifyBannerForm.controls['order'].value,
        'image': this.imageUrl,
        'expireTime': this.datePipe.transform(this.modifyBannerForm.controls['expireTime'].value, 'yyyy-MM-dd HH:mm:ss')
      };
      this.bannerService.updateBanner(bannerInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '内容管理', op_page: '轮播图', op_name: '修改' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModifyModal('banner');
          this.loadData('banner');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'personal') {
      if (!this.verificationModify('personal')) {
        return;
      }
      const jump = this.modifyPersonalForm.controls['jump'].value;
      const personalInput = {
        'id': this.cmsId,
        'title': this.modifyPersonalForm.controls['title'].value,
        'jump': this.modifyPersonalForm.controls['jump'].value,
        'site': jump === 'APP' ? this.modifyPersonalForm.controls['site'].value : '',  // 安卓 IOS 标识
        'url': jump === 'HTML' ? this.modifyPersonalForm.controls['url'].value : '',
        'image': this.imageUrl,
        'enabled': false,
        // tslint:disable-next-line:max-line-length
        'expireTime': this.datePipe.transform(this.modifyPersonalForm.controls['expireTime'].value, 'yyyy-MM-dd') + 'T' + this.datePipe.transform(this.modifyPersonalForm.controls['expireTime'].value, 'HH:mm:ss') + 'Z'
      };
      this.personalService.updatePersonal(personalInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '内容管理', op_page: '轮播图', op_name: '修改' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModifyModal('personal');
          this.loadData('personal');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  // 删除 - 复用弹窗
  showDeleteModal(data, flag) {
    this.modalService.confirm({
      nzTitle: '提示', nzContent: '您确定要删除该信息？',
      nzOkText: '确定', nzOnOk: () => this.doDelete(data.id, flag)
    });
  }

  doDelete(id, flag) {
    if (flag === 'content') {
      this.contentService.deleteContent(id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '内容管理', op_page: '内容发布', op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('content');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'screen') {
      this.screenService.deleteScreen(id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '内容管理', op_page: '开屏启动', op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('screen');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'open') {
      this.openService.deleteOpen(id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '内容管理', op_page: '首页弹窗', op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('open');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'banner') {
      this.bannerService.deleteBanner(id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '内容管理', op_page: '轮播图', op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('banner');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'personal') {
      this.personalService.deletePersonal(id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '内容管理', op_page: '个人中心', op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('personal');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }













  // 点击switch
  clickSwitch(data, flag) {
    if (flag === 'screen') {
      this.screenService.updateSwitch(data).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '内容管理', op_page: '开屏启动', op_name: '启用/不启用' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
        this.loadData('screen');
      });
    } else if (flag === 'open') {
      this.openService.updateSwitch(data).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '内容管理', op_page: '首页弹窗', op_name: '启用/不启用' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
        this.loadData('open');
      });
    } else if (flag === 'banner') {
      this.bannerService.updateSwitch(data).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '内容管理', op_page: '轮播图', op_name: '启用/不启用' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
        this.loadData('banner');
      });
    } else if (flag === 'personal') {
      // tslint:disable-next-line:max-line-length
      const personalInput = {
        'id': data.id,
        'title': data.title,
        'jump': data.jump,
        'site': data.site,
        'url': data.url,
        'image': data.image,
        'enabled': data.enabled,
        // tslint:disable-next-line:max-line-length
        'expireTime': this.datePipe.transform(data.expireTime, 'yyyy-MM-dd') + 'T' + this.datePipe.transform(data.expireTime, 'HH:mm:ss') + 'Z'
      };
      this.personalService.updatePersonal(personalInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '内容管理', op_page: '个人中心', op_name: '启用/不启用' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
        this.loadData('personal');
      });
    }
  }

  // 预览新增
  doPreviewContentAdd() {
    if (!this.verificationAdd('content')) {
      return;
    }
    const url = this.addContentForm.controls['url'].value;
    if (url) {
      url.indexOf('`') !== -1 ? window.open(this.dotranUrl(url)) : window.open(url) ;
    } else {
      const title = '<h1><strong>' + this.addContentForm.controls['title'].value + '</strong></h1>';
      const pseudonym = '<p><strong>﻿</strong></p><p>创建人：<span style="color: rgb(102, 163, 224);">'
          + this.addContentForm.controls['pseudonym'].value + '</span>'
          + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
          + this.datePipe.transform(this.addContentForm.controls['publishTime'].value, 'yyyy-MM-dd HH:mm:ss')
          + '</p><p><br></p>';
      this.localizationService.setPreview = title + pseudonym + this.addContentForm.controls['content'].value;
      window.open('preview');
    }
  }

  // 预览文章
  doPreviewContent(data) {
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

  // 获取地址
  doGetContentUrl(data) {
    // tslint:disable-next-line:max-line-length
    window.open(`${this.commonService.dataCenterUrl.substring(0, this.commonService.dataCenterUrl.indexOf(':46004/api'))}/static/content-detail.html?id=${data.id}&channelId=${localStorage.getItem('currentAppHeader')}`);
  }

  // 用于区分分享文案下的三个上传图片的方法
  choosePng(flag) {
    this.currentCopywritingImage = flag;
  }

  // 上传image
  beforeUpload = (file: UploadFile): boolean => {
    const suffix = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
    const isPng = suffix === '.png' || suffix === '.jpeg' || suffix === '.jpg' || suffix === '.ico' ? true : false;
    const isMoreThanTen = file.size < 512000 ? true : false;
    if (!isPng) {
      this.msg.error('您只能上传.png、.jpeg、.jpg、.ico、文件');
    } else if (!isMoreThanTen) {
      this.msg.error('您只能上传不超过500K文件');
    } else {
      this.fileList.push(file);
      this.handleUpload();
    }
    return false;
  }

  // 点击上传
  handleUpload(): void {
    let url = '';
    let flag = '';
    switch (this.currentPanel) {
      case 'content':
        url = `/v1/cms/notices/thumbnails/`;
        flag = 'thumbnail';
        break;
      case 'screen':
        url = `/v1/cms/start-page-ads/images/`;
        flag = 'image';
        break;
      case 'open':
        url = `/v1/cms/main-page-ads/images/`;
        flag = 'image';
        break;
      case 'banner':
        url = `/v1/cms/banner-ads/images/`;
        flag = 'image';
        break;
      case 'personal':
        url = `/personal/center/advertising/img`;
        flag = 'file';
        break;
      default:
        break;
    }
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append(flag, file);
    });
    // tslint:disable-next-line:max-line-length
    const req = new HttpRequest('POST', `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}${url}`, formData, {
      reportProgress: true,
      headers: new HttpHeaders({
        'App-Channel-Id': localStorage.getItem('currentAppHeader'),
        'Authorization': localStorage.getItem('token')
      })
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe((event: HttpResponse<{ code: any, data: any, msg: any }> | any) => {
        if (event.body.retcode === 0) {
          this.imageUrl = event.body.payload; // 不仅用于下面的showImageUrl的拼接，还有其他接口会用到新增修改等操作
          if (this.currentPanel === 'personal') {
            this.showImageUrl = `${this.imageUrl}`;
          } else {
            // tslint:disable-next-line:max-line-length
            this.showImageUrl = `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}${url}${this.imageUrl}`;
          }
          this.notification.success( '提示', '上传成功' );
          // tslint:disable-next-line:max-line-length
          const operationInput = { op_category: '内容管理', op_page: this.currentPanel === 'content' ? '内容发布' : this.currentPanel === 'screen' ? '开屏启动' : this.currentPanel === 'open' ? '首页弹窗' : this.currentPanel === 'banner' ? '轮播图' : this.currentPanel === 'personal' ? '个人中心' : '' , op_name: '上传图片' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: event.body.message, });
        }
        formData.delete(flag);
      }, err => { formData.delete(flag); }
    );
  }

  // 转换 url 的 & 字符
  dotranUrl(url) {
    url = url.indexOf('`') !== -1 ? url.replace(/`/g, '&') : url.replace(/&/g, '`');
    return url;
  }

  // 转换 json 为 html
  dotranJson(str) {
    str = str.replace(/\/\/"/g, '"', str).replace(/\/\/r\/\/n/g, '/r/n', str).replace(/\/\/t/g, '/t', str).replace(/\/\/b/g, '/b', str);
    return str;
  }

  // 切换面板
  changePanel(flag): void {
    if (flag !== this.currentPanel) { this.loadData(flag); }
    this.currentPanel = flag;
    const operationInput = {
      op_category: '内容管理',
      // tslint:disable-next-line:max-line-length
      op_page: flag === 'content' ? '内容发布' : flag === 'screen' ? '开屏启动' : flag === 'open' ? '首页弹窗' : flag === 'banner' ? '轮播图' : flag === 'personal' ? '个人中心' : '',
      op_name: '访问'
    };
    this.commonService.updateOperationlog(operationInput).subscribe();
  }

}
