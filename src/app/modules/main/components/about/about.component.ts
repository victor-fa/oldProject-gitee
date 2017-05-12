import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
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
