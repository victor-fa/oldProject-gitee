import { Component, OnInit, HostListener } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

interface ProductSingleCase {
    h: string[];
    p: string[];
    img: string[];
    video: string[];
    link: {
        ref: string;
        name: string;
    }[];
}

interface ProductSingle {
    title: string;
    sub: string;
    desc: [string];
    case: ProductSingleCase[];
    name: string;
    icon: string;
}

interface Product {
    title: string;
    sub: string;
    pages: ProductSingle[];
}

@Component({
    selector: 'app-prod-m',
    templateUrl: './product-m.component.html',
    styleUrls: ['./product-m.component.scss']
})

export class ProductMComponent implements OnInit {
    language = 'zh';
    langIndex = 0;
    nowIndex = 0;

    nowProd: Product;
    nowProdSingle: ProductSingle;
    products: [Product] = [
        {
            title: '产品方案',
            sub: '提供的是垂直领域最智能的语义识别技术，同时根据客户的需求去提供完全定制化的解决方案。',
            pages: [
                {
                    title: '智能金融',
                    sub: '基于算法，精准匹配用户与资产，智能控制风险识别，齐悟智能投顾让金融投资更精细更轻松。',
                    desc: [
                        '人工智能的飞速发展，使得机器人能够在一定程度上模拟人的功能，批量且更个性化地服务客户。对于金融业而言，在前端可以使服务更加个性化，提升客户体验；在中端可以支持各类金融交易和分析中的决策，使决策更加智能化；在后端用于风险识别和防控，使管理更加精细化。齐悟技术结合智能金融能在金融领域多方面的结合，应用场景包括了智能投顾，基于大数据和算法能力，对用户与资产信息进行标签化，精准匹配用户与资产，让投资小白也可以轻松投资，同时也更能针对大户专属投资者有更精准专业的投资建议。同时更能结合齐悟的语音交互产品优势，基于自然语言处理能力和语音识别能力，在智能客服领域的深度和广度，大幅降低服务成本，提升服务体验。智能金融将会为金融行业的变革带来一场新的浪潮，齐悟将在成为这个变革中的行业领军产品提供商。'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/fin.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: '智能金融',
                    icon: '/assets/img/product_icons/money_w.png'
                },
                {
                    title: '智能助手',
                    sub: '提供可交互的友好虚拟助手，使新用户快速了解玩法，提高游戏的留存率。',
                    desc: [
                        '在工作中有许多要处理的行政业务，家庭生活中有许多细小琐事要操心。此时你就需要一个“智能助手”来帮你记住那些琐碎繁杂小事，同时又能帮你做到贴身私人秘书，处理订机票订酒店叫外卖整个生活工作方面照顾的妥妥帖贴。齐悟的核心技术“记忆，理解，推理”能够理解负责长句，并且从中判断出复杂的逻辑关系，将用户的需求记住并且能够推理出用户的真正意图，从而解决实际的问题。让你随时随地有最贴心的助手帮你解决实际需要，让你不再为生活琐事烦心，不再错过任何工作上的重要事项。'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/helper_cn.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: '智能助手',
                    icon: '/assets/img/product_icons/helper_w.png'
                },
                {
                    title: '智慧医疗',
                    sub: '新一代智慧医生“中国版Watson”，让“看病难”“看病贵”成为历史。',
                    desc: [
                        '随着社会大众对于健康越发重视，大众对于高效看病的迫切需要。齐悟与广州著名的甲状腺诊断专家平台“医和你”一起合力打造了共享医疗服务平台的智能问诊系统，为解决时下医疗行业的痛点提供了优化解决方案。病人可以通过与齐悟机器人的医疗助手一问一答交互过程中，进行了初步的健康筛查。结合齐悟的算法技术优势，可以通过在封闭性对话中有效信息的筛选，最终获取有效信息匹配用户的提问。齐悟可以做到如同人脑般的逻辑处理-包括记忆，理解，推理，问答的几个过程。针对客户的技术需求，齐悟可以将语音交互过程中收集大量有效信息，能有效的解决医院就医难，病患不知道该如何匹配合适的医生等问题。',
                        '智能问诊系统将对病患的初步问诊以及日常家庭健康的监控有着非常关键的价值以及深远影响。会实际的解决当前医患关系紧张，有效缓解医院的就诊压力以及给医生提供更有针对性的医疗数据去解决患者的需求。'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/medical_cn.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: '智慧医疗',
                    icon: 'assets/img/product_icons/doctor_w.png'
                },
                {
                    title: '智慧教育',
                    sub: '与知名教育机构合作，语音交互+互动游戏，更加精准地解决学习难题，提高学习效率。',
                    desc: [
                        '跟国内顶级的英语教育机构合作，利用线上线下资源相互结合，将目前学生在学习中遇到的痛点“学习无聊，重复做题却得不到有效提高”找到有效解决方法。通过齐悟语音交互技术，可以让学生通过跟网络教师24小时随时随地学最正宗的英文发音，练习英文对话不在费力。同时还可以通过齐悟打造的“智能教师”给学生量身定制专属教学方案，通过集中演练错题重点击破薄弱环节，让学习英语不再依靠题海战术，而是有针对性的教学，学习效率大大提高。同时还可以通过开发寓教于乐的教学小游戏，让学生在玩中轻松学英语，英语学习不再枯燥乏味。智慧教育将会给教学学习两方都带来全新的体验，学习不再是一件枯燥累人的事情，寓教于乐，教学相长。'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/edu_1.jpg',
                                '/assets/img/product_cases/edu_2.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: '智慧教育',
                    icon: '/assets/img/product_icons/edu_w.png'
                },
                {
                    title: '智慧政务',
                    sub: '与政府机关合作，智能机器人处理政务，真正服务广大人民。',
                    desc: [
                        '我们与政府机关的合作，通过我们的语音交互解决方案可以与政府的便民服务系统相衔接，从而做到用语音解决便民资讯咨询，相关档案历史问题查询以及政务资讯交流等。这样可以大大减轻政府部门在政务处理方面的行政压力，从而可以辅助政府机关的形象建设，同时也可以大大提高政府部门的办理业务效率，真正做到服务于民。'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/gov.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: '智慧政务',
                    icon: '/assets/img/product_icons/gov_w.png'
                },
                {
                    title: '智能汽车',
                    sub: '语音交互让开车出行更安全更放心更轻松，齐悟智能车载系统为您保驾护航。',
                    desc: [
                        '如今随着人工智能的不断发展，智能汽车时代已然出现了，随着互联网公司推动以及传统车企也跟上了革新的步伐，纷纷推出专属智能互联系统，它们的出现将会让车主的用车生活变得更加轻松、简单。语音交互会将是智能车载系统的技术核心，让车主在开车时能轻松用语音完成一系列的操作，同时还兼顾了行车安全。齐悟的核心技术优势可以结合市面上已有的车载系统，用语音搜索行程路线，用语音操控车内设备，同时还能运用我们的核心结束语义理解为您定制行程，查询目的地天气状况，甚至为您保驾护航，在意外发生时可以报修拖车，保险理赔等。提升语音交互的应用体验感，让齐悟帮车主解决一切行车中遇到的问题。可以轻松地驾驭爱车，去到想去的地方。也同时让汽车行业相关的企业可以通过齐悟收集的行业相关数据进行分析，最终获取更多更精准的用户需求信息和数据，从而可以打造出独一无二的产品，提升产品的认知度和差异性。'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/auto.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: '智能汽车',
                    icon: '/assets/img/product_icons/car_w.png'
                },
                {
                    title: '智能客服',
                    sub: '量身定制7*24小时智能客服，飞速响应，降低80%人力成本。',
                    desc: [
                        '齐悟与全国最大的游戏发行商一起展开了针对智能客服方面的合作。结合了齐悟的核心技术优势以及乐逗游戏客服需求，合力打造了一个满足客户定制化需求的技术解决方案。这个智能客服将根据客户需求可以放入不同的通用入口，比如微信公众号，线上平台以及电话客服。这个技术解决方案展现了我们的技术亮点主要在于我们前期可以不需要通过数据收集，标记等一系列的复杂过程，只需要客户提供客服运作的标准流程以及需求，齐悟通过运用核心算法技术将用户讲的一句话变成一个“知识表达模型”从而进行模糊匹配，相比一般的关键字匹配更加精准智能的理解用户的问题，最终给出用户需要的解答。后期齐悟将通过机器学习来不断优化整个客服系统的智能化，与此同时，也将收集有用的用户数据去解决用户更深层的客服需求。',
                        '智能客服将为合作企业大大降低客服成本，并且能够满足全天候无间断的客服需求，让用户有更好的客服体验感，从而大大提高用户忠诚度以及提升企业的核心价值竞争力。这也是体现了齐悟的核心目标——为企业创造更多的价值，最终实现双方合作的共赢。'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/customer_cn.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: '智能客服',
                    icon: '/assets/img/product_icons/cservice_w.png'
                },
                {
                    title: '智能硬件',
                    sub: '深度定制硬件模组，满足全套语音交互硬件需求。',
                    desc: [
                        '能够根据客户的需求深度定制专属的硬件模组，能够兼容市面上一般的软件或硬件系统，更能融合齐悟的技术优势与硬件的结合，让语音交互不仅仅是在软件嵌入的层面的应用，更有硬件方面的技术支持与结合。这样更能满足客户的需求与是市场的发展，能够结合各方优势来展现产品的特色与差异化体现。'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/hardware_1.jpg',
                                '/assets/img/product_cases/hardware_2_cn.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: '智能硬件',
                    icon: '/assets/img/product_icons/hard_w.png'
                },
                {
                    title: '智能家居',
                    sub: '打造一个全智能家庭，让你住的更舒服，温馨智慧家的感觉。',
                    desc: [
                        '现代人对已家居的舒适追求日益见增，家居的智能化已经开始深入人们的生活，让更多人可以在家享受舒适的生活同时通过智能化来提升生活水准。随着生活节奏的加快，智能家具系统将把信息多元化和安全更融入到日常的生活中。让使用者拥有舒适的居住环境的同时也为他们节省宝贵的时间。更能提高家中能源的转化率。齐悟智能家居控制系统是以家居住宅楼智能控制为核心，依托云服务平台，利用互联网技术，网络通信技术，安全防范技术，自动控制技术以及结合我们的语音交互核心技术与家庭生活相关的设施集成，构建高效的住宅设施与家庭日程事务的管理系统。全方位的信息交换功能，优化了人们的生活方式和居住环境，帮助用户有效的安排时间，节约各种能源，实现家电，照明，窗帘，门禁，监控防盗设备的本地和远程控制。构造个全智能，智慧化的家居空间。'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/home.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: '智能家居',
                    icon: '/assets/img/product_icons/apt_w.png'
                },
                {
                    title: '智能机器人',
                    sub: '可以根据客户需求，提供整套的软硬件解决方案，量身打造机器人。',
                    desc: [
                        '“齐悟”的技术优势就是做机器人的大脑，让机器人能正常与人类交流。所以智能机器人的产品就是让我们的技术优势体现在载体上，能有多元的展现形式，同时能让我们的客户体验了到智能化更为实际的应用。智能机器人能用于家庭陪护，儿童养成类教育等方面，能让机器人融入现代家庭生活中，成为我们生活中最好的生活帮手。'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/robot_1.jpg',
                                '/assets/img/product_cases/robot_2.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: '智能机器人',
                    icon: '/assets/img/product_icons/robot_w.png'
                },
                {
                    title: '智能旅游',
                    sub: '齐悟量身订造专属的旅游规划，AR+VR体验感更有趣，从此旅行更加贴心好玩。',
                    desc: [
                        '随着传统旅游业的转型需求，智能旅游成为了一个新的行业转折点。智能旅游是基于云计算、物联网等新技术，通过互联网，借助便携设备，主动感知旅游资源、旅游经济、旅游活动、旅游者等方面的信息。齐悟的语音交互技术解决方案能带给智慧旅游一个全新的交互方式，不再需要通过网络各种搜寻，可以让用户用语音提出需求，齐悟机器人自主分析客户的需要，提供最有效的旅游资讯，同时还能根据用户的需求，去为您量身打造合适的旅游路线规划，同时根据过往用户习惯帮你预定机票，酒店。还可以结合VR以及AR技术，让旅游更充满科技现代感与趣味体验感。同时旅游行业上下游企业可以通过齐悟收集到的信息去更精准的分析用户习惯以及掌握用户的爱好设计出更加人性化，个性化的旅游产品。从而让传统的旅游企业可以打破传统的行业瓶颈，给用户打造更加细分化“导航”“导游”“导览”“导购”等一条龙服务。智慧旅游将是从传统的旅游消费方式向现代的旅游消费方式转变的“推手”。虽然旅游消费的内容还是传统的吃住行游购娱，但是我们可以通过人工智能的技术优势去广泛实现消费模式向新型态的转变。'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/trip.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: '智能旅游',
                    icon: '/assets/img/product_icons/travel_w.png'
                },
                {
                    title: '智能法律',
                    sub: '齐悟法律助手让法律咨询更加精准高效，准确记录卷宗案件归档查阅，专业服务值得信赖。',
                    desc: [
                        '法律行业从业员每天都面临着大量的文件，卷宗整理归档查阅，法律条文条规案件咨询等。大量重复而又繁琐的工作耗时费力。随着人工智能的技术不断迭代，机器人可以协助法律人士处理相关业务已经十分必要了，齐悟的语音交互技术优势将让这个问询业务变得简单，我们可以在知识库编辑上法律知识逻辑，精准地证明可用于扫描和预测什么样的文档能够与一宗案件相关，从而大大降低了人力搜索卷宗的时间成本，同时能快速的匹配相关案例文档，为律师高效执业提供了更多的方便。同时还可以把齐悟的多轮对话技术应用到法律机器人，用来解答许多法律方面的问询，节省了咨询的人力成本，同时能精准根据问题找到相关的答案，提供给客户更专业的服务。同时法务机器人还可以结合齐悟的记忆理解技术优势，在法庭上协助法庭速记员，更加准确的记录法庭案件审理的全过程，并且准确归档便于以后查阅调用。人工智能时代下法律行业将会迎来一次全新的变革，而齐悟将见证着这一历史的改写。'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/law.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: '智能法律',
                    icon: '/assets/img/product_icons/law_w.png'
                },
                {
                    title: '语音游戏',
                    sub: '炫酷好玩的语音类游戏，提供全套技术解决方案，获得海量的玩家数据。',
                    desc: [
                        '由我们独家研发的全球首款声控格斗游戏“声动战士”。用声音来控制游戏中的角色的动作，让玩家在游戏中解放双手，全程用语音来操控，将大大提高游戏参与感和体验感。让游戏不再是手指间的互动，更能是让你用声音来指挥角色来进行战斗，更能点燃玩家在游戏过程中的激情。齐悟的语音识别技术能把语音游戏中最大化的价值凸显出来，同时更能增添游戏中的互动亮点。让游戏跳脱传统的手指操控，让声音帮你赢得游戏中的胜利。声动战士，用声音与你一起战斗！'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/game_vw_01.jpg'],
                            link: [{
                                ref: 'http://vocalwarrior.centaurstech.com/',
                                name: '游戏官网'
                            }],
                            video: []
                        }
                    ],
                    name: '语音游戏',
                    icon: '/assets/img/product_icons/voicegame_w.png'
                },
                {
                    title: '虚拟偶像',
                    sub: '打造能听会说的二次元IP偶像，领跑虚拟直播平台。',
                    desc: [
                        '直播向来都是泛娱乐领域最火热的传播渠道，最有话题性的IP虚拟直播将会把这个热度再升一级，虚拟偶像“醋醋”的出现，是来自音熊联萌以及齐悟智能大脑的完美结合。这个将双方的优势结合，为虚拟IP形象配上了一个智能“大脑”让虚拟偶像活起来。虚拟偶像的展现场景可以是2D或者是3D场面，可以结合直播平台与粉丝互动，来真实演绎专属于粉丝的剧情走向和推动。同时也可以在游戏中加入更多的互动环节，让粉丝来决定主播该怎么玩这个游戏。利用齐悟的多轮对话技术能让粉丝与虚拟偶像的互动更加有趣味性，有更多的互动火花爆发。虚拟偶像的应用场景不仅限于直播平台上的一对多互动，更可以一对一的互动，也可以在游戏场景中与粉丝互动一起娱乐，更充满趣味性和娱乐性。也可以在线上教育中寓教于乐，让学习不再枯燥，同时还大大地降低了家教费用，让您足不出户，随时随地都可以学习。',
                        '虚拟偶像的变现价值具有十分大的潜力，粉丝可以在直播过程中与偶像互动，赠送礼品或者红包。也可以选择付费单聊，与偶像“零距离”接触。更可以通过在直播过程中的广告植入来扩大宣传和产品广告有效性。这将是最大的盈利点来覆盖成本，获得共赢。同时虚拟偶像能够迅速渗入到粉丝的生活各个方面，打造专属IP衍生品将带来二次收益。虚拟偶像将会是二次元的时代的成功产品，齐悟大脑将让虚拟偶像“醋醋”走进现实，走入千万粉丝的心中，为生活创造更多的欢乐，让生活有更多的色彩。'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/vi_cc_01.jpg'],
                            link: [{
                                ref: 'https://www.centaurstech.com/product/cc/',
                                name: 'CC官网'
                            }],
                            video: []
                        }
                    ],
                    name: '虚拟偶像',
                    icon: '/assets/img/product_icons/idol_w.png'
                },
                {
                    title: '动漫交互广告',
                    sub: '人工智能+二次元+广告的结合，与受众语音交互，提升广告转化率和ROI，实现更高品牌价值。',
                    desc: [
                        '广告是最快的资讯信息传播媒介，如何让广告能够更有效的打动人心，达到快速传播的效应？广告传统模式已经不足以打动受众，因为被动的广告销售已经让受众疲于应付。互动广告正好可以打破这个僵局，可以让广告“活”起来。通过与二次元IP或者时下流行的元素结合，我们可以在电梯广告，触摸交互广告屏中投放广告，让广告中的“主角”与观众进行语音互动，通过与“齐悟”的技术优势结合，广告已经不再是传统的单向输出，转为双向互动的广告传播，有效的将信息传递给受众。也可以更好的深入了解客户的想法，通过收集用户数据进行精确的营销，达到良好的市场沟通，针对每个客户的需求，将会把营销顾客的反馈直接给到客户，让广告更有效的传播，大大降低成本。同时也因为广告形式活泼生动，将会广受欢迎，也将为产品快速的打开一个新的传播途径，达到提高宣传效果增加广告转化率，同时提升品牌的建设和良好的竞争力。让品牌形象的科技感大大增加，同时也利用虚拟偶像相比明星代言更有号召力，却相对低廉成本来降低广告投放和制作成本。让广告更贴近生活更融入用户的体验。'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/ad.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: '交互广告',
                    icon: '/assets/img/product_icons/ad_w.png'
                }
            ]
        }, {
            title: 'PRODUCTS',
            sub: 'We provide most intelligent voice recognition technology in the most refined field where customer have high degree of freedom in customization.',
            pages: [
                {
                    title: 'Smart Finance',
                    sub: 'Excels at computation, build the portfolio precisely for you. Hedging risk at all time.',
                    desc: [
                        'Smart finance excels at computation, build the portfolio precisely for each customer. hedging risk at all time. Smart finance can provide better customer experience by making the front end service more customized.'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/fin.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: 'Smart Finance',
                    icon: '/assets/img/product_icons/money_w.png'
                },
                {
                    title: 'Virtual Assistant',
                    sub: 'Interactive virtual assistant for new gamer. It is the best friend of gamers',
                    desc: [
                        'There are so much stuff happens all the time, in home and in office. Now you can let virtual assistant handle this. It will memorize and organize all the agenda while helping you do most of the work. No more hassle on errands.'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/helper_en.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: 'Virtual Assistant',
                    icon: '/assets/img/product_icons/helper_w.png'
                },
                {
                    title: 'Smart Clinic',
                    sub: 'Next-Gen Smart Doctor, “Watson of China”. Ease of use, Ease of access.',
                    desc: [
                        'People have to make appointments and wait for days before actually attending a doctor. we have worked with sever medical experts to build an online medical service and heath counseling system. This system can make a rough diagnosis for the patient and connects to the doctors who can help. All those information is acquired through conversation between Chewbots and the patients.',
                        'The smart clinic can also help monitoring users everyday health information which would be important for the doctor when emergency occurs. This would greatly help the elderly who stay at home most of the time and provide early alert for paramedics.'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/medical_en.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: 'Smart Clinic',
                    icon: 'assets/img/product_icons/doctor_w.png'
                },
                {
                    title: 'Smart Learning',
                    sub: 'Cooperation with teaching institution, voice interaction+interactive gaming. Help to improve learning efficiency.',
                    desc: [
                        'Cooperate with top level english teaching institution in China, Chewbot utilizes both online and offline resources to improve the efficiency of current english education. Using voice interactive and streaming technology, we are able to design a customized private tutor for each individual students. Oral english, the hardest part of all language learning will be cracked down.'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/edu_1.jpg',
                                '/assets/img/product_cases/edu_2.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: 'Smart Learning',
                    icon: '/assets/img/product_icons/edu_w.png'
                },
                {
                    title: 'Smart Government',
                    sub: 'Smart Gov: Cooperating with government agency, improve the usage of government services.',
                    desc: [
                        'Cooperation with local government makes Chewbot a service robot with ability to serve the people. Chewbot is able to make quick search, departments connection and handle issues all thought voice commands.'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/gov.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: 'Smart Gov',
                    icon: '/assets/img/product_icons/gov_w.png'
                },
                {
                    title: 'Smart Driving',
                    sub: 'The voice interactive aid provide a more comfortable driving experience.',
                    desc: [
                        'The voice interactive aid provide a more comfortable driving experience. You only need to enjoy your ride with smart driving, no more road rage, no more tired driving.'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/auto.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: 'Smart Driving',
                    icon: '/assets/img/product_icons/car_w.png'
                },
                {
                    title: 'Smart Service',
                    sub: 'Customized 7/24 customer service robot, high speed, low cost.',
                    desc: [
                        'Chewbot cooperated with the largest game publisher in China. Combine chewbots and the customer service needs. we have built a fully customizable resolution. This smart service have many means to access. Through phone calling, social media, or online chats, we have demonstrated that with only limited time, the service chewbot provided is at least on par if not better as those traditional keywords matching service robot. Chewbot can also progress its learning while taking more and more service to improve its own utilization.',
                        'Smart service will greatly decrease the cost for enterprise and provide 7/24 services at all time. Greatly increase customer satisfaction, with improved user experience.'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/customer_en.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: 'Smart Service',
                    icon: '/assets/img/product_icons/cservice_w.png'
                },
                {
                    title: 'Smart Hardware',
                    sub: 'Highly customizable hardware model. Sufficient for all voice interactive demand.',
                    desc: [
                        'Can be customized as the clients needs, fully compatible with most of the software or hardware on market.'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/hardware_1.jpg',
                                '/assets/img/product_cases/hardware_2_en.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: 'Smart Hardware',
                    icon: '/assets/img/product_icons/hard_w.png'
                },
                {
                    title: 'Smart Home',
                    sub: 'Innovate a whole new smart home. Live comfortably.',
                    desc: [
                        'Now a days, people trying to make more comfortable out of their living. The most effective way of achieving so is to increase the ability of the compliances. we can provide resolution for all manufactures who wishes to make their product the most intelligent and advance. With the ability of voice interaction, cloud computing and utilization improving, Smart compliance will redefine what home really means.'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/home.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: 'Smart Home',
                    icon: '/assets/img/product_icons/apt_w.png'
                },
                {
                    title: 'Smart Robot',
                    sub: 'Based on different client needs, provide complete set of resolution.',
                    desc: [
                        'Chewbot is the brain of a robot who can communicate with human just like another. This robot will be the carrier of our advance technology which features all ability that we can incorporate within. Smart robot will be your best aid at home, best friends of kids and best secretary in office.'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/robot_1.jpg',
                                '/assets/img/product_cases/robot_2.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: 'Smart Robot',
                    icon: '/assets/img/product_icons/robot_w.png'
                },
                {
                    title: 'Smart Travel',
                    sub: 'Chewbot is your personal concierge. From booking to shopping, only build for you.',
                    desc: [
                        'Chewbot is your personal concierge. From booking to shopping, only build for you. We can provide our customer with latest travel news and help the customer planning their trips. We can also make all arrangements just while the customer making the plan.'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/trip.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: 'Smart Travel',
                    icon: '/assets/img/product_icons/travel_w.png'
                },
                {
                    title: 'Smart lawyer',
                    sub: 'Chewrobot law firm aid is able to provide quick reference and archive search. Generating most of the legal documents in seconds.',
                    desc: [
                        'Chewbot law firm aid is able to provide quick reference and archive search. Generating most of the legal documents in seconds.'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/law.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: 'Smart lawyer',
                    icon: '/assets/img/product_icons/law_w.png'
                },
                {
                    title: 'Voice Gaming',
                    sub: 'Use voice to make command in the game. Complete product resolution, large user data.',
                    desc: [
                        'Vocal Warrior, a world first voice controlled mobile game. You can control in game characters with your voice. Free your hands and dive in to this game with all your passion. Fight out others with your own sound.'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/game_vw_01.jpg'],
                            link: [{
                                ref: 'http://vocalwarrior.centaurstech.com/',
                                name: 'Voical Warrior'
                            }],
                            video: []
                        }
                    ],
                    name: 'Voice Gaming',
                    icon: '/assets/img/product_icons/voicegame_w.png'
                },
                {
                    title: 'Virtual Idol',
                    sub: 'Interactive AI with anime character. Can stream on all platform.',
                    desc: [
                        'Online streaming is one of the most potent channel of media now. Once we combine the virtual IP with steaming we can quickly developed a “hot-spot” on the media. Virtual Idol can be either 2D or 3D when live streaming. It can also interactive with viewers on comments, of in game actions and etc.',
                        'Virtual Idol is a high potential product. It can profit from streaming bonus, view counts or interactive advertisements. It will not only help IP holder generate more revenue form its product also increase the products exposure to reinforce the holder’s reputation. The virtual idol broadcasting would no doubt leads the live streaming industry into a new era.'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/vi_cc_01.jpg'],
                            link: [{
                                ref: 'https://www.centaurstech.com/product/cc/',
                                name: ' CC '
                            }],
                            video: []
                        }
                    ],
                    name: 'Virtual Idol',
                    icon: '/assets/img/product_icons/idol_w.png'
                },
                {
                    title: 'Interactive Advertisement',
                    sub: 'AI + Anime + Advertisement, interaction with customer. High ROI, more brand value.',
                    desc: [
                        'Advertisements are everywhere in our life. People feels annoyed by most of them but do rely on the information it provided. Our goal is to make the advertisement strike right into the heart of their target customer. We can combine anime character with live streaming and advertisements together, where audiences can chat or play with the ad. This will greatly enhance the broadcasting effectiveness.'
                    ],
                    case: [
                        {
                            h: [],
                            p: [],
                            img: ['/assets/img/product_cases/ad.jpg'],
                            link: [],
                            video: []
                        }
                    ],
                    name: 'Interactive Ad',
                    icon: '/assets/img/product_icons/ad_w.png'
                }
            ]
        }
    ];

    constructor(private cookieService: CookieService) {
        this.language = this.cookieService.get('lang');
        if (this.language === 'en') {
            this.langIndex = 1;
        } else {
            this.langIndex = 0;
        }
        this.nowProd = this.products[this.langIndex];
        this.nowProdSingle = this.nowProd.pages[this.nowIndex];
    }

    ngOnInit() {
        $('#product-s').hide();
    }

    clickProdItem(index: number): void {
        $('#product-s').show();
        $('#product-m').hide();
        this.clickProdSingleItem(index);
    }

    clickProdSingleItem(index: number): void {
        this.nowProdSingle = this.nowProd.pages[index];
        this.nowIndex = index;
    }

    closeProdSingle() {
        $('#product-m').show();
        $('#product-s').hide();
    }
}
