import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

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
