import { Component, OnInit, OnDestroy, AfterViewInit, OnChanges, Input, ViewChild, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

interface About {
    title: string;
    sub: string;
    desc: string;
}

enum Side {
    Left = 1,
    Right
}

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
    language = 'UNKNOWN';
    langIndex = 0;

    year: number = new Date().getFullYear();

    nowAbout: About;
    abouts: [About] = [
        {
            title: '关于齐悟',
            sub: '齐悟是人马互动科技有限公司(CentaursTech)创立的的人工智能品牌，我们致力于为企业打造智能化、差异化产品提供深度定制化语音交互技术解决方案。',
            desc: '齐悟机器人涵盖语音识别、语义识别、语音合成和嵌入式硬件模组，齐悟给客户提供的是完善的一站式语音交互技术解决方案。我们完全自主研发的语义识别引擎技术可以实现上下文语义理解及推理，能处理复杂的业务逻辑，技术处于全球领先水平，我们能根据合作企业实际业务需求做个性化定制，帮助其大幅降低企业人力成本，提升企业产品价值，用创新的黑科技结合企业的资源优势实现共赢。'
        },
        {
            title: 'ABOUT CHEWROBOT',
            sub: 'Chewbot is the Artificial Intelligence designed by CentaursTech. We provide customizable, differentiable products and resolution with voice interaction.',
            desc: 'Chewbot include voice recognition, speech interpretation, voice synthesis and integrate with hardware. We have self developed voice recognition engine able to induce and deduce logic while handling complex real life scenario. This is the state of the art business engine.'
        }
    ];

    picIndex: number = 0;
    pictures: [string] = [
        '/assets/img/about_pic5.jpg',
        '/assets/img/about_pic2.jpg',
        '/assets/img/about_pic3.jpg',
        '/assets/img/about_pic4.jpg'
    ];
    nowPic: string;

    public _sWidth: number;
    public _sHeight: number;
    private ctx: CanvasRenderingContext2D;
    private running: boolean;
    private dotNumber: number;
    private isViewInit: boolean;

    public dots: Array<Dot>;

    // get the element with the #canvasRef on it
    @ViewChild('testCanvas') canvasRef: ElementRef;

    constructor(private cookieService: CookieService, private ngZone: NgZone) {
        this.language = this.cookieService.get('lang');
        if (this.language === 'en') {
            this.langIndex = 1;
        } else {
            this.langIndex = 0;
        }
        this.nowAbout = this.abouts[this.langIndex];
        this.nowPic = this.pictures[this.picIndex];

        this.isViewInit = false;
        const getWiddowDims = () => {
            if ($(window).width() > 1000) {
                this._sWidth = $(window).width();
            } else {
                this._sWidth = 1000;
            }
            this._sHeight = 694;
            if (this.isViewInit) { };
        };

        window.onresize = () => {
            getWiddowDims();
        };

        getWiddowDims();
    }

    ngOnInit() {
        this.running = true;
        this.ctx = this.canvasRef.nativeElement.getContext('2d');
        this.dotNumber = 10;
    }

    ngOnDestroy(): void {
        this.running = false;
    }

    ngAfterViewInit() {
        this.changePicLeft();
        this.isViewInit = true;
        this.dots = this.initDots(this.dotNumber, this._sWidth, this._sHeight);
        this.animate();
    }


    changePicLeft() {
        setTimeout(() => {
            this.picIndex = (this.picIndex + 1) % (this.pictures.length);
            this.nowPic = this.pictures[this.picIndex];
            this.changePicLeft();
        }, 2000);
    }


    private initDots(cnt: number, sWidth: number, sHeight: number): Array<Dot> {
        const dots: Array<Dot> = new Array<Dot>();
        for (let i = 0; i < cnt; ++i) {
            if (i < cnt / 2) {
                dots.push(new Dot(Side.Left, this._sWidth, this._sHeight));
            } else {
                dots.push(new Dot(Side.Right, this._sWidth, this._sHeight));
            }
        }
        return dots;
    }

    private clear() {
        this.ctx.clearRect(0, 0, this._sWidth, this._sHeight);
    }

    private animate() {
        // this.clear();
        this.ctx.fillStyle = 'rgba(255,255,255,.1)';
        this.ctx.fillRect(0, 0, this._sWidth, this._sHeight);
        for (let i = 0; i < this.dots.length; ++i) {
            const d = this.dots[i];
            d.update();
            if (d.state > 3 || d.y > this._sHeight || d.y < 0) {
                if (i < this.dotNumber / 2) {
                    this.dots[i] = new Dot(Side.Left, this._sWidth, this._sHeight);
                } else {
                    this.dots[i] = new Dot(Side.Right, this._sWidth, this._sHeight);
                }
            } else {
                d.draw(this.ctx, this._sWidth, this._sHeight);
            }
        }

        if (this.running) {
            // Schedule next
            requestAnimationFrame(() => {
                this.animate();
            });
        }
    }
}

class Dot {
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;
    speed: number;
    scale: number;
    tscale: number;
    tracks: [number];
    state: number;
    alpha: number;

    constructor(side: Side, sWidth: number, sHeight: number) {
        if (side === Side.Left) {
            this.x = 0;
            this.dx = 1;
        } else {
            this.x = sWidth;
            this.dx = -1;
        }
        // 在全屏幕的高度的中间80%区域生成点
        this.y = Math.random() * sHeight * 0.8 + sHeight * 0.1;
        if (this.y < sHeight / 2) {
            this.dy = 1; // turn down
        } else {
            this.dy = -1; // turn up
        }
        this.radius = 1;
        this.speed = Math.random() * 0.6 + 0.8;
        this.state = 0;

        this.scale = Math.random() * 2 + 1;
        this.tscale = this.scale * 3;

        const track0 = Math.random() * sWidth * .2 + sWidth * .05;
        const track1 = Math.random() * sWidth * .1 + sWidth * .05 + track0;
        const track2 = Math.random() * sWidth * .3 + sWidth * .05 + track1;
        if (side === Side.Left) {
            this.tracks = [track0, track1, track2];
        } else {
            this.tracks = [sWidth - track0, sWidth - track1, sWidth - track2];
        }
        this.alpha = Math.random() * 0.3 + 0.7;
    }

    public update() {
        switch (this.state) {
            case 0: {
                this.x += this.speed * this.dx;
                if (Math.abs(this.x - this.tracks[0]) <= 1) {
                    this.state++;
                }
                break;
            }
            case 1: {
                this.x += this.speed * this.dx;
                this.y += this.speed * this.dy;
                if (Math.abs(this.x - this.tracks[1]) <= 1) {
                    this.state++;
                }
                break;
            }
            case 2: {
                this.x += this.speed * this.dx;
                if (Math.abs(this.x - this.tracks[2]) <= 1) {
                    this.state++;
                }
                break;
            }
            case 3: {
                this.scale *= 1.02;
                if (this.scale > this.tscale) {
                    this.state++;
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    public draw(ctx: CanvasRenderingContext2D, sWidth: number, sHeight: number): void {
        ctx.save();
        ctx.beginPath();
        ctx.arc(sWidth / 2 + (this.x - sWidth / 2), sHeight / 2 + (this.y - sHeight / 2), this.radius * this.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(10, 84, 111, ${this.alpha})`;
        ctx.fill();
        ctx.restore();
    }
}
