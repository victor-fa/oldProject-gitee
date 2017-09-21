import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

interface Footer {
    brand: string;
    certificate: string;
}

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

    language = 'UNKNOWN';
    langIndex = 0;

    year: number = new Date().getFullYear();

    nowFooter: Footer;
    footers: [Footer] = [
        {
            brand: '深圳市人马互动科技有限公司',
            certificate: '粤ICP备16128928号'
        },
        {
            brand: 'Centaurs Technologies Co., Ltd.',
            certificate: '粤ICP备16128928号'
        }
    ];

    constructor(private cookieService: CookieService) {
        this.language = this.cookieService.get('lang');
        if (this.language === 'en') {
            this.langIndex = 1;
        } else {
            this.langIndex = 0;
        }
        this.nowFooter = this.footers[this.langIndex];
    }

    // scroll to target tag
    scrollTop() {
        window.scrollBy(0, $('body').outerHeight() * -1);
        $('#main-container nav a').removeClass('active');
        $('#main-container nav a:first-child').addClass('active');
    }
}
