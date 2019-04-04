import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonService } from '../public/service/common.service';
import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NzModalService, NzNotificationService, UploadFile, NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LocalizationService } from '../public/service/localization.service';
import { ContentService } from '../public/service/content.service';
import { AppversionService } from '../public/service/appVersion.service';
import { ShareService } from '../public/service/share.service';
import { HttpResponse, HttpRequest, HttpClient, HttpHeaders } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { GuideService } from '../public/service/guide.service';
import { HelpService } from '../public/service/help.service';
import { ProtocolService } from '../public/service/protocol.service';

registerLocaleData(zh);

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-appVersion',
  templateUrl: './appVersion.component.html',
  styleUrls: ['./appVersion.component.scss']
})
export class AppVersionComponent implements OnInit {

  isAddContentVisible = false;
  isAddGuideVisible = false;
  isAddHelpVisible = false;
  isModifyGuideVisible = false;
  isModifyHelpVisible = false;
  addContentForm: FormGroup;
  addGuideForm: FormGroup;
  addHelpForm: FormGroup;
  shareForm: FormGroup;
  modifyGuideForm: FormGroup;
  modifyHelpForm: FormGroup;
  addProtocolForm: FormGroup;
  now = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  emptyAdd = ['', '', '', '', '', '', ''];  // 清空新增表单
  // tslint:disable-next-line:max-line-length
  contentDate = { 'version': '', 'title': '', 'description': '', 'size': '', 'file': '', 'system_symbol': '', 'version_allowed': '', 'sub_title': '', 'dataContent': '' };
  // tslint:disable-next-line:max-line-length
  dataShare = { 'wechatTitle': '', 'wechatContent': '', 'wechatHost': '', 'wechatUrl': '', 'linkTitle': '', 'linkUrl': '', 'linkHost': '', 'h5Title': '', 'h5Content': ''};  // 分享
  // tslint:disable-next-line:max-line-length
  guideDate = { 'name': '', 'type': 'BEGINNNER_GUIDE', 'guideElements': [], 'id': '', 'jumpType': 'DISABLE', 'appDestinationType': 'PERSONAL_CENTER', 'webUrl': '' };
  helpDate = { 'describe': '', 'details': '', 'guides': '', 'image': '', 'name': '', 'order': '', 'type': '' };
  dateSearch = { 'Today': [new Date(), new Date()], 'This Month': [new Date(), new Date()] };
  dataContent = []; // 内容
  dataSystemSymbo = []; // 操作系统
  dataGuide = []; // 引导语
  dataHelp = []; // 帮助管理
  dataProtocol = []; // 协议管理
  beginDate = '';
  endDate = '';
  shareImageUrl01 = '';
  shareImageUrl02 = '';
  shareImageUrl03 = '';
  showImageUrl = '';
  fileList: UploadFile[] = [];
  currentCopywritingImage = '';
  imageUrl = '';
  currentPanel = 'content';  // 当前面板 默认内容管理
  guideItem = { messageArr: [], buttonArr: [], imageArr: [], };
  helpItem = { jumpArr: [{ text: '' }], detailArr: [{ title: '', describe: '' }] };
  currentAppId = '';  // 当前默认的APP信息
  templateId = '';  // 帮助管理的模板Id
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
  isSaveShareButton = false;
  isSaveProtocolButton = false;
  currentProtocol = '火车退票/改签协议';
  private timerList;
  private timerDetail;
  currentChanelId = '';
  helpType = 'TRAVEL';

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private modalService: NzModalService,
    private protocolService: ProtocolService,
    public localizationService: LocalizationService,
    private appversionService: AppversionService,
    private notification: NzNotificationService,
    private helpService: HelpService,
    private guideService: GuideService,
    private datePipe: DatePipe,
    private shareService: ShareService,
    private msg: NzMessageService,
    private http: HttpClient,
  ) {
    this.commonService.nav[1].active = true;
    this._initForm();
    this.currentChanelId = localStorage.getItem('currentAppHeader');
  }

  ngOnInit() {
    this.loadData('content');
    this.changePanel('content');
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    if (this.timerList) {
      clearInterval(this.timerList);
    }
    if (this.timerDetail) {
      clearInterval(this.timerDetail);
    }
  }

  loadData(flag) {
    if (flag === 'content') {
      const arr = [];
      this.appversionService.getAppversionList(this.currentChanelId).subscribe(res => {
        if (JSON.parse(res.payload).android !== 'null') {
          arr.push(JSON.parse(JSON.parse(res.payload).android));
        }
        if (JSON.parse(res.payload).ios !== 'null') {
          arr.push(JSON.parse(JSON.parse(res.payload).ios));
        }
        this.dataContent = arr;
        const operationInput = { op_category: 'APP管理', op_page: '版本更新', op_name: '访问' };
        this.commonService.updateOperationlog(operationInput).subscribe();
      });
    } else if (flag === 'system') {
      const arrSystem = [];
      this.appversionService.getSystemSymbolList().subscribe(res => {
        arrSystem.push(JSON.parse(res.payload).ANDROID);
        arrSystem.push(JSON.parse(res.payload).IOS);
        this.dataSystemSymbo = arrSystem;
        const operationInput = { op_category: 'APP管理', op_page: '版本更新', op_name: '访问' };
        this.commonService.updateOperationlog(operationInput).subscribe();
      });
    } else if (flag === 'share') {
      this.shareImageUrl01 = '';
      this.shareImageUrl02 = '';
      this.shareImageUrl03 = '';
      this.shareService.getShareList().subscribe(res => {
        this.dataShare = JSON.parse(res.payload);
        const operationInput = { op_category: 'APP管理', op_page: '分享文案', op_name: '访问' };
        this.commonService.updateOperationlog(operationInput).subscribe();
        if (this.currentPanel === 'share') {
          const url = `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}/copywriter/upload/`;
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
          console.log(appList);
          let templates = {}; // 用于获取APP里面的模板信息，针对激活与否
          appList.forEach(item => {
            if (item.registryName === localStorage.getItem('currentAppHeader')) {
              this.currentAppId = item.id;
              // tslint:disable-next-line:no-unused-expression
              JSON.stringify(item.templates) !== '{}' ? templates = JSON.parse(item.templates) : 1;
            }
          });
          this.guideService.getGuideList(this.currentAppId).subscribe(result => { // 查当前APP的id下有多少个模板
            if (result.retcode === 0) {
              this.dataGuide = JSON.parse(result.payload);
              const operationInput = { op_category: 'APP管理', op_page: '引导语模板', op_name: '访问' };
              this.commonService.updateOperationlog(operationInput).subscribe();
              this.dataGuide.forEach((cell, i) => {
                let enabled = false;
                // tslint:disable-next-line:forin
                for (const key in templates) {
                  // tslint:disable-next-line:no-unused-expression
                  key === cell.id ? enabled = templates[key] : 1; // 匹配APP的templates与模板接口查出来的Id
                }
                cell.enabled = enabled;
              });
              console.log(this.dataGuide);
            }
          });
        }
      });
    } else if (flag === 'help') {
      this.helpService.getHelpList().subscribe(res => {
        if (res.retcode === 0) {
          this.dataHelp = JSON.parse(res.payload).reverse();
          console.log(this.dataHelp);
        }
      });
      const operationInput = { op_category: 'APP管理', op_page: '帮助管理', op_name: '访问' };
      this.commonService.updateOperationlog(operationInput).subscribe();
    } else if (flag === 'protocol') {
      this.protocolService.getProtocolList(this.currentProtocol).subscribe(res => {
        this.dataProtocol = res.payload;
      });
    }
  }

  private _initForm(): void {
    this.addContentForm = this.fb.group({ version: [''], title: [''], description: [''], size: [''], file: [''],
      system_symbol: [''], version_allowed: [''], sub_title: [''], });
    this.shareForm = this.fb.group({ wechatTitle: [''], wechatContent: [''], wechatHost: [''], wechatUrl: [''],
      linkTitle: [''], linkUrl: [''], linkHost: [''], H5Title: [''], H5Content: [''], });
    this.addGuideForm = this.fb.group({ name: [''], type: [''], });
    this.addHelpForm = this.fb.group({ describe: [''], guides: [''], image: [''], name: [''], order: [''], type: [''],
      details_title: [''], details_describe: [''], });
    this.modifyHelpForm = this.fb.group({ describe: [''], guides: [''], image: [''], name: [''], order: [''], type: [''],
    details_title: [''], details_describe: [''], });
    this.modifyGuideForm = this.fb.group({ title: [''], });
    this.addProtocolForm = this.fb.group({ title: [''], content: [''], });
  }

  // 弹框
  showAddModal(flag) {
    if (flag === 'content') {
      this.isAddContentVisible = true;
      this.contentDate = {  // 清空
        // tslint:disable-next-line:max-line-length
        'version': '', 'title': '', 'description': '', 'size': '', 'file': '', 'system_symbol': '', 'version_allowed': '', 'sub_title': '', 'dataContent': ''
      };
    } else if (flag === 'guide') {
      this.isAddGuideVisible = true;
      this.guideDate = { // 清空
        // tslint:disable-next-line:max-line-length
        'name': '', 'type': 'BEGINNNER_GUIDE', 'guideElements': [], 'id': '', 'jumpType': 'DISABLE', 'appDestinationType': 'PERSONAL_CENTER', 'webUrl': ''
      };
      this.guideItem.messageArr.splice(0, this.guideItem.messageArr.length);
      this.guideItem.buttonArr.splice(0, this.guideItem.buttonArr.length);
      this.guideItem.imageArr.splice(0, this.guideItem.imageArr.length);
    } else if (flag === 'help') {
      this.isAddHelpVisible = true;
      this.helpDate = { 'describe': '', 'details': '', 'guides': '', 'image': '', 'name': '', 'order': '', 'type': '' };
      this.helpItem.jumpArr.splice(0, this.helpItem.jumpArr.length);
      this.helpItem.detailArr.splice(0, this.helpItem.detailArr.length);
      this.helpItem = { jumpArr: [{ text: '' }], detailArr: [{ title: '', describe: '' }] };  // 清空后初始化
    }
    this.fileList.splice(0, this.guideItem.imageArr.length);
    this.emptyAdd = ['', '', '', '', '', '', ''];
    this.showImageUrl = '';
  }

  hideModal(flag) {
    if (flag === 'content') {
      this.isAddContentVisible = false;
    } else if (flag === 'guide') {
      this.isAddGuideVisible = false;
      this.isModifyGuideVisible = false;
    } else if (flag === 'addHelp') {
      this.isAddHelpVisible = false;
    } else if (flag === 'share') {  // 取消分享的保存功能
      this.isSaveShareButton = false;
    } else if (flag === 'modifyHelp') {
      this.isModifyHelpVisible = false;
    } else if (flag === 'protocol') {
      this.isSaveProtocolButton = false;
    }
  }

  // 处理后台传过来的经纬度数据
  getPointRoute(points) {
    const path = [];
    for (let i = 0; i < points.length; i++) {
      path.push(points[i].split(',').reverse());
    }
    return path;
  }

  // 封装验证新增
  verificationAdd(flag): boolean {
    let result = true;
    if (flag === 'content') {
      if (this.addContentForm.controls['system_symbol'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '系统类型未选择' });
        result = false;
      } else if (this.addContentForm.controls['title'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '标题未选择' });
        result = false;
      } else if (this.addContentForm.controls['sub_title'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '副标题未填写' });
        result = false;
      } else if (this.addContentForm.controls['version'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '版本未填写' });
        result = false;
      } else if (this.addContentForm.controls['version_allowed'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '允许的最低版本未填写' });
        result = false;
      } else if (this.addContentForm.controls['file'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '下载链接未填写' });
        result = false;
      } else if (this.addContentForm.controls['size'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '文件大小未填写' });
        result = false;
      } else if (this.addContentForm.controls['description'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '更新详情未填写' });
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
      }
      //  else if (this.shareForm.controls['H5Title'].value === '') {
      //   this.modalService.error({ nzTitle: '提示', nzContent: 'H5标题未填写' });
      //   result = false;
      // } else if (this.shareForm.controls['H5Content'].value === '') {
      //   this.modalService.error({ nzTitle: '提示', nzContent: 'H5内容未填写' });
      //   result = false;
      // }
    } else if (flag === 'guide') {
      if (this.addGuideForm.controls['name'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '模板名称未填写' });
        result = false;
      }
    } else if (flag === 'addHelp') {
      if (this.addHelpForm.controls['name'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '技能名称未填写' });
        result = false;
      } else if (this.addHelpForm.controls['order'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '技能排序未填写' });
        result = false;
      } else if (this.addHelpForm.controls['describe'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '技能介绍未填写' });
        result = false;
      }
    }
    if (this.fileList.length !== 1 && flag !== 'guide' && flag !== 'share' && flag !== 'content') {
      this.modalService.error({ nzTitle: '提示', nzContent: '未上传图片' });
      result = false;
    }
    return result;
  }

  // 新增操作
  doSave(flag): void {
    if (flag === 'content') {
      if (!this.verificationAdd('content')) {
        return;
      }
      const contentInput = {
        'version': this.addContentForm.controls['version'].value,
        'title': this.addContentForm.controls['title'].value,
        'description': this.addContentForm.controls['description'].value,
        'size': this.addContentForm.controls['size'].value,
        'file': this.addContentForm.controls['file'].value,
        'system_symbol': this.addContentForm.controls['system_symbol'].value,
        'version_allowed': this.addContentForm.controls['version_allowed'].value,
        'sub_title': this.addContentForm.controls['sub_title'].value,
        'channel': this.currentChanelId
      };
      this.appversionService.addAppversion(contentInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: 'APP管理', op_page: '版本更新', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('content');
          this.loadData('content');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'editShare') {
      this.isSaveShareButton = true;  // 点击编辑按钮，变成保存按钮
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
        // 'h5Title': this.shareForm.controls['H5Title'].value,
        // 'h5Content': this.shareForm.controls['H5Content'].value,
      };
      this.shareService.addShare(shareInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: 'APP管理', op_page: '分享文案', op_name: '保存' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.isSaveShareButton = false; // 保存成功后，变为编辑按钮
          this.loadData('share');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'guide') {  // 引导语
      if (!this.verificationAdd('guide')) { return; }
      const guideInput = {
        'name': this.addGuideForm.controls['name'].value,
        'type': 'BEGINNNER_GUIDE',  // 目前暂时固定一种
      };
      let count = 0;
      const tempallArr = [];
      const allArr = [];
      this.guideItem.messageArr.forEach((item, i) => {
        // tslint:disable-next-line:no-unused-expression
        item ? tempallArr.push(item) : 1; count++;
      });
      this.guideItem.buttonArr.forEach((item, i) => {
        // tslint:disable-next-line:no-unused-expression
        item ? tempallArr.push(item) : 1; count++;
      });
      this.guideItem.imageArr.forEach((item, i) => {
        // tslint:disable-next-line:no-unused-expression
        item ? tempallArr.push(item) : 1; count++;
      });

      // tslint:disable-next-line:no-unused-expression
      tempallArr.forEach((item, i) => { (item.sort === i + 1) ? count++ : 1; });
      if (count !== tempallArr.length) { // 解决不按序号排列的情况
        this.modalService.error({ nzTitle: '提示', nzContent: '序号没有按顺序填写，或序号填写不完整' });
        return;
      }
      tempallArr.forEach((item, i) => {
        // tslint:disable-next-line:radix
        if (parseInt(item.sort) === (i + 1)) { allArr.push(item); }  // 针对sort进行排序
      });
      allArr.forEach((item, i) => {
        // tslint:disable-next-line:radix
        if (parseInt(item.sort) === (i + 1)) { delete item.sort; }  // 删除sort字段
      });
      console.log(allArr);

      if (this.isModifyGuideVisible !== true) { // 只有新增需要绑定模板到APP上
        // 拿到模板Id
        this.guideService.addGuide(guideInput).subscribe(res => {
          if (res.retcode === 0) {
            const guideId = JSON.parse(res.payload).id;

            // 元素添加到模板
            const finalInput = { 'templateId': guideId, 'elements': allArr, 'name': this.addGuideForm.controls['name'].value };
            this.guideService.addXxxForGuide(finalInput).subscribe(res1 => {
              // tslint:disable-next-line:max-line-length
              res1.retcode === 0 ? this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } }) : this.modalService.error({ nzTitle: '提示', nzContent: res1.message });
            });

            // 给指定的APP绑定模板
            const guideInfo = { 'id': this.currentAppId, 'templateId': guideId };
            this.guideService.addGuideForApp(guideInfo).subscribe(result => {  // 新增一个模板给到默认的APP，不然看不到模板新增后的数据
              if (result.retcode === 0) {
                this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } });
                const operationInput = { op_category: 'APP管理', op_page: '引导语模板', op_name: '新增' };
                this.commonService.updateOperationlog(operationInput).subscribe();
                this.isAddGuideVisible = false;
                this.loadData('guide');
              }
            });
          } else {
            this.modalService.error({ nzTitle: '提示', nzContent: res.message });
          }
        });
      } else {  // 修改时候，直接调用修改接口
        // 元素添加到模板
        const finalInput = { 'templateId': this.templateId, 'elements': allArr, 'name': this.addGuideForm.controls['name'].value };
        this.guideService.addXxxForGuide(finalInput).subscribe(res1 => {
          // tslint:disable-next-line:max-line-length
          res1.retcode === 0 ? this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } }) : this.modalService.error({ nzTitle: '提示', nzContent: res1.message });
          const operationInput = { op_category: 'APP管理', op_page: '引导语模板', op_name: '保存' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        });
      }
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
    } else if (flag === 'addHelp') {
      if (!this.verificationAdd('addHelp')) { return; }
      const guides = [];  // 单独处理拿到的数组
      this.helpItem.jumpArr.forEach(item => { guides.push(item.text); });
      const helpInput = {
        'describe': this.addHelpForm.controls['describe'].value,
        'details': this.helpItem.detailArr,
        'guides': guides,
        'image': this.imageUrl,
        'name': this.addHelpForm.controls['name'].value,
        'order': this.addHelpForm.controls['order'].value,
        'type': this.helpType
      };
      this.helpService.addHelp(helpInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: 'APP管理', op_page: '幫助管理', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('addHelp');
          this.loadData('help');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'modifyHelp') {
      if (!this.verificationModify('addHelp')) {
        return;
      }
      const guides = [];  // 单独处理拿到的数组
      this.helpItem.jumpArr.forEach(item => { guides.push(item.text); });
      const helpInput = {
        'id': this.templateId,
        'describe': this.modifyHelpForm.controls['describe'].value,
        'details': this.helpItem.detailArr,
        'guides': guides,
        'image': this.imageUrl,
        'name': this.modifyHelpForm.controls['name'].value,
        'order': this.modifyHelpForm.controls['order'].value,
        'type': this.helpType
      };
      this.helpService.updateHelp(helpInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: 'APP管理', op_page: '帮助管理', op_name: '修改' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('modifyHelp');
          this.loadData('help');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'editProtocol') {
      this.isSaveProtocolButton = true;
    } else if (flag === 'saveProtocol') {
      const protocolInput = {
        'title': this.currentProtocol,
        'content': encodeURI(this.replaceHtmlStr(this.addProtocolForm.controls['content'].value)).replace(/&/g, '%26')
      };
      this.protocolService.addProtocol(protocolInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '运维后台', op_page: '协议管理' , op_name: '保存' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.isSaveProtocolButton = false; // 保存成功后，变为编辑按钮
          this.loadData('voice');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'previewProtocol') {
      // tslint:disable-next-line:max-line-length
      window.open(`${this.commonService.dataCenterUrl.substring(0, this.commonService.dataCenterUrl.indexOf(':46004/api'))}/static/protocolManage.html?title=${this.currentProtocol}&channelId=${localStorage.getItem('currentAppHeader')}`);
    } else if (flag === 'help_jump') {
      const jumpItem = {
        'text': ''
      };
      this.helpItem.jumpArr.push(jumpItem);
    } else if (flag === 'help_detail') {
      const detailItem = {
        'title': '',
        'describe': ''
      };
      this.helpItem.detailArr.push(detailItem);
    }
  }

  // 修改 - 弹框
  showModifyModal(data, flag) {
    if (flag === 'guide') {
      this.guideDate = { // 清空
        // tslint:disable-next-line:max-line-length
        'name': '', 'type': 'BEGINNNER_GUIDE', 'guideElements': [], 'id': '', 'jumpType': 'DISABLE', 'appDestinationType': 'PERSONAL_CENTER', 'webUrl': ''
      };
      this.guideItem.messageArr.splice(0, this.guideItem.messageArr.length);
      this.guideItem.buttonArr.splice(0, this.guideItem.buttonArr.length);
      this.guideItem.imageArr.splice(0, this.guideItem.imageArr.length);
      this.fileList.splice(0, this.guideItem.imageArr.length);
      this.showImageUrl = '';

      this.templateId = data.id; // 用于修改
      this.isModifyGuideVisible = true;
      this.guideDate.name = data.name;
      this.guideDate.type = data.type;
      let imageUrl = '';  // 获取到图片
      let jumpType = '';  // 跳转位置
      let appDestinationType = '';  // 跳转位置
      let webUrl = '';  // 网址
      data.guideElements.forEach((item, i) => {
        if (item.type === 'MESSAGE') {
          item.sort = i + 1;
          this.guideItem.messageArr.push(item);
        }
        if (item.type === 'BUTTON') {
          item.sort = i + 1;
          this.guideItem.buttonArr.push(item);
        }
        if (item.type === 'IMAGE') {
          imageUrl = item.imageKey;
          jumpType = item.jumpType;
          appDestinationType = item.appDestinationType;
          webUrl = item.webUrl;
          item.sort = i + 1;
          this.guideItem.imageArr.push(item);
        }
      });
      // tslint:disable-next-line:max-line-length
      this.showImageUrl = `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}/guide/resources/images/${imageUrl}`;
      this.guideDate.jumpType = jumpType;
      this.guideDate.appDestinationType = appDestinationType;
      this.guideDate.webUrl = webUrl;
      const file: any = { name: imageUrl };
      this.fileList.push(file);
    } else if (flag === 'help') {
      const id = data.id;
      this.helpItem.jumpArr.splice(0, this.helpItem.jumpArr.length);  // 先清空数组
      this.helpItem.detailArr.splice(0, this.helpItem.jumpArr.length);
      this.fileList.splice(0, this.fileList.length);
      this.isModifyHelpVisible = true;
      this.templateId = id;  // 用于修改
      this.helpService.getHelp(id).subscribe(res => {
        // 处理异常处理
        this.helpDate = data;
        this.imageUrl = JSON.parse(res.payload).image;
        this.helpType = data.type;
        this.imageUrl = data.image;
        data.guides.forEach(item => {
          let tempJson = { text: item };
          this.helpItem.jumpArr.push(tempJson);
        });
        this.helpItem.detailArr = data.details;
        const file: any = { name: JSON.parse(res.payload).image };
        this.fileList.push(file);
        this.showImageUrl = `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}/v1/cms/skills/images/${this.imageUrl}`;
      });
    }
  }

  // 封装验证修改表单
  verificationModify(flag): boolean {
    let result = true;
    if (flag === 'help') {
      if (this.modifyHelpForm.controls['title'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '轮播图标题未填写' });
        result = false;
      } else if (this.modifyHelpForm.controls['jump'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '跳转位置未选择' });
        result = false;
      } else if (this.modifyHelpForm.controls['order'].value === '') {
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

  doDelete(id, flag) {
    if (flag === 'guide') {
      this.guideService.deleteGuideFromApp(this.currentAppId, id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: 'APP管理', op_page: '引导语模板', op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('guide');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'guide_message') {
      this.guideItem.messageArr.splice(id, 1);
    } else if (flag === 'guide_button') {
      this.guideItem.buttonArr.splice(id, 1);
    } else if (flag === 'guide_image') {
      this.guideItem.imageArr.splice(id, 1);
    } else if (flag === 'help_jump') {
      this.helpItem.jumpArr.splice(id, 1);
    } else if (flag === 'help_detail') {
      this.helpItem.detailArr.splice(id, 1);
    } else if (flag === 'help') {
      this.helpService.deleteHelp(id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: 'APP管理', op_page: '帮助管理', op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('help');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  // 点击switch
  clickSwitch(data, flag) {
    if (flag === 'guide') {
      const switchInput = { 'id': this.currentAppId, 'templateId': data.id, 'enable': data.enabled };
      this.guideService.updateSwitch(switchInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: 'APP管理', op_page: '引导语模板', op_name: '启用/不启用' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
        this.loadData('guide');
      });
    } else if (flag === 'help') {
      const switchInput = { 'id': data.id, 'enable': data.enabled };
      this.helpService.updateHelp(switchInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: 'APP管理', op_page: '帮助管理', op_name: '启用/不启用' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
        this.loadData('help');
      });
    }
  }

  // 上传image
  beforeUpload = (file: UploadFile): boolean => {
    const suffix = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
    const isPng = suffix === '.png' || suffix === '.jpeg' || suffix === '.jpg' || suffix === '.ico' ? true : false;
    const isMoreThanTen = file.size < 512000 ? true : false;
    if (this.currentPanel === 'share') {
      this.fileList.splice(0, this.fileList.length);
    }
    if (this.currentPanel === 'guide') {
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
    let url = ''; // 用于上传
    let flag = '';
    switch (this.currentPanel) {
      case 'share':
        url = `/copywriter/upload/`;
        flag = 'file';
        break;
      case 'guide':
        url = `/guide/resources/images/`;
        flag = 'file';
        break;
      case 'help':
        url = `/v1/cms/skills/images/`;
        flag = 'image';
        break;
      default:
        break;
    }
    // 文件数量不可超过1个，超过一个则提示
    if (this.fileList.length > 1 && this.currentPanel !== 'share') {
      this.notification.error( '提示', '您上传的文件超过一个！' );
      return;
    }
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append(flag, file);
      // tslint:disable-next-line:no-unused-expression
      this.currentPanel === 'share' ? formData.append('fileType', '0') : '1';
      // this.currentPanel === 'share' ? formData.append('fileType', this.currentCopywritingImage) : '1';
      // tslint:disable-next-line:no-unused-expression
      this.currentPanel === 'guide' ? formData.append('imageKey', file.name) : 1;
    });
    // tslint:disable-next-line:max-line-length
    const baseUrl = this.currentPanel === 'guide' || this.currentPanel === 'help' ? this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin')) : this.commonService.baseUrl;
    const req = new HttpRequest('POST', `${baseUrl}${url}`, formData, { // 上传图需要区分，因为引导语不需要admin，而分享需要admin
      reportProgress: true,
      headers: new HttpHeaders({ 'Authorization': localStorage.getItem('token') })
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe((event: HttpResponse<{ code: any, data: any, msg: any }> | any) => {
        if (event.body.retcode === 0) {
          this.imageUrl = event.body.payload; // 不仅用于下面的showImageUrl的拼接，还有其他接口会用到新增修改等操作
          if (this.currentPanel === 'share') {  // 针对分享
            if (this.currentCopywritingImage === '0') {
              // tslint:disable-next-line:max-line-length
              this.shareImageUrl01 = `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}${url}?fileName=${this.imageUrl}`;
            } else if (this.currentCopywritingImage === '1') {
              // tslint:disable-next-line:max-line-length
              this.shareImageUrl02 = `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}${url}?fileName=${this.imageUrl}`;
            } else if (this.currentCopywritingImage === '2') {
              // tslint:disable-next-line:max-line-length
              this.shareImageUrl03 = `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}${url}?fileName=${this.imageUrl}`;
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
            this.onInputChange(this.imageUrl, 'imageImageKey', 0);  // 上传成功后，将穿回来的信息丢给第一个图片
            this.showImageUrl = url + '/api' + this.imageUrl;
          } else if (this.currentPanel === 'help') {  // 引导语
            this.showImageUrl = `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}${url}${this.imageUrl}`;
          }
          this.notification.success( '提示', '上传成功' );
          // tslint:disable-next-line:max-line-length
          const operationInput = { op_category: 'APP管理', op_page: this.currentPanel === 'share' ? '分享文案' : this.currentPanel === 'guide' ? '引导语模板' : this.currentPanel === 'help' ? '帮助管理' : '' , op_name: '上传图片' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: event.body.message, });
        }
        formData.delete(flag);
      }, err => { formData.delete(flag); }
    );
  }

  // 针对结构进行数据的累加
  onInputChange(value, site, item) {
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
    } else if (site === 'helpJunp') {  // input help
      this.helpItem.jumpArr.forEach(( cell, i ) => {
        // tslint:disable-next-line:no-unused-expression
        i === item ? cell.text = value : 1;
      });
    } else if (site === 'helpDetailTitle') {  // input help
      this.helpItem.detailArr.forEach(( cell, i ) => {
        // tslint:disable-next-line:no-unused-expression
        i === item ? cell.title = value : 1;
      });
    } else if (site === 'helpDetailDesc') {  // input help
      this.helpItem.detailArr.forEach(( cell, i ) => {
        // tslint:disable-next-line:no-unused-expression
        i === item ? cell.describe = value : 1;
      });
    }
  }

  // 日期插件
  onChange(result): void {
    if (result === []) {
      this.beginDate = '';
      this.endDate = '';
      return;
    }
    // 正确选择数据
    if (result[0] !== '' || result[1] !== '') {
      this.beginDate = this.datePipe.transform(result[0], 'yyyyMMdd');
      this.endDate = this.datePipe.transform(result[1], 'yyyyMMdd');
    }
  }

  // 切换面板
  changePanel(flag): void {
    // tslint:disable-next-line:no-unused-expression
    flag !== this.currentPanel ? this.loadData(flag) : 1;
    if (flag !== 'share') {
      this.isSaveShareButton = false;
    }
    this.currentPanel = flag;
    // tslint:disable-next-line:max-line-length
    const operationInput = { op_category: 'APP管理', op_page: flag === 'content' ? '版本更新' : flag === 'share' ? '分享文案' : flag === 'guide' ? '引导语模板' : flag === 'help' ? '帮助管理' : flag === 'protocol' ? '协议管理' : '', op_name: '访问' };
    this.commonService.updateOperationlog(operationInput).subscribe();
  }

  // 用于区分分享文案下的三个上传图片的方法
  choosePng(flag) {
    this.currentCopywritingImage = flag;
  }

  chooseProtocol(flag) {
    this.currentProtocol = flag;
    this.loadData('protocol');
  }

  // 替换所有奇怪字符
  replaceHtmlStr(str) {
    return str = str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, '\'')
          .replace(/&quot;/g, '"').replace(/&nbsp;/g, '<br>').replace(/&ensp;/g, '   ')
          .replace(/&emsp;/g, '    ').replace(/%/g, '%').replace(/&amp;/g, '&');
  }

}
