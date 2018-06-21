import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export interface Home {
    h1: string;
    h2: string;
    h3: string;
}

@Component({
    selector: 'app-home-m',
    templateUrl: './home-m.component.html',
    styleUrls: ['./home-m.component.scss']
})
export class HomeMComponent {
    language = 'zh';
    langIndex = 0;

    nowHome: Home;
    homes: Home[] = [ {
        h1: '革命性',
        h2: '语音交互技术',
        h3: '解决方案提供商'
    },
    {
        h1: 'REVOLUTIONARY',
        h2: 'VOICE INTERACTIVE TECHNOLOGY',
        h3: 'PRACTICAL RESOLUTION PROVIDER'
    }]

    constructor(private cookieService: CookieService) {
        this.language = this.cookieService.get('lang');
        if (this.language === 'en') {
            this.langIndex = 1;
        } else {
            this.langIndex = 0;
        }
        this.nowHome = this.homes[this.langIndex];
    }
}
