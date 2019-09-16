import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalService, NzNotificationService, UploadFile } from 'ng-zorro-antd';
import { CommonService } from '../public/service/common.service';
import { RegressionService } from '../public/service/regression.service';
import { HttpResponse, HttpRequest, HttpHeaders, HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';

registerLocaleData(zh);

@Component({
  selector: 'app-regression',
  templateUrl: './regression.component.html',
  styleUrls: ['./regression.component.scss']
})

export class RegressionComponent implements OnInit {

  visiable = { creTemplateModal: false, creTaskModal: false };
  regressionSearchForm: FormGroup;
  addRegressionForm: FormGroup;
  modifyRegressionForm: FormGroup;
  serialSearchForm: FormGroup;
  regressionDate = { 'appChannel': '', 'appChannelName': '', 'robot': '', 'loginType': 0, 'paymentKey': '', 'smsSign': '', keys: '' };
  addSerialData = {};
  dataRegression = [];
  dataCreTemplate = [];
  creTemplateData = {case_name: ''};
  dataCreTask = [];
  creTaskData = {task_name: '', appkey: '', case_id: '', bot_name: ''};
  dataSerial = [];
  serialData = {task_name: '', appkey: '', case_id: '', task_type: '', bot_name: '', temp_id: ''};
  creTemplateModalData = { pk: '' };
  dataTemplate = [];
  templateData = {temp_name: ''};
  creTaskModalData = { pk: '' };
  isSpinning = false;
  editSerialData = '';
  dataTestSubtasks = [];
  currentPanel = 'informa';
  currentUser = '';
  fileList: UploadFile[] = [];

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private modalService: NzModalService,
    private regressionService: RegressionService,
    private notification: NzNotificationService,
    private msg: NzMessageService,
    private http: HttpClient,
  ) {
    this.commonService.nav[11].active = true;
    this._initForm();
    const currentUser = localStorage.getItem('currentUser');
    this.currentUser = currentUser === 'admin' ? '1001' : currentUser;
  }

  ngOnInit() {
    const tabFlag = [{label: '客户管理', value: 'informa'}, {label: '模板创建', value: 'creTemplate'}, {label: '任务创建', value: 'creTask'}, {label: '模板库', value: 'template'}];
    let targetFlag = 0;
    for (let i = 0; i < tabFlag.length; i++) {
      if (this.commonService.haveMenuPermission('children', tabFlag[i].label)) {targetFlag = i; break; }
    }
    this.loadData(tabFlag[targetFlag].value);
    this.loadData('template');  // 一进来就加载下拉
  }

  loadData(flag) {
    this.isSpinning = true;
    const input = { user_id: this.currentUser };
    if (flag === 'informa') {
      this.regressionService.getInformaList(input).subscribe(res => {
        if (res.status !== 'fail') {
          this.isSpinning = false;
          this.dataRegression = res;
          console.log(this.dataRegression);
        } else { this.msg.error(res.msg); }
      });
    } else if (flag === 'creTemplate') {
      this.regressionService.getCreTemplateList(input).subscribe(res => {
        if (res.status !== 'fail') {
          this.isSpinning = false;
          this.dataCreTemplate = res.filter(item => item.fields.task_type && item.fields.task_type === 2)
          console.log(this.dataCreTemplate);
        } else { this.msg.error(res.msg); }
      });
    } else if (flag === 'creTask') {
      this.regressionService.getCreTaskList(input).subscribe(res => {
        if (res.status !== 'fail') {
          this.isSpinning = false;
          this.dataCreTask = res.filter(item => item.fields.task_type && item.fields.task_type !== 2)
          console.log(this.dataCreTask);
        } else { this.msg.error(res.msg); }
      });
    } else if (flag === 'template') {
      this.regressionService.getTemplateList(input).subscribe(res => {
        if (res.status !== 'fail') {
          this.isSpinning = false;
          this.dataTemplate = res;
          console.log(this.dataTemplate);
        } else { this.dataTemplate = []; this.msg.error(res.msg); }
      });
    } else if (flag === 'getTestSubtasksForCreTemplate' || flag === 'getTestSubtasksForCreTask') {
      const taskInput = {
        task_id: (flag === 'getTestSubtasksForCreTemplate' ? this.creTemplateModalData.pk : this.creTaskModalData.pk)
      };
      this.regressionService.getTestSubtasks(taskInput).subscribe(res => {
        if (res.status !== 'fail') {
          this.isSpinning = false;
          this.dataTestSubtasks = res;
          console.log(this.dataTestSubtasks);
        } else { this.dataTestSubtasks = []; this.msg.error(res.msg); }
      });
    }
  }

  private _initForm(): void {
    this.regressionSearchForm = this.fb.group({ userPhone: [''], jump: [''], skip: [''], site: [''], duration: [''], url: [''], expireTime: [''] });
    this.addRegressionForm = this.fb.group({ appChannel: [''], appChannelName: [''], robot: [''], paymentKey: [''], smsSign: [''], aaa: [''], keys: [''] });
    this.modifyRegressionForm = this.fb.group({ paymentKey: [''], smsSign: [''], keys: [''] });
    this.serialSearchForm = this.fb.group({ sn: [''] });
  }

  // 弹窗
  showModal(flag, data) {
    if (flag === 'deleteInforma' || flag === 'deleteCreTemplate' || flag === 'deleteCreTask' || flag === 'deleteTemplate' || flag === 'delTestSubtask') {
      this.modalService.confirm({
        nzTitle: '确认删除', nzContent: '确认删除吗？', nzCancelText: '取消',
        nzOnCancel: () => 1, nzOkText: '确定', nzOnOk: () => { this.doSomething(data, flag); }
      });
    } else if (flag === 'creTemplateModal') {
      this.creTemplateModalData = data;
      console.log(this.creTemplateModalData);
      this.loadData('getTestSubtasksForCreTemplate');
      this.visiable.creTemplateModal = true;
    } else if (flag === 'creTaskModal') {
      this.creTaskModalData = data;
      console.log(this.creTaskModalData);
      this.loadData('getTestSubtasksForCreTask');
      this.visiable.creTaskModal = true;
    }
  }

  // 隐藏
  hideModal(flag) {
    if (flag === 'creTemplateModal') {
      this.regressionDate = { 'appChannel': '', 'appChannelName': '', 'robot': '', 'loginType': 0, 'paymentKey': '', 'smsSign': '', keys: '' };
      this.visiable.creTemplateModal = false;
    } else if (flag === 'creTaskModal') {
      this.visiable.creTaskModal = false;
    }
  }

  // doSomething
  doSomething(data, flag) {
    if (flag === 'deleteInforma') {
      const input = { id: data.pk }
      this.regressionService.deleteInforma(input).subscribe(res => {
        if (res.state === 'success') {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          this.loadData('informa');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.msg }); }
      });
    } else if (flag === 'deleteCreTemplate') {
      const input = { id: data.pk }
      this.regressionService.deleteCreTemplate(input).subscribe(res => {
        if (res.state === 'success') {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          this.loadData('creTemplate');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.msg }); }
      });
    } else if (flag === 'deleteCreTask') {
      const input = { id: data.pk }
      this.regressionService.deleteCreTask(input).subscribe(res => {
        if (res.state === 'success') {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          this.loadData('creTask');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.msg }); }
      });
    } else if (flag === 'deleteTemplate') {
      const input = { id: data.pk }
      this.regressionService.deleteTemplate(input).subscribe(res => {
        if (res.state === 'success') {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          this.loadData('template');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.msg }); }
      });
    } else if (flag === 'delTestSubtask') {
      const input = { id: data.pk }
      this.regressionService.delTestSubtask(input).subscribe(res => {
        if (res.state === 'success') {
          this.notification.blank( '提示', '删除成功', { nzStyle: { color : 'green' } });
          this.loadData('getTestSubtasksForCreTemplate');
          this.loadData('getTestSubtasksForCreTask');
        } else { this.modalService.error({ nzTitle: '提示', nzContent: res.msg }); }
      });
    }
  }

  // // 封装验证新增
  // verificationAdd(flag): boolean {
  //   let result = true;
  //   if (flag === 'regression') {
  //     if (this.addRegressionForm.controls['appChannel'].value === '') {
  //       this.modalService.error({ nzTitle: '提示', nzContent: '客户ID未填写' });
  //       result = false;
  //     } else if (this.addRegressionForm.controls['appChannelName'].value === '') {
  //       this.modalService.error({ nzTitle: '提示', nzContent: '客户名称未填写' });
  //       result = false;
  //     } else if (this.addRegressionForm.controls['robot'].value === '') {
  //       this.modalService.error({ nzTitle: '提示', nzContent: 'BOT名称未填写' });
  //       result = false;
  //     }
  //   } else if (flag === 'addSerial') {
  //     if (this.regressionDate.keys === '' || this.regressionDate.keys.length === 0 || this.regressionDate.keys.replace(/ /g,'') === '') {
  //       this.modalService.error({ nzTitle: '提示', nzContent: '序列号不得为空' });
  //       result = false;
  //     }
  //   }
  //   return result;
  // }

  // 新增操作
  doSave(flag): void {
    if (flag === 'addInforma') {
      if (this.dataRegression.some(item => item.fields.case_name === this.creTemplateData.case_name.replace(/(^\s*)|(\s*$)/g, ""))) {
        this.msg.error('集合名（set name）与现有的集合名重复');
        return;
      }
      const formData = new FormData();
      this.fileList.forEach((file: any) => { formData.append('case_file', file); });
      const url = `http://192.168.1.5:8000/auto/addTestCase?case_name=${this.creTemplateData.case_name}&user_id=${this.currentUser}`;
      const req = new HttpRequest('POST', url, formData, {reportProgress: true, headers: new HttpHeaders({})
      });
      this.http.request(req).pipe(filter(e => e instanceof HttpResponse))
        .subscribe((event: HttpResponse<{ code: any, data: any, msg: any }> | any) => {
          if (event.body.length === 1) {
            this.creTemplateData = {case_name: ''};
            this.msg.success('创建成功');
            this.fileList.splice(0, this.fileList.length);
            this.loadData('informa');
          } else { this.modalService.error({ nzTitle: '提示', nzContent: event.body.msg, }); }
          formData.delete(flag);
        }, err => { formData.delete(flag); }
      );
    } else if (flag === 'addCreTemplate') {
      // if (!this.verificationAdd('regression')) { return; }
      const url = 'http://192.168.1.5:8000/auto/addTestTask?task_name='
        + this.creTaskData.task_name
        + '&task_type=2'
        + '&appkey=' + this.creTaskData.appkey
        + '&bot_name=' + this.creTaskData.bot_name
        + '&case_id=' + this.creTaskData.case_id
        + '&temp_id=1'
        + '&user_id=' + this.currentUser;
      const req = new HttpRequest('POST', url, '', {reportProgress: true, headers: new HttpHeaders({})});
      this.http.request(req).pipe(filter(e => e instanceof HttpResponse))
        .subscribe((event: HttpResponse<{ code: any, data: any, msg: any }> | any) => {
          if (event.body.length === 1) {
            this.creTaskData = {task_name: '', appkey: '', case_id: '', bot_name: ''};
            this.msg.success('创建成功');
            this.loadData('creTemplate');
          } else { this.modalService.error({ nzTitle: '提示', nzContent: event.body.msg, }); }
        }, err => {}
      );
    } else if (flag === 'addCreTask') {
      // if (!this.verificationAdd('regression')) { return; }
      const formData = new FormData();
      this.fileList.forEach((file: any) => { formData.append('temp_file', file); });
      const url = 'http://192.168.1.5:8000/auto/addTestTask?'
        + 'task_name=' + this.serialData.task_name
        + '&task_type=' + this.serialData.task_type
        + '&appkey=' + this.serialData.appkey
        + '&bot_name=' + this.serialData.bot_name
        + '&case_id=' + this.serialData.case_id
        + '&temp_id=' + this.serialData.temp_id
        + '&user_id=' + this.currentUser;
      const req = new HttpRequest('POST', url, formData, {reportProgress: true, headers: new HttpHeaders({})});
      this.http.request(req).pipe(filter(e => e instanceof HttpResponse))
        .subscribe((event: HttpResponse<{ code: any, data: any, msg: any }> | any) => {
          if (event.body.length === 1) {
            this.serialData = {task_name: '', appkey: '', case_id: '', task_type: '', bot_name: '', temp_id: ''};
            this.msg.success('创建成功');
            this.fileList.splice(0, this.fileList.length);
            this.loadData('creTask');
          } else { this.modalService.error({ nzTitle: '提示', nzContent: event.body.msg, }); }
          formData.delete(flag);
        }, err => { formData.delete(flag); }
      );
    } else if (flag === 'addTemplate') {
      if (this.dataTemplate.some(item => item.fields.temp_name === this.templateData.temp_name.replace(/(^\s*)|(\s*$)/g, ""))) {
        this.msg.error('Template Name*（模板名）与现有的模板名重复');
        return;
      }
      const formData = new FormData();
      this.fileList.forEach((file: any) => { formData.append('temp_file', file); });
      const url = 'http://192.168.1.5:8000/auto/addTestTemp?'
        + 'temp_name=' + this.templateData.temp_name
        + '&user_id=' + this.currentUser;
      const req = new HttpRequest('POST', url, formData, {reportProgress: true, headers: new HttpHeaders({})});
      this.http.request(req).pipe(filter(e => e instanceof HttpResponse))
        .subscribe((event: HttpResponse<{ code: any, data: any, msg: any }> | any) => {
          if (event.body.length === 1) {
            this.templateData = {temp_name: ''};
            this.msg.success('提交成功');
            this.fileList.splice(0, this.fileList.length);
            this.loadData('template');
          } else { this.modalService.error({ nzTitle: '提示', nzContent: event.body.msg, }); }
          formData.delete(flag);
        }, err => { formData.delete(flag); }
      );
    } else if (flag === 'addCreTemplateModal') { // 执行任务
      // if (!this.verificationAdd('regression')) { return; }
      const url = 'http://192.168.1.5:8000/auto/addTestSubtask?'
        + 'task_id=' + this.creTemplateModalData.pk;
      const req = new HttpRequest('POST', url, '', {reportProgress: true, headers: new HttpHeaders({})});
      this.http.request(req).pipe(filter(e => e instanceof HttpResponse))
        .subscribe((event: HttpResponse<{ code: any, data: any, msg: any }> | any) => {
          if (event.body.length === 1) {
            this.msg.success('执行成功');
            this.loadData('getTestSubtasksForCreTemplate');
          } else { this.modalService.error({ nzTitle: '提示', nzContent: event.body.msg, }); }
        }, err => { }
      );
    } else if (flag === 'addCreTaskModal') { // 执行任务
      // if (!this.verificationAdd('regression')) { return; }
      const url = 'http://192.168.1.5:8000/auto/addTestSubtask?'
        + 'task_id=' + this.creTaskModalData.pk;
      const req = new HttpRequest('POST', url, '', {reportProgress: true, headers: new HttpHeaders({})});
      this.http.request(req).pipe(filter(e => e instanceof HttpResponse))
        .subscribe((event: HttpResponse<{ code: any, data: any, msg: any }> | any) => {
          if (event.body.length === 1) {
            this.msg.success('执行成功');
            this.loadData('getTestSubtasksForCreTask');
          } else { this.modalService.error({ nzTitle: '提示', nzContent: event.body.msg, }); }
        }, err => { }
      );
    }
  }

  showExcel(data) {
    const url = 'http://192.168.1.5:8000/static/' + (data.fields.case_file ? data.fields.case_file : data.fields.temp_file ? data.fields.temp_file : data.fields.stask_result_file ? data.fields.stask_result_file : '');
    window.open(url);
  }

  // 上传image
  beforeUpload = (file: UploadFile): boolean => {
    const suffix = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
    const isPng = suffix === '.xls' || suffix === '.xlsx' ? true : false;
    // const isMoreThanTen = file.size < 512000 ? true : false;
    this.fileList.splice(0, this.fileList.length);
    if (!isPng) {
      this.msg.error('您只能上传.xls、.xlsx文件');
    } else {
      this.fileList.push(file);
    }
    return false;
  }

  // 切换面板
  changePanel(flag): void {
    if (flag !== this.currentPanel) { this.loadData(flag); }
    this.currentPanel = flag;
    // const operationInput = { op_category: '权限后台', op_page: flag === 'role' ? '权限配置' : flag === 'customer' ? '员工配置' : flag === 'operationlog' ? '操作日志' : flag === 'navConfig' ? '导航页配置' : '', op_name: '访问' };
    // this.commonService.updateOperationlog(operationInput).subscribe();
  }

}
