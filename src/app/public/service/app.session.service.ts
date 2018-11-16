import { Injectable } from '@angular/core';
import { CookiesService } from './cookies.service';
declare const $: any;
@Injectable()
export class AppSessionService {
    constructor(
        private _cookiesService: CookiesService,
    ) {
    }

    get isLogin(): boolean {
        return this._cookiesService.getToken() ? true : false;
    }
}
