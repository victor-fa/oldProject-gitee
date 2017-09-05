import { Component } from '@angular/core';

export interface Job {
    title: string;
    desc: string;
    salary: string;
    time: string;
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
            desc: '研发世界领先的技术，用于聊天机器人各个模块',
            salary: '¥25000-¥50000',
            time: '2017.7.31-2017.9.1',
            details: [
                '博士毕业（NLP专业）',
                '对自然语言处理技术，有浓厚兴趣，并有自己独创的技术',
                '熟练掌握Java和Python',
                '有两年以上用Java或Python开发自然语言处理系统的经验（包括博士在读期间）',
                '熟悉Linux系统环境下的开发'
            ]
        },
        {
            title: '网络开发工程师',
            desc: '网络开发工程师',
            salary: '¥20000-¥30000',
            time: '2017.7.31-2017.9.1',
            details: [
                '网络开发工程师',
                '网络开发工程师',
                '网络开发工程师'
            ]
        },
        {
            title: '游戏开发工程师',
            desc: '游戏开发工程师',
            salary: '¥21000-¥52000',
            time: '2017.7.31-2017.9.1',
            details: [
                '游戏开发工程师',
                '游戏开发工程师',
                '游戏开发工程师',
                '游戏开发工程师'
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
