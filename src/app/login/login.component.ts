import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { LoginItemInput } from '../public/model/user.model';
import { CommonService } from '../public/service/common.service';
import { UserService } from '../public/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  login = new LoginItemInput();
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private commonService: CommonService,
    private modalService: NzModalService,
  ) {
    this._initForm();
  }

  ngOnInit() {
  }

  onSubmit($event, { value, valid }): void {
    $event.preventDefault();
    for (const key in this.loginForm.controls) {
      this.loginForm.controls[key].markAsDirty();
    }
    // 验证不通过，则不请求API
    if (this.getFormControl('userName').value === ''
    || this.getFormControl('password').value === '') {
      this.modalService.error({
        nzTitle: '提示',
        nzContent: '请填写完整登录信息'
      });
      return; }
    this.login.userName = this.loginForm.controls['userName'].value;
    this.login.password = this.loginForm.controls['password'].value;
    this.userService.login(this.login);
  }

  getFormControl = (name) => {
    return this.loginForm.controls[name];
  }

  private _initForm = () => {
    this.loginForm = this.fb.group({
      userName: [''],
      password: ['']
    });
  }
}
