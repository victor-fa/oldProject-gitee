/**
 * 统一管理后端API URL
 */

/** 用户模块 */
export enum userApiUrls {
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
  /** 角色 */
  roles = '/role',
  /** 管理账号 */
  acc = '/acc',
}

/** 订单模块 */
export enum bookingApiUrls {
  /** 获取全部订单 */
  orderList = '/order/list',
  /** 获取订单详情 */
  orderDetail = '/order/detail',
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
  /** 获取优惠券 */
  couponList = '/couponrule',
  /** 分享 */
  shareList = '/copywriter',
  /** 引导语 */
  guideList = '/guide/management',
  /** 帮助管理 */
  helpList = '/cms/skills',
  /** 语音配置 */
  voiceList = '/cms/asr-configs',
  /** 语音配置 */
  protocolList = '/agreement',
}

/** APP版本 */
export enum appVersionApiUrls {
  /** 获取最新 */
  appVersionList = '/app/version',
  /** 获取打车路径 */
  taxiList = '/monitor/taxi/list',
}

/** 活动管理 */
export enum activityApiUrls {
  /** 活动管理 */
  activityList = '/actrule',
  /** 发放管理 */
  batchsendList = '/pushrule',
}

/** 数据中心模块 */
export enum dataCenterApiUrls {
  /** 获取全部内容 */
  dataCenterList = '/dataCenter',
}

/** 运营模块 */
export enum operateApiUrls {
  /** 重置送豆 */
  xiaowubeanList = '/wallet/promotions',
}
