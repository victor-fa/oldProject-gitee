/**
 * 统一管理后端API URL
 */

/** 用户模块 */
export enum userApiUrls {
  /** 获取全部账号 */
  users = '/user/userInfo',
  /** 登录账号 */
  login = '/users/login',
  /** 获取加密用的盐 */
  publicSalt = '/users/publicSalt',
  /** 发送伪验证码 */
  sms = '/sms/fake',
}

/** 订单模块 */
export enum bookingApiUrls {
  /** 获取全部订单 */
  orderList = '/order/list',
  /** 获取订单详情 */
  orderDetail = '/order/detail',
}

