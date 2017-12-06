import { Component, AfterViewChecked, HostListener, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { HomeTitleZhComponent } from "./title/title-zh.component";
import { HomeTitleEnComponent } from "./title/title-en.component";

import { Star } from './star';

import * as p5 from 'p5';

export interface HomeTitle {
    h1: string;
    h2: string;
    h3: string;
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    language = 'zh';
    p5js: p5;

    constructor(private cookieService: CookieService) {
        if (this.cookieService.get('lang')) {
            this.language = this.cookieService.get('lang');
        }
    }

    ngOnInit() {
        const p5_opt = (p) => {

            let canvas;
            let constellation = [];
            let n;
            let d;

            p.setup = () => {
                canvas = p.createCanvas(1000, 619);
                p.pixelDensity(1); // Set 1 because it's too slow on firefox
                //pixelDensity(displayDensity());
                canvas.parent('equalizer');
                let n = 20;

                for (var i = 0; i < n; i++) {
                    constellation.push(new Star());
                }
                p.strokeWeight(.75);
                p.stroke('#0000FF');
                console.log(constellation);
            }

            p.draw = () => {
                p.background(255, 0, 255, 1);
                for (let k = 0; k < constellation.length; k++) {
                    constellation[k].update();
                    // p.ellipse(constellation[k].x, constellation[k].y, 80, 80);
                }
                // p.ellipse(p.mouseX, p.mouseY, 80, 80);
                /*
                // background('#000000');
                p.background('#FF00FF');

                for (let i = 0; i < p.constellation.length; i++) {
                    p.constellation[i].update();
                    for (var j = 0; j < p.constellation.length; j++) {
                        if (i > j) { // "if (i > j)" => to check one time distance between two stars
                            d = p.constellation[i].loc.dist(constellation[j].loc); // Distance between two stars
                            if (d <= p.width / 10) { // if d is less than width/10 px, we draw a line between the two stars
                                p.line(constellation[i].loc.x, constellation[i].loc.y, constellation[j].loc.x, constellation[j].loc.y)
                            }
                        }
                    }
                }
                */
            }

            class Star {
                width: number;
                height: number;
                x: number;
                y: number;
                a: number;
                r: number;
                loc: p5.Vector;
                speed: p5.Vector;
                bam: p5.Vector;
                m;

                /*
                this.a = random(5 * TAU); // "5*TAU" => render will be more homogeneous
                this.r = random(width * .2, width * .25); // first position will looks like a donut
                this.loc = createVector(width / 2 + sin(this.a) * this.r, height / 2 + cos(this.a) * this.r);
                this.speed = createVector();
                this.speed = p5.Vector.random2D();
                //this.speed.random2D();
                this.bam = createVector();
                this.m;
                */

                constructor() {
                    this.width = 1000;
                    this.height = 619;
                    this.a = p.random(5 * p.TAU); // "5*TAU" => render will be more homogeneous
                    this.r = p.random(this.width * .2, this.width * .25); // first position will looks like a donut
                    this.loc = p.createVector(this.width / 2 + p.sin(this.a) * this.r, p.height / 2 + p.cos(this.a) * this.r);
                    // this.speed = p.createVector();
                    this.speed = p5.Vector.random2D();
                    //this.speed.random2D();
                    this.bam = p.createVector();
                    this.m;
                }
                update() {
                    this.x += 20;
                    this.y += 15;
                    this.x %= 1000;
                    this.y %= 619;
                }
            }
        }
        this.p5js = new p5(p5_opt);
    }
}
