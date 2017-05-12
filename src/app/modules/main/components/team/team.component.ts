import { Component, OnInit } from '@angular/core';

export interface Member {
	name: string;
	position: string;
	education: string;
	introduction: string;
	img: string;
}


@Component({
    selector: 'app-team',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
    nowIndex: number = 0;

    members: [Member] = [
        {
            name: "王一",
            position: "创始人 & CEO",
            education: "华南理工大学软件工程专业本科，伊利诺伊理工大学硕士。",
            introduction: "具有8年移动开发及项目管理经验，曾多次获得全国移动开发比赛大奖。在世界500强企业工作两年并且积累了丰富的实战经验后辞职赴美留学创业。攻读计算机硕士学位的同时从0到1组建了一支优秀的技术团队。",
            img: "/assets/images/avator/wy.png"
        },
        {
            name: "胡上峰",
            position: "语义模块负责人",
            education: "北京大学计算机科学本科，澳大利亚斯威本科技大学自然语言处理博士。",
            introduction: "曾担任大型互联网公司主程7年，后专注聊天机器人语义识别研究10余年，并在新加坡国立研究所专研人机多轮对话理解及无监督的语义归纳提取等前沿人工智能领域3年，在行业内有多篇著名论文发表及相关技术发明专利。",
            img: "/assets/images/avator/hsf.png"
        },
        {
            name: "江松",
            position: "企业产品架构师",
            education: "上海交通大学计算机硕士。",
            introduction: "拥有超过15年的企业级软件产品开发背景。在欧洲和国内多家公司历任系统架构师，研发总监和研发副总裁。对企业级存储，私有云，PaaS平台产品的开发和部署拥有很深的技术理解。其负责主导开发的产品曾用于欧洲电子对撞机项目和国内大型保险和金融公司。对软件产品在保险，金融，电信等领域的落地拥有丰富的实战经验。",
            img: "/assets/images/avator/js.png"
        },
        {
            name: "文剑钧",
            position: "技术顾问",
            education: "加州大学计算机硕士，中科院数学博士。",
            introduction: "拥有机器学习相关技术资深背景，曾在多家初创公司、独角兽公司以及谷歌等世界互联网巨头担任重要职务，拥有超过10年的软件产品研发设计、系统架构及管理的丰富经验。同时也拥有多年创业经历，在建立及管理团队方面有着多年实战经验。",
            img: "/assets/images/avator/wjj.png"
        },
        {
            name: "王曦",
            position: "语言识别模块负责人",
            education: "西南交大计算机软件游戏方向本科毕业，伊利诺伊理工大学计算机硕士。",
            introduction: "多年移动互联网开发经验，在语音识别领域有多年研究，采用国际领先的语音识别模型作为基底，通过机器学习优化语音模型，从而让用户获得更好的识别体验。通过优化语音识引擎使其具有实时极速响应能力，拥有较好的降噪处理及对环境音的过滤能力。",
            img: "/assets/images/avator/wx.png"
        },
        {
            name: "龙方舟",
            position: "全栈工程师",
            education: "美国南加州大学计算机科学游戏开发方向硕士(专业方向全美第一)。",
            introduction: "曾供职于国内顶尖游戏开发商乐元素，参与多个商业项目开发。硕士就读期间担任南加州大学交互实验室的工程师，管理多个基于虚幻4游戏引擎游戏项目开发，擅长服务器系统架构。",
            img: "/assets/images/avator/fl.png"
        }
    ]

    nowMember:Member = this.members[this.nowIndex];

    constructor() {

    }
    ngOnInit() {}

    changeMember(index: number) {
		this.nowMember = this.members[index];
		this.nowIndex = index;
	}

}
