import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-m',
  templateUrl: './header-m.component.html',
  styleUrls: ['./header-m.component.scss']
})
export class HeaderMComponent implements OnInit {

  constructor() { 
    console.log("mobile header loaded.");
  }

  ngOnInit() {
  }

}
