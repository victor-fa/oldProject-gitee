import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppSessionService } from './app.session.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private _sessionService: AppSessionService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let canLogin: boolean;
    if (this._sessionService.isLogin) {
      canLogin = true;
    } else {
      canLogin = false;
      alert('您还未登录，请先登录！');
      // 未登入跳转到登入界面
      this.router.navigateByUrl('/login');
    }
    return canLogin;
  }
}
