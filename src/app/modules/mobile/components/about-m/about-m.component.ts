import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

interface About {
    title: string;
    sub: string;
    desc: string;
}

@Component({
    selector: 'app-about-m',
    templateUrl: './about-m.component.html',
    styleUrls: ['./about-m.component.scss']
})
export class AboutMComponent {

    language = 'UNKNOWN';
    langIndex = 0;

    nowAbout: About;
    abouts: About[] = [
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

    constructor(private cookieService: CookieService) {
        this.language = this.cookieService.get('lang');
        if (this.language === 'en') {
            this.langIndex = 1;
        } else {
            this.langIndex = 0;
        }
        this.nowAbout = this.abouts[this.langIndex];
    }
}
