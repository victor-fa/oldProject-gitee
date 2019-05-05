/** 登录账号 */
export interface ILoginItemInput {
  userName: string;
  password: string;
}

export class LoginItemInput implements ILoginItemInput {
  userName: string;
  password: string;
}
