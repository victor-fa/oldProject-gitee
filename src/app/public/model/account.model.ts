/** 获取全部账号API输出接口 + 登录账号 */
export interface IAccountListItemOutput {
  uid: string;
  userName: number;
  nick: number;
  pwd: number;
  salt: number;
  created: number;
  updated: number;
  roles: string[];
  roleName: string;
  perms: string[];
}

// /** 员工 */
// export interface ICustomerItemInput {
//   userName: string;
//   nick: string;
//   role: string;
//   department: string;
// }

// export class CustomerItem implements ICustomerItemInput {
//   userName: string;
//   nick: string;
//   role: string;
//   department: string;
// }

/** 登录账号 */
export interface ILoginItemInput {
  userName: string;
  password: string;
}

export class LoginItemInput implements ILoginItemInput {
  userName: string;
  password: string;
}

/** 登录账号输出 */
export interface ILoginItemOutput {
  sessionId: string;
  user: LoginUser;
}

export class LoginItemOutput implements ILoginItemOutput {
  sessionId: string;
  user: LoginUser;
}

export interface LoginUser {
  created: string;
  department: string;
  nick: string;
  perms: string[];
  pwdPlaintext: string;
  roles: string[];
  root: boolean;
  uid: string;
  userName: string;
}

