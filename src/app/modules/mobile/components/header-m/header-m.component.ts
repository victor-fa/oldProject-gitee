import { Component } from '@angular/core';

@Component({
    selector: 'app-header-m',
    templateUrl: './header-m.component.html',
    styleUrls: ['./header-m.component.scss']
})
export class HeaderMComponent {
    openSideNav() {
        $('#header-m-nav-left').show();
    }

    closeSideNav() {
        $('#header-m-nav-left').hide();
        // console.log(12341234);
    }
}
