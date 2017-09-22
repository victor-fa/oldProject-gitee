import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { HomeTitleZhComponent } from "./title/title-zh.component";
import { HomeTitleEnComponent } from "./title/title-en.component";

export interface HomeTitle {
    h1: string;
    h2: string;
    h3: string;
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    language = 'zh';

    constructor(private cookieService: CookieService) {
        if (this.cookieService.get('lang')) {
            this.language = this.cookieService.get('lang');
        }
    }
}
