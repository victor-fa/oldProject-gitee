import { Component } from '@angular/core';

@Component({
    selector: 'app-header-m',
    templateUrl: './header-m.component.html',
    styleUrls: ['./header-m.component.scss']
})
export class HeaderMComponent {
    showSideNav:boolean;

    constructor() {
        this.showSideNav = false;
    }
    openSideNav() {
        this.showSideNav = true;
    }

    closeSideNav() {
        // $('#header-m-nav-left').hide();
        console.log(66666);
    }
}
