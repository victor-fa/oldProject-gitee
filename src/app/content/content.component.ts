import { Component, OnInit } from '@angular/core';
import { CommonService } from '../public/service/common.service';
import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NzMessageService, UploadFile, NzModalService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalizationService } from '../public/service/localization.service';

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
  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                         // remove formatting button
      ['link', 'image', 'video']                         // link and image, video
    ]
  };
  dataSet = [
    {
      image: 'http://stormfa.cn:3000/media/201812/5c04e3da1eba1a1e28046745/github-rain.jpg',
      title: '让 Chrome 崩溃的一行 CSS 代码',
      readTime: 6,
      author: 'stormfa',
      state: 1,
      time: '2018-12-03'
    },
    {
      image: 'http://stormfa.cn:3000/media/201811/5bed41821eba1a1e28046710/timg.jpg',
      title: '介绍一款好用 mongodb 可视化工具',
      readTime: 1,
      author: 'stormfa',
      state: 1,
      time: '2018-11-15'
    },
    {
      image: 'http://stormfa.cn:3000/media/201811/5bed40bf1eba1a1e2804670e/chrome.jpg',
      title: 'chrome提示 “正在等待可用的套接字”',
      readTime: 0,
      author: 'stormfa',
      state: 0,
      time: '2018-11-15'
    }
  ];

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private msg: NzMessageService,
    private modalService: NzModalService,
    private router: Router,
    public localizationService: LocalizationService,
  ) {
    this.commonService.nav[2].active = true;
    this._initAddForm();
    this._initModifyForm();
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {

  }

  private _initAddForm(): void {
    this.addForm = this.fb.group({
      title: [''],
      type: [''],
      url: [''],
      abstract: [''],
      content: [''],
      publisher: [''],
    });
  }

  /* 展示新增弹框 */

  /**
   *
   * @param data
   */
  doSave(data): void {
    // console.log(this.addForm.controls['title'].value);
    // console.log(this.addForm.controls['type'].value);
    // console.log(this.addForm.controls['url'].value);
    // console.log(this.addForm.controls['abstract'].value);
    // console.log(this.addForm.controls['content'].value);
    // console.log(this.addForm.controls['publisher'].value);

    // this.bookingService.updateBookingInfo(this.modifyForm.controls['updateType'].value, this.orderId).subscribe(res => {
    //   if (res.retcode === 0) {
    //     this.modalService.success({
    //       nzTitle: '修改成功',
    //       nzContent: res.message
    //     });
    //   } else {
    //     this.modalService.confirm({
    //       nzTitle: '提示',
    //       nzContent: res.message
    //     });
    //   }
    // });
  }

  // 预览新增
  doPreviewAdd() {
    this.localizationService.setPreview =  this.addForm.controls['content'].value;
    window.open('preview');
  }

  // 新增 - 弹框
  showAddModal() {
    this.isAddVisible = true;
  }

  hideAddModal() {
    this.isAddVisible = false;
  }

  _initModifyForm() {
    this.modifyForm = this.fb.group({
      title: [''],
      type: [''],
      url: [''],
      abstract: [''],
      content: [''],
      publisher: [''],
    });
  }

  // 预览修改
  doPreviewModify() {
    console.log(this.modifyForm.controls['content'].value);
    this.localizationService.setPreview = this.modifyForm.controls['content'].value;
    window.open('preview');
  }

  // 修改 - 弹框
  showModifyModal() {
    this.isModifyVisible = true;
  }

  hideModifyModal() {
    this.isModifyVisible = false;
  }

  // 删除 - 弹框
  showDeleteModal(data) {
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: '您确定要删除该内容？',
      nzOkText: '确定',
      nzOnOk: () => this.doDelete()
    });
  }

  doDelete() {
    console.log('删除');
  }

  beforeUpload = (file: File) => {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      this.msg.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.msg.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result.toString()));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: UploadFile }): void {
    if (info.file.status === 'uploading') {
      this.loading = true;
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, (img: string) => {
        this.loading = false;
        this.avatarUrl = img;
      });
    }
  }
}
