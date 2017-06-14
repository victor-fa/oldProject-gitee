import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-m',
  templateUrl: './header-m.component.html',
  styleUrls: ['./header-m.component.scss']
})
export class HeaderMComponent implements OnInit {
  activeAbout: boolean = true;
  activePlan: boolean = false;
  activePartner: boolean = false;
  activeTeam: boolean = false;
  activeContact: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }
}
