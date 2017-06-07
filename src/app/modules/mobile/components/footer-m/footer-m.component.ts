import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-m',
  templateUrl: './footer-m.component.html',
  styleUrls: ['./footer-m.component.scss']
})
export class FooterMComponent implements OnInit {
  year: number = new Date().getFullYear();
  constructor() { }

  ngOnInit() {
  }

}
