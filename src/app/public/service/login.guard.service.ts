import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalizationService } from './localization.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(
    private router: Router,
    public localizationService: LocalizationService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let canLogin: boolean;
    // 判断用户是否登入
    const isLogin = this.localizationService.getLocalization;
    if (isLogin === 'isLogin') {
      canLogin = true;
    } else {
      canLogin = false;
      // 未登入跳转到登入界面
      this.router.navigateByUrl('/login');
    }
    return canLogin;
  }
}
