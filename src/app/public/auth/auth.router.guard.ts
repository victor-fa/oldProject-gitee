import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AppSessionService } from '../service/app.session.service';

@Injectable()
export class AppRouteGuard implements CanActivate, CanActivateChild {

  constructor(
    private _router: Router,
    private _sessionService: AppSessionService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.selectBestRoute();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  selectBestRoute(): boolean {
    if (this._sessionService.isLogin) {
      return true;
    }
    this._router.navigate(['/auth/login']);
    return false;
  }
}
