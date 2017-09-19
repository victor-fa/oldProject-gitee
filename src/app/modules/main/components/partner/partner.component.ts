import { Component, AfterViewChecked } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

interface Partner {
    title: string;
}

@Component({
    selector: 'app-partner',
    templateUrl: './partner.component.html',
    styleUrls: ['./partner.component.scss']
})
export class PartnerComponent implements AfterViewChecked {
    language = 'UNKNOWN';
    langIndex = 0;

    nowPartner: Partner;
    partners: [Partner] = [
        {
            title: '合作客户'
        },
        {
            title: 'PARTNERS'
        }
    ];
    constructor(private cookieService: CookieService) {
        this.language = this.cookieService.get('lang');
        if (this.language === 'en') {
            this.langIndex = 1;
        } else {
            this.langIndex = 0;
        }
        this.nowPartner = this.partners[this.langIndex];
    }

    ngAfterViewChecked() {
        window.onscroll = function (e) {
            const pageTop = $(window).scrollTop();
            const pageBottom = pageTop + $(window).height();
            const pageWidth = $(window).width();
            const partnerTop = $('#partner').offset().top;
            const partnerBottom = partnerTop + $('#partner').height();
            const partnerWidth = $('#partner').width();
            // console.log(`${pageTop}, ${pageBottom}; ${partnerTop}, ${partnerBottom}; ${pageWidth}, ${partnerWidth};`);
            if (!((pageTop > partnerBottom) || (pageBottom < partnerTop))) {
                $('#partner-bg-left').css('top', (pageTop - partnerTop) / 8 + 80 + 'px');
                $('#partner-bg-right').css('top', (pageTop - partnerTop) / -4 + 80 + 'px');
                let bg_img_x = 50;
                let bg_img_y = 50;
                bg_img_x -= (pageTop - partnerTop) / 25;
                bg_img_y += (pageTop - partnerTop) / 15;
                if (bg_img_x < 0) { bg_img_x = 0; }
                if (bg_img_x > 100) { bg_img_x = 100; }
                if (bg_img_y < 0) { bg_img_y = 0; }
                if (bg_img_y > 100) { bg_img_y = 100; }
                $('#partner').css('background-position', bg_img_x + '% ' + bg_img_y + '%');
            }
        }
    }
}
