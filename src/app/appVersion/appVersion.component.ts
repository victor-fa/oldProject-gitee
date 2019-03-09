import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
  searchContentForm: FormGroup;
  addContentForm: FormGroup;
  now = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  emptyAdd = ['', '', '', '', '', '', ''];  // 清空新增表单
  contentDate = {
    // tslint:disable-next-line:max-line-length
    'version': '', 'title': '', 'description': '', 'size': '', 'file': '', 'system_symbol': '', 'version_allowed': '', 'sub_title': '', 'channel': '', 'dataContent': ''
  };
  dataContent = []; // 内容
  dataSystemSymbo = []; // 操作系统
  dataChannel = []; // 渠道
  beginDate = '';
  endDate = '';
  dateSearch = { 'Today': [new Date(), new Date()], 'This Month': [new Date(), new Date()] };
  private timerList;
  private timerDetail;

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
    this._initSearchContentForm();
    this._initAddContentForm();
  }

  ngOnInit() {
    this.loadData('content');
    this.loadData('system');
    this.loadData('channel');
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
      const channel = this.searchContentForm.controls['channel'].value;
      this.appversionService.getAppversionList(channel).subscribe(res => {
        if (JSON.parse(res.payload).android !== 'null') {
          arr.push(JSON.parse(JSON.parse(res.payload).android));
        }
        if (JSON.parse(res.payload).ios !== 'null') {
          arr.push(JSON.parse(JSON.parse(res.payload).ios));
        }
        this.dataContent = arr;
      });
    } else if (flag === 'system') {
      const arrSystem = [];
      this.appversionService.getSystemSymbolList().subscribe(res => {
        arrSystem.push(JSON.parse(res.payload).ANDROID);
        arrSystem.push(JSON.parse(res.payload).IOS);
        this.dataSystemSymbo = arrSystem;
      });
    } else if (flag === 'channel') {
      const arrChannel = [];
      this.appversionService.getChannelList().subscribe(res => {
        arrChannel.push(JSON.parse(res.payload).XIAOWU);
        arrChannel.push(JSON.parse(res.payload).LENZE);
        this.dataChannel = arrChannel;
      });
    }
  }

  private _initSearchContentForm(): void {
    this.searchContentForm = this.fb.group({
      channel: [''],
    });
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


  // 弹框
  showModal(flag, data) {
    if (flag === 'content') {
      this.isAddContentVisible = true;
      this.contentDate = {  // 清空
          // tslint:disable-next-line:max-line-length
          'version': '', 'title': '', 'description': '', 'size': '', 'file': '', 'system_symbol': '', 'version_allowed': '', 'sub_title': '', 'channel': '', 'dataContent': ''
        };
    }
    this.emptyAdd = ['', '', '', '', '', '', ''];
  }

  // 处理后台传过来的经纬度数据
  getPointRoute(points) {
    const path = [];
    for (let i = 0; i < points.length; i++) {
      path.push(points[i].split(',').reverse());
    }
    return path;
  }

  hideModal(flag) {
    if (flag === 'content') {
      this.isAddContentVisible = false;
    }
  }

  // 封装验证新增
  verificationAdd(flag): boolean {
    let result = true;
    if (flag === 'content') {
      if (this.addContentForm.controls['channel'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '渠道未选择' });
        result = false;
      } else if (this.addContentForm.controls['system_symbol'].value === '') {
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
          this.hideModal('content');
          this.loadData('content');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
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

}
