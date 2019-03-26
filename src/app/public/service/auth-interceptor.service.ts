import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
      const authReq = req.clone({
        headers: req.headers.set( 'Authorization', localStorage.getItem('token'))
      });

      return next.handle(authReq).do(
        event => { },
        (res: HttpErrorResponse) => {
          if (res.status && res.status === 401) {
            alert('用户未登录');
            this.router.navigateByUrl('login');
            return;
          }
        }
      );
    }
}
