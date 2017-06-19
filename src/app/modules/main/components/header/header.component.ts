import { Component, AfterViewInit } from '@angular/core';
/// <reference path="jquery.d.ts" />

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {
    constructor() {}

    ngAfterViewInit() {
        $(document).ready(function () {
            $('#main-container nav a').click(function (e) {
                $('#main-container nav a').removeClass('active');
                var $parent = $(this).addClass('active');
            });
        });
    }
}
