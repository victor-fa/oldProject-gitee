import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    animations: [
        trigger('flyInOut', [
            state('in', style({
                opacity: 1,
                transform: 'translateX(0)'
            })),
            state('out', style({
                opacity: 0,
                transform: 'translateX(50%)'
            })),
            transition('in => out', animate('200ms ease-in', style(
                {
                    transform: 'translateX(-50%)'
                }
            ))),
            transition('out => in', animate('200ms ease-out'))
        ])
    ]
})
export class AboutComponent implements OnInit {

    hideAppointment: boolean = true;
    nowPageNumber: number = 1;
    pageWidth: number = (window.innerWidth > 0) ? window.innerWidth : screen.width;

    private subscription3s: Subscription;
    constructor() { }

    ngOnInit() {
        if (this.pageWidth > 414) {
            console.log("Large Width: " + this.pageWidth);
            let timer3s = TimerObservable.create(5000,5000);
            this.subscription3s = timer3s.subscribe(this.refresh3s.bind(this));
        } else {
            console.log("Small Width: " + this.pageWidth);
        }

    }

    changePage(i: number) {
        this.nowPageNumber = i;
    }

    refresh3s(t: number){
        this.nowPageNumber = this.nowPageNumber % 2 + 1;
    }

}
