import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-m',
  templateUrl: './contact-m.component.html',
  styleUrls: ['./contact-m.component.scss']
})
export class ContactMComponent implements OnInit {

  name: string = "";
  mailto: string = "";
  content: string = "";

  constructor() {

  }
  ngOnInit() { }

  onEnterName(value: string) {
    this.name = value;
    console.log(this.name);
  }

  onEnterMailto(value: string) {
    this.mailto = value;
  }

  onEnterContent(value: string) {
    this.content = value;
  }

}
