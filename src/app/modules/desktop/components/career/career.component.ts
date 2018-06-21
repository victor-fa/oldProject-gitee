import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

interface JobSingle {
    title: string;
    desc: string[];
    details: string[];
}

interface Job {
    title: string;
    sub: string;
    texts: string[];
    pages: JobSingle[];
}

@Component({
    selector: 'app-career',
    templateUrl: './career.component.html',
    styleUrls: ['./career.component.scss']
})

export class CareerComponent {
    language = 'zh';
    langIndex = 0;
    nowIndex = 0;
    isShowJobMenu = false;

    nowJob: Job;
    nowJobSingle: JobSingle;
    jobs: Job[] = [
        {
            title: '加入齐悟',
            sub: '加入齐悟，创造人工智能的未来。',
            texts: ['职位：', '职位：', '工作职责：', '职位要求：', '如果你对以上任一职位感兴趣，请你提供详细丰富的个人简历，请发送至：'],
            pages: [
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
        },
        {
            title: 'CAREERS',
            sub: 'Join CentaursTech, Build Future AI.',
            texts: ['', '', 'Job Description', 'Responsibilities', 'If you are intersted in any position about, please send your latest resument to '],
            pages: [
                {
                    title: 'Senior AI algorithm engineer',
                    desc: [
                        'Design the most advanced AI module.'
                    ],
                    details: [
                        'Ph.D degree (NLP related)',
                        'Interested in NLP',
                        'Excellent in Java and Python',
                        '2+ years experience with NLP system in Java/Python',
                        'Experience developing on Linux'
                    ]
                },
                {
                    title: 'AI algorithm engineer',
                    desc: [
                        'Develop AI processing algorithm with senior engineer'
                    ],
                    details: [
                        'MS/BS in Computer Science/Maths, related discipline, or comparable experience',
                        'Interested in NLP',
                        'Excellent in Java and Python',
                        '2+ years experience with NLP system in Java/Python',
                        'Experience developing on Linux'
                    ]
                },
                {
                    title: 'Assistant algorithm engineer',
                    desc: [
                        'Help other engineer develop and test AI system'
                    ],
                    details: [
                        'MS/BS in Computer Science/Maths, related discipline, or comparable experience',
                        'Interested in NLP',
                        'Excellent in Java and Python',
                        '1-2 years experience with NLP system in Java/Python',
                        'Experience developing on Linux'
                    ]
                },
                {
                    title: 'UI develop engineer',
                    desc: [
                        'Design UI for Chatbot'
                    ],
                    details: [
                        'MS/BS in Computer Science/Maths, related discipline, or comparable experience',
                        'Interested in AI and robot',
                        '3+ years experience with UI design and develop'
                    ]
                },
                {
                    title: 'Product manager',
                    desc: [
                        'Marketing and design for promotion',
                        'User-end testing of robot',
                        'Implement a product robot',
                        'archiving documents',
                        'training new recruits'
                    ],
                    details: [
                        'Master/Bachelor of Science degree (STEM first)',
                        'Interested in AI and robot',
                        '3+ years in marketing or product management related experience'
                    ]
                },
                {
                    title: 'Product assistant',
                    desc: [
                        'Marketing and design for promotion',
                        'User end testing of robot',
                        'Implement a product robot',
                        'archiving documents',
                        'training new recruits'
                    ],
                    details: [
                        'Master/Bachelor of Science degree (STEM first)',
                        'Interested in AI and robot',
                        '1+ years in marketing or product management related experience'
                    ]
                }
            ]
        }
    ]

    constructor(private cookieService: CookieService) {
        this.language = this.cookieService.get('lang');
        if (this.language === 'en') {
            this.langIndex = 1;
        } else {
            this.langIndex = 0;
        }
        this.nowJob = this.jobs[this.langIndex];
        this.nowJobSingle = this.nowJob.pages[this.nowIndex];
    }

    changeJob(index: number) {
        this.nowJobSingle = this.nowJob.pages[index];
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
