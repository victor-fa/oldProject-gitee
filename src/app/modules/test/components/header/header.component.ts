import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

interface Header {
    home: string;
    tech: string;
    product: string;
    partner: string;
    about: string;
    career: string;
    contact: string;
}

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    language = 'zh';
    langIndex = 0;

    nowHeader: Header;
    headers: Header[] = [
        {
            home: '首页',
            tech: '核心技术',
            product: '产品方案',
            partner: '合作客户',
            about: '关于齐悟',
            career: '加入齐悟',
            contact: '联系我们'
        },
        {
            home: 'Home',
            tech: 'Techologies',
            product: 'Products',
            partner: 'Partners',
            about: 'About',
            career: 'Careers',
            contact: 'Contact Us'
        }
    ];

    constructor(private cookieService: CookieService) {
        this.language = this.cookieService.get('lang');
        if (this.language === 'en') {
            this.langIndex = 1;
        } else {
            this.langIndex = 0;
        }
        this.nowHeader = this.headers[this.langIndex];
    }

    ngOnInit() {
        if (!this.cookieService.get('lang')) {
            this.cookieService.set('lang', 'zh');
        }
        this.language = this.cookieService.get('lang');
    }

    changeActive(index: number) {
        $('#header-nav-bar ul li').removeClass('active');
        $(`#header-nav-bar ul li:nth-child(${index})`).addClass('active');
    }

    changeLanguage(language: string) {
        if (language === 'en') {
            this.cookieService.set('lang', 'en');
        } else {
            this.cookieService.set('lang', 'zh');
        }
        location.reload();
    }
}
