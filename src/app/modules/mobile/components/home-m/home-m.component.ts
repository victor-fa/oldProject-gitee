import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export interface HomeM {
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

    nowHomeM: HomeM;
    homeMs: [HomeM] = [ {
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
        this.nowHomeM = this.homeMs[this.langIndex];
    }
}
