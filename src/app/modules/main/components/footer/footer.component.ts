import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

    year:number = new Date().getFullYear();

    // test
    innerWidth: number = window.innerWidth;
    width: number = screen.width;
    deviceType: string;


    constructor() {
        if (this.detectmob()) {
            this.deviceType = "mobile";
        } else {
            this.deviceType = "desktop";
        }
    }
    ngOnInit() {}

    detectmob() : boolean {
     if( navigator.userAgent.match(/Android/i)
     || navigator.userAgent.match(/webOS/i)
     || navigator.userAgent.match(/iPhone/i)
     || navigator.userAgent.match(/iPad/i)
     || navigator.userAgent.match(/iPod/i)
     || navigator.userAgent.match(/BlackBerry/i)
     || navigator.userAgent.match(/Windows Phone/i)
     ){
        return true;
      }
     else {
        return false;
      }
    }
}
