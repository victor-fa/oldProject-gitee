import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { LoginItemInput } from '../public/model/user.model';
import { CommonService } from '../public/service/common.service';
import { UserService } from '../public/service/user.service';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-changePass',
  templateUrl: './changePass.component.html',
  styleUrls: ['./changePass.component.scss']
})
export class ChangePassComponent implements OnInit {

  changePassForm: FormGroup;
  passData = {
    oldPassword: '',
    newPassword: '',
  };
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private commonService: CommonService,
    private modalService: NzModalService,
    private router: Router,
  ) {
    this._initForm();
  }

  ngOnInit() {
  }

  onSubmit($event, { value, valid }): void {
    $event.preventDefault();
    // tslint:disable-next-line:forin
    for (const key in this.changePassForm.controls) {
      this.changePassForm.controls[key].markAsDirty();
    }
    // 验证不通过，则不请求API
    if (this.getFormControl('oldPassword').value === ''
    || this.getFormControl('newPassword').value === ''
    || this.getFormControl('confirmPassword').value === '') {
      this.modalService.error({
        nzTitle: '提示',
        nzContent: '请填写完整登录信息'
      });
      return;
    }
    if (this.getFormControl('newPassword').value.length < 6) {
      this.modalService.error({nzTitle: '提示', nzContent: '新密码不能少于6个字符！'});
      return;
    }
    if (this.getFormControl('confirmPassword').value.length < 6) {
      this.modalService.error({nzTitle: '提示', nzContent: '确认密码不能少于6个字符！'});
      return;
    }
    if (this.getFormControl('oldPassword').value === this.getFormControl('newPassword').value) {
      this.modalService.error({
        nzTitle: '提示',
        nzContent: '新密码旧密码不能重复！'
      });
      return;
    }
    this.passData.oldPassword = this.changePassForm.controls['oldPassword'].value;
    this.passData.newPassword = this.changePassForm.controls['newPassword'].value;
    this.userService.changePass(this.passData).subscribe(res => {
      if (res.retcode === 0 && res.status === 200) {
        const operationInput = { op_category: '修改密码', op_page: '修改密码', op_name: '修改' };
        this.commonService.updateOperationlog(operationInput).subscribe();
        this.modalService.success({ nzTitle: '提示', nzContent: '修改密码成功！' });
        // this.router.navigateByUrl('login');
      } else {
        this.modalService.error({ nzTitle: '提示', nzContent: res.message });
      }
    });
  }

  getFormControl = (name) => {
    return this.changePassForm.controls[name];
  }

  private _initForm = () => {
    this.changePassForm = this.fb.group({
      oldPassword: [''],
      newPassword: [''],
      confirmPassword: ['']
    });
  }
}
