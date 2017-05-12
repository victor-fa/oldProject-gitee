import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-plan',
    templateUrl: './plan.component.html',
    styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {
    hideEducation: boolean = true;
    hideGame: boolean = true;
    hideAnimate: boolean = true;

    features: [string] = [
        '/assets/images/plan_feature1.png',
        '/assets/images/plan_feature2.png',
        '/assets/images/plan_feature3.png'
    ];

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

}
