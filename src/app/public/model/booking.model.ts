/** 获取用户信息 */
export interface IBookingOutput {
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

/** 查询订单列表 */
export class SearchBookingInput {
  date: string;
  type: string;
  status: string;
  orderId: string;
}


/** 修改订单状态 */
export class ModifyBookingInput {
  updateType: string;
}
