import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http/http';
import { Injectable, Injector } from '@angular/core';
import { CookiesService } from './cookies.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private _cookiesService: CookiesService,
        private modalService: NzModalService,
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
      // const token = this._cookiesService.getToken();
      const token = 'Bearer ' + localStorage.getItem('token');
      const authToken = token ? token : '';
      const authReq = req.clone({
        headers: req.headers.set('Authorization', authToken)
      });

      return next.handle(authReq).do(
        event => { },
        (res: HttpErrorResponse) => {
          if (res.status && res.status === 403) {
            // 没有Token/Token过期，用户未登录情况，do this...
            this.modalService.confirm({
              nzTitle: '提示',
              nzContent: '用户未登录'
            });
            this._cookiesService.clearToken();
            this.router.navigateByUrl('booking');
            return;
          }
        }
      );
    }
}
