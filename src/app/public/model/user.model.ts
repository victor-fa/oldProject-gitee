/** 获取用户信息 */
export interface IUserInfoOutput {
  total: number;
  allSize: number;
  pageSize: number;
  users: IUserInfoItemOutput[] | IUserInfoItemOutput;
}

export interface IUserInfoItemOutput {
  createTime: string;
  nickName: string;
  userPhone: string;
  updateTime: string;
  locked: boolean | string;
  userId: number;
  status: string;
  sentCount: number;
}

/** 查询用户 */
export interface IUserSearchInput {
  userName: string;
  phoneNum: string;
}

export class UserSearchInput implements IUserSearchInput {
  userName: string;
  phoneNum: string;
}

/** 发送短信 */
export class SendMsgInput {
  phoneNum: string;
}

/** 登录账号 */
export interface ILoginItemInput {
  userName: string;
  password: string;
}

export class LoginItemInput implements ILoginItemInput {
  userName: string;
  password: string;
}
