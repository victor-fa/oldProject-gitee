import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HomeTitle } from '../home.component';

@Component({
    selector: 'app-home-title-en',
    templateUrl: './title.component.html',
    styleUrls: ['./title-en.component.scss']
})
export class HomeTitleEnComponent {
    homeTitle: HomeTitle = {
        h1: 'REVOLUTIONARY',
        h2: 'VOICE INTERACTIVE TECHNOLOGY',
        h3: 'PRACTICAL RESOLUTION PROVIDER'
    }
}
