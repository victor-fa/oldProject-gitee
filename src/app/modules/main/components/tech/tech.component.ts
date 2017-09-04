import { Component, OnInit } from '@angular/core';

export interface Member {
    name: string;
    position: string;
    education: string;
    introduction: string;
    img: string;
    linkedin: string;
    facebook: string;
}

export interface Technology {
    title: string;
    sub: string;
    desp: string;
    name: string;
    icon: string;
}

@Component({
    selector: 'app-tech',
    templateUrl: './tech.component.html',
    styleUrls: ['./tech.component.scss']
})

export class TechComponent {
    nowIndex: number = 0;

    technologies: [Technology] = [
        {
            title: "获得精准数据",
            sub: "齐悟能知道某个用户具体的信息，而且可以联系起来精准定位。",
            desp: "打个比方，他在乐逗玩了什么游戏，玩的怎么样了，打到多少关了，充了多少钱，这个虽然腾讯能知道，但是百度阿里巴巴肯定是不知道的。然后也能知道他患了什么病，现在健康状况是什么样的，比如百度可能知道他去了哪家医院，搜了什么病，但是具体病情肯定是不知道的，然后腾讯之类也肯定收集不到。这就是我们比BAT数据上的优势。而且百度只知道他搜了什么，而我们是用户亲口告诉具体情况，我们也能理解用户在相关业务里所有的数据。",
            name: "精准数据",
            icon: "/assets/img/tech_icons/tech_icon1_w.png"
        },
        {
            title: "复杂逻辑",
            sub: "复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑",
            desp: "复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻辑复杂逻",
            name: "复杂逻辑",
            icon: "/assets/img/tech_icons/tech_icon2_w.png"
        },
        {
            title: "敏捷开发",
            sub: "敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发",
            desp: "敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发敏捷开发",
            name: "敏捷开发",
            icon: "/assets/img/tech_icons/tech_icon3_w.png"
        },
        {
            title: "定制化",
            sub: "定制化定制化定制化定制化定制化定制化定制化定制化",
            desp: "定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化定制化",
            name: "定制化",
            icon: "/assets/img/tech_icons/tech_icon4_w.png"
        },
        {
            title: "自主逻辑",
            sub: "自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑",
            desp: "自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑自主逻辑",
            name: "自主逻辑",
            icon: "/assets/img/tech_icons/tech_icon5_w.png"
        },
        {
            title: "成本优势",
            sub: "成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势",
            desp: "成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势成本优势",
            name: "成本优势",
            icon: "/assets/img/tech_icons/tech_icon6_w.png"
        }
    ]
    nowTech: Technology = this.technologies[this.nowIndex];

    constructor() {
    }

    changeTech(index: number) {
        this.nowTech = this.technologies[index];
        this.nowIndex = index;
    }
}
