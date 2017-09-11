import { Component } from '@angular/core';

export interface Job {
    title: string;
    desc: [string];
    details: [string];
}

@Component({
    selector: 'app-career',
    templateUrl: './career.component.html',
    styleUrls: ['./career.component.scss']
})

export class CareerComponent {
    nowIndex = 0;
    isShowJobMenu = false;

    jobs: [Job] = [
        {
            title: 'AI高级算法工程师',
            desc: [
                '研发世界领先的技术，用于聊天机器人各个模块'
            ],
            details: [
                '博士毕业（NLP专业）',
                '对自然语言处理技术，有浓厚兴趣，并有自己独创的技术',
                '熟练掌握Java和Python',
                '有两年以上用Java或Python开发自然语言处理系统的经验（包括博士在读期间）',
                '熟悉Linux系统环境下的开发'
            ]
        },

        {
            title: '算法工程师',
            desc: [
                '在技术负责人的指导下，开发，测试聊天机器人引擎的各个模块'
            ],
            details: [
                '本科以上学历（计算机，数学专业优先）',
                '对自然语言处理技术，有浓厚兴趣，并有一定的了解，乐于学习新知识，新技术',
                '熟练掌握Java和Python',
                '有两年以上用Java或Python开发自然语言处理系统的经验（或硕士NLP专业），熟悉Linux系统环境下的开发'
            ]
        },
        {
            title: '算法助理工程师',
            desc: [
                '在技术负责人的指导下，开发，测试聊天机器人引擎的各个模块'
            ],
            details: [
                '本科以上学历（计算机，数学专业优先）',
                '对自然语言处理技术，有浓厚兴趣，并有一定的了解，乐于学习新知识，新技术',
                '熟练掌握Java和Python',
                '有两年以上用Java或Python的开发经验，熟悉Linux系统环境下的开发（硕士应届毕业生也可以）'
            ]
        },
        {
            title: 'UI开发工程师',
            desc: [
                '聊天机器人引擎UI的设计，开发'
            ],
            details: [
                '本科以上学历（计算机，数学专业优先）',
                '对聊天机器人，人工智能，有浓厚兴趣，乐于学习新知识，新技术',
                '有3年以上UI设计开发经验'
            ]
        },
        {
            title: '产品经理',
            desc: [
                '聊天机器人引擎市场策划，UI的功能设计',
                '聊天机器人引擎的测试',
                '聊天机器人引擎核心知识库编辑',
                '产品文档（在线文档和PPT）的编写（中英文）',
                '与编辑部门和市场部门协作，并做培训'
            ],
            details: [
                '本科以上学历（理工科专业优先），英语六级以上（或者通过面试现场翻译测试）',
                '对聊天机器人，人工智能，有浓厚兴趣，乐于学习新知识，新技术',
                '有3年以上的市场策划或产品经理的工作经验'
            ]
        },
        {
            title: '产品助理',
            desc: [
                '聊天机器人引擎的测试',
                '聊天机器人引擎核心知识库编辑',
                '与编辑部门和市场部门协作，并做培训'
            ],
            details: [
                '本科以上学历',
                '对聊天机器人，人工智能，有浓厚兴趣，乐于学习新知识，新技术',
                '有1年以上的市场策划或产品经理的工作经验'
            ]
        }
    ]

    nowJob: Job = this.jobs[this.nowIndex];

    changeJob(index: number) {
        this.nowJob = this.jobs[index];
        this.nowIndex = index;
    }

    hideJobMenu() {
        this.isShowJobMenu = false;
    }

    showJobMenu() {
        this.isShowJobMenu = true;
    }

    clickJobMenu(index: number) {
        this.changeJob(index);
        this.hideJobMenu();
    }

    selectJob() {
        if (this.isShowJobMenu) {
            this.hideJobMenu();
        } else {
            this.showJobMenu();
        }
    }
}
