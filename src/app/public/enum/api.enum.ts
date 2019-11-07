/**
 * 统一管理后端API URL
 */

/** 用户模块 */
export enum userApiUrls {
  /** 用户管理相关 */
  mgmtList = '/cms/user-mgmt',
  /** 获取全部账号 */
  users = '/user/info',
  /** 获取账号详情 */
  userContact = '/user/contact/list',
  /** 登录账号 */
  login = '/token ',
  /** 获取加密用的盐 */
  publicSalt = '/users/publicSalt',
  /** 发送伪验证码 */
  sms = '/sms/fake',
  /** 登录账号 */
  register = '/users/register',
  /** 登出当前账号 */
  logout = '/users/logout',
  /** 获取全部订单 */
  orderList = '/order/list',
  /** 获取订单详情 */
  orderDetail = '/order/detail',
  /** 数据调整 */
  adjustList = '/cms/adjusters',
}

/** 内容模块 */
export enum cmsApiUrls {
  /** 获取全部内容 */
  contentList = '/cms/notices',
  /** 获取首屏 */
  screenList = '/cms/start-page-ads',
  /** 获取弹框 */
  openList = '/cms/main-page-ads',
  /** 获取cms */
  bannerList = '/cms/banner-ads',
  /** 个人中心 */
  personalList = '/personal/center/advertising',
}

/** APP版本 */
export enum appVersionApiUrls {
  /** 获取最新 */
  appVersionList = '/app/version',
  /** 分享 */
  shareList = '/copywriter',
  /** 引导语 */
  guideList = '/guide/management',
  /** 帮助管理 */
  helpList = '/cms/skills',
  /** 协议管理 */
  protocolList = '/agreement',
  /** 流程点引导 */
  flowpointList = '/guide/bottom',
  /** 客服QQ */
  qqCustomerList = '/contact_qq',
  /** 任务模块 */
  taskList = '/tasks',
  /** 任务模块 */
  captcha = '/tasks/captcha',
  /** 任务重置 */
  reset = '/tasks/reset',
}

/** 客服中心 */
export enum customerApiUrls {
  /** 开票管理 */
  invoiceList = '/order/invoice/manager',
}

/** 客户中心 */
export enum consumerApiUrls {
  /** 客户管理 */
  consumerList = '/customer/channel',
  /** 客户管理 序列号批次 */
  serialBatch = '/guest/key-groups',
  /** 客户管理 对接凭证 */
  voucher = '/channel/account',
  /** 客户管理 短信通知 */
  sms = '/channel/sms',
  /** 客户管理 短信通知 */
  callback = '/callback/url',
  /** 客户管理 音频管理 */
  musicList = '/priority/music',
}

/** 运维后台 */
export enum operatenApiUrls {
  /** 获取打车路径 */
  taxiList = '/monitor/taxi/list',
  /** 获取订单状态监控路径 */
  orderStateList = '/order/alert',
  /** 获取订单状态设置 */
  orderStateSettingList = '/order/monitor',
  /** 语音配置 */
  voiceList = '/cms/asr-configs',
  /** 白名单管理 */
  whiteListList = '/white-list/members',
  /** 获取短信 */
  sendMsg = '/white-list/captcha'
}

/** 活动管理 */
export enum activityApiUrls {
  /** 活动管理 */
  activityList = '/actrule',
  /** 发放管理 */
  batchsendList = '/pushrule',
  /** 获取优惠券 */
  couponList = '/couponrule',
  /** 重置送豆 */
  xiaowubeanList = '/wallet/promotions',
  /** 优惠券统计 */
  actdatasList = '/actdatas',

}

/** 数据中心模块 */
export enum dataCenterApiUrls {
  /** 获取全部内容 */
  dataCenterList = '/dataCenter',
}

/** 对话分析 */
export enum sessionAnalysisApiUrls {
  /** 对话日志 */
  sessionLogList = '/chat-logs',
  /** 特殊用户 */
  categoriesList = '/chat-logs/categories',
  /** 特殊用户 */
  specialUserList = '/chat-logs/special-users',
}

/** 权限后台 */
export enum accountApiUrls {
  /** 角色 */
  roles = '/role',
  /** 员工 */
  acc = '/acc',
  /** 操作日志 */
  audit = '/audit/list',
  /** 导航页配置 */
  navConfig = '/shortcut/categories',
}

/** 新闻词库 */
export enum newsApiUrls {
  /** 新闻词库 */
  newsList = '/news/word-sets',
  /** 新闻词库 */
  newsWordList = '/news/words',
  /** 新闻NER */
  nerList = '/v2/ner/feeder',
  /** 新闻NER测试 */
  nerTest = '/v2/ner/test',
}

/** 回归工具 */
export enum regressionApiUrls {
  /** 数据 */
  dataList = '/regression/word-sets',
  /** 模板创建 */
  createTemplateList = '/regression/word-sets',
  /** 任务创建 */
  taskList = '/regression/word-sets',
  /** 模板库 */
  templateList = '/regression/word-sets',
}

/** 开放平台 */
export enum platformApiUrls {
  /** 技术文档 */
  categoryList = '/docs/category',
  /** 客户账号 */
  userList = '/docs/user',
}

/** 交游天下 */
export enum jiaoyouApiUrls {
  /** 免费配置 */
  freeList = '/skill/channel',
  /** 付费配置 */
  payList = '/skill',
  /** 付费技能 */
  typeList = '/skill/type',
}
