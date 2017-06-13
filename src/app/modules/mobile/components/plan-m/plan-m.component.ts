import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plan-m',
  templateUrl: './plan-m.component.html',
  styleUrls: ['./plan-m.component.scss']
})
export class PlanMComponent implements OnInit {
  hideEducation: boolean = true;
  hideGame: boolean = true;
  hideAnimate: boolean = true;
  hideHardware: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  showOrCloseEducation() {
    this.hideEducation = !this.hideEducation;
    this.hideGame = true;
    this.hideAnimate = true;
    this.hideHardware = true;
  }

  showOrCloseGame() {
    this.hideEducation = true;
    this.hideGame = !this.hideGame;
    this.hideAnimate = true;
    this.hideHardware = true;
  }

  showOrCloseAnimate() {
    this.hideEducation = true;;
    this.hideGame = true;
    this.hideAnimate = !this.hideAnimate;
    this.hideHardware = true;
  }

  showOrCloseHardware() {
    this.hideEducation = true;
    this.hideGame = true;
    this.hideAnimate = true;
    this.hideHardware = !this.hideHardware;
  }
}
