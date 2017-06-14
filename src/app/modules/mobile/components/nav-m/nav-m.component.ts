import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-nav-m',
  templateUrl: './nav-m.component.html',
  styleUrls: ['./nav-m.component.scss']
})
export class NavMComponent implements AfterViewInit {
  activeAbout: boolean = true;
  activePlan: boolean = false;
  activePartner: boolean = false;
  activeTeam: boolean = false;
  activeContact: boolean = false;

  didScroll: boolean = false;
  constructor() {
  }

  ngAfterViewInit() {

    // on scroll, let the interval function know the user has scrolled
    $(window).scroll(function (event) {
      this.didScroll = true;
    });

    // run hasScrolled() and reset didScroll status
    setInterval(function () {
      if (this.didScroll) {
        hasScrolled();
        this.didScroll = false;
      }
    }, 250);
    function hasScrolled() {
      $("a").css("background-color", "pink");
    }
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
