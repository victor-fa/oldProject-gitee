import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

interface Home {
    h1: string;
    h2: string;
    h3: string;
}

@Component({
    selector: 'app-home-title-en',
    templateUrl: './title-en.component.html',
    styleUrls: ['./title-en.component.scss']
})
export class HomeTitleEnComponent { }
