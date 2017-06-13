import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-m',
  templateUrl: './nav-m.component.html',
  styleUrls: ['./nav-m.component.scss']
})
export class NavMComponent implements OnInit {
  activeAbout: boolean = true;
  activePlan: boolean = false;
  activePartner: boolean = false;
  activeTeam: boolean = false;
  activeContact: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  scrollTo(hash: string) {
    location.hash = "#" + hash;
    this.activeChecker(hash);
  }

  activeChecker(id: string) {
    this.activeAbout = (id == 'about-m' ? true : false);
    this.activeAbout = (id == 'plan-m' ? true : false);
    this.activePartner = (id == 'partner-m' ? true : false);
    this.activeTeam = (id == 'team-m' ? true : false);
    this.activeContact = (id == 'contact-m' ? true : false);
  }
}
