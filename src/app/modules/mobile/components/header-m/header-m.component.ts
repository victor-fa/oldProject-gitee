import { Component } from '@angular/core';
import { MobileComponent } from "../../mobile.component";

@Component({
    selector: 'app-header-m',
    templateUrl: './header-m.component.html',
    styleUrls: ['./header-m.component.scss']
})
export class HeaderMComponent {

    openSideNav() {
        $('#header-m-nav-left').css('transform', 'translate(0)');
    }

    closeSideNav() {
        $('#header-m-nav-left').css('transform', 'translate(-67vw)');
    }

    changeMain(cp: string) {
        var id: string = "#" + cp;
        $('html, body').animate({
            scrollTop: $(id).offset().top
        }, 1000);
        this.closeSideNav();
    }
}
