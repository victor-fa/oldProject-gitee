import { Component, OnInit } from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({
          opacity: 1,
          transform: 'translateX(0)'
        })),
      state('out',   style({
          opacity: 0,
          transform: 'translateX(50%)'
        })),
      transition('in => out', animate('100ms ease-in', style(
          {
              transform: 'translateX(-50%)'
          }
      ))),
      transition('out => in', animate('100ms ease-out'))
    ])
  ]
})
export class AboutComponent implements OnInit {

  hideAppointment:boolean = true;
  nowPageNumber:number = 1;

  constructor() { }

  ngOnInit() {
  }

  changePage(i:number){
      this.nowPageNumber = i;
  }

}
