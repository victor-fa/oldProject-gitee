/**
 * 统一管理后端API URL
 */

/** 账号模块 */
export enum userApiUrls {
  /** 获取全部账号 */
  users = '/users',
  /** 登录账号 */
  login = '/users/login',
  /** 获取加密用的盐 */
  publicSalt = '/users/publicSalt',
  /** 登录账号 */
  register = '/users/register',
  /** 登出当前账号 */
  logout = '/users/logout',
  /** 角色 */
  roles = '/roles',
  /** 获取部门下拉 */
  departments = '/users/departments',
}


