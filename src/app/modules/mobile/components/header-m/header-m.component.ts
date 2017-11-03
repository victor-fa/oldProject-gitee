import { Component } from '@angular/core';
import {MobileComponent} from "../../mobile.component";

@Component({
    selector: 'app-header-m',
    templateUrl: './header-m.component.html',
    styleUrls: ['./header-m.component.scss']
})
export class HeaderMComponent {
    mc: MobileComponent;
    constructor(mc: MobileComponent) {
        this.mc = mc;
    }

    openSideNav() {
        $('#header-m-nav-left').css('transform', 'translate(0)');
    }

    closeSideNav() {
        $('#header-m-nav-left').css('transform', 'translate(-67vw)');
    }

    changeMain(cp: string) {
        this.mc.loadComponent(cp);
    }
}
