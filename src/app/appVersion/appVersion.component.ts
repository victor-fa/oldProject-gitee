import { Component, OnInit } from '@angular/core';
import { CommonService } from '../public/service/common.service';
import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LocalizationService } from '../public/service/localization.service';
import { ContentService } from '../public/service/content.service';
import { AppversionService } from '../public/service/appVersion.service';

registerLocaleData(zh);

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-appVersion',
  templateUrl: './appVersion.component.html',
  styleUrls: ['./appVersion.component.scss']
})
export class AppVersionComponent implements OnInit {

  isAddContentVisible = false;
  avatarUrl: string;
  addContentForm: FormGroup;
  now = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  cmsId = '';
  emptyAdd = ['', '', '', '', '', '', ''];  // 清空新增表单
  currentPanel = '';  // 当前面板
  contentDate = {
    // tslint:disable-next-line:max-line-length
    'version': '', 'title': '', 'description': '', 'size': '', 'file': '', 'system_symbol': '', 'version_allowed': '', 'sub_title': '', 'channel': '', 'dataContent': ''
  };
  dataContent = []; // 内容
  dataSystemSymbo = []; // 操作系统
  dataChannel = []; // 渠道

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private modalService: NzModalService,
    public localizationService: LocalizationService,
    private appversionService: AppversionService,
    private notification: NzNotificationService,
    private datePipe: DatePipe,
  ) {
    this.commonService.nav[0].active = true;
    this._initAddContentForm();
  }

  ngOnInit() {
    this.loadData('content');
    this.loadData('system');
    this.loadData('channel');
  }

  loadData(flag) {
    if (flag === 'content') {
      const arr = [];
      this.appversionService.getAppversionList('123').subscribe(res => {
        arr.push(JSON.parse(JSON.parse(res.payload).android));
        arr.push(JSON.parse(JSON.parse(res.payload).ios));
        this.dataContent = arr;
        console.log(this.dataContent);
      });
    } else if (flag === 'system') {
      const arr = [];
      this.appversionService.getSystemSymbolList().subscribe(res => {
        arr.push(JSON.parse(JSON.parse(res.payload).ANDROID));
        arr.push(JSON.parse(JSON.parse(res.payload).IOS));
        this.dataSystemSymbo = arr;
        console.log(this.dataSystemSymbo);
      });
    } else if (flag === 'channel') {
      const arr = [];
      this.appversionService.getChannelList().subscribe(res => {
        arr.push(JSON.parse(JSON.parse(res.payload).XIAOWU));
        arr.push(JSON.parse(JSON.parse(res.payload).LENZE));
        this.dataChannel = arr;
        console.log(this.dataChannel);
      });
    }
  }

  private _initAddContentForm(): void {
    this.addContentForm = this.fb.group({
      version: [''],
      title: [''],
      description: [''],
      size: [''],
      file: [''],
      system_symbol: [''],
      version_allowed: [''],
      sub_title: [''],
      channel: [''],
    });
  }


  // 新增内容 - 弹框
  showAddModal(flag) {
    if (flag === 'content') {
      this.isAddContentVisible = true;
      this.contentDate = {  // 清空
          // tslint:disable-next-line:max-line-length
          'version': '', 'title': '', 'description': '', 'size': '', 'file': '', 'system_symbol': '', 'version_allowed': '', 'sub_title': '', 'channel': '', 'dataContent': ''
        };
    }
    this.emptyAdd = ['', '', '', '', '', '', ''];
  }

  hideAddModal(flag) {
    if (flag === 'content') {
      this.isAddContentVisible = false;
    }
  }

  // 封装验证新增
  verificationAdd(flag): boolean {
    let result = true;
    if (flag === 'content') {
      if (this.addContentForm.controls['version'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '版本未填写' });
        result = false;
      } else if (this.addContentForm.controls['title'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '标题未选择' });
        result = false;
      } else if (this.addContentForm.controls['description'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '描述未填写' });
        result = false;
      } else if (this.addContentForm.controls['size'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '大小未填写' });
        result = false;
      } else if (this.addContentForm.controls['file'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '文件地址未填写' });
        result = false;
      } else if (this.addContentForm.controls['system_symbol'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '操作系统未选择' });
        result = false;
      } else if (this.addContentForm.controls['version_allowed'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '允许的最低版本未填写' });
        result = false;
      } else if (this.addContentForm.controls['sub_title'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '副标题未填写' });
        result = false;
      } else if (this.addContentForm.controls['channel'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '渠道未选择' });
        result = false;
      }
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
        'channel': this.addContentForm.controls['channel'].value
      };
      this.appversionService.addAppversion(contentInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '修改成功', { nzStyle: { color : 'green' } });
          this.hideAddModal('content');
          this.loadData('content');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }
}
