import { Component } from '@angular/core';

@Component({
    selector: 'app-header-m',
    templateUrl: './header-m.component.html',
    styleUrls: ['./header-m.component.scss']
})
export class HeaderMComponent {
    constructor() {}

    openSideNav() {
        $('#header-m-nav-left').css('transform', 'translate(0)');
    }

    closeSideNav() {
        $('#header-m-nav-left').css('transform', 'translate(-67vw)');
    }
}
