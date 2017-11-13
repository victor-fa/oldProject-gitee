import { Component, OnInit, ViewContainerRef } from '@angular/core';

// import { Service } from './service';

@Component({
    selector: 'app-mobile',
    templateUrl: './mobile.component.html',
    styleUrls: ['./mobile.component.scss']
})
export class MobileComponent implements OnInit {
    /*
    service: Service;

    constructor(service: Service, viewContainerRef: ViewContainerRef) {
        this.service = service;
        this.service.setRootViewContainerRef(viewContainerRef)
        this.service.addDynamicComponent('tech')
    }
    */

    ngOnInit() {
        console.log('mobile version');
    }

    loadComponent(component: string) {
        // this.service.addDynamicComponent(component);
        console.log(component);
    }
}
