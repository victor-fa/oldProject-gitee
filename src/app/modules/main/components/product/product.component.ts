import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
    hideEducation: boolean = true;
    hideGame: boolean = true;
    hideAnimate: boolean = true;
    hideHardware: boolean = true;

    nowIndex = 0;

    constructor() { }

    ngOnInit() {
    }

    changeFeature(index: number) {
        this.nowIndex = index;
    }

    showOrCloseEducation() {
        this.hideEducation = !this.hideEducation;
    }

    showOrCloseGame() {
        this.hideGame = !this.hideGame;
    }

    showOrCloseAnimate() {
        this.hideAnimate = !this.hideAnimate;
    }

    showOrCloseHardware() {
        this.hideHardware = !this.hideHardware;
    }
}
