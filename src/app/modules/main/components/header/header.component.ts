import { Component, AfterViewInit } from '@angular/core';
/// <reference path="jquery.d.ts" />

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {
    constructor() {}

    ngAfterViewInit() {}

    changeActive(index: number) {
        $('#header-nav-bar ul li').removeClass('active');
        $(`#header-nav-bar ul li:nth-child(${index})`).addClass('active');
    }
}
