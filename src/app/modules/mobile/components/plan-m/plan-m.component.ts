import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plan-m',
  templateUrl: './plan-m.component.html',
  styleUrls: ['./plan-m.component.scss']
})
export class PlanMComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  showOrCloseEducation() {
    var education = document.getElementById("education-dialog");
    if (education.style.opacity != "1") {
      education.style.opacity = "1";
      education.style.height = "auto";
    } else {
      education.style.opacity = "0";
      education.style.height = "0";
    }
  }

  showOrCloseGame() {
    var game = document.getElementById("game-dialog");
    if (game.style.opacity != "1") {
      game.style.opacity = "1";
      game.style.height = "auto";
    } else {
      game.style.opacity = "0";
      game.style.height = "0";
    }
  }

  showOrCloseAnimate() {
    var animate = document.getElementById("animate-dialog");
    if (animate.style.opacity != "1") {
      animate.style.opacity = "1";
      animate.style.height = "auto";
    } else {
      animate.style.opacity = "0";
      animate.style.height = "0";
    }
  }

  showOrCloseHardware() {
    var hardware = document.getElementById("hardware-dialog");
    if (hardware.style.opacity != "1") {
      hardware.style.opacity = "1";
      hardware.style.height = "auto";
    } else {
      hardware.style.opacity = "0";
      hardware.style.height = "0";
    }
  }
}
