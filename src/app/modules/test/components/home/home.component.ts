import { Component, AfterViewChecked, HostListener, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { HomeTitleZhComponent } from "./title/title-zh.component";
import { HomeTitleEnComponent } from "./title/title-en.component";

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
        // ref: https://www.openprocessing.org/sketch/434620
        const p5_opt = (p) => {
            let width: number = 1000;
            let height: number = 619;
            let canvas: p5.Renderer2D;
            let constellation: Array<Star>;
            let n: number;
            let d: number;
            let stroke_color: Object;

            p.setup = () => {
                canvas = p.createCanvas(1000, 1000);
                p.pixelDensity(1); // Set 1 because it's too slow on firefox
                //pixelDensity(displayDensity());
                canvas.parent('home-bg-anim-p5');
                n = 150;
                constellation = [];
                for (var i = 0; i < n; i++) {
                    constellation.push(new Star());
                }
                p.strokeWeight(.75);
                stroke_color = p.color('rgba(255,255,255,0.2)');
                p.stroke(stroke_color);
            }

            p.draw = () => {
                p.clear();

                for (var i = 0; i < constellation.length; i++) {
                    constellation[i].update();
                    for (var j = 0; j < constellation.length; j++) {
                        if (i > j) { // "if (i > j)" => to check one time distance between two stars
                            d = constellation[i].loc.dist(constellation[j].loc); // Distance between two stars
                            if (d <= width / 10) { // if d is less than width/10 px, we draw a line between the two stars
                                p.line(constellation[i].loc.x, constellation[i].loc.y, constellation[j].loc.x, constellation[j].loc.y)
                            }
                        }
                    }
                }
            }

            class Star {
                a: number;
                r: number;
                loc: p5.Vector;
                speed: p5.Vector;
                bam: p5.Vector;
                m: number;

                constructor() {
                    this.a = p.random(5 * p.TAU); // "5*TAU" => render will be more homogeneous
                    this.r = p.random(p.width * .2, p.width * .25); // first position will looks like a donut
                    this.loc = p.createVector(p.width / 2 + p.sin(this.a) * this.r, p.height / 2 + p.cos(this.a) * this.r);
                    this.speed = p5.Vector.random2D();
                    this.bam = p.createVector();
                    this.m;
                }
                update() {
                    this.bam = p5.Vector.random2D(); // movement of star will be a bit erractic
                    //this.bam.random2D();
                    this.bam.mult(0.45);
                    this.speed.add(this.bam);
                    // speed is done according distance between loc and the mouse :
                    this.m = p.constrain(p.map(p.dist(this.loc.x, this.loc.y, p.mouseX, p.mouseY), 0, p.width, 8, .05), .05, 8); // constrain => avoid returning "not a number"
                    this.speed.normalize().mult(this.m);

                    // No colision detection, instead loc is out of bound
                    // it reappears on the opposite side :
                    if (p.dist(this.loc.x, this.loc.y, p.width / 2, p.height / 2) > (p.width / 2) * 0.98) {
                        if (this.loc.x < p.width / 2) {
                            this.loc.x = p.width - this.loc.x - 4; // "-4" => avoid blinking stuff
                        } else if (this.loc.x > p.width / 2) {
                            this.loc.x = p.width - this.loc.x + 4; // "+4"  => avoid blinking stuff
                        }
                        if (this.loc.y < p.height / 2) {
                            this.loc.y = p.width - this.loc.y - 4;
                        } else if (this.loc.x > p.height / 2) {
                            this.loc.y = p.width - this.loc.y + 4;
                        }
                    }
                    this.loc = this.loc.add(this.speed);
                }
            }
        }
        this.p5js = new p5(p5_opt);
    }
}
