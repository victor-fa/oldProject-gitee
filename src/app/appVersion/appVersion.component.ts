import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalService, NzNotificationService, UploadFile } from 'ng-zorro-antd';
import { filter } from 'rxjs/operators';
import { AppversionService } from '../public/service/appVersion.service';
import { CommonService } from '../public/service/common.service';
import { GuideService } from '../public/service/guide.service';
import { HelpService } from '../public/service/help.service';
import { LocalizationService } from '../public/service/localization.service';
import { ProtocolService } from '../public/service/protocol.service';
import { ShareService } from '../public/service/share.service';
import { FlowpointService } from '../public/service/flowpoint.service';
import { QqCustomerService } from '../public/service/qqCustomer.service';
import { DomSanitizer } from '@angular/platform-browser';

registerLocaleData(zh);

@Component({
  selector: 'app-appVersion',
  templateUrl: './appVersion.component.html',
  styleUrls: ['./appVersion.component.scss']
})
export class AppVersionComponent implements OnInit {

  visiable = {addContent: false, addGuide: false, addHelp: false, addFlowPoint: false, modifyGuide: false,
    modifyHelp: false, modifyFlowPoint: false };
  addContentForm: FormGroup;
  addGuideForm: FormGroup;
  addHelpForm: FormGroup;
  shareForm: FormGroup;
  modifyGuideForm: FormGroup;
  modifyHelpForm: FormGroup;
  addProtocolForm: FormGroup;
  addFlowPointForm: FormGroup;
  modifyFlowPointForm: FormGroup;
  qqCustomerForm: FormGroup;
  now = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  emptyAdd = ['', '', '', '', '', '', ''];  // 清空新增表单
  contentDate = { 'version': '', 'title': '', 'description': '', 'size': '', 'file': '', 'system_symbol': 'ANDROID', 'version_allowed': '', 'sub_title': '已完成', 'dataContent': '' };
  dataShare = { 'wechatTitle': '', 'wechatContent': '', 'wechatHost': '', 'wechatUrl': '', 'linkTitle': '', 'linkUrl': '', 'linkHost': '', 'h5Title': '', 'h5Content': ''};  // 分享
  dataQQCustomer = { 'contact_qq': '' };
  guideDate = { 'name': '', 'type': 'BEGINNNER_GUIDE', 'guideElements': [], 'id': '', 'jumpType': 'DISABLE', 'appDestinationType': 'PERSONAL_CENTER', 'webUrl': '' };
  flowPointDate = { 'id': '', 'botName': '', 'process': '', 'mtime': '', 'status': '', 'botMsg': '', 'guides': [], 'guideArr': [] };
  helpDate = { 'describe': '', 'details': '', 'guides': '', 'image': '', 'name': '', 'order': '', 'type': '', 'guideArr': '' };
  dataContent = []; // 内容
  dataSystemSymbo = []; // 操作系统
  dataGuide = []; // 引导语
  dataHelp = []; // 帮助管理
  dataProtocol = []; // 协议管理
  dataFlowPoint = []; // 流程点引导
  shareImageUrl01 = '';
  shareImageUrl02 = '';
  shareImageUrl03 = '';
  showImageUrl = '';
  fileList: UploadFile[] = [];
  currentCopywritingImage = '';
  imageUrl = '';
  currentPanel = 'content';  // 当前面板 默认内容管理
  guideItem = { messageArr: [], buttonArr: [], imageArr: [], };
  currentAppId = '';  // 当前默认的APP信息
  templateId = '';  // 帮助管理的模板Id
  isSaveShareButton = false;
  isSaveProtocolButton = false;
  isSaveQQCustomerButton = false;
  currentProtocol = '1';
  private timerList;
  private timerDetail;
  helpType = 'TRAVEL';
  limitModelChange = 1;
  isSpinning = false;
  flowPointBotName = '';
  tempContent;

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private modalService: NzModalService,
    private protocolService: ProtocolService,
    private flowpointService: FlowpointService,
    public localizationService: LocalizationService,
    private appversionService: AppversionService,
    private notification: NzNotificationService,
    private qqCustomerService: QqCustomerService,
    private helpService: HelpService,
    private guideService: GuideService,
    private datePipe: DatePipe,
    private shareService: ShareService,
    private msg: NzMessageService,
    private http: HttpClient,
    private sanitize: DomSanitizer,
  ) {
    this.commonService.nav[1].active = true;
    this._initForm();
  }

  ngOnInit() {
    const tabFlag = [{label: '版本更新', value: 'content'}, {label: '分享文案', value: 'share'},
        {label: '引导语模板', value: 'guide'}, {label: '帮助管理', value: 'help'},
        {label: '协议管理', value: 'protocol'}, {label: '流程点引导', value: 'flowPoint'},
        {label: '客服QQ', value: 'qqCustomer'}];
    let targetFlag = 0;
    for (let i = 0; i < tabFlag.length; i++) {
      if (this.commonService.haveMenuPermission('children', tabFlag[i].label)) {targetFlag = i; break; }
    }
    console.log(tabFlag[targetFlag].value);
    this.loadData(tabFlag[targetFlag].value);
    this.changePanel(tabFlag[targetFlag].value);
  }

  ngOnDestroy() {
    if (this.timerList) { clearInterval(this.timerList); }
    if (this.timerDetail) { clearInterval(this.timerDetail); }
  }

  loadData(flag) {
    this.isSpinning = true; // loading
    if (flag === 'content') {
      const arr = [];
      this.appversionService.getAppversionList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          if (JSON.parse(res.payload).android !== 'null') { arr.push(JSON.parse(JSON.parse(res.payload).android)); }
          if (JSON.parse(res.payload).ios !== 'null') { arr.push(JSON.parse(JSON.parse(res.payload).ios)); }
          this.dataContent = arr;
          const operationInput = { op_category: 'APP管理', op_page: '版本更新', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'system') {
      const arrSystem = [];
      this.appversionService.getSystemSymbolList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          arrSystem.push(JSON.parse(res.payload).ANDROID);
          arrSystem.push(JSON.parse(res.payload).IOS);
          this.dataSystemSymbo = arrSystem;
          const operationInput = { op_category: 'APP管理', op_page: '版本更新', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'share') {
      this.shareImageUrl01 = '';
      this.shareImageUrl02 = '';
      this.shareImageUrl03 = '';
      this.shareService.getShareList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200 && res.payload !== 'null') {
          this.isSpinning = false;
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
        } else if (res.payload === 'null') {

        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'guide') {
      this.guideService.getGuideAppList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          if (res.retcode === 0) {
            const appList = JSON.parse(res.payload);
            let templates = {}; // 用于获取APP里面的模板信息，针对激活与否
            appList.forEach(item => {
              if (item.registryName === localStorage.getItem('currentAppHeader')) {
                this.currentAppId = item.id;
                if (JSON.stringify(item.templates) !== '{}') { templates = JSON.parse(item.templates); }
              }
            });
            this.guideService.getGuideList(this.currentAppId).subscribe(result => { // 查当前APP的id下有多少个模板
              if (result.retcode === 0) {
                this.dataGuide = JSON.parse(result.payload).reverse();
                console.log(this.dataGuide);
                const operationInput = { op_category: 'APP管理', op_page: '引导语模板', op_name: '访问' };
                this.commonService.updateOperationlog(operationInput).subscribe();
                this.dataGuide.forEach((cell, i) => {
                  let enabled = false;
                  for (const key in templates) { if (key === cell.id) { enabled = templates[key]; } } // 匹配APP的templates与模板接口查出来的Id
                  cell.enabled = enabled;
                });
              }
            });
          }
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'help') {
      this.helpService.getHelpList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataHelp = JSON.parse(res.payload).reverse();
          console.log(this.dataHelp);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
      const operationInput = { op_category: 'APP管理', op_page: '帮助管理', op_name: '访问' };
      this.commonService.updateOperationlog(operationInput).subscribe();
    } else if (flag === 'protocol') {
      this.protocolService.getProtocolList(this.currentProtocol).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataProtocol = res.payload;
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'flowPoint') {
      this.flowpointService.getFlowpointList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          if (this.flowPointBotName !== '') {
            const tempArr = [];
            JSON.parse(res.payload).forEach(item => {
              const guideArr = [];
              if (item.guides) { item.guides.forEach(cell => { guideArr.push(cell.join('\n')); }); }
              item.guideArr = guideArr;
              if (item.botName === this.flowPointBotName) { tempArr.push(item); }
            });
            this.dataFlowPoint = tempArr;
          } else {
            const tempArr = [];
            JSON.parse(res.payload).forEach(item => {
              const guideArr = [];
              if (item.guides) { item.guides.forEach(cell => { guideArr.push(cell.join('\n')); }); item.guideArr = guideArr; }
              tempArr.push(item);
            });
            this.dataFlowPoint = tempArr;
          }
          console.log(this.dataFlowPoint);
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'qqCustomer') {
      this.qqCustomerService.getQqCustomerList().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.dataQQCustomer = res.payload;
          const operationInput = { op_category: 'APP管理', op_page: '客服QQ', op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  private _initForm(): void {
    this.addContentForm = this.fb.group({ version: [''], title: [''], description: [''], size: [''], file: [''],
      system_symbol: [''], version_allowed: [''], sub_title: [''], });
    this.shareForm = this.fb.group({ wechatTitle: [''], wechatContent: [''], wechatHost: [''], wechatUrl: [''],
      linkTitle: [''], linkUrl: [''], linkHost: [''], H5Title: [''], H5Content: [''], });
    this.addGuideForm = this.fb.group({ name: [''], type: [''], });
    this.addHelpForm = this.fb.group({ describe: [''], guides: [''], image: [''], name: [''], order: [''], type: [''], details: [''] });
    this.modifyHelpForm = this.fb.group({ describe: [''], guides: [''], image: [''], name: [''], order: [''], type: [''], details: [''] });
    this.modifyGuideForm = this.fb.group({ title: [''], });
    this.addProtocolForm = this.fb.group({ title: [''], content: [''], });
    this.addFlowPointForm = this.fb.group({ botName: [''], process: [''], mtime: [''], status: [''], botMsg: [''], guides: [''], });
    this.modifyFlowPointForm = this.fb.group({ botName: [''], process: [''], mtime: [''], status: [''], botMsg: [''], guides: [''], });
    this.qqCustomerForm = this.fb.group({ contact_qq: [''] });
  }

  // 弹框
  showAddModal(flag) {
    if (flag === 'content') {
      this.visiable.addContent = true;
      this.contentDate = {  // 清空
        'version': '', 'title': '', 'description': '', 'size': '', 'file': '', 'system_symbol': 'ANDROID', 'version_allowed': '', 'sub_title': '已完成', 'dataContent': ''
      };
    } else if (flag === 'guide') {
      this.visiable.addGuide = true;
      this.guideDate = { // 清空
        'name': '', 'type': 'BEGINNNER_GUIDE', 'guideElements': [], 'id': '', 'jumpType': 'DISABLE', 'appDestinationType': 'PERSONAL_CENTER', 'webUrl': ''
      };
      this.guideItem.messageArr.splice(0, this.guideItem.messageArr.length);
      this.guideItem.buttonArr.splice(0, this.guideItem.buttonArr.length);
      this.guideItem.imageArr.splice(0, this.guideItem.imageArr.length);
    } else if (flag === 'help') {
      this.visiable.addHelp = true;
      this.helpDate = { 'describe': '', 'details': '', 'guides': '', 'image': '', 'name': '', 'order': '', 'type': '', 'guideArr': '' };
      this.helpType = 'TRAVEL';
    } else if (flag === 'flowPoint') {
      this.visiable.addFlowPoint = true;
      this.flowPointDate = { 'id': '', 'botName': '', 'process': '', 'mtime': '', 'status': '', 'botMsg': '', 'guides': [], 'guideArr': [] };
    }
    this.fileList.splice(0, this.fileList.length);
    this.emptyAdd = ['', '', '', '', '', '', ''];
    this.showImageUrl = '';
  }

  hideModal(flag) {
    if (flag === 'content') {
      this.visiable.addContent = false;
    } else if (flag === 'guide') {
      this.visiable.addGuide = false;
      this.visiable.modifyGuide = false;
    } else if (flag === 'addHelp') {
      this.visiable.addHelp = false;
      this.helpDate = { 'describe': '', 'details': '', 'guides': '', 'image': '', 'name': '', 'order': '', 'type': '', 'guideArr': '' };
      this.helpType = 'TRAVEL';
    } else if (flag === 'share') {
      this.isSaveShareButton = false;
    } else if (flag === 'modifyHelp') {
      this.visiable.modifyHelp = false;
      this.helpDate = { 'describe': '', 'details': '', 'guides': '', 'image': '', 'name': '', 'order': '', 'type': '', 'guideArr': '' };
      this.helpType = 'TRAVEL';
    } else if (flag === 'protocol') {
      this.isSaveProtocolButton = false;
    } else if (flag === 'addFlowPoint') {
      this.visiable.addFlowPoint = false;
      this.flowPointDate = { 'id': '', 'botName': '', 'process': '', 'mtime': '', 'status': '', 'botMsg': '', 'guides': [],
        'guideArr': [] };
    } else if (flag === 'modifyFlowPoint') {
      this.visiable.modifyFlowPoint = false;
      this.flowPointDate = { 'id': '', 'botName': '', 'process': '', 'mtime': '', 'status': '', 'botMsg': '', 'guides': [],
        'guideArr': [] };
    } else if (flag === 'qqCustomer') {
      this.isSaveQQCustomerButton = false;
    }
  }

  // 处理后台传过来的经纬度数据
  getPointRoute(points) {
    const path = [];
    for (let i = 0; i < points.length; i++) { path.push(points[i].split(',').reverse()); }
    return path;
  }

  // 封装验证新增
  verificationAdd(flag): boolean {
    let result = true;
    if (flag === 'content') {
      if (this.addContentForm.controls['system_symbol'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '系统类型未选择' }); result = false;
      } else if (this.addContentForm.controls['title'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '标题未选择' }); result = false;
      } else if (this.addContentForm.controls['sub_title'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '副标题未填写' }); result = false;
      } else if (this.addContentForm.controls['version'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '版本未填写' }); result = false;
      } else if (this.addContentForm.controls['version_allowed'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '允许的最低版本未填写' }); result = false;
      } else if (this.addContentForm.controls['file'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '下载链接未填写' }); result = false;
      } else if (this.addContentForm.controls['size'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '文件大小未填写' }); result = false;
      } else if (this.addContentForm.controls['description'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '更新详情未填写' }); result = false;
      }
    } else if (flag === 'share') {
      if (this.shareForm.controls['wechatTitle'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '微信分享的标题未填写' }); result = false;
      } else if (this.shareForm.controls['wechatContent'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '微信分享的的内容未填写' }); result = false;
      } else if (this.shareForm.controls['wechatHost'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '微信分享的的域名路径未填写' }); result = false;
      } else if (this.shareForm.controls['wechatUrl'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '微信分享的跳转链接未填写' }); result = false;
      } else if (this.shareForm.controls['linkTitle'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '复制路径的标题未填写' }); result = false;
      } else if (this.shareForm.controls['linkUrl'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '复制路径对的跳转链接未填写' }); result = false;
      } else if (this.shareForm.controls['linkHost'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '复制路径的域名路径未填写' }); result = false;
      }
      //  else if (this.shareForm.controls['H5Title'].value === '') {
      //   this.modalService.error({ nzTitle: '提示', nzContent: 'H5标题未填写' }); result = false;
      // } else if (this.shareForm.controls['H5Content'].value === '') {
      //   this.modalService.error({ nzTitle: '提示', nzContent: 'H5内容未填写' }); result = false;
      // }
    } else if (flag === 'guide') {
      if (this.addGuideForm.controls['name'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '模板名称未填写' }); result = false;
      }
    } else if (flag === 'addHelp') {
      const guides = this.addHelpForm.controls['guides'].value.replace(/\r/g, ',').replace(/\n/g, ',').split(',');
      if (this.addHelpForm.controls['name'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '技能名称未填写' }); result = false;
      } else if (this.addHelpForm.controls['order'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '技能排序未填写' }); result = false;
      } else if (this.addHelpForm.controls['describe'].value === '' || this.addHelpForm.controls['describe'].value === null) {
        this.modalService.error({ nzTitle: '提示', nzContent: '技能介绍未填写' }); result = false;
      } else if (this.addHelpForm.controls['details'].value === '' || this.addHelpForm.controls['details'].value === null) {
        this.modalService.error({ nzTitle: '提示', nzContent: '详情页编辑未填写' }); result = false;
      } else if (guides.length < 1) {
        this.modalService.error({ nzTitle: '提示', nzContent: '外部跳转编辑至少填1个' }); result = false;
      }
      guides.forEach(item => {
        if (item === '') { this.modalService.error({ nzTitle: '提示', nzContent: '外部跳转编辑有话术未填写' }); result = false; }
      });
    } else if (flag === 'addFlowPoint') {
      const guideArr = this.flowPointDate.guides;
      const finalGuides = []; // 获取最终结果
      guideArr.sort(function(a, b) {return a.sort - b.sort; });
      guideArr.forEach((item, i) => {
        if (item.text !== '' && item.sort !== '') {
          finalGuides.push(item.text.replace(/\r/g, ',').replace(/\n/g, ',').split(','));
        } else { this.modalService.error({ nzTitle: '提示', nzContent: '指引语或排序未填写' }); result = false; }
      });
      if (this.addFlowPointForm.controls['botName'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: 'bot选择未选择' }); result = false;
      } else if (this.addFlowPointForm.controls['process'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '流程点名称未填写' }); result = false;
      } else if (this.addFlowPointForm.controls['botMsg'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '对应后台话术未填写' }); result = false;
      } else if (finalGuides.length < 1) {
        this.modalService.error({ nzTitle: '提示', nzContent: '指引语设置至少填1个' }); result = false;
      }
      finalGuides.forEach(item => {
        item.forEach(cell => {
          if (cell.length > 18) { this.modalService.error({ nzTitle: '提示', nzContent: '指引语设置不得超过18个字符' }); result = false; }
        });
      });
    } else if (flag === 'modifyFlowPoint') {
      const guideArr = this.flowPointDate.guides;
      const finalGuides = []; // 获取最终结果
      guideArr.sort(function(a, b) {return a.sort - b.sort; });
      guideArr.forEach((item, i) => {
        if (item.text !== '' && item.sort !== '') {
          finalGuides.push(item.text.replace(/\r/g, ',').replace(/\n/g, ',').split(','));
        } else { this.modalService.error({ nzTitle: '提示', nzContent: '指引语或排序未填写' }); result = false; }
      });
      if (this.modifyFlowPointForm.controls['botName'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: 'bot选择未选择' }); result = false;
      } else if (this.modifyFlowPointForm.controls['process'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '流程点名称未填写' }); result = false;
      } else if (this.modifyFlowPointForm.controls['botMsg'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '对应后台话术未填写' }); result = false;
      } else if (finalGuides.length < 1) {
        this.modalService.error({ nzTitle: '提示', nzContent: '指引语设置至少填1个' }); result = false;
      }
      finalGuides.forEach(item => {
        item.forEach(cell => {
          if (cell.length > 18) { this.modalService.error({ nzTitle: '提示', nzContent: '指引语设置不得超过18个字符' }); result = false; }
        });
      });
    } else if (flag === 'qqCustomer') {
      if (this.qqCustomerForm.controls['contact_qq'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: 'QQ号未填写' }); result = false;
      }
    }
    if (this.fileList.length !== 1 && flag !== 'guide' && flag !== 'share' && flag !== 'content'
      && flag !== 'addFlowPoint' && flag !== 'modifyFlowPoint' && flag !== 'qqCustomer') {
      this.modalService.error({ nzTitle: '提示', nzContent: '未上传图片' }); result = false;
    }
    return result;
  }

  // 新增操作
  doSave(flag): void {
    if (flag === 'content') {
      if (!this.verificationAdd('content')) { return; }
      const contentInput = {
        'version': this.addContentForm.controls['version'].value,
        'title': this.addContentForm.controls['title'].value,
        'description': this.addContentForm.controls['description'].value,
        'size': this.addContentForm.controls['size'].value,
        'file': this.addContentForm.controls['file'].value,
        'system_symbol': this.addContentForm.controls['system_symbol'].value,
        'version_allowed': this.addContentForm.controls['version_allowed'].value,
        'sub_title': this.addContentForm.controls['sub_title'].value,
        'channel': localStorage.getItem('currentAppHeader')
      };
      this.appversionService.addAppversion(contentInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: 'APP管理', op_page: '版本更新', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('content');
          this.loadData('content');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'editShare') {
      this.isSaveShareButton = true;  // 点击编辑按钮，变成保存按钮
    } else if (flag === 'share') {
      if (!this.verificationAdd('share')) { return; }
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
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'guide') {  // 引导语
      if (!this.verificationAdd('guide')) { return; }
      const guideInput = { 'name': this.addGuideForm.controls['name'].value, 'type': 'BEGINNNER_GUIDE', }; // 目前暂时固定一种
      let allArr = [];
      let count = 0;
      const tempallArr = [];
      const checkSortArr = [];
      this.guideItem.messageArr.forEach((item, i) => { if (item) { item.text && item.text !== '' ? tempallArr.push(item) : count += 1; } });
      if (count > 0) { this.modalService.error({ nzTitle: '提示', nzContent: '对话配置不能为空' }); return; }
      this.guideItem.buttonArr.forEach((item, i) => { if (item) { item.text && item.text !== '' ? tempallArr.push(item) : count += 1; } });
      if (count > 0) { this.modalService.error({ nzTitle: '提示', nzContent: '表单配置不能为空' }); return; }
      this.guideItem.imageArr.forEach((item, i) => { if (item) { item.imageKey !== '' ? tempallArr.push(item) : count += 1; }});
      if (count > 0) { this.modalService.error({ nzTitle: '提示', nzContent: '未上传图片' }); return; }

      tempallArr.forEach((item, i) => { item.sort ? checkSortArr.push(item.sort) : (count += 1); }); // sort组成数组
      if (count > 0) { this.modalService.error({ nzTitle: '提示', nzContent: '排序不能为空' }); return; }
      const tempArr = checkSortArr.slice().sort();  // 进行排序
      for (let i = 0; i < checkSortArr.length; i++) { if (parseInt(tempArr[i]) === parseInt(tempArr[i + 1])) { count += 1; }}

      if (count > 0) { this.modalService.error({ nzTitle: '提示', nzContent: '序号不可重复' }); return; }
      allArr = tempallArr.sort(this.sortBySort);  // 根据sort排序
      allArr.forEach(item => { if (item.webUrl && item.webUrl !== '') { item.webUrl = item.webUrl.replace(/&/g, '%26'); } });

      if (this.visiable.modifyGuide !== true) { // 只有新增需要绑定模板到APP上
        // 拿到模板Id
        this.guideService.addGuide(guideInput).subscribe(res => {
          if (res.retcode === 0) {
            const guideId = JSON.parse(res.payload).id;
            // 元素添加到模板
            const finalInput = { 'templateId': guideId, 'elements': allArr, 'name': this.addGuideForm.controls['name'].value };
            this.guideService.addXxxForGuide(finalInput).subscribe(res1 => {

              res1.retcode === 0 ? this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } }) : this.modalService.error({ nzTitle: '提示', nzContent: res1.message });
            });
            // 给指定的APP绑定模板
            const guideInfo = { 'id': this.currentAppId, 'templateId': guideId };
            this.guideService.addGuideForApp(guideInfo).subscribe(result => {  // 新增一个模板给到默认的APP，不然看不到模板新增后的数据
              if (result.retcode === 0) {
                this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } });
                const operationInput = { op_category: 'APP管理', op_page: '引导语模板', op_name: '新增' };
                this.commonService.updateOperationlog(operationInput).subscribe();
                this.hideModal('guide');
                this.loadData('guide');
              }
            });
          } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
        });
      } else {  // 修改时候，直接调用修改接口
        // 元素添加到模板
        const finalInput = { 'templateId': this.templateId, 'elements': allArr, 'name': this.addGuideForm.controls['name'].value };
        this.guideService.addXxxForGuide(finalInput).subscribe(res1 => {
          if (res1.retcode === 0) {

            res1.retcode === 0 ? this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } }) : this.modalService.error({ nzTitle: '提示', nzContent: res1.message });
            const operationInput = { op_category: 'APP管理', op_page: '引导语模板', op_name: '保存' };
            this.commonService.updateOperationlog(operationInput).subscribe();
            this.hideModal('guide');
            this.loadData('guide');
          }
        });
      }
    } else if (flag === 'guide_message') {
      const mesItem = { 'type': 'MESSAGE', 'text': '', 'sort': '' }; this.guideItem.messageArr.push(mesItem);
    } else if (flag === 'guide_button') {
      const butItem = { 'type': 'BUTTON', 'text': '', 'sort': '' }; this.guideItem.buttonArr.push(butItem);
    } else if (flag === 'guide_image') {
      if (this.guideItem.imageArr.length === 1) { this.modalService.error({ nzTitle: '提示', nzContent: '暂时只支持上传一张' }); return; } // 最多添加一个上传图片
      const imgItem = { 'type': 'IMAGE', 'imageKey': '', 'jumpType': '', 'appDestinationType': '', 'webUrl': '', 'sort': '' };
      this.guideItem.imageArr.push(imgItem);
    } else if (flag === 'addHelp') {
      if (!this.verificationAdd('addHelp')) { return; }
      const guides = this.addHelpForm.controls['guides'].value.replace(/\r/g, ',').replace(/\n/g, ',').split(',');
      const helpInput = {
        'describe': this.addHelpForm.controls['describe'].value,
        'details': this.addHelpForm.controls['details'].value,
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
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'modifyHelp') {
      if (!this.verificationModify('modifyHelp')) { return; }
      const guides = this.modifyHelpForm.controls['guides'].value.replace(/\r/g, ',').replace(/\n/g, ',').split(',');
      const helpInput = {
        'id': this.templateId,
        'describe': this.modifyHelpForm.controls['describe'].value,
        'details': this.modifyHelpForm.controls['details'].value,
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
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
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
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'previewProtocol') {
      window.open(`${this.commonService.dataCenterUrl.substring(0, this.commonService.dataCenterUrl.indexOf(':46004/api'))}/static/protocolManage.html?title=${this.currentProtocol}&channelId=${localStorage.getItem('currentAppHeader')}`);
    } else if (flag === 'addFlowPoint') {
      if (!this.verificationAdd('addFlowPoint')) { return; }
      const guideArr = this.flowPointDate.guides;
      const finalGuides = []; // 获取最终结果
      guideArr.sort(function(a, b) {return a.sort - b.sort; });
      guideArr.forEach((item, i) => { finalGuides.push(item.text.replace(/\r/g, ',').replace(/\n/g, ',').split(',')); });
      const flowPointInput = {
        'botName': this.addFlowPointForm.controls['botName'].value,
        'process': this.addFlowPointForm.controls['process'].value,
        'status': false,
        'botMsg': this.addFlowPointForm.controls['botMsg'].value,
        'guides': finalGuides
      };
      this.flowpointService.addFlowpoint(flowPointInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: 'APP管理', op_page: '流程点引导', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('addFlowPoint');
          this.loadData('flowPoint');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'modifyFlowPoint') {
      if (!this.verificationAdd('modifyFlowPoint')) { return; }
      const guideArr = this.flowPointDate.guides;
      const finalGuides = []; // 获取最终结果
      guideArr.sort(function(a, b) {return a.sort - b.sort; });
      guideArr.forEach((item, i) => { finalGuides.push(item.text.replace(/\r/g, ',').replace(/\n/g, ',').split(',')); });
      const flowPointInput = {
        'id': this.flowPointDate.id,
        'botName': this.modifyFlowPointForm.controls['botName'].value,
        'process': this.modifyFlowPointForm.controls['process'].value,
        'status': false,
        'botMsg': this.modifyFlowPointForm.controls['botMsg'].value,
        'guides': finalGuides
      };
      this.flowpointService.modifyFlowpoint(flowPointInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: 'APP管理', op_page: '流程点引导', op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('modifyFlowPoint');
          this.loadData('flowPoint');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'flow_guides') {
      const guideItem = { 'text': '', 'sort': this.flowPointDate.guides.length };
      this.flowPointDate.guides.push(guideItem);
      console.log(this.flowPointDate);
    } else if (flag === 'editQQCustomer') {
      this.isSaveQQCustomerButton = true;
    } else if (flag === 'qqCustomer') {
      if (!this.verificationAdd('qqCustomer')) { return; }
      const qqInput = { 'contact_qq': this.qqCustomerForm.controls['contact_qq'].value, };
      this.qqCustomerService.modifyQqCustomer(qqInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '保存成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: 'APP管理', op_page: '客服QQ', op_name: '保存' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.isSaveQQCustomerButton = false; // 保存成功后，变为编辑按钮
          this.loadData('qqCustomer');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    }
  }

  // 修改 - 弹框
  showModifyModal(data, flag) {
    if (flag === 'guide') {
      // 清空
      this.guideDate = { 'name': '', 'type': 'BEGINNNER_GUIDE', 'guideElements': [], 'id': '', 'jumpType': 'DISABLE', 'appDestinationType': 'PERSONAL_CENTER', 'webUrl': '' };
      this.guideItem.messageArr.splice(0, this.guideItem.messageArr.length);
      this.guideItem.buttonArr.splice(0, this.guideItem.buttonArr.length);
      this.guideItem.imageArr.splice(0, this.guideItem.imageArr.length);
      this.fileList.splice(0, this.fileList.length);
      this.showImageUrl = '';
      this.templateId = data.id; // 用于修改
      this.visiable.modifyGuide = true;
      this.guideDate.name = data.name;
      this.guideDate.type = data.type;
      let imageUrl = '';  // 获取到图片
      let jumpType = '';  // 跳转位置
      let appDestinationType = '';  // 跳转位置
      let webUrl = '';  // 网址
      data.guideElements.forEach((item, i) => {
        if (item.type === 'MESSAGE') { item.sort = i + 1; this.guideItem.messageArr.push(item); }
        if (item.type === 'BUTTON') { item.sort = i + 1; this.guideItem.buttonArr.push(item); }
        if (item.type === 'IMAGE') {
          imageUrl = item.imageKey;
          jumpType = item.jumpType;
          appDestinationType = item.appDestinationType;
          webUrl = item.webUrl;
          item.sort = i + 1;
          this.guideItem.imageArr.push(item);
        }
      });
      this.showImageUrl = `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}/guide/resources/images/${imageUrl}`;
      this.guideDate.jumpType = jumpType;
      this.guideDate.appDestinationType = appDestinationType;
      this.guideDate.webUrl = webUrl;
      const file: any = { name: imageUrl };
      this.fileList.push(file);
    } else if (flag === 'help') {
      const id = data.id;
      this.fileList.splice(0, this.fileList.length);
      this.visiable.modifyHelp = true;
      this.templateId = id;  // 用于修改
      this.cnaNotUseModelChange();
      this.helpDate = data;
      this.helpDate.guideArr = data.guides.join('\n');
      this.imageUrl = data.image;
      this.helpType = data.type;
      const file: any = { name: data.image };
      this.fileList.push(file);
      this.showImageUrl = `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}/v1/cms/skills/images/${this.imageUrl}`;
    } else if (flag === 'modifyFlowPoint') {
      this.visiable.modifyFlowPoint = true;
      this.flowPointDate = data;
      const tempArr = [];
      const guideArr = [];
      if (data.guides) {
        data.guides.forEach((item, index) => { tempArr.push(item.join('\n')); guideArr.push({'text': item.join('\n'), 'sort': index}); });
      }
      this.flowPointDate.guideArr = tempArr;
      this.flowPointDate.guides = guideArr;
      console.log(this.flowPointDate);
    }
  }

  // 专门解决ngModel与ngModelChange互相冲突的情况
  cnaNotUseModelChange() {
    this.limitModelChange--;
    if (this.limitModelChange === -1) { this.limitModelChange = 1; return; }
    setTimeout(() => { this.cnaNotUseModelChange(); }, 2000);
  }

  // 封装验证修改表单
  verificationModify(flag): boolean {
    let result = true;
    if (flag === 'modifyHelp') {
      const guides = this.modifyHelpForm.controls['guides'].value.replace(/\r/g, ',').replace(/\n/g, ',').split(',');
      if (this.modifyHelpForm.controls['name'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '技能名称未填写' }); result = false;
      } else if (this.modifyHelpForm.controls['order'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '技能排序未填写' }); result = false;
      } else if (this.modifyHelpForm.controls['describe'].value === '' || this.modifyHelpForm.controls['describe'].value === null) {
        this.modalService.error({ nzTitle: '提示', nzContent: '技能介绍未填写' }); result = false;
      } else if (this.modifyHelpForm.controls['details'].value === '' || this.modifyHelpForm.controls['details'].value === null) {
        this.modalService.error({ nzTitle: '提示', nzContent: '详情页编辑未填写' }); result = false;
      } else if (guides.length < 1) {
        this.modalService.error({ nzTitle: '提示', nzContent: '外部跳转编辑至少填1个' }); result = false;
      }
      guides.forEach(item => {
        if (item === '') { this.modalService.error({ nzTitle: '提示', nzContent: '外部跳转编辑有话术未填写' }); result = false; }
        if (item.length > 20) { this.modalService.error({ nzTitle: '提示', nzContent: '外部跳转编辑有话术不得超过20个字符' }); result = false; }
      });
    }
    if (this.fileList.length !== 1) { this.modalService.error({ nzTitle: '提示', nzContent: '未上传图片' }); result = false; }
    return result;
  }

  // 删除 - 复用弹窗
  showDeleteModal(id, flag) { this.modalService.confirm({ nzTitle: '提示', nzContent: '您确定要删除该信息？', nzOkText: '确定', nzOnOk: () => this.doDelete(id, flag) }); }

  doDelete(id, flag) {
    if (flag === 'guide') {
      this.guideService.deleteGuideFromApp(this.currentAppId, id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: 'APP管理', op_page: '引导语模板', op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('guide');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'guide_message') {
      this.guideItem.messageArr.splice(id, 1);
    } else if (flag === 'guide_button') {
      this.guideItem.buttonArr.splice(id, 1);
    } else if (flag === 'guide_image') {
      this.guideItem.imageArr.splice(id, 1);
    } else if (flag === 'help') {
      this.helpService.deleteHelp(id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: 'APP管理', op_page: '帮助管理', op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('help');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'flowPoint') {
      this.flowpointService.deleteFlowpoint(id).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: 'APP管理', op_page: '流程点引导', op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('flowPoint');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
      });
    } else if (flag === 'flow_guides') {
      this.flowPointDate.guides.splice(id, 1);
      this.flowPointDate.guideArr.splice(id, 1);
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
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
        this.loadData('guide');
      });
    } else if (flag === 'help') {
      const switchInput = { 'id': data.id, 'enabled': data.enabled };
      this.helpService.updateHelp(switchInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: 'APP管理', op_page: '帮助管理', op_name: '启用/不启用' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
        this.loadData('help');
      });
    } else if (flag === 'flowPoint') {
      const switchInput = {
        'id': data.id, 'botName': data.botName, 'process': data.process, 'status': data.status, 'botMsg': data.botMsg, 'guides': data.guides
      };
      this.flowpointService.modifyFlowpoint(switchInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: 'APP管理', op_page: '流程点引导', op_name: '启用/不启用' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.message }); }
        this.loadData('flowPoint');
      });
    }
  }

  // 上传image
  beforeUpload = (file: UploadFile): boolean => {
    if (this.currentPanel === 'share' || this.currentPanel === 'guide' || this.currentPanel === 'help') {
      const suffix = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
      const isPng = suffix === '.png' || suffix === '.jpeg' || suffix === '.jpg' || suffix === '.ico' ? true : false;
      const isMoreThanTen = file.size < 512000 ? true : false;
      if (this.currentPanel === 'share' || this.currentPanel === 'guide') { this.fileList.splice(0, this.fileList.length); }
      if (!isPng) {
        this.msg.error('您只能上传.png、.jpeg、.jpg、.ico、文件');
      } else if (!isMoreThanTen) {
        this.msg.error('您只能上传不超过500K文件');
      } else { this.fileList.push(file); this.handleUpload(); }
      return false;
    }
  }

  // 点击上传
  handleUpload(): void {
    let url = ''; // 用于上传
    let flag = '';
    switch (this.currentPanel) {
      case 'share': url = `/copywriter/upload/`; flag = 'file'; break;
      case 'guide': url = `/guide/resources/images/`; flag = 'file'; break;
      case 'help': url = `/v1/cms/skills/images/`; flag = 'image'; break;
      default: break;
    }
    // 文件数量不可超过1个，超过一个则提示
    if (this.fileList.length > 1 && this.currentPanel !== 'share') { this.notification.error( '提示', '您上传的文件超过一个！' ); return; }
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append(flag, file);
      if (this.currentPanel === 'share') { formData.append('fileType', '0'); }
      if (this.currentPanel === 'guide') { formData.append('imageKey', file.name); }
    });

    const baseUrl = this.currentPanel === 'guide' || this.currentPanel === 'help' ? this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin')) : this.commonService.baseUrl;
    const req = new HttpRequest('POST', `${baseUrl}${url}`, formData, { // 上传图需要区分，因为引导语不需要admin，而分享需要admin
      reportProgress: true, headers: new HttpHeaders({ 'Authorization': localStorage.getItem('token') })
    });
    this.http.request(req).pipe(filter(e => e instanceof HttpResponse))
      .subscribe((event: HttpResponse<{ code: any, data: any, msg: any }> | any) => {
        if (event.body.retcode === 0) {
          this.imageUrl = event.body.payload; // 不仅用于下面的showImageUrl的拼接，还有其他接口会用到新增修改等操作
          if (this.currentPanel === 'share') {  // 针对分享
            if (this.currentCopywritingImage === '0') {
              this.shareImageUrl01 = `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}${url}?fileName=${this.imageUrl}`;
            } else if (this.currentCopywritingImage === '1') {
              this.shareImageUrl02 = `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}${url}?fileName=${this.imageUrl}`;
            } else if (this.currentCopywritingImage === '2') {
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
          } else if (this.currentPanel === 'guide') {  // 引导语
            this.onInputChange(this.imageUrl, 'imageImageKey', 0);  // 上传成功后，将穿回来的信息丢给第一个图片
            this.showImageUrl = `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}/guide/resources/images/${this.imageUrl}`;
          } else if (this.currentPanel === 'help') {  // 技能帮助
            this.showImageUrl = `${this.commonService.baseUrl.substring(0, this.commonService.baseUrl.indexOf('/admin'))}${url}${this.imageUrl}`;
          }
          this.notification.success( '提示', '上传成功' );
          const operationInput = { op_category: 'APP管理', op_page: this.currentPanel === 'share' ? '分享文案' : this.currentPanel === 'guide' ? '引导语模板' : this.currentPanel === 'help' ? '帮助管理' : '' , op_name: '上传图片' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else { this.modalService.error({ nzTitle: '提示', nzContent: event.body.message, }); }
        formData.delete(flag);
      }, err => { formData.delete(flag); }
    );
  }

  // 针对结构进行数据的累加
  onInputChange(value, site, item) {
    if (site === 'messageSort') { // message 排序
      this.guideItem.messageArr.forEach(( cell, i ) => { if (i === item) { cell.sort = value; } });
    } else if (site === 'messageText') { // message
      this.guideItem.messageArr.forEach(( cell, i ) => { if (i === item) { cell.text = value; } });
    } else if (site === 'buttonSort') {  // button 排序
      this.guideItem.buttonArr.forEach(( cell, i ) => { if (i === item) { cell.sort = value; } });
    } else if (site === 'buttonText') {  // button
      this.guideItem.buttonArr.forEach(( cell, i ) => { if (i === item) { cell.text = value; } });
    } else if (site === 'imageSort') {  // image 排序
      this.guideItem.imageArr.forEach(( cell, i ) => { if (i === item) { cell.sort = value; } });
    } else if (site === 'imageJumpType') {  // image TYPE
      this.guideItem.imageArr.forEach(( cell, i ) => { if (i === item) { cell.jumpType = value; } });
    } else if (site === 'imageAppDestinationType') {  // image APP
      this.guideItem.imageArr.forEach(( cell, i ) => { if (i === item) { cell.appDestinationType = value; } });
    } else if (site === 'imageWebUrl') {  // image WEB
      this.guideItem.imageArr.forEach(( cell, i ) => { if (i === item) { cell.webUrl = value; } });
    } else if (site === 'imageImageKey') {  // image WEB
      this.guideItem.imageArr.forEach(( cell, i ) => { if (i === item) { cell.imageKey = value; } });
    } else if (site === 'flowGuide') {  // flow text
      this.flowPointDate.guides.forEach(( cell, i ) => { if (i === item) { cell.text = value; } });
    } else if (site === 'flowSort') {  // flow sort
      this.flowPointDate.guides.forEach(( cell, i ) => { if (i === item) { cell.sort = value; } });
    }
  }

  // 日期插件
  onChange(flag): void {
    if (flag === 'description') {
      this.tempContent = this.sanitize.bypassSecurityTrustHtml(this.contentDate.description.replace(/\n/g, '<br/>'));
    }
  }

  // 切换面板
  changePanel(flag): void {
    if (flag !== this.currentPanel) { this.loadData(flag); }
    if (flag !== 'share') { this.isSaveShareButton = false; }
    if (flag !== 'qqCustomer') { this.isSaveQQCustomerButton = false; }
    this.currentPanel = flag;
    const operationInput = { op_category: 'APP管理', op_page: flag === 'content' ? '版本更新' : flag === 'share' ? '分享文案' : flag === 'guide' ? '引导语模板' : flag === 'help' ? '帮助管理' : flag === 'protocol'  ? '客服QQ' : flag === 'qqCustomer' ? '协议管理' : '', op_name: '访问' };
    this.commonService.updateOperationlog(operationInput).subscribe();
  }

  // 用于区分分享文案下的三个上传图片的方法
  choosePng(flag) { this.currentCopywritingImage = flag; }

  chooseProtocol(flag) { this.currentProtocol = flag; this.loadData('protocol'); }

  // 替换所有奇怪字符
  replaceHtmlStr(str) {
    let result = '';
    if (str === null) {
      result = '';
    } else {
      result = str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, '\'')
      .replace(/&quot;/g, '"').replace(/&nbsp;/g, '<br>').replace(/&ensp;/g, '   ')
      .replace(/&emsp;/g, '    ').replace(/%/g, '%').replace(/&amp;/g, '&');
    }
    return result;
  }

  // 根据sort排序
  sortBySort(a, b) { return a.sort - b.sort; }

}
