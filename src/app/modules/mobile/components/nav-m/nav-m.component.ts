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

  constructor() {
  }

  ngAfterViewInit() {
    var didScroll = false;
    var lastScrollTop = 0;
    var delta = 5;
    var logoHeight = $('#nav-top').outerHeight();
    var navbarHeight = $('#nav-main').outerHeight();
    var headerHeight = logoHeight + navbarHeight;

    $(".main-contain").css("margin-top", headerHeight + "px");
    $('#nav-top').css("top", "0px");

    // on scroll, let the interval function know the user has scrolled
    $(window).scroll(function (event) {
      didScroll = true;
    });

    // run hasScrolled() and reset didScroll status
    setInterval(function () {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 250);

    function hasScrolled() {
      var st: number = $(window).scrollTop();

      // Make sure they scroll more than delta
      if (Math.abs(lastScrollTop - st) <= delta) {
        return;
      }

      // If they scrolled down and are past the navbar, add class .nav-up.
      // This is necessary so you never see what is "behind" the navbar.
      if (st > lastScrollTop && st > headerHeight) {
        // Scroll Down
        $('#nav-top').css("top", -logoHeight + "px");
        $('#nav-main').css("top", "0px");
        $('#nav-m').css("top", -logoHeight + "px");
      } else {
        // Scroll Up to top
        if (st < headerHeight) {
          $('#nav-top').css("top", "0px");
          $('#nav-main').css("top", logoHeight + "px");
          $('#nav-m').css("top", "0px");
        }
      }
      lastScrollTop = st;
    }
  }

  // scroll to target tag
  scrollTo(hash: string) {
    var navbarHeight = $('#nav-main').outerHeight();
    location.hash = "#" + hash;
    window.scrollBy(0, $('#nav-main').outerHeight() * -1);
    this.activeChecker(hash);
  }

  activeChecker(id: string) {
    this.activeAbout = (id == 'about-m' ? true : false);
    this.activePlan = (id == 'plan-m' ? true : false);
    this.activePartner = (id == 'partner-m' ? true : false);
    this.activeTeam = (id == 'team-m' ? true : false);
    this.activeContact = (id == 'contact-m' ? true : false);
    if (id != 'about-m' && id != 'plan-m' && id != 'partner-m' && id != 'team-m' && id != 'contact-m') {
      this.activeAbout = true;
    }
  }
}
