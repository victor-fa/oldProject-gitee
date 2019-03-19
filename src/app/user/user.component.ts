import { registerLocaleData, DatePipe } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { IUserInfoItemOutput, SendMsgInput, UserSearchInput } from '../public/model/user.model';
import { CommonService } from '../public/service/common.service';
import { UserService } from '../public/service/user.service';
import { Router } from '@angular/router';
import { BookingService } from '../public/service/booking.service';
registerLocaleData(zh);

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userData: IUserInfoItemOutput[];
  searchUserForm: FormGroup;  // 查询表单
  searchUserItem = new UserSearchInput();
  userInfoId = '';
  lastUserId = 0;
  firstUserId = 0;
  totalUser = 0;
  allUserSize = 0;
  changeUserPage = 1;
  doLastUser = false;
  doFirstUser = false;
  userPageSize = 10;
  dataDetail = [];
  dataOrder = {};
  displayData = [];
  allChecked = false;
  indeterminate = false;
  isBookingDetailVisible = false;
  isExternalDetailVisible = false;
  isInvoiceVisible = false;
  orderId = '';
  orderStatus = '';
  searchBookingForm: FormGroup;  // 查询表单
  modifyBookingForm: FormGroup;  // 修改表单
  isFlightOrder = false;
  isHotelOrder = false;
  isTrainOrder = false;
  lastBookingId = 0;
  firstBookingId = 0;
  totalBooking = 0;
  allBookingSize = 0;
  changeBookingPage = 1;
  doLastBooking = false;
  doFirstBooking = false;
  bookingPageSize = 10;
  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private modalService: NzModalService,
    private userService: UserService,
    private notification: NzNotificationService,
    private datePipe: DatePipe,
    private bookingService: BookingService,
  ) {
    this.commonService.nav[3].active = true;
    this._initSearchUserForm();
    this._initSearchBookingForm();
    this._initModifyBookingForm();
  }

  ngOnInit() {
    this.loadData('user');
    this.loadData('booking');
  }

  /**
   * 查询全部
   */
  private loadData(flag): void {
    if (flag === 'user') {
      let id = 0;
      let flagPage = '';
      if (this.doLastUser) {
        id = this.lastUserId;
        flagPage = 'last';
      }
      if (this.doFirstUser) {
        id = this.firstUserId;
        flagPage = 'first';
      }
      this.userService.getUserInfoList(this.userPageSize, flagPage, id).subscribe(res => {
        if (res.payload !== '') {
          if (res.status === 200) {
            this.userData = JSON.parse(res.payload).users;
            this.totalUser = JSON.parse(res.payload).total;
            this.allUserSize = JSON.parse(res.payload).allSize;
            this.firstUserId = JSON.parse(res.payload).users[0].userId;  // 最前面的userId
            this.lastUserId = JSON.parse(res.payload).users[JSON.parse(res.payload).users.length - 1].userId;  // 最后面的userId
            this.userData.forEach(item => {
              item.locked === false ? item.locked = '正常' : item.locked = '已拉黑';
            });
          }
        } else if (res.retcode === 10000) {
          this.notification.blank( '提示', '您还没有登录哦！', { nzStyle: { color : 'red' } });
          // this._router.navigate(['/login']);
        } else {
          this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
        }
      });
      this.doLastUser = false;
      this.doFirstUser = false;
    } else if (flag === 'booking') {
      let id = 0;
      let pageFlag = '';
      if (this.doLastBooking) {
        id = this.lastBookingId;
        pageFlag = 'last';
      }
      if (this.doFirstBooking) {
        id = this.firstBookingId;
        pageFlag = 'first';
      }
      this.bookingService.getBookingList(this.bookingPageSize, pageFlag, id).subscribe(res => {
        if (res.retcode === 0) {
          if (res.payload !== '') {
            this.dataOrder = JSON.parse(res.payload).orders;
            this.totalBooking = JSON.parse(res.payload).total;
            this.allBookingSize = JSON.parse(res.payload).allSize;
            this.firstBookingId = JSON.parse(res.payload).orders[0].id;  // 最前面的userId
            this.lastBookingId = JSON.parse(res.payload).orders[JSON.parse(res.payload).orders.length - 1].id;  // 最后面的userId
          }
        } else if (res.retcode === 10000) {
          this.notification.blank(
            '提示',
            '您还没有登录哦！',
            {
              nzStyle: {
                color : 'red'
              }
            }
          );
          // this._router.navigate(['/login']);
        } else {
          this.modalService.confirm({
            nzTitle: '提示',
            nzContent: res.message
          });
        }
      });
      this.doLastBooking = false;
      this.doFirstBooking = false;
    }
  }

  /* 加载信息 */
  private loadDataByKey(state, type, createTime, orderId): void {
    let id = 0;
    let pageFlag = '';
    if (this.doLastBooking) {
      id = this.lastBookingId;
      pageFlag = 'last';
    }
    if (this.doFirstBooking) {
      id = this.firstBookingId;
      pageFlag = 'first';
    }
    this.bookingService.getBookingList(this.bookingPageSize, pageFlag, id, state, type, createTime, orderId).subscribe(res => {
      if (res.retcode === 0) {
        if (res.payload !== '') {
          this.dataOrder = JSON.parse(res.payload).orders;
          this.totalBooking = JSON.parse(res.payload).total;
          this.allBookingSize = JSON.parse(res.payload).allSize;
          this.firstBookingId = JSON.parse(res.payload).orders[0].id;  // 最前面的userId
          this.lastBookingId = JSON.parse(res.payload).orders[JSON.parse(res.payload).orders.length - 1].id;  // 最后面的userId
        }
      } else if (res.retcode === 10000) {
        this.notification.blank(
          '提示', '您还没有登录哦！', { nzStyle: { color : 'red' } }
        );
        // this._router.navigate(['/login']);
      } else {
        this.modalService.confirm({
          nzTitle: '提示',
          nzContent: res.message
        });
      }
    });
    this.doLastBooking = false;
    this.doFirstBooking = false;
  }

  /**
   * 单条件查询单条
   * @param type
   * @param userName
   */
  private loadDataByUserName(type, userName): void {
    let id = 0;
    let flagPage = '';
    if (this.doLastUser) {
      id = this.lastUserId;
      flagPage = 'last';
    }
    if (this.doFirstUser) {
      id = this.firstUserId;
      flagPage = 'first';
    }
    this.userService.getUserInfoListByType(this.userPageSize, flagPage, id, type, userName).subscribe(res => {
      if (res.retcode === 0) {
        if (res.payload !== '') {
          this.userData = [];
          this.userData[0] = JSON.parse(res.payload);
          this.userData[0].locked === false ? this.userData[0].locked = '正常' : this.userData[0].locked = '已拉黑';
        }
      } else if (res.retcode === 10000) {
        this.notification.blank('提示', '您还没有登录哦！', { nzStyle: { color : 'red' } });
        // this._router.navigate(['/login']);
      } else {
        this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
      }
    });
    this.doLastUser = false;
    this.doFirstUser = false;
  }

  /**
   * 上一页
   */
  lastPage(flag): void {
    this.changeUserPage -= 1;
    this.doFirstUser = true;
    this.doSearch(flag);
  }

  /**
   * 下一页
   */
  nextPage(flag): void {
    this.changeUserPage += 1;
    this.doLastUser = true;
    this.doSearch(flag);
  }

  showUserInfo(data): void {
    this.userService.getUserInfo(data.userId).subscribe(res => {
      if (res.retcode === 0) {
        if (res.payload !== '') {
          let forItem = '';
          if (JSON.parse(res.payload).length > 0) {
            for (let i = 0; i < JSON.parse(res.payload).length; i++) {
              forItem += '<br>联系人' +
              (i + 1) + '姓名：' + JSON.parse(res.payload)[i].CName +
              '<br>联系人' + (i + 1) + '证件号：' + JSON.parse(res.payload)[i].IDNumber +
              '<br>联系人' + (i + 1) + '生日年月日：' + JSON.parse(res.payload)[i].birthday +
              '<br>联系人' + (i + 1) + '电话：' + JSON.parse(res.payload)[i].contactPhone +
              '<br>联系人' + (i + 1) + '年龄段：' + this.getAgeType(JSON.parse(res.payload)[i].ageType) +
              '<br>联系人' + (i + 1) + '性别：' + this.getSex(JSON.parse(res.payload)[i].sex) + '<br>';
            }
            this.modalService.info({  nzTitle: '常用联系人', nzContent: forItem });
          } else {
            this.modalService.info({ nzTitle: '提示', nzContent: '当前用户无常用联系人' });
          }
        }
      } else if (res.retcode === 10000) {
        this.notification.blank( '提示', '您还没有登录哦！', { nzStyle: { color : 'red' } });
        // this._router.navigate(['/login']);
      } else {
        this.modalService.info({ nzTitle: '提示', nzContent: res.message });
      }
    });
  }

  getAgeType(ageType): string {
    return ageType === 0 ? '成人' : ageType === 1 ? '儿童' : ageType === 2 ? '婴儿' : '其他';
  }

  getSex(sex): string {
    return sex === 0 ? '男' : '女' ;
  }

  doSearch(flag) {
    if (flag === 'user') {
      this.searchUserItem.userName = this.searchUserForm.controls['userName'].value;
      this.searchUserItem.phoneNum = this.searchUserForm.controls['phoneNum'].value;
      if (this.searchUserItem.userName === '' && this.searchUserItem.phoneNum === '') {
        this.loadData('user');
      } else if (this.searchUserItem.userName !== '' && this.searchUserItem.phoneNum === '') {
        this.loadDataByUserName('infoId', this.searchUserItem.userName);
      } else if (this.searchUserItem.userName === '' && this.searchUserItem.phoneNum !== '') {
        this.loadDataByUserName('phone', this.searchUserItem.phoneNum);
      } else {
        this.modalService.confirm({ nzTitle: '提示', nzContent: '查询条件只能选一个查询' });
      }
    } else if ('booking') {
      const searchBookingItem = {
        'date': this.datePipe.transform(this.searchBookingForm.controls['date'].value, 'yyyy-MM-dd'),
        'type': this.searchBookingForm.controls['type'].value,
        'status': this.searchBookingForm.controls['status'].value,
        'orderId': this.searchBookingForm.controls['orderId'].value
      };
      if ((searchBookingItem.date === '' || searchBookingItem.date === null) && searchBookingItem.type === ''
          && searchBookingItem.status === '' && searchBookingItem.orderId === '') {
        this.loadData('booking');
      } else {
        this.loadDataByKey(searchBookingItem.status, searchBookingItem.type, searchBookingItem.date, searchBookingItem.orderId);
      }
    }
  }

  private _initSearchUserForm(): void {
    this.searchUserForm = this.fb.group({
      userName: [''],
      phoneNum: [''],
    });
  }

  private _initSearchBookingForm(): void {
    this.searchBookingForm = this.fb.group({
      date: [''],
      type: [''],
      status: [''],
      orderId: [''],
    });
  }

  private _initModifyBookingForm(): void {
    this.modifyBookingForm = this.fb.group({
      updateType: [''],
    });
  }

  /* 展示拉入黑名单 */
  showBlacklistModal(data): void {
    this.userInfoId = data.userId;
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: '确定将该用户拉入黑名单吗？',
      nzOkText: '确定',
      nzOnOk: () => this.doBlacklist()
    });
  }

  /* 设为拉黑状态 */
  doBlacklist(): void {
    this.userService.updateUserInfo(this.userInfoId).subscribe(res => {
      if (res.status === 200) {
        setTimeout(() => {
          this.loadData('user');
        }, 1000);
      } else if (res.retcode === 10000) {
        this.notification.blank( '提示', '您还没有登录哦！', { nzStyle: { color : 'red' } } );
        // this._router.navigate(['/login']);
      }
    });
  }

  /*  取消酒店订单 */
  cancleHotelOrder(): void {

  }

  showInvoiceDetail(data): void {
    this.isInvoiceVisible = true;
  }

  hideInvoiceDetail(): void {
    this.isInvoiceVisible = false;
  }

  /* 展示订单详情 */
  showBookingDetail(data): void {
    this.orderId = data.orderId;
    this.orderStatus = data.state;
    this.bookingService.getBookingDetail(0, data.orderId).subscribe(res => {
      if (res.retcode === 0) {
        if (JSON.parse(res.payload).flightOrderReturn) {
          this.dataDetail = JSON.parse(res.payload).flightOrderReturn;
          this.isFlightOrder = true;
          this.isHotelOrder = false;
          this.isTrainOrder = false;
        }
        if (JSON.parse(res.payload).hotelOrder) {
          this.dataDetail = JSON.parse(res.payload).hotelOrder;
          this.isFlightOrder = false;
          this.isHotelOrder = true;
          this.isTrainOrder = false;
        }
        if (JSON.parse(res.payload).trainOrderReturn) {
          this.dataDetail = JSON.parse(res.payload).trainOrderReturn;
          this.isFlightOrder = false;
          this.isHotelOrder = false;
          this.isTrainOrder = true;
        }
      } else if (res.retcode === 10000) {
        this.notification.blank(
          '提示',
          '您还没有登录哦！',
          {
            nzStyle: {
              color : 'red'
            }
          }
        );
        // this._router.navigate(['/login']);
      } else {
        this.modalService.confirm({
          nzTitle: '提示',
          nzContent: res.message
        });
      }
    });
    this.isBookingDetailVisible = true;
  }

  /* 展示供应商订单详情 */
  showExternal(flag, data): void {
    this.bookingService.getBookingDetail(flag, data).subscribe(res => {
      if (res.retcode === 0) {
        let externalDetail = [];
        if (JSON.parse(res.payload).flightOrderReturn) {
          externalDetail = JSON.parse(res.payload).flightOrderReturn;
          let forItem = '';
          for (let i = 0; i < JSON.parse(res.payload).flightOrderReturn.flight_order_passengers.length; i++) {
            forItem = '\'<br>乘客\'' + (i + 1) + '\'姓名：\'' + JSON.parse(res.payload).flightOrderReturn.flight_order_passengers[i].name +
            '\'<br>乘客\'' + (i + 1) + '\'属性：\'' + JSON.parse(res.payload).flightOrderReturn.flight_order_passengers[i].age_type +
            '\'<br>乘客\'' + (i + 1) + '\'生日：\'' + JSON.parse(res.payload).flightOrderReturn.flight_order_passengers[i].birthday +
            '\'<br>乘客\'' + (i + 1) + '\'证件号：\'' + JSON.parse(res.payload).flightOrderReturn.flight_order_passengers[i].card_no +
            '\'<br>乘客\'' + (i + 1) + '\'性别：\'' + this.getSex(JSON.parse(res.payload).flightOrderReturn.flight_order_passengers[i].sex);
          }
          this.notification.blank('供应商订单详情',
            '订单数量：' + JSON.parse(res.payload).flightOrderReturn.amount +
            '<br>目的机场位置：' + JSON.parse(res.payload).flightOrderReturn.arr_airport +
            '<br>目的城市：' + JSON.parse(res.payload).flightOrderReturn.arr_city +
            '<br>到达时间：' + JSON.parse(res.payload).flightOrderReturn.arr_time +
            '<br>机票类型：' + JSON.parse(res.payload).flightOrderReturn.cabin_type +
            '<br>联系人：' + JSON.parse(res.payload).flightOrderReturn.contact +
            '<br>联系人电话：' + JSON.parse(res.payload).flightOrderReturn.contact_mobile +
            '<br>始发机场：' + JSON.parse(res.payload).flightOrderReturn.dept_airport +
            '<br>始发城市：' + JSON.parse(res.payload).flightOrderReturn.dept_city +
            '<br>始发时间：' + JSON.parse(res.payload).flightOrderReturn.dept_time +
            '<br>所在航班：' + JSON.parse(res.payload).flightOrderReturn.flight_com +
            forItem +
            '<br>旅程时间：' + JSON.parse(res.payload).flightOrderReturn.flight_times +
            '<br>航班类型：' + JSON.parse(res.payload).flightOrderReturn.flight_type +
            '<br>企业管家编号：' + JSON.parse(res.payload).flightOrderReturn.no +
            '<br>订单价格：' + JSON.parse(res.payload).flightOrderReturn.order_amount +
            '<br>订单类型：' + JSON.parse(res.payload).flightOrderReturn.order_type +
            '<br>备注：' + JSON.parse(res.payload).flightOrderReturn.order_type,
            { nzDuration: 0 });
        }
        if (JSON.parse(res.payload).hotelOrder) {
          externalDetail = JSON.parse(res.payload).hotelOrder;
          let forItem = '';
          for (let i = 0; i < JSON.parse(res.payload).hotelOrder.customers.length; i++) {
            forItem = '\'<br>入住成员\'' + (i + 1) + '\'：\'' + JSON.parse(res.payload).hotelOrder.customers[i].name;
          }
          this.notification.blank('供应商订单详情',
            '到达时间：' + JSON.parse(res.payload).hotelOrder.arrival_date +
            '<br>是否可取消：' + this.getAllowed(JSON.parse(res.payload).hotelOrder.allowed) +
            '<br>取消说明：' + JSON.parse(res.payload).hotelOrder.cancel_policy.penalty_type_name +
            '<br>取消时限：' + JSON.parse(res.payload).hotelOrder.cancel_policy.time_limit +
            '<br>手续费：' + JSON.parse(res.payload).hotelOrder.hotelOrderReturn.detail.penalty +
            '<br>最晚到达时间：' + JSON.parse(res.payload).hotelOrder.cancel_policy.time_limit +
            '<br>联系人电话：' + JSON.parse(res.payload).hotelOrder.contact_mobile +
            '<br>联系人姓名：' + JSON.parse(res.payload).hotelOrder.contact_name +
            '<br>订单创建时间：' + JSON.parse(res.payload).hotelOrder.createAt +
            forItem +
            '<br>离开时间：' + JSON.parse(res.payload).hotelOrder.departure_date +
            '<br>订单价格：' + JSON.parse(res.payload).hotelOrder.hotelOrderReturn.order_amount +
            '<br>酒店订单编号：' + JSON.parse(res.payload).hotelOrder.hotelOrderReturn.no +
            '<br>酒店订单状态：' + JSON.parse(res.payload).hotelOrder.hotelOrderReturn.state_name +
            '<br>酒店订单创建时间：' + JSON.parse(res.payload).hotelOrder.hotelOrderReturn.created_at +
            '<br>酒店所在城市：' + JSON.parse(res.payload).hotelOrder.hotel_city +
            '<br>酒店编号：' + JSON.parse(res.payload).hotelOrder.hotel_id +
            '<br>酒店名称：' + JSON.parse(res.payload).hotelOrder.hotel_name +
            '<br>酒店评价：' + JSON.parse(res.payload).hotelOrder.hotel_score + '分' +
            '<br>最晚到达时间：' + JSON.parse(res.payload).hotelOrder.latest_arrival_time +
            '<br>房间类型：' + JSON.parse(res.payload).hotelOrder.order_room.bed_type +
            '<br>房间容纳人数：' + JSON.parse(res.payload).hotelOrder.order_room.capacity + '人' +
            '<br>房间小孩人数：' + JSON.parse(res.payload).hotelOrder.order_room.children + '人' +
            '<br>房间是否有早餐：' + JSON.parse(res.payload).hotelOrder.order_room.meal +
            '<br>房间规格：' + JSON.parse(res.payload).hotelOrder.order_room.rate_type_name +
            '<br>房间占地面积：' + JSON.parse(res.payload).hotelOrder.order_room.roomArea +
            '<br>房间特色：' + JSON.parse(res.payload).hotelOrder.order_room.room_type_name +
            '<br>酒店所在区：' + JSON.parse(res.payload).hotelOrder.peripheral_information +
            '<br>预订房间数量：' + JSON.parse(res.payload).hotelOrder.room_nums +
            '<br>信息来源：' + JSON.parse(res.payload).hotelOrder.stars_level + '星级' +
            '<br>酒店星级：' + JSON.parse(res.payload).hotelOrder.source +
            '<br>用户边海鸥：' + JSON.parse(res.payload).hotelOrder.userId,
            { nzDuration: 0 });
        }
        if (JSON.parse(res.payload).trainOrderReturn) {
          externalDetail = JSON.parse(res.payload).trainOrderReturn;
          let forItem = '';
          for (let i = 0; i < JSON.parse(res.payload).trainOrderReturn.service_order.tickets.length; i++) {
            forItem = '\'<br>车票\'' + (i + 1) + '\'退款价：\'' +
             JSON.parse(res.payload).trainOrderReturn.service_order.tickets[i].estimate_refund_price +
            '\'<br>车票\'' + (i + 1) + '\'变更价格：\'' +
             JSON.parse(res.payload).trainOrderReturn.service_order.tickets[i].estimate_refund_service_charge +
            '\'<br>车票\'' + (i + 1) + '\'编号：\'' + JSON.parse(res.payload).trainOrderReturn.service_order.tickets[i].id +
            '\'<br>车票\'' + (i + 1) + '\'价格：\'' + JSON.parse(res.payload).trainOrderReturn.service_order.tickets[i].price +
            '\'<br>车票\'' + (i + 1) + '\'退款费用：\'' + JSON.parse(res.payload).trainOrderReturn.service_order.tickets[i].refund_price +
            '\'<br>车票\'' + (i + 1) + '\'退款服务费：\'' +
             JSON.parse(res.payload).trainOrderReturn.service_order.tickets[i].refund_service_charge +
            '\'<br>车票\'' + (i + 1) + '\'状态：\'' + JSON.parse(res.payload).trainOrderReturn.service_order.tickets[i].state_name +
            '\'<br>乘客\'' + (i + 1) + '\'生日：\'' + JSON.parse(res.payload).trainOrderReturn.service_order.tickets[i].passenger.birthday +
            '\'<br>乘客\'' + (i + 1) + '\'编号：\'' + JSON.parse(res.payload).trainOrderReturn.service_order.tickets[i].passenger.id_no +
            '\'<br>乘客\'' + (i + 1) + '\'身份证：\'' +
             JSON.parse(res.payload).trainOrderReturn.service_order.tickets[i].passenger.id_type_name +
            '\'<br>乘客\'' + (i + 1) + '\'姓名：\'' + JSON.parse(res.payload).trainOrderReturn.service_order.tickets[i].passenger.name +
            '\'<br>乘客\'' + (i + 1) + '\'类型：\'' +
             JSON.parse(res.payload).trainOrderReturn.service_order.tickets[i].passenger.passenger_type_name +
            '\'<br>乘客\'' + (i + 1) + '\'是否退款：\'' +
             this.getRefund(JSON.parse(res.payload).trainOrderReturn.service_order.tickets[i].passenger.refund) +
            '\'<br>乘客\'' + (i + 1) + '\'性别：\'' + JSON.parse(res.payload).trainOrderReturn.service_order.tickets[i].passenger.sex_name;
          }
          this.notification.blank('供应商订单详情',
            '订单创建时间：' + JSON.parse(res.payload).trainOrderReturn.created_at +
            '<br>订单编号：' + this.getAllowed(JSON.parse(res.payload).trainOrderReturn.no) +
            '<br>到达时间：' + JSON.parse(res.payload).trainOrderReturn.service_order.arrival_at +
            '<br>到达城市：' + JSON.parse(res.payload).trainOrderReturn.service_order.arrival_city_name +
            '<br>变更差价：' + JSON.parse(res.payload).trainOrderReturn.service_order.change_price_diff +
            '<br>变更服务价格：' + JSON.parse(res.payload).trainOrderReturn.service_order.change_service_charge +
            '<br>联系人电话：' + JSON.parse(res.payload).trainOrderReturn.service_order.contact_mobile +
            '<br>联系人姓名：' + JSON.parse(res.payload).trainOrderReturn.service_order.contacts +
            '<br>出发时间：' + JSON.parse(res.payload).trainOrderReturn.service_order.departure_at +
            '<br>出发城市：' + JSON.parse(res.payload).trainOrderReturn.service_order.departure_city_name +
            '<br>出发站台：' + JSON.parse(res.payload).trainOrderReturn.service_order.from_station +
            '<br>到达站台：' + JSON.parse(res.payload).trainOrderReturn.service_order.to_station +
            '<br>火车编号：' + JSON.parse(res.payload).trainOrderReturn.service_order.train_no +
            forItem +
            '<br>订单情况：' + JSON.parse(res.payload).trainOrderReturn.state_name,
            { nzDuration: 0 });
        }
      } else if (res.retcode === 10000) {
        this.notification.blank(
          '提示',
          '您还没有登录哦！',
          {
            nzStyle: {
              color : 'red'
            }
          }
        );
        // this._router.navigate(['/login']);
      } else {
        this.modalService.confirm({
          nzTitle: '提示',
          nzContent: res.message
        });
      }
    });
    this.isExternalDetailVisible = true;
  }

  getAllowed(allowed): string {
    return allowed = true ? '可以取消' : '不可取消' ;
  }

  getRefund(refund): string {
    return refund = true ? '是' : '否' ;
  }

  hideBookingDetail(): void {
    this.isBookingDetailVisible = false;
  }

  /* 展示修改弹框 */
  doBookingModify(): void {
    this.bookingService.updateBookingInfo(this.modifyBookingForm.controls['updateType'].value, this.orderId).subscribe(res => {
      if (res.retcode === 0) {
        this.modalService.success({
          nzTitle: '修改成功',
          nzContent: res.message
        });
      } else if (res.retcode === 10000) {
        this.notification.blank(
          '提示',
          '您还没有登录哦！',
          {
            nzStyle: {
              color : 'red'
            }
          }
        );
        // this._router.navigate(['/login']);
      } else {
        this.modalService.confirm({
          nzTitle: '提示',
          nzContent: res.message
        });
      }
    });
  }

  // 主面板分页表单
  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
    this.displayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    const allChecked = this.displayData.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.displayData.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

}
