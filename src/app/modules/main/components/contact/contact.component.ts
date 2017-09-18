import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

interface Contact {
    title: string;
    left: {
        name: string;
        email: string;
        msg: string;
        submit: string;
    };
    right: {
        title: string;
        company: {
            zh: string;
            en: string;
        };
        tel: {
            l1: string;
            l2: string;
        };
        addr: {
            l1: string;
            l2: string;
        }
        email: {
            l1: string;
            l2: string;
        }
    }
}

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
    language = 'UNKNOWN';
    langIndex = 0;

    nowContact: Contact;
    contacts: [Contact] = [
        {
            title: '联系我们',
            left: {
                name: '名字',
                email: '邮箱',
                msg: '内容',
                submit: '发送'
            },
            right: {
                title: '联系方式：',
                company: {
                    zh: '深圳市人马互动科技有限公司',
                    en: 'Centaurs Technologies Co., Ltd.'
                },
                tel: {
                    l1: '电话：',
                    l2: '0755-86968772'
                },
                addr: {
                    l1: '地址：',
                    l2: '深圳市南山区留学生创业大厦2007室'
                },
                email: {
                    l1: '邮箱：',
                    l2: 'contact@qiwu.ai'
                }
            }
        },
        {
            title: 'CONTACT US',
            left: {
                name: 'Name',
                email: 'Email',
                msg: 'Message',
                submit: 'Submit'
            },
            right: {
                title: 'Information',
                company: {
                    zh: '深圳市人马互动科技有限公司',
                    en: 'Centaurs Technologies Co., Ltd.'
                },
                tel: {
                    l1: 'Telephone ',
                    l2: '0755-86968772'
                },
                addr: {
                    l1: 'Address ',
                    l2: '深圳市南山区留学生创业大厦2007室'
                },
                email: {
                    l1: 'Email ',
                    l2: 'contact@qiwu.ai'
                }
            }
        }
    ];

    constructor(private cookieService: CookieService) {
        this.language = this.cookieService.get('lang');
        if (this.language === 'en') {
            this.langIndex = 1;
        } else {
            this.langIndex = 0;
        }
        this.nowContact = this.contacts[this.langIndex];
    }

    ngOnInit() {
        if (!this.cookieService.get('lang')) {
            this.cookieService.set('lang', 'zh');
        }
        this.language = this.cookieService.get('lang');
    }
}
