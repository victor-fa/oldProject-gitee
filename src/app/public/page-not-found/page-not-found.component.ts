import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  count = 5;
  private timer;
  constructor(
    private router: Router,
  ) {
    this.timer = setInterval(() => {
      this.count -= 1;
    }, 1000);
  }

  ngOnInit() {
    setTimeout(() => {
      this.router.navigateByUrl('appVersion');
    }, 5000);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

}
