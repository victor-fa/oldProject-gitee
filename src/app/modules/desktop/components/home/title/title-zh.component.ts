import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HomeTitle } from '../home.component';

@Component({
    selector: 'app-home-title-zh',
    templateUrl: './title.component.html',
    styleUrls: ['./title-zh.component.scss']
})
export class HomeTitleZhComponent {
    homeTitle: HomeTitle = {
        h1: '革命性',
        h2: '语音交互技术',
        h3: '解决方案提供商'
    }
}
