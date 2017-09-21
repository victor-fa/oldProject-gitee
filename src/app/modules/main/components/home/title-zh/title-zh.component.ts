import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

interface Home {
    h1: string;
    h2: string;
    h3: string;
}

@Component({
    selector: 'app-home-title-zh',
    templateUrl: './title-zh.component.html',
    styleUrls: ['./title-zh.component.scss']
})
export class HomeTitleZhComponent { }
