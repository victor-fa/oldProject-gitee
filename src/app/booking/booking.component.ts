import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { ModifyBookingInput, SearchBookingInput } from '../public/model/booking.model';
import { BookingService } from '../public/service/booking.service';
import { CommonService } from '../public/service/common.service';
import { Router } from '@angular/router';
registerLocaleData(zh);

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  data = [];
  dataDetail = [];
  dataOrder = {};
  displayData = [];
  allChecked = false;
  indeterminate = false;
  isBookingDetailVisible = false;
  isExternalDetailVisible = false;
  isModifyVisible = false;
  isInvoiceVisible = false;
  orderId = '';
  orderStatus = '';
  searchForm: FormGroup;  // 查询表单
  searchItem = new SearchBookingInput();
  modifyForm: FormGroup;  // 修改表单
  modifyItem = new ModifyBookingInput();
  isFlightOrder = false;
  isHotelOrder = false;
  isTrainOrder = false;
  lastId = 0;
  firstId = 0;
  total = 0;
  allSize = 0;
  changePage = 1;
  doLast = false;
  doFirst = false;
  pageSize = 10;
  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private datePipe: DatePipe,
    private modalService: NzModalService,
    private bookingService: BookingService,
    private notification: NzNotificationService,
    private _router: Router,
  ) {
    this.commonService.nav[0].active = true;
    this._initSearchForm();
    this._initModifyForm();
  }

  ngOnInit() {
    this.loadData();
  }

  /**
   * 查询全部
   */
  private loadData(): void {
    let id = 0;
    let flag = '';
    if (this.doLast) {
      id = this.lastId;
      flag = 'last';
    }
    if (this.doFirst) {
      id = this.firstId;
      flag = 'first';
    }
    this.bookingService.getBookingList(this.pageSize, flag, id).subscribe(res => {
      if (res.retcode === 0) {
        if (res.payload !== '') {
          this.data = JSON.parse(res.payload);
          this.dataOrder = JSON.parse(res.payload).orders;
          this.total = JSON.parse(res.payload).total;
          this.allSize = JSON.parse(res.payload).allSize;
          this.firstId = JSON.parse(res.payload).orders[0].id;  // 最前面的userId
          this.lastId = JSON.parse(res.payload).orders[JSON.parse(res.payload).orders.length - 1].id;  // 最后面的userId
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
        this._router.navigate(['/login']);
      } else {
        this.modalService.confirm({
          nzTitle: '提示',
          nzContent: res.message
        });
      }
    });
    this.doLast = false;
    this.doFirst = false;
  }

  /* 加载信息 */
  private loadDataByKey(sortType, sortKey): void {
    let id = 0;
    let flag = '';
    if (this.doLast) {
      id = this.lastId;
      flag = 'last';
    }
    if (this.doFirst) {
      id = this.firstId;
      flag = 'first';
    }
    this.bookingService.getBookingList(this.pageSize, flag, id, sortType, sortKey).subscribe(res => {
      if (res.retcode === 0) {
        if (res.payload !== '') {
          this.data = JSON.parse(res.payload);
          this.dataOrder = JSON.parse(res.payload).orders;
          this.total = JSON.parse(res.payload).total;
          this.allSize = JSON.parse(res.payload).allSize;
          this.firstId = JSON.parse(res.payload).orders[0].id;  // 最前面的userId
          this.lastId = JSON.parse(res.payload).orders[JSON.parse(res.payload).orders.length - 1].id;  // 最后面的userId
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
        this._router.navigate(['/login']);
      } else {
        this.modalService.confirm({
          nzTitle: '提示',
          nzContent: res.message
        });
      }
    });
    this.doLast = false;
    this.doFirst = false;
  }

  /**
   * 上一页
   */
  lastPage(): void {
    this.changePage -= 1;
    this.doFirst = true;
    this.doSearch();
  }

  /**
   * 下一页
   */
  nextPage(): void {
    this.changePage += 1;
    this.doLast = true;
    this.doSearch();
  }

  doSearch() {
    this.searchItem.date = this.datePipe.transform(this.searchForm.controls['date'].value, 'yyyy-MM-dd');
    this.searchItem.type = this.searchForm.controls['type'].value;
    this.searchItem.status = this.searchForm.controls['status'].value;
    this.searchItem.orderId = this.searchForm.controls['orderId'].value;
    if ((this.searchItem.date === '' || this.searchItem.date === null) && this.searchItem.type === ''
        && this.searchItem.status === '' && this.searchItem.orderId === '') {
      this.loadData();
    } else if ((this.searchItem.date !== '' || this.searchItem.date !== null) && this.searchItem.type === ''
        && this.searchItem.status === '' && this.searchItem.orderId === '') {
      this.loadDataByKey('createTime', this.searchItem.date);
    } else if ((this.searchItem.date === '' || this.searchItem.date === null) && this.searchItem.type !== ''
        && this.searchItem.status === '' && this.searchItem.orderId === '') {
      this.loadDataByKey('orderType', this.searchItem.type);
    } else if ((this.searchItem.date === '' || this.searchItem.date === null) && this.searchItem.type === ''
        && this.searchItem.status !== '' && this.searchItem.orderId === '') {
      this.loadDataByKey('state', this.searchItem.status);
    } else if ((this.searchItem.date === '' || this.searchItem.date === null) && this.searchItem.type === ''
        && this.searchItem.status === '' && this.searchItem.orderId !== '') {
      this.loadDataByKey('id', this.searchItem.orderId);
    } else {
      this.modalService.confirm({
        nzTitle: '提示',
        nzContent: '查询条件只能选一个查询'
      });
    }
  }

  private _initSearchForm(): void {
    this.searchForm = this.fb.group({
      date: [''],
      type: [''],
      status: [''],
      orderId: [''],
    });
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
        this._router.navigate(['/login']);
      } else {
        this.modalService.confirm({
          nzTitle: '提示',
          nzContent: res.message
        });
      }
    });
    this.isBookingDetailVisible = true;
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
        this._router.navigate(['/login']);
      } else {
        this.modalService.confirm({
          nzTitle: '提示',
          nzContent: res.message
        });
      }
    });
    this.isExternalDetailVisible = true;
  }

  getRefund(refund): string {
    return refund = true ? '是' : '否' ;
  }

  getAllowed(allowed): string {
    return allowed = true ? '可以取消' : '不可取消' ;
  }

  getSex(sex): string {
    return sex = 1 ? '男' : '女' ;
  }

  hideBookingDetail(): void {
    this.isBookingDetailVisible = false;
  }

  /* 展示修改弹框 */
  doModify(): void {
    this.bookingService.updateBookingInfo(this.modifyForm.controls['updateType'].value, this.orderId).subscribe(res => {
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
        this._router.navigate(['/login']);
      } else {
        this.modalService.confirm({
          nzTitle: '提示',
          nzContent: res.message
        });
      }
    });
  }

  private _initModifyForm(): void {
    this.modifyForm = this.fb.group({
      updateType: [''],
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
