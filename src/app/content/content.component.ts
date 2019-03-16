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
import { ShareService } from '../public/service/share.service';
import { GuideService } from '../public/service/guide.service';
import { ReturnStatement } from '@angular/compiler';

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
  isAddGuideVisible = false;
  isModifyGuideVisible = false;
  avatarUrl: string;
  addContentForm: FormGroup;
  addScreenForm: FormGroup;
  addOpenForm: FormGroup;
  addBannerForm: FormGroup;
  addGuideForm: FormGroup;
  modifyContentForm: FormGroup;
  modifyScreenForm: FormGroup;
  modifyOpenForm: FormGroup;
  modifyBannerForm: FormGroup;
  modifyGuideForm: FormGroup;
  shareForm: FormGroup;
  jumpForScreen = 'DISABLED';
  jumpForOpen = 'DISABLED';
  jumpForBanner = 'DISABLED';
  now = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  cmsId = '';
  emptyAdd = ['', '', '', '', '', '', ''];  // 清空新增表单
  fileList: UploadFile[] = [];
  imageUrl = '';
  showImageUrl = '';
  shareImageUrl01 = '';
  shareImageUrl02 = '';
  shareImageUrl03 = '';
  currentPanel = 'content';  // 当前面板 默认内容管理
  contentDate = {
    'title': '', 'type': '', 'url': '', 'abstractContent': '', 'content': '', 'publishTime': '', 'pseudonym': ''
  };
  screenDate = {
    'title': '', 'site': '', 'enabled': '', 'jump': '', 'image': '', 'skip': '', 'duration': '', 'url': ''
  };
  openDate = {
    'title': '', 'enabled': '', 'jump': '', 'site': '', 'order': '', 'image': '', 'url': ''
  };
  bannerDate = {
    'title': '', 'jump': '', 'enabled': '', 'site': '', 'order': '', 'image': '', 'url': ''
  };
  guideDate = {
    'title': '', 'jumpType': 'DISABLE', 'appDestinationType': 'PERSONAL_CENTER', 'imageSort': '', 'webUrl': ''
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
  dataGuide = []; // 引导语
  // tslint:disable-next-line:max-line-length
  dataShare = { 'wechatTitle': '', 'wechatContent': '', 'wechatHost': '', 'wechatUrl': '', 'linkTitle': '', 'linkUrl': '', 'linkHost': '', 'h5Title': '', 'h5Content': ''};  // 分享
  currentCopywritingImage = '';
  guideItem = { messageArr: [], buttonArr: [], imageArr: [], };
  currentAppId = '';  // 当前默认的APP信息
  currentGuideId = '';  // 当前弹框出来的Id

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
    private shareService: ShareService,
    private guideService: GuideService,
    private notification: NzNotificationService,
    private datePipe: DatePipe,
    private http: HttpClient,
  ) {
    this.commonService.nav[4].active = true;
    this._initAddContentForm();
    this._initAddScreenForm();
    this._initAddOpenForm();
    this._initAddBannerForm();
    this._initAddGuideForm();
    this._initModifyContentForm();
    this._initModifyScreenForm();
    this._initModifyOpenForm();
    this._initModifyBannerForm();
    this._initModifyGuideForm();
    this._initShareForm();
  }

  ngOnInit() {
    this.loadData('content');
  }

  loadData(flag) {
    if (flag === 'content') {
      this.contentService.getContentList().subscribe(res => {
        this.dataContent = JSON.parse(res.payload).reverse();
      });
    } else if (flag === 'screen') {
      this.screenService.getScreenList().subscribe(res => {
        this.dataScreen = JSON.parse(res.payload).reverse();
      });
    } else if (flag === 'open') {
      this.openService.getOpenList().subscribe(res => {
        this.dataOpen = JSON.parse(res.payload).reverse();
      });
    } else if (flag === 'banner') {
      this.bannerService.getBannerList().subscribe(res => {
        this.dataBanner = JSON.parse(res.payload).reverse();
      });
    } else if (flag === 'share') {
      this.shareImageUrl01 = '';
      this.shareImageUrl02 = '';
      this.shareImageUrl03 = '';
      this.shareService.getShareList().subscribe(res => {
        this.dataShare = JSON.parse(res.payload);
        if (this.currentPanel === 'share') {
          const url = `${this.commonService.baseUrl}/copywriter/upload/`;
          this.shareImageUrl01 = `${url}?fileName=wechatPhoto`;
          this.shareImageUrl02 = `${url}?fileName=H5NavigatePhoto`;
          this.shareImageUrl03 = `${url}?fileName=H5Photo`;
          this.fileList.splice(0, this.fileList.length);
        }
      });
    } else if (flag === 'guide') {
      this.guideService.getGuideAppList().subscribe(res => {
        if (res.retcode === 0) {
          const appList = JSON.parse(res.payload);
          appList.forEach(item => {
            console.log(item);
            if (item.displayName === '小悟') {
              this.currentAppId = item.id;
            }
          });
          this.guideService.getGuideList(this.currentAppId).subscribe(result => {
            if (result.retcode === 0) {
              this.dataGuide = JSON.parse(result.payload);
              this.dataGuide.forEach(cell => {
                cell.enabled = cell.guideElements.length === 0 ? false : true;
              });
              console.log(this.dataGuide);
            }
          });
        }
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
      title: [''],
      jump: [''],
      skip: [''],
      site: [''],
      duration: [''],
      url: [''],
    });
  }

  private _initAddOpenForm(): void {
    this.addOpenForm = this.fb.group({
      title: [''],
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

  private _initAddGuideForm(): void {
    this.addGuideForm = this.fb.group({
      title: [''],
      type: [''],
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
        'title': '', 'site': '', 'enabled': '', 'jump': '', 'image': '', 'skip': '', 'duration': '', 'url': ''
      };
    } else if (flag === 'open') {
      this.isAddOpenVisible = true;
      this.openDate = {  // 清空
        'title': '', 'enabled': '', 'jump': '', 'site': '', 'order': '', 'image': '', 'url': ''
      };
    } else if (flag === 'banner') {
      this.isAddBannerVisible = true;
      this.bannerDate = { // 清空
        'title': '', 'jump': '', 'enabled': '', 'site': '', 'order': '', 'image': '', 'url': ''
      };
    } else if (flag === 'guide') {
      this.isAddGuideVisible = true;
      this.guideDate = { // 清空
        'title': '', 'jumpType': 'DISABLE', 'appDestinationType': 'PERSONAL_CENTER', 'imageSort': '', 'webUrl': ''
      };
      this.guideItem.messageArr.splice(0, this.guideItem.messageArr.length);
      this.guideItem.buttonArr.splice(0, this.guideItem.buttonArr.length);
      this.guideItem.imageArr.splice(0, this.guideItem.imageArr.length);
      this.showImageUrl = '';
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
    } else if (flag === 'guide') {
      this.isAddGuideVisible = false;
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
        this.modalService.error({ nzTitle: '提示', nzContent: '弹框标题未填写' });
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
    } else if (flag === 'share') {
      if (this.shareForm.controls['wechatTitle'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '微信分享的标题未填写' });
        result = false;
      } else if (this.shareForm.controls['wechatContent'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '微信分享的的内容未填写' });
        result = false;
      } else if (this.shareForm.controls['wechatHost'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '微信分享的的域名路径未填写' });
        result = false;
      } else if (this.shareForm.controls['wechatUrl'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '微信分享的跳转链接未填写' });
        result = false;
      } else if (this.shareForm.controls['linkTitle'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '复制路径的标题未填写' });
        result = false;
      } else if (this.shareForm.controls['linkUrl'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '复制路径对的跳转链接未填写' });
        result = false;
      } else if (this.shareForm.controls['linkHost'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '复制路径的域名路径未填写' });
        result = false;
      } else if (this.shareForm.controls['H5Title'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: 'H5标题未填写' });
        result = false;
      } else if (this.shareForm.controls['H5Content'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: 'H5内容未填写' });
        result = false;
      }
    } else if (flag === 'guide') {
      if (this.addGuideForm.controls['title'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '模板名称未填写' });
        result = false;
      }
    }
    if (this.fileList.length !== 1 && flag !== 'share' && flag !== 'guide') {
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
          // .replace(/&copy;/g, '©')
          // .replace(/&reg;/g, '®').replace(/™/g, '™').replace(/&times;/g, '×')
          // .replace(/&divide;/g, '÷')
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
        'url': this.addScreenForm.controls['url'].value
      };
      this.screenService.addScreen(screenInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
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
      const openInput = {
        'enabled': false, // 默认不可启用
        'title': this.addOpenForm.controls['title'].value,
        'site': this.addOpenForm.controls['site'].value,
        'jump': this.addOpenForm.controls['jump'].value,
        'image': this.imageUrl,
        'order': this.addOpenForm.controls['order'].value,
        'url': this.addOpenForm.controls['url'].value
      };
      this.openService.addOpen(openInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
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
        'url': this.addBannerForm.controls['url'].value
      };
      this.bannerService.addBanner(bannerInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          this.hideAddModal('banner');
          this.loadData('banner');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'share') {
      if (!this.verificationAdd('share')) {
        return;
      }
      const shareInput = {
        'wechatTitle': this.shareForm.controls['wechatTitle'].value,
        'wechatContent': this.shareForm.controls['wechatContent'].value,
        'wechatHost': this.shareForm.controls['wechatHost'].value,
        'wechatUrl': this.shareForm.controls['wechatUrl'].value,
        'linkTitle': this.shareForm.controls['linkTitle'].value,
        'linkUrl': this.shareForm.controls['linkUrl'].value,
        'linkHost': this.shareForm.controls['linkHost'].value,
        'h5Title': this.shareForm.controls['H5Title'].value,
        'h5Content': this.shareForm.controls['H5Content'].value,
      };
      this.shareService.addShare(shareInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } });
          this.loadData('share');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'guide') {  // 引导语
      if (!this.verificationAdd('guide')) {
        return;
      }
      const guideInput = {
        'name': this.addGuideForm.controls['title'].value,
        'type': 'BEGINNNER_GUIDE',  // 目前暂时固定一种
      };
      let count = 0;
      const allArr = [];
      this.guideItem.messageArr.forEach((item, i) => {
        // tslint:disable-next-line:no-unused-expression
        item ? allArr.push(item) : 1;
        count++;
      });
      this.guideItem.buttonArr.forEach((item, i) => {
        // tslint:disable-next-line:no-unused-expression
        item ? allArr.push(item) : 1;
        count++;
      });
      this.guideItem.imageArr.forEach((item, i) => {
        // tslint:disable-next-line:no-unused-expression
        item ? allArr.push(item) : 1;
        count++;
      });
      console.log(allArr);

      // tslint:disable-next-line:no-unused-expression
      allArr.forEach((item, i) => { (item.sort === i + 1) ? count++ : 1; });
      if (count !== allArr.length) { // 解决不按序号排列的情况
        this.modalService.error({ nzTitle: '提示', nzContent: '序号没有按顺序填写，或序号填写不完整' });
        return;
      }

      // 拿到模板Id
      this.guideService.addGuide(guideInput).subscribe(res => {
        if (res.retcode === 0) {
          const guideId = JSON.parse(res.payload).id;

          // 元素添加到模板
          // tslint:disable-next-line:no-shadowed-variable
          let elementCount = 0;
          allArr.forEach((item, i) => {
            // tslint:disable-next-line:radix
            if (parseInt(item.sort) === (i + 1)) {
              if (item.type === 'MESSAGE') {
                const finalInput = { 'templateId': guideId, 'text': item.text, 'index': item.sort };
                this.guideService.addXxxForGuide(finalInput, 'message-element').subscribe(res1 => {
                  if (res1.retcode === 0) {
                    elementCount++;
                    this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } });
                  } else {
                    this.modalService.error({ nzTitle: '提示', nzContent: res1.message });
                  }
                });
              } else if (item.type === 'BUTTON') {
                const finalInput = { 'templateId': guideId, 'text': item.text, 'index': item.sort };
                this.guideService.addXxxForGuide(finalInput, 'button-element').subscribe(res2 => {
                  if (res2.retcode === 0) {
                    elementCount++;
                    this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } });
                  } else {
                    this.modalService.error({ nzTitle: '提示', nzContent: res2.message });
                  }
                });
              } else if (item.type === 'IMAGE') {
                // tslint:disable-next-line:max-line-length
                const finalInput = { 'templateId': guideId, 'imageKey': item.imageKey, 'index': item.sort, 'jumpType': item.jumpType, 'appDestinationType': item.appDestinationType, 'webUrl': item.webUrl };
                this.guideService.addXxxForGuide(finalInput, 'image-element').subscribe(res3 => {
                  if (res3.retcode === 0) {
                    elementCount++;
                    this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } });
                  } else {
                    this.modalService.error({ nzTitle: '提示', nzContent: res3.message });
                  }
                });
              }
            }
          });

          // 给指定的APP绑定模板
          const guideInfo = { 'id': this.currentAppId, 'templateId': guideId };
          this.guideService.addGuideForApp(guideInfo).subscribe(result => {  // 新增一个模板给到默认的APP，不然看不到模板新增后的数据
            if (result.retcode === 0) {
              this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } });
              this.isAddGuideVisible = false;
              this.loadData('guide');
            }
          });
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message })
        }
      });

    } else if (flag === 'guide_message') {
      const mesItem = {
        'type': 'MESSAGE',
        'text': '',
        'sort': ''
      };
      this.guideItem.messageArr.push(mesItem);
    } else if (flag === 'guide_button') {
      const butItem = {
        'type': 'BUTTON',
        'text': '',
        'sort': ''
      };
      this.guideItem.buttonArr.push(butItem);
    } else if (flag === 'guide_image') {
      if (this.guideItem.imageArr.length === 1) { // 最多添加一个上传图片
        this.modalService.error({ nzTitle: '提示', nzContent: '暂时只支持上传一张' });
        return;
      }
      const imgItem = {
        'type': 'IMAGE',
        'imageKey': '',
        'jumpType': '',
        'appDestinationType': '',
        'webUrl': '',
        'sort': ''
      };
      this.guideItem.imageArr.push(imgItem);
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
      title: [''],
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
      title: [''],
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

  // 修改
  _initModifyGuideForm() {
    this.modifyGuideForm = this.fb.group({
      title: [''],
    });
  }

  // 分享
  _initShareForm() {
    this.shareForm = this.fb.group({
      wechatTitle: [''],
      wechatContent: [''],
      wechatHost: [''],
      wechatUrl: [''],
      linkTitle: [''],
      linkUrl: [''],
      linkHost: [''],
      H5Title: [''],
      H5Content: [''],
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
        this.modalService.error({ nzTitle: '提示', nzContent: '弹框标题未填写' });
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
    }
    if (this.fileList.length !== 1) {
      this.modalService.error({ nzTitle: '提示', nzContent: '未上传图片' });
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
        this.showImageUrl = `${this.commonService.baseUrl}/cms/notices/thumbnails/${JSON.parse(res.payload).thumbnail}`;
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
        this.showImageUrl = `${this.commonService.baseUrl}/cms/start-page-ads/images/${JSON.parse(res.payload).image}`;
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
        this.showImageUrl = `${this.commonService.baseUrl}/cms/main-page-ads/images/JSON.parse(res.payload).image`;
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
        this.showImageUrl = `${this.commonService.baseUrl}/cms/banner-ads/images/JSON.parse(res.payload).image`;
      });
    } else if (flag === 'guide') {
      // const id = data.id;
      // this.isModifyBannerVisible = true;
      // this.cmsId = id;  // 用于修改
      // this.bannerService.getBanner(id).subscribe(res => {
      //   // 处理异常处理
      //   this.bannerDate = JSON.parse(res.payload);
      //   this.bannerDate.url = JSON.parse(res.payload).url;
      //   this.imageUrl = JSON.parse(res.payload).image;
      //   const file: any = {
      //     name: JSON.parse(res.payload).image
      //   };
      //   this.fileList.push(file);
      //   this.showImageUrl = `${this.commonService.baseUrl}/cms/banner-ads/images/JSON.parse(res.payload).image`;
      // });
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
        'image': this.imageUrl
      };
      this.screenService.updateScreen(screenInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
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
      const openInput = {
        'id': this.cmsId,
        'title': this.modifyOpenForm.controls['title'].value,
        'jump': this.modifyOpenForm.controls['jump'].value,
        'site': jump === 'APP' ? this.modifyOpenForm.controls['site'].value : '',  // 安卓 IOS 标识
        'url': jump === 'HTML' ? this.modifyOpenForm.controls['url'].value : '',
        'order': this.modifyOpenForm.controls['order'].value,
        'image': this.imageUrl
      };
      this.openService.updateOpen(openInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
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
        'image': this.imageUrl
      };
      this.bannerService.updateBanner(bannerInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
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
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          this.loadData('content');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'screen') {
      this.screenService.deleteScreen(id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          this.loadData('screen');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'open') {
      this.openService.deleteOpen(id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          this.loadData('open');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'banner') {
      this.bannerService.deleteBanner(id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          this.loadData('banner');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'guide') {
      this.guideService.deleteGuideFromApp(this.currentAppId, id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          this.loadData('guide');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'guide_message') {
      this.guideItem.messageArr.splice(id, 1);
      console.log(id);
    } else if (flag === 'guide_button') {
      this.guideItem.buttonArr.splice(id, 1);
    } else if (flag === 'guide_image') {
      this.guideItem.imageArr.splice(id, 1);
    }
  }













  // 点击switch
  clickSwitch(data, flag) {
    if (flag === 'screen') {
      this.screenService.updateSwitch(data).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          this.loadData('screen');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
          this.loadData('screen');
        }
      });
    } else if (flag === 'open') {
      this.openService.updateSwitch(data).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          this.loadData('open');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
          this.loadData('open');
        }
      });
    } else if (flag === 'banner') {
      this.bannerService.updateSwitch(data).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          this.loadData('banner');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
          this.loadData('banner');
        }
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
    window.open(`${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/api'))}/static/content-detail.html?id=${data.id}`);
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
    if (this.currentPanel === 'share' || this.currentPanel === 'guide') {
      this.fileList.splice(0, this.fileList.length);
    }
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
        url = `${this.commonService.baseUrl}/cms/notices/thumbnails/`;
        flag = 'thumbnail';
        break;
      case 'screen':
        url = `${this.commonService.baseUrl}/cms/start-page-ads/images/`;
        flag = 'image';
        break;
      case 'open':
        url = `${this.commonService.baseUrl}/cms/main-page-ads/images/`;
        flag = 'image';
        break;
      case 'banner':
        url = `${this.commonService.baseUrl}/cms/banner-ads/images/`;
        flag = 'image';
        break;
      case 'share':
        url = `${this.commonService.baseUrl}/copywriter/upload/`;
        flag = 'file';
        break;
      case 'guide':
        // url = `${this.commonService.baseUrl}/guide/resources/images/`;
        url = `http://192.168.1.217:8086/api/guide/resources/images/`;
        flag = 'file';
        break;
      default:
        break;
    }
    // 文件数量不可超过1个，超过一个则提示
    if (this.fileList.length > 1 && this.currentPanel !== 'share') {
      this.notification.error(
        '提示', '您上传的文件超过一个！'
      );
      return;
    }
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append(flag, file);
      if (this.currentPanel === 'share') {
        formData.append('fileType', this.currentCopywritingImage);
      }
      if (this.currentPanel === 'guide') {
        formData.append('imageKey', file.name);
      }
    });
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe((event: HttpResponse<{ code: any, data: any, msg: any }> | any) => {
        if (event.body.retcode === 0) {
          this.imageUrl = event.body.payload; // 不仅用于下面的showImageUrl的拼接，还有其他接口会用到新增修改等操作
          if (this.currentPanel === 'share') {  // 针对分享
            if (this.currentCopywritingImage === '0') {
              this.shareImageUrl01 = `${url}?fileName=${this.imageUrl}`;
            } else if (this.currentCopywritingImage === '1') {
              this.shareImageUrl02 = `${url}?fileName=${this.imageUrl}`;
            } else if (this.currentCopywritingImage === '2') {
              this.shareImageUrl03 = `${url}?fileName=${this.imageUrl}`;
            }
            if (event.body.message !== 'SUCCESS') {
              if (this.currentCopywritingImage === '0') {
                this.modalService.error({ nzTitle: '提示', nzContent: '上传超过32K' });
              } else if (this.currentCopywritingImage === '1') {
                this.modalService.error({ nzTitle: '提示', nzContent: '上传超过20K' });
              } else if (this.currentCopywritingImage === '2') {
                this.modalService.error({ nzTitle: '提示', nzContent: '上传超过50K' });
              }
              return;
            }
            this.loadData('share'); // 每次上传成功都重新加载数据
          } else if (this.currentPanel === 'guide') {  // 引导语
            this.onGuideChange(this.imageUrl, 'imageImageKey', 0);  // 上传成功后，将穿回来的信息丢给第一个图片
            this.showImageUrl = url + this.imageUrl;
          } else {  // 内容、开屏、首页弹框、轮播
            this.showImageUrl = url + this.imageUrl;
          }
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

  // 针对结构进行数据的累加
  onGuideChange(value, site, item) {
    if (site === 'messageSort') { // message 排序
      this.guideItem.messageArr.forEach(( cell, i ) => {
        // tslint:disable-next-line:no-unused-expression
        i === item ? cell.sort = value : 1;
      });
    } else if (site === 'messageText') { // message
      this.guideItem.messageArr.forEach(( cell, i ) => {
        // tslint:disable-next-line:no-unused-expression
        i === item ? cell.text = value : 1;
      });
    } else if (site === 'buttonSort') {  // button 排序
      this.guideItem.buttonArr.forEach(( cell, i ) => {
        // tslint:disable-next-line:no-unused-expression
        i === item ? cell.sort = value : 1;
      });
    } else if (site === 'buttonText') {  // button
      this.guideItem.buttonArr.forEach(( cell, i ) => {
        // tslint:disable-next-line:no-unused-expression
        i === item ? cell.text = value : 1;
      });
    } else if (site === 'imageSort') {  // image 排序
      this.guideItem.imageArr.forEach(( cell, i ) => {
        // tslint:disable-next-line:no-unused-expression
        i === item ? cell.sort = value : 1;
      });
    } else if (site === 'imageJumpType') {  // image TYPE
      this.guideItem.imageArr.forEach(( cell, i ) => {
        // tslint:disable-next-line:no-unused-expression
        i === item ? cell.jumpType = value : 1;
      });
    } else if (site === 'imageAppDestinationType') {  // image APP
      this.guideItem.imageArr.forEach(( cell, i ) => {
        // tslint:disable-next-line:no-unused-expression
        i === item ? cell.appDestinationType = value : 1;
      });
    } else if (site === 'imageWebUrl') {  // image WEB
      this.guideItem.imageArr.forEach(( cell, i ) => {
        // tslint:disable-next-line:no-unused-expression
        i === item ? cell.webUrl = value : 1;
      });
    } else if (site === 'imageImageKey') {  // image WEB
      this.guideItem.imageArr.forEach(( cell, i ) => {
        // tslint:disable-next-line:no-unused-expression
        i === item ? cell.imageKey = value : 1;
      });
    }
    console.log(this.guideItem);
  }

  // 切换面板
  changePanel(flag): void {
    if (flag === 'content' && flag !== this.currentPanel) {
      this.loadData('content');
    } else if (flag === 'screen' && flag !== this.currentPanel) {
      this.loadData('screen');
    } else if (flag === 'open' && flag !== this.currentPanel) {
      this.loadData('open');
    } else if (flag === 'banner' && flag !== this.currentPanel) {
      this.loadData('banner');
    } else if (flag === 'share' && flag !== this.currentPanel) {
      this.loadData('share');
    } else if (flag === 'guide' && flag !== this.currentPanel) {
      this.loadData('guide');
    }
    this.currentPanel = flag;
  }

}
