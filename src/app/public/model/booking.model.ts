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
