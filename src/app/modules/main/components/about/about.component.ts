import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  hideAppointment:boolean = true;

  constructor() { }

  ngOnInit() {
  }

  showOrCloseAppointment() {
    this.hideAppointment = !this.hideAppointment;
  }
}
