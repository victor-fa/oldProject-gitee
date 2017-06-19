import { Component, AfterViewInit } from '@angular/core';
/// <reference path="jquery.d.ts" />

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements AfterViewInit {

    year: number = new Date().getFullYear();

    constructor() { }

    ngAfterViewInit() { }
    // scroll to target tag
    scrollTop() {
        window.scrollBy(0, $('body').outerHeight() * -1);
        $('#main-container nav a').removeClass('active');
        $('#main-container nav a:first-child').addClass('active');
    }
}
