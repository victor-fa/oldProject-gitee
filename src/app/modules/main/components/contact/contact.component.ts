import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

    name:string = "";
    mailto:string = "";
    content:string = "";

    constructor() {

    }
    ngOnInit() {}

    onEnterName(value:string) {
        this.name = value;
        console.log(this.name);
    }

    onEnterMailto(value:string) {
        this.mailto = value;
    }

    onEnterContent(value:string){
        this.content = value;
    }
}
