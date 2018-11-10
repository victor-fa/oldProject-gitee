import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { Md5 } from 'ts-md5/dist/md5';
import { LoginItemInput } from '../public/model/user.model';
import { CommonService } from '../public/service/common.service';
import { CookiesService } from '../public/service/cookies.service';
import { LocalizationService } from '../public/service/localization.service';
import { UserService } from '../public/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  login = new LoginItemInput();
  checked = true;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private userService: UserService,
    private router: Router,
    private _cookiesService: CookiesService,
    private message: NzMessageService,
    public localizationService: LocalizationService,
  ) {
    this._initForm();
  }

  ngOnInit() {
  }

  // onSubmit($event, { value, valid }): void {
  //   $event.preventDefault();
  //   let salt = '';
  //   this.userService.getPublicSalt().subscribe(res => {
  //     salt = res.data;
  //   });
  //   // tslint:disable-next-line:forin
  //   for (const key in this.loginForm.controls) {
  //     this.loginForm.controls[key].markAsDirty();
  //   }
  //   // 验证不通过，则不请求API
  //   if (!valid) { return; }
  //   this.login.userName = this.loginForm.controls['userName'].value;
  //   this.login.password = Md5.hashStr(Md5.hashStr(this.loginForm.controls['password'].value + salt).toString() + salt).toString();
  //   this.userService.login(this.login)
  //     .subscribe(res => {
  //       if (res.data) {
  //         // 登录成功，直接跳转
  //         this.message.create('success', '登录成功');
  //         this.localizationService.setLocalization = 'isLogin';
  //         this.localizationService.setUserName = res.data.user.userName;
  //         this.localizationService.setUid = res.data.user.uid;
  //         // this.localizationService.setCompany = res.data.user.department;
  //         this.localizationService.setPermission = res.data.user.perms.toString();
  //         setTimeout(() => {
  //           this.router.navigateByUrl('booking');
  //         }, 2000);
  //       } else if (res.code === '262') {
  //         this.message.create('error', res.msg);
  //       } else {
  //         this.localizationService.setLocalization = '';
  //         this.localizationService.setUserName = '';
  //         this.localizationService.setUid = '';
  //         // this.localizationService.setCompany = '';
  //         this.localizationService.setPermission = '';
  //         this.message.create('error', res.msg);
  //       }
  //     });
  // }

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
