import { Component, OnInit } from '@angular/core';

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
            title: "支持复杂逻辑和业务",
            sub: "齐悟拥有革命性的语音交互技术，涵盖了语音识别、语义识别和语音合成一整套语音交互技术。",
            desp: "现在知名度比较高的几个机器人(微软小 冰、度秘、siri)都是闲聊为主，顶多增加 一些调闹钟、查天气的关键词查询式的助理功能。齐悟可以根据企业用户需求定制业务逻辑，处理更加复杂的业务，如买机票、订酒店、点外卖，通过一系列多轮对话搜集用户意图或直接一次性理解多句复杂句子表的达，这是传统一问一答聊天机器人做不到的。并且支持多个话题跳转，网状逻辑，而不是传统客服的线性菜单式逻辑。",
            name: "复杂逻辑",
            icon: "/assets/img/tech_icons/tech_icon2_w.png"
        },
        {
            title: "敏捷开发",
            sub: "齐悟运用革命性智能算法提高百倍以上的开发效率，快速迭代，试试更新。",
            desp: "国内大多数智能客服公司做一个demo需要花4个月时间，我们只需要3天就可以做出效果更好的demo，一周即可做出成品，能够快速测试投产，并且动态根据客户需求调整。在产品的开发及迭代快速的泛娱乐领域，齐悟智能客服有很强的竞争力。",
            name: "敏捷开发",
            icon: "/assets/img/tech_icons/tech_icon3_w.png"
        },
        {
            title: "深度定制化",
            sub: "人工智能巨头的技术有各自的先进性，但是极少会针对中小企业提供深度定制服务。",
            desp: "微软小冰的闲聊功能不错，但是微软公司不会给中小企业定制一个专门的产品。我们可以给不同行业定制，目前轻松覆盖游戏、客服、虚拟偶像、智能硬件、教育、医疗、语音助手等领域，帮助各类规模企业解决实际问题，降低企业成本，提高营收水平及品牌价值。",
            name: "定制化",
            icon: "/assets/img/tech_icons/tech_icon4_w.png"
        },
        {
            title: "自主研发核心引擎",
            sub: "齐悟机器人在记忆、推理等功能完胜国内外一线竞争对手。",
            desp: "齐悟的引擎已经开发了10多年，智能程度碾压国内现有的许多人工智能极速，可以轻松实现快速定制，更重要的是开发费用相比竞争对手更低，而且迭代速度快，版本更新灵活，具有绝对的竞争优势。齐悟技术的核心是采用独特的偏重实例层的多层语义知识网络，基于图模板映射的规则归纳和知识推理，从而实现多轮人机对话及上下文语义理解。",
            name: "自主研发",
            icon: "/assets/img/tech_icons/tech_icon5_w.png"
        },
        {
            title: "甲方压力小",
            sub: "运用标准化的流程，减少人工成本，大大加快模型训练时间。",
            desp: "传统的智能客服是通过机器学习的方式进行训练，会产生两个问题：需要甲方提供大量语料数据进行训练，许多企业往往无法提供数据;同时每一次定制都需要甲方出人力进行大量的人工标记，费时劳力。可以说，他们是人工堆积出来的智能，而不是真正的人工智能。齐悟给客户定制无需数据、不需要标记，客户只提供给人类客服学习的《培训手册》或标准的业务流程图，齐悟就能建立自己的逻辑、快速学习处理业务，实现接近真人的自然交互。后续需要增删知识，只需要在神经网络中增加或减少节点即可完成需求。",
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
