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
import { ScreenService } from '../public/service/screen.service';
import { OpenService } from '../public/service/open.service';
import { BannerService } from '../public/service/banner.service';

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
  loading = false;
  avatarUrl: string;
  addContentForm: FormGroup;
  addScreenForm: FormGroup;
  addOpenForm: FormGroup;
  addBannerForm: FormGroup;
  modifyContentForm: FormGroup;
  modifyScreenForm: FormGroup;
  modifyOpenForm: FormGroup;
  modifyBannerForm: FormGroup;
  now = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  cmsId = '';
  emptyAdd = ['', '', '', '', '', '', ''];  // 清空新增表单
  fileList: UploadFile[] = [];
  imageUrl = '';
  showImageUrl = '';
  currentPanel = '';  // 当前面板
  contentDate = {
    'title': '',
    'type': '',
    'url': '',
    'abstractContent': '',
    'content': '',
    'publishTime': '',
    'pseudonym': ''
  };
  screenDate = {
    'site': '',
    'enabled': '',
    'jump': '',
    'image': '',
    'skip': '',
    'duration': '',
    'url': ''
  };
  openDate = {
    'enabled': '',
    'jump': '',
    'site': '',
    'order': '',
    'image': '',
    'url': ''
  };
  bannerDate = {
    'title': '',
    'jump': '',
    'enabled': '',
    'site': '',
    'order': '',
    'image': '',
    'url': ''
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
  dataScreen = [];  // 首屏
  dataOpen = [];  // 弹框
  dataBanner = [];  // 轮播

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private msg: NzMessageService,
    private modalService: NzModalService,
    public localizationService: LocalizationService,
    private contentService: ContentService,
    private screenService: ScreenService,
    private openService: OpenService,
    private bannerService: BannerService,
    private notification: NzNotificationService,
    private datePipe: DatePipe,
    private http: HttpClient,
  ) {
    this.commonService.nav[3].active = true;
    this._initAddContentForm();
    this._initAddScreenForm();
    this._initAddOpenForm();
    this._initAddBannerForm();
    this._initModifyContentForm();
    this._initModifyScreenForm();
    this._initModifyOpenForm();
    this._initModifyBannerForm();
  }

  ngOnInit() {
    this.loadData('content');
    this.loadData('screen');
    this.loadData('open');
    this.loadData('banner');
  }

  loadData(flag) {
    if (flag === 'content') {
      this.contentService.getContentList().subscribe(res => {
        this.dataContent = JSON.parse(res.payload);
      });
    } else if (flag === 'screen') {
      this.screenService.getScreenList().subscribe(res => {
        this.dataScreen = JSON.parse(res.payload);
      });
    } else if (flag === 'open') {
      this.openService.getOpenList().subscribe(res => {
        this.dataOpen = JSON.parse(res.payload);
      });
    } else if (flag === 'banner') {
      this.bannerService.getBannerList().subscribe(res => {
        this.dataBanner = JSON.parse(res.payload);
      });
    }
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

  private _initAddScreenForm(): void {
    this.addScreenForm = this.fb.group({
      jump: [''],
      skip: [''],
      site: [''],
      duration: [''],
      url: [''],
    });
  }

  private _initAddOpenForm(): void {
    this.addOpenForm = this.fb.group({
      jump: [''],
      site: [''],
      order: [''],
      url: [''],
    });
  }

  private _initAddBannerForm(): void {
    this.addBannerForm = this.fb.group({
      jump: [''],
      title: [''],
      site: [''],
      order: [''],
      url: [''],
    });
  }

  // 新增内容 - 弹框
  showAddModal(flag) {
    if (flag === 'content') {
      this.isAddContentVisible = true;
      this.contentDate = {  // 清空
        'title': '', 'type': '', 'url': '', 'abstractContent': '', 'content': '', 'publishTime': '', 'pseudonym': ''
      };
    } else if (flag === 'screen') {
      this.isAddScreenVisible = true;
      this.screenDate = {  // 清空
        'site': '', 'enabled': '', 'jump': '', 'image': '', 'skip': '', 'duration': '', 'url': ''
      };
    } else if (flag === 'open') {
      this.isAddOpenVisible = true;
      this.openDate = {  // 清空
        'enabled': '', 'jump': '', 'site': '', 'order': '', 'image': '', 'url': ''
      };
    } else if (flag === 'banner') {
      this.isAddBannerVisible = true;
      this.bannerDate = { // 清空
        'title': '', 'jump': '', 'enabled': '', 'site': '', 'order': '', 'image': '', 'url': ''
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
    }
    this.fileList.splice(0, this.fileList.length);
    this.imageUrl = '';
    this.showImageUrl = '';
  }

  // 封装验证新增
  verificationAddContent(flag): boolean {
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

    } else if (flag === 'open') {

    } else if (flag === 'banner') {

    }
    return result;
  }

  // 新增操作
  doSave(flag): void {
    if (flag === 'content') {
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
    } else if (flag === 'screen') {
      // if (!this.verificationAddContent('screen')) {
      //   return;
      // }
      const screenInput = {
        'enabled': false, // 默认不可启用
        'site': this.addScreenForm.controls['site'].value,
        'jump': this.addScreenForm.controls['jump'].value,
        'image': this.imageUrl,
        'skip': this.addScreenForm.controls['skip'].value,
        'duration': this.addScreenForm.controls['duration'].value,
        'url': this.addScreenForm.controls['url'].value
      };
      this.screenService.addScreen(screenInput).subscribe(res => {
        if (res.retcode === 0) {
          this.modalService.success({ nzTitle: '提示', nzContent: '新增成功' });
          this.hideAddModal('screen');
          this.loadData('screen');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'open') {
      // if (!this.verificationAddContent('open')) {
      //   return;
      // }
      const openInput = {
        'enabled': false, // 默认不可启用
        'site': this.addOpenForm.controls['site'].value,
        'jump': this.addOpenForm.controls['jump'].value,
        'image': this.imageUrl,
        'order': this.addOpenForm.controls['order'].value,
        'url': this.addOpenForm.controls['url'].value
      };
      this.openService.addOpen(openInput).subscribe(res => {
        if (res.retcode === 0) {
          this.modalService.success({ nzTitle: '提示', nzContent: '新增成功' });
          this.hideAddModal('open');
          this.loadData('open');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'banner') {
      // if (!this.verificationAddContent('banner')) {
      //   return;
      // }
      const bannerInput = {
        'enabled': false, // 默认不可启用
        'title': this.addBannerForm.controls['title'].value,
        'site': this.addBannerForm.controls['site'].value,
        'jump': this.addBannerForm.controls['jump'].value,
        'image': this.imageUrl,
        'order': this.addBannerForm.controls['order'].value,
        'url': this.addBannerForm.controls['url'].value
      };
      this.bannerService.addBanner(bannerInput).subscribe(res => {
        if (res.retcode === 0) {
          this.modalService.success({ nzTitle: '提示', nzContent: '新增成功' });
          this.hideAddModal('banner');
          this.loadData('banner');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
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

  // 修改
  _initModifyScreenForm() {
    this.modifyScreenForm = this.fb.group({
      jump: [''],
      site: [''],
      skip: [''],
      duration: [''],
      url: [''],
    });
  }

  // 修改
  _initModifyOpenForm() {
    this.modifyOpenForm = this.fb.group({
      jump: [''],
      site: [''],
      order: [''],
      url: [''],
    });
  }

  // 修改
  _initModifyBannerForm() {
    this.modifyBannerForm = this.fb.group({
      jump: [''],
      title: [''],
      site: [''],
      order: [''],
      url: [''],
    });
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

    } else if (flag === 'open') {

    } else if (flag === 'banner') {

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
    if (flag === 'content') {
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
    } else if (flag === 'screen') {
      const id = data.id;
      this.isModifyScreenVisible = true;
      this.cmsId = id;  // 用于修改
      this.screenService.getScreen(id).subscribe(res => {
        // 处理异常处理
        this.screenDate = JSON.parse(res.payload);
        this.screenDate.url = JSON.parse(res.payload).url;
        this.imageUrl = JSON.parse(res.payload).image;
        const file: any = {
          name: JSON.parse(res.payload).image
        };
        this.fileList.push(file);
        this.showImageUrl = 'http://account-center-test.chewrobot.com/api/cms/start-page-ads/images/' + JSON.parse(res.payload).image;
      });
    } else if (flag === 'open') {
      const id = data.id;
      this.isModifyOpenVisible = true;
      this.cmsId = id;  // 用于修改
      this.openService.getOpen(id).subscribe(res => {
        // 处理异常处理
        this.openDate = JSON.parse(res.payload);
        this.openDate.url = JSON.parse(res.payload).url;
        this.imageUrl = JSON.parse(res.payload).image;
        const file: any = {
          name: JSON.parse(res.payload).image
        };
        this.fileList.push(file);
        this.showImageUrl = 'http://account-center-test.chewrobot.com/api/cms/main-page-ads/images/' + JSON.parse(res.payload).image;
      });
    } else if (flag === 'banner') {
      const id = data.id;
      this.isModifyBannerVisible = true;
      this.cmsId = id;  // 用于修改
      this.bannerService.getBanner(id).subscribe(res => {
        // 处理异常处理
        this.bannerDate = JSON.parse(res.payload);
        this.bannerDate.url = JSON.parse(res.payload).url;
        this.imageUrl = JSON.parse(res.payload).image;
        const file: any = {
          name: JSON.parse(res.payload).image
        };
        this.fileList.push(file);
        this.showImageUrl = 'http://account-center-test.chewrobot.com/api/cms/banner-ads/images/' + JSON.parse(res.payload).image;
      });
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
    } else if (flag === 'screen') {
      // if (!this.verificationModify('screen')) {
      //   return;
      // }
      const screenInput = {
        'id': this.cmsId,
        'jump': this.modifyScreenForm.controls['jump'].value,
        'site': this.modifyScreenForm.controls['site'].value,  // 安卓 IOS 标识
        'duration': this.modifyScreenForm.controls['duration'].value,
        'url': this.modifyScreenForm.controls['url'].value,
        'skip': this.modifyScreenForm.controls['skip'].value,
        'image': this.imageUrl
      };
      this.screenService.updateScreen(screenInput).subscribe(res => {
        if (res.retcode === 0) {
          this.modalService.success({ nzTitle: '提示', nzContent: '修改成功' });
          this.hideModifyModal('screen');
          this.loadData('screen');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'open') {
      // if (!this.verificationModify('open')) {
      //   return;
      // }
      const openInput = {
        'id': this.cmsId,
        'jump': this.modifyOpenForm.controls['jump'].value,
        'site': this.modifyOpenForm.controls['site'].value,  // 安卓 IOS 标识
        'url': this.modifyOpenForm.controls['url'].value,
        'order': this.modifyOpenForm.controls['order'].value,
        'image': this.imageUrl
      };
      this.openService.updateOpen(openInput).subscribe(res => {
        if (res.retcode === 0) {
          this.modalService.success({ nzTitle: '提示', nzContent: '修改成功' });
          this.hideModifyModal('open');
          this.loadData('open');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'banner') {
      // if (!this.verificationModify('open')) {
      //   return;
      // }
      const bannerInput = {
        'id': this.cmsId,
        'title': this.modifyBannerForm.controls['title'].value,
        'jump': this.modifyBannerForm.controls['jump'].value,
        'site': this.modifyBannerForm.controls['site'].value,  // 安卓 IOS 标识
        'url': this.modifyBannerForm.controls['url'].value,
        'order': this.modifyBannerForm.controls['order'].value,
        'image': this.imageUrl
      };
      this.bannerService.updateBanner(bannerInput).subscribe(res => {
        if (res.retcode === 0) {
          this.modalService.success({ nzTitle: '提示', nzContent: '修改成功' });
          this.hideModifyModal('banner');
          this.loadData('banner');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
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
    if (flag === 'content') {
      this.contentService.deleteContent(id).subscribe(res => {
        if (res.retcode === 0) {
          this.modalService.success({ nzTitle: '提示', nzContent: '删除成功' });
          this.loadData('content');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'screen') {
      this.screenService.deleteScreen(id).subscribe(res => {
        if (res.retcode === 0) {
          this.modalService.success({ nzTitle: '提示', nzContent: '删除成功' });
          this.loadData('screen');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'open') {
      this.openService.deleteOpen(id).subscribe(res => {
        if (res.retcode === 0) {
          this.modalService.success({ nzTitle: '提示', nzContent: '删除成功' });
          this.loadData('open');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'banner') {
      this.bannerService.deleteBanner(id).subscribe(res => {
        if (res.retcode === 0) {
          this.modalService.success({ nzTitle: '提示', nzContent: '删除成功' });
          this.loadData('banner');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }













  // 点击switch
  clickSwitch(id, switchValue, flag) {
    if (flag === 'content') {
    } else if (flag === 'screen') {
      this.screenService.updateSwitch(id, switchValue).subscribe(res => {
        if (res.retcode === 0) {
          this.modalService.success({ nzTitle: '提示', nzContent: '修改成功' });
          this.loadData('screen');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'open') {
      this.openService.updateSwitch(id, switchValue).subscribe(res => {
        if (res.retcode === 0) {
          this.modalService.success({ nzTitle: '提示', nzContent: '修改成功' });
          this.loadData('screen');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'banner') {
      this.bannerService.updateSwitch(id, switchValue).subscribe(res => {
        if (res.retcode === 0) {
          this.modalService.success({ nzTitle: '提示', nzContent: '修改成功' });
          this.loadData('screen');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  // 预览新增
  doPreviewContentAdd() {
    if (!this.verificationAddContent('content')) {
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
    let url = '';
    let flag = '';
    switch (this.currentPanel) {
      case 'content':
        url = 'http://account-center-test.chewrobot.com/api/cms/notices/thumbnails';
        flag = 'thumbnail';
        break;
      case 'screen':
        url = 'http://account-center-test.chewrobot.com/api/cms/start-page-ads/images/';
        flag = 'image';
        break;
      case 'open':
        url = 'http://account-center-test.chewrobot.com/api/cms/main-page-ads/images/';
        flag = 'image';
        break;
      case 'banner':
        url = 'http://account-center-test.chewrobot.com/api/cms/banner-ads/images/';
        flag = 'image';
        break;
      default:
        break;
    }
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
      reportProgress: true
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe((event: HttpResponse<{ code: any, data: any, msg: any }> | any) => {
        if (event.body.retcode === 0) {
          this.imageUrl = event.body.payload;
          this.showImageUrl = url + this.imageUrl;
          this.notification.success( '提示', '上传成功' );
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: event.body.message, });
        }
        formData.delete(flag);
      },
      err => { formData.delete(flag); }
    );
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
}
