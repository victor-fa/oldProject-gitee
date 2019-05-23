import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { AdjustService } from '../public/service/adjust.service';
import { BookingService } from '../public/service/booking.service';
import { CommonService } from '../public/service/common.service';
import { InvoiceService } from '../public/service/invoice.service';
import { UserService } from '../public/service/user.service';
registerLocaleData(zh);

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userData = [];
  adjustData = [];
  operatersData = [];
  // tslint:disable-next-line:max-line-length
  adjustDetail = { successNum: 0, failNum: 0, success: '', fail: '', result: {}, all: 0, users: '', noticeTitle: '', noticeAbstract: '', noticeContent: '', adjustReason: '' };
  searchUserForm: FormGroup;  // 查询表单
  userInfoId = '';
  userInfoDetail = [];
  totalUser = 0;
  allUserSize = 0;
  // changeUserPage = 1;
  // doLastUser = false;
  // doFirstUser = false;
  dataDetail = [];
  dataOrder = {};
  displayData = [];
  dataRefund = [];
  allChecked = false;
  indeterminate = false;
  isUserInfoDetailVisible = false;
  isUserInfoCommonVisible = false;
  isInvoiceDetailVisible = false;
  isBookingDetailVisible = false;
  isExternalDetailVisible = false;
  isInvoiceVisible = false;
  isRefundVisible = false;
  isAdjustDetailVisible = false;
  isAdjustAddVisible = false;
  isAdjustSendVisible = false;
  orderId = '';
  orderStatus = '';
  searchBookingForm: FormGroup;  // 查询表单
  modifyBookingForm: FormGroup;  // 修改表单
  addAdjustForm: FormGroup;  // 新增数据调整
  searchRechargeForm: FormGroup;  // 查询充值记录
  searchInvoiceForm: FormGroup; // 查询开票记录
  isFlightOrder = false;
  isHotelOrder = false;
  isTrainOrder = false;
  isTaxiOrder = false;
  isDeliveryOrder = false;
  isPhoneBillOrder = false;
  isConstellationOrder = false;
  lastBookingId = 0;
  firstBookingId = 0;
  totalBooking = 0;
  allBookingSize = 0;
  changeBookingPage = 1;
  doLastBooking = false;
  doFirstBooking = false;
  bookingPageSize = 10;
  currentPanel = 'user';
  refundInfo = { userId: '', orderId: ''};
  refundRadio = '';
  refundSelectArr = [];
  refundSelectName = [];
  invoiceDetail = { invoiceMsg: '' };
  dateSearch = { 'Today': [new Date(), new Date()], 'This Month': [new Date(), new Date()] };
  beginBookingDate = '';
  endBookingDate = '';
  beginAdjustDate = '';
  endAdjustDate = '';
  beginRechargeDate = '';
  endRechargeDate = '';
  beginInvoiceDate = '';
  endInvoiceDate = '';
  begUserRegisterDate = ''; // 用户时间
  endUserRegisterDate = '';
  begUserLoginDate = '';  // 登录时间
  endUserLoginDate = '';
  adjustType = 'ALL';  // 针对查询的类型
  adjustTypeAdd = 'BEAN'; // 针对新增面板的类型
  adjustSendData = {}; // 针对执行发送弹框的展示
  operateObject = { code: '', operater: '' };
  semdMesCodeText = 60;
  currentUserCommonTab = 'TRAVELER';
  invoiceType = '';
  invoiceState = '';
  tabsetJson = { currentNum: 0, param: '' };
  rechargeData = [];
  invoiceData = [];
  invoiceItem = {};
  commonUserId = '';  // 常用信息的用户id
  userInfoCommonData = [];
  rechargePhone = ''; // 用户管理跳充值记录传值
  invoicePhone = ''; // 用户管理跳开票记录传值
  bookingPhone = ''; // 用户管理跳实体服务订单传值
  userLocked = '';  // 用户状态下拉
  bookingType = '';
  isSpinning = false;
  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
      [{ 'size': ['0.26rem', '0.31rem', '0.37rem', '0.41rem', '0.47rem', '0.52rem'] }], // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                         // remove formatting button
      ['link', 'video']                         // link and image, video
    ]
  };
  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    private modalService: NzModalService,
    private userService: UserService,
    private adjustService: AdjustService,
    private invoiceService: InvoiceService,
    private notification: NzNotificationService,
    private datePipe: DatePipe,
    private bookingService: BookingService,
  ) {
    this.commonService.nav[3].active = true;
    this._initForm();
  }

  ngOnInit() {
    this.loadData('user');
  }

  /**
   * 查询全部
   */
  private loadData(flag): void {
    this.isSpinning = true;
    if (flag === 'user') {
      const userInput = { locked: this.userLocked, loginBegin: this.begUserLoginDate,
        loginEnd: this.endUserLoginDate, registerBegin: this.begUserRegisterDate,
        registerEnd: this.endUserRegisterDate,
        phone: this.searchUserForm.controls['phone'].value,
        userId: this.searchUserForm.controls['userId'].value
      };
      this.userService.getUserInfoList(userInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.userData = JSON.parse(res.payload);
          console.log(this.userData);
        } else {
          this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'bookingHypostatic' || flag === 'bookingDigital') {
      setTimeout(() => {
        let id = 0;
        let pageFlag = '';
        if (this.doLastBooking) { id = this.lastBookingId; console.log(this.lastBookingId); pageFlag = 'last'; }  // 下一页
        if (this.doFirstBooking) { id = this.firstBookingId; console.log(this.firstBookingId); pageFlag = 'first'; }  // 上一页
        // tslint:disable-next-line:max-line-length
        const queryType = this.currentPanel === 'bookingHypostatic' ? 'HYPOSTATIC' : this.currentPanel === 'bookingDigital' ? 'DIGITAL' : '';
        this.bookingService.getBookingList(this.bookingPageSize, pageFlag, id, queryType).subscribe(res => {
          if (res.retcode === 0 && res.status === 200) {
            this.isSpinning = false;
            if (res.payload) {
              if (res.payload !== '') {
                const operationInput = { op_category: '用户管理', op_page: '订单查询' , op_name: '访问' };
                this.commonService.updateOperationlog(operationInput).subscribe();
                // tslint:disable-next-line:max-line-length
                this.dataOrder = pageFlag === 'last' || pageFlag === '' ? JSON.parse(res.payload).orders : JSON.parse(res.payload).orders;
                console.log(this.dataOrder);
                this.totalBooking = JSON.parse(res.payload).total;
                this.allBookingSize = JSON.parse(res.payload).allSize;
                if (JSON.parse(res.payload).orders.length > 0) {
                  this.firstBookingId = JSON.parse(res.payload).orders[0].id;  // 最前面的Id
                  this.lastBookingId = JSON.parse(res.payload).orders[JSON.parse(res.payload).orders.length - 1].id;  // 最后面的Id
                }
              }
            }
          } else {
            this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
          }
        });
        this.doLastBooking = false;
        this.doFirstBooking = false;
      }, 500);
    } else if (flag === 'adjust') {
      const adjustInput = {
        adjustType: this.adjustType === 'ALL' ? '' : this.adjustType,
        begin: this.beginAdjustDate,
        end: this.endAdjustDate,
      };
      this.adjustService.getAdjustList(adjustInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          const operationInput = { op_category: '用户管理', op_page: '订单查询' , op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.adjustData = JSON.parse(res.payload).reverse();
          console.log(JSON.parse(res.payload).reverse());
          this.adjustData.forEach(item => {
            item.createTime = item.createTime.replace(/-/g, ':');  // 创建日期格式化
            item.all = Object.keys(item.result).length; // 发放人数
            const fail = [];
            for (let i in item.result) {
              if (item.result[i] === false) { fail.push(i); }
            }
            item.failNum = fail.length; // 失败人数
          });
          console.log(this.adjustData);
        } else {
          this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'operaters') {
      this.adjustService.getOperaters().subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.operatersData.splice(0, this.operatersData.length);
          JSON.parse(res.payload).forEach(item => {
            this.operatersData.push(item.phone);
          });
          this.operateObject.operater = this.operatersData[0];
        } else {
          this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'recharge') {
      const rechargeInput = {
        beginTime: this.beginRechargeDate, endTime: this.endRechargeDate,
        phone: this.searchRechargeForm.controls['phone'].value
      };
      this.invoiceService.getRechargeListForUser(rechargeInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.rechargeData = JSON.parse(res.payload).reverse();
          console.log(this.rechargeData);
        } else {
          this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'invoice') {
      const invoiceInput = {
        createTimeBegin: this.beginInvoiceDate, createTimeEnd: this.endInvoiceDate,
        phone: this.searchInvoiceForm.controls['phone'].value,
        orderType: this.invoiceType, state: this.invoiceState,
      };
      console.log(invoiceInput);
      this.invoiceService.getInvoiceListForUser(invoiceInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          this.invoiceData = JSON.parse(res.payload).reverse();
          console.log(this.invoiceData);
        } else {
          this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'userInfoCommon') {
      const commonInput = { userId: this.commonUserId, queryType: this.currentUserCommonTab, };
      this.userService.getUserCommonInfo(commonInput).subscribe(res => {
        if (res.retcode === 0 && res.status === 200) {
          this.isSpinning = false;
          if (res.payload) {
            if (this.currentUserCommonTab === 'TRAVELER') {
              this.userInfoCommonData = JSON.parse(res.payload).reverse();
            } else if (this.currentUserCommonTab === 'CONTACTS') {
              this.userInfoCommonData = JSON.parse(res.payload).linkmen.reverse();
            } else if (this.currentUserCommonTab === 'DELIVERY_ADDRESS') {
              this.userInfoCommonData = JSON.parse(res.payload).list.reverse();
            } else if (this.currentUserCommonTab === 'TRAVEL_ADDRESS') {
              const result = JSON.parse(res.payload);
              const tempArr = [];
              if (result.home) { tempArr.push({ title: '家', name: result.home.address }); }
              if (result.company) { tempArr.push({ title: '公司', name: result.company.address }); }
              if (result.school) { tempArr.push({ title: '学校', name: result.school.address }); }
              if (result.address_1) { tempArr.push({ title: '地址1', name: result.address_1.address }); }
              if (result.address_2) { tempArr.push({ title: '地址2', name: result.address_2.address }); }
              if (result.address_3) { tempArr.push({ title: '地址3', name: result.address_3.address }); }
              if (result.address_4) { tempArr.push({ title: '地址4', name: result.address_4.address }); }
              this.userInfoCommonData = tempArr;
            } else if (this.currentUserCommonTab === 'INVOICE_TITLE') {
              this.userInfoCommonData = JSON.parse(res.payload).invoiceMsgList.reverse();
            }
            console.log(this.userInfoCommonData);
          }
        } else {
          this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  /* 加载信息 */
  private loadDataByKey(state, type, createTimeBegin, createTimeEnd, orderId, phone): void {
    setTimeout(() => {
      let id = 0;
      let pageFlag = '';
      if (this.doLastBooking) { id = this.lastBookingId; pageFlag = 'last'; }
      if (this.doFirstBooking) { id = this.firstBookingId; pageFlag = 'first'; }
      const queryType = this.currentPanel === 'bookingHypostatic' ? 'HYPOSTATIC' : this.currentPanel === 'bookingDigital' ? 'DIGITAL' : '';
      // tslint:disable-next-line:max-line-length
      this.bookingService.getBookingList(this.bookingPageSize, pageFlag, id, queryType, state, type, createTimeBegin, createTimeEnd, orderId, phone).subscribe(res => {
        if (res.retcode === 0) {
          if (res.payload !== '') {
            const operationInput = { op_category: '用户管理', op_page: '订单查询' , op_name: '访问' };
            this.commonService.updateOperationlog(operationInput).subscribe();
            console.log(JSON.parse(res.payload));
            this.dataOrder = JSON.parse(res.payload).orders;
            this.totalBooking = JSON.parse(res.payload).total;
            this.allBookingSize = JSON.parse(res.payload).allSize;
            if (JSON.parse(res.payload).orders.length > 0) {
              this.firstBookingId = JSON.parse(res.payload).orders[0].id;  // 最前面的userId
              this.lastBookingId = JSON.parse(res.payload).orders[JSON.parse(res.payload).orders.length - 1].id;  // 最后面的userId
            }
          }
        } else {
          this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
        }
      });
      this.doLastBooking = false;
      this.doFirstBooking = false;
    }, 500);
  }

  /**
   * 上一页
   */
  lastPage(flag): void {
    this.changeBookingPage -= 1;
    this.doFirstBooking = true;
    this.doSearch(flag);
  }

  /**
   * 下一页
   */
  nextPage(flag): void {
    this.changeBookingPage += 1;
    this.doLastBooking = true;
    this.doSearch(flag);
  }


  getAgeType(ageType): string {
    return ageType === 0 ? '成人' : ageType === 1 ? '儿童' : ageType === 2 ? '婴儿' : '其他';
  }

  getSex(sex): string {
    return sex === 0 ? '男' : '女' ;
  }

  doSearch(flag) {
    if (flag === 'booking') {
      const searchBookingItem = {
        'createTimeBegin': this.beginBookingDate,
        'createTimeEnd': this.endBookingDate,
        'type': this.searchBookingForm.controls['type'].value,
        'status': this.searchBookingForm.controls['status'].value,
        'orderId': this.searchBookingForm.controls['orderId'].value,
        'phone': this.searchBookingForm.controls['phone'].value
      };
      if ((searchBookingItem.createTimeBegin === '' || searchBookingItem.createTimeBegin === null)
          && (searchBookingItem.createTimeEnd === '' || searchBookingItem.createTimeEnd === null)
          && searchBookingItem.type === ''
          && searchBookingItem.status === '' && searchBookingItem.orderId === '' && searchBookingItem.phone === '') {
        this.currentPanel === 'bookingHypostatic' ? this.loadData('bookingHypostatic') :  this.loadData('bookingDigital');
      } else {
        // tslint:disable-next-line:max-line-length
        this.loadDataByKey(searchBookingItem.status, searchBookingItem.type, searchBookingItem.createTimeBegin, searchBookingItem.createTimeEnd, searchBookingItem.orderId, searchBookingItem.phone);
      }
    }
  }

  private _initForm(): void {
    this.searchUserForm = this.fb.group({ userId: [''], phone: [''], locked: [''], date: [''], });
    this.searchBookingForm = this.fb.group({ date: [''], type: [''], status: [''], orderId: [''], phone: [''], });
    this.modifyBookingForm = this.fb.group({ updateType: [''], });
    this.addAdjustForm = this.fb.group({ adjustAmount: [''], adjustReason: [''], adjustType: [''], code: [''],
      noticeAbstract: [''], noticeContent: [''], noticeTitle: [''], operater: [''], users: [''], });
    this.searchRechargeForm = this.fb.group({ phone: [''], date: [''], });
    this.searchInvoiceForm = this.fb.group({ phone: [''], date: [''], type: [''], state: [''], });
  }

  // 封装验证新增
  verification(flag): boolean {
    let result = true;
    if (flag === 'adjustSend') {
      const myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      const user = this.addAdjustForm.controls['users'].value.replace(/\r/g, ',').replace(/\n/g, ',');
      user.split(',').forEach(item => {
        if (!myreg.test(item)) {
          this.modalService.error({ nzTitle: '提示', nzContent: '发送对象必须为手机号码，格式有误' });
          result = false;
        }
      });
      if (this.addAdjustForm.controls['noticeTitle'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '附带消息的标题未填写' });
        result = false;
      } else if (this.addAdjustForm.controls['noticeAbstract'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '附带消息的摘要未填写' });
        result = false;
      } else if (this.addAdjustForm.controls['noticeContent'].value === null) {
        this.modalService.error({ nzTitle: '提示', nzContent: '附带消息的内容未填写' });
        result = false;
      } else if (this.addAdjustForm.controls['adjustAmount'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '发送奖励配置参数未填写' });
        result = false;
      } else if (this.addAdjustForm.controls['adjustReason'].value === '') {
        this.modalService.error({ nzTitle: '提示', nzContent: '调整原因未填写' });
        result = false;
      }
    }
    return result;
  }

  doSave(flag) {
    if (flag === 'adjustSend') {
      const user = this.addAdjustForm.controls['users'].value.replace(/\r/g, ',').replace(/\n/g, ',');
      const adjustInput = {
        adjustAmount: this.addAdjustForm.controls['adjustAmount'].value,
        adjustReason: this.addAdjustForm.controls['adjustReason'].value,
        adjustType: this.adjustTypeAdd,
        code: this.operateObject.code,
        noticeAbstract: this.addAdjustForm.controls['noticeAbstract'].value,
        noticeContent: this.replaceHtmlStr(this.addAdjustForm.controls['noticeContent'].value).replace(/&/g, '%26'),
        noticeTitle: this.addAdjustForm.controls['noticeTitle'].value,
        operater: this.operateObject.operater,
        users: user.split(','),
      };
      this.adjustService.addAdjust(adjustInput).subscribe(res => {
        if (res.retcode === 0) {
          this.notification.blank( '提示', '新增成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '用户管理', op_page: '数据调整' , op_name: '新增' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.loadData('adjust');
          this.hideModal('adjustAdd');
          this.hideModal('adjustSend');
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } else if (flag === 'sendMsg') {
      this.adjustService.sendMsg(this.operateObject.operater).subscribe(res => {
        if (res.retcode === 0) {
          this.countDown();
          this.notification.blank( '提示', '发送成功', { nzStyle: { color : 'green' } });
          const operationInput = { op_category: '用户管理', op_page: '数据调整' , op_name: '发送短信' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.error({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  countDown() {
    this.semdMesCodeText--;
    if (this.semdMesCodeText === 0) {
      this.semdMesCodeText = 60;
      return;
    }
    setTimeout(() => { this.countDown(); }, 1000);
  }

  /* 设为冻结状态 */
  doBlacklist(): void {
    this.userService.updateUserInfo(this.userInfoId).subscribe(res => {
      if (res.status === 200) {
        const operationInput = { op_category: '用户管理', op_page: '订单查询' , op_name: '修改' };
        this.commonService.updateOperationlog(operationInput).subscribe();
        setTimeout(() => { this.loadData('user'); }, 1000);
      }
    });
  }

  /*  取消酒店订单 */
  cancleHotelOrder(): void {

  }

  showModal(flag, data) {
    if (flag === 'InvoiceDetail') {
      this.isInvoiceVisible = true;
      this.userService.getInvoiceDetail(data.orderId).subscribe(res => {
        if (res.retcode === 0) {
          if (res.payload) {
            this.invoiceDetail = JSON.parse(res.payload);
          }
        } else {
          this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } if (flag === 'Refund') {
      this.isRefundVisible = true;
      this.refundInfo.userId = data.userId;
      this.refundInfo.orderId = data.orderId;
      const refundInput = { orderId: data.orderId, ticketNo: data.actualId };
      this.bookingService.getRefundDetail(refundInput).subscribe(res => {
        if (res.retcode === 0) {
          const personArr = [];
          const msgArr = [];
          JSON.parse(res.payload).forEach(item => {
            this.refundSelectArr.push({id: item.code, msg: item.msg});
          });
          JSON.parse(res.payload)[0].refundPassengerPriceInfoList.forEach(item => {
            personArr.push({
              passengerName: item.basePassengerPriceInfo.passengerName,
              cardNum: item.basePassengerPriceInfo.cardNum,
              passengerId: item.basePassengerPriceInfo.passengerId,
              ticketPrice: item.basePassengerPriceInfo.ticketPrice,
              preRefundFee: item.refundFeeInfo.refundFee,
              preRefundPrice: item.refundFeeInfo.returnRefundFee,
              refundCauseId: JSON.parse(res.payload)[0].code,
              refundCause: JSON.parse(res.payload)[0].msg
            });
          });
          JSON.parse(res.payload).forEach(item => {
            msgArr.push(item.msg);
          });
          personArr.forEach(item => {
            item.msg = msgArr;
          });
          this.dataRefund = personArr;
        } else {
          this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } if (flag === 'Blacklist') {
      this.userInfoId = data.userId;
      this.modalService.confirm({
        nzTitle: '提示', nzContent: '确定将该用户拉入黑名单吗？', nzOkText: '确定', nzOnOk: () => this.doBlacklist()
      });
    } if (flag === 'BookingDetail') {
      this.orderId = data.orderId;
      this.orderStatus = data.state;
      this.bookingService.getBookingDetail(0, data.orderId).subscribe(res => {
        if (res.retcode === 0) {
          const operationInput = { op_category: '用户管理', op_page: '订单查询' , op_name: '访问' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          console.log(JSON.parse(res.payload));
          if (JSON.parse(res.payload).flightOrderReturn) {
            this.dataDetail = JSON.parse(res.payload).flightOrderReturn;
            this.isFlightOrder = true;
            this.isHotelOrder = false;
            this.isTrainOrder = false;
            this.isTaxiOrder = false;
            this.isDeliveryOrder = false;
            this.isPhoneBillOrder = false;
            this.isConstellationOrder = false;
          }
          if (JSON.parse(res.payload).hotelOrder) {
            this.dataDetail = JSON.parse(res.payload).hotelOrder;
            this.isFlightOrder = false;
            this.isHotelOrder = true;
            this.isTrainOrder = false;
            this.isTaxiOrder = false;
            this.isDeliveryOrder = false;
            this.isPhoneBillOrder = false;
            this.isConstellationOrder = false;
          }
          if (JSON.parse(res.payload).trainOrderReturn) {
            this.dataDetail = JSON.parse(res.payload).trainOrderReturn;
            this.isFlightOrder = false;
            this.isHotelOrder = false;
            this.isTrainOrder = true;
            this.isTaxiOrder = false;
            this.isDeliveryOrder = false;
            this.isPhoneBillOrder = false;
            this.isConstellationOrder = false;
          }
          if (JSON.parse(res.payload).taxiOrderDetailResponse) {
            this.dataDetail = JSON.parse(res.payload).taxiOrderDetailResponse;
            this.isFlightOrder = false;
            this.isHotelOrder = false;
            this.isTrainOrder = false;
            this.isTaxiOrder = true;
            this.isDeliveryOrder = false;
            this.isPhoneBillOrder = false;
            this.isConstellationOrder = false;
          }
          if (JSON.parse(res.payload).expressOrderDetailResponse) {
            this.dataDetail = JSON.parse(res.payload).expressOrderDetailResponse;
            this.isFlightOrder = false;
            this.isHotelOrder = false;
            this.isTrainOrder = false;
            this.isTaxiOrder = false;
            this.isDeliveryOrder = true;
            this.isPhoneBillOrder = false;
            this.isConstellationOrder = false;
          }
          if (JSON.parse(res.payload).phoneChargeOrder) {
            this.dataDetail = JSON.parse(res.payload).phoneChargeOrder;
            this.isFlightOrder = false;
            this.isHotelOrder = false;
            this.isTrainOrder = false;
            this.isTaxiOrder = false;
            this.isDeliveryOrder = false;
            this.isPhoneBillOrder = true;
            this.isConstellationOrder = false;
          }
          if (JSON.parse(res.payload).pairOrder) {
            this.dataDetail = JSON.parse(res.payload).pairOrder;
            this.isFlightOrder = false;
            this.isHotelOrder = false;
            this.isTrainOrder = false;
            this.isTaxiOrder = false;
            this.isDeliveryOrder = false;
            this.isPhoneBillOrder = false;
            this.isConstellationOrder = true;
          }
          if (JSON.parse(res.payload).fortuneOrder) {
            this.dataDetail = JSON.parse(res.payload).fortuneOrder;
            this.isFlightOrder = false;
            this.isHotelOrder = false;
            this.isTrainOrder = false;
            this.isTaxiOrder = false;
            this.isDeliveryOrder = false;
            this.isPhoneBillOrder = false;
            this.isConstellationOrder = true;
          }
        } else {
          this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
        }
      });
      this.isBookingDetailVisible = true;
    } if (flag === 'UserInfo') {
      this.userInfoDetail = data;
      console.log(this.userInfoDetail);
      this.isUserInfoDetailVisible = true;
    } if (flag === 'modifyBooking') {
      this.bookingService.updateBookingInfo(this.modifyBookingForm.controls['updateType'].value, this.orderId).subscribe(res => {
        if (res.retcode === 0) {
          this.modalService.success({ nzTitle: '修改成功', nzContent: res.message });
          const operationInput = { op_category: '用户管理', op_page: '订单查询' , op_name: '修改' };
          this.commonService.updateOperationlog(operationInput).subscribe();
        } else {
          this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
        }
      });
    } if (flag === 'adjustDetail') {
      this.isAdjustDetailVisible = true;
      this.adjustDetail = data;
      const success = [];
      const fail = [];
      this.adjustDetail.all = Object.keys(this.adjustDetail.result).length;
      for (let i in this.adjustDetail.result) {
        if (this.adjustDetail.result[i] === true) {
          success.push(i);
        } else if (this.adjustDetail.result[i] === false) {
          fail.push(i);
        }
      }
      this.adjustDetail.success = success.join('\n');
      this.adjustDetail.fail = fail.join('\n');
      this.adjustDetail.successNum = success.length;
      this.adjustDetail.failNum = fail.length;
    } if (flag === 'adjustAdd') {
      // tslint:disable-next-line:max-line-length
      this.adjustDetail = { successNum: 0, failNum: 0, success: '', fail: '', result: {}, all: 0, users: '', noticeTitle: '', noticeAbstract: '', noticeContent: '', adjustReason: '' };
      this.adjustTypeAdd = 'BEAN';
      this.isAdjustAddVisible = true;
    } if (flag === 'adjustSend') {
      if (!this.verification('adjustSend')) {
        return;
      }
      this.operateObject = { code: '', operater: '' };
      this.loadData('operaters'); // 获取操作者列表数据
      this.adjustSendData = {
        users: this.addAdjustForm.controls['users'].value,
        // tslint:disable-next-line:max-line-length
        config: (this.adjustTypeAdd === 'BEAN' ? '小悟豆' : this.adjustTypeAdd === 'COIN' ? '小悟币' : null) + '*' + this.addAdjustForm.controls['adjustAmount'].value,
        noticeContent: this.replaceHtmlStr(this.addAdjustForm.controls['noticeContent'].value).replace(/&/g, '%26'),
      };
      this.isAdjustSendVisible = true;
    } if (flag === 'userCommon') {  // 常用信息
      this.commonUserId = data.userId;
      this.currentUserCommonTab = 'TRAVELER';
      this.loadData('userInfoCommon');
      this.isUserInfoCommonVisible = true;
    } if (flag === 'invoiceInfoDetail') {
      this.invoiceItem = data;
      console.log(this.invoiceItem);
      this.isInvoiceDetailVisible = true;
    } if (flag === 'goRecharge') {  // 查看充值
      this.rechargePhone = data.account;
      setTimeout(() => { this.loadData('recharge'); }, 1000);
      this.tabsetJson.currentNum = 4;
    } if (flag === 'goInvoice') {  // 查看开票
      this.invoicePhone = data.account;
      setTimeout(() => { this.loadData('invoice'); }, 1000);
      this.tabsetJson.currentNum = 5;
    } if (flag === 'goBooking') {  // 查看开票
      this.bookingPhone = data.account;
      setTimeout(() => { this.doSearch('booking'); }, 1000);
      this.tabsetJson.currentNum = 1; // 实体服务订单
    }
  }

  /* 展示供应商订单详情 */
  showExternal(flag, data): void {
    this.bookingService.getBookingDetail(flag, data).subscribe(res => {
      if (res.retcode === 0) {
        const operationInput = { op_category: '用户管理', op_page: '订单查询' , op_name: '访问' };
        this.commonService.updateOperationlog(operationInput).subscribe();
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
            // '<br>酒店所在区：' + JSON.parse(res.payload).hotelOrder.peripheral_information +
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
      } else {
        this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
      }
    });
    this.isExternalDetailVisible = true;
  }

  getAllowed(allowed): string { return allowed = true ? '可以取消' : '不可取消' ; }

  getRefund(refund): string { return refund = true ? '是' : '否' ; }

  hideModal(flag) {
    if (flag === 'InvoiceDetail') {
      this.invoiceDetail = { invoiceMsg: '' };
      this.isInvoiceVisible = false;
    } else if (flag === 'BookingDetail') {
      this.isBookingDetailVisible = false;
    } else if (flag === 'Refund') {
      this.isRefundVisible = false;
    } else if (flag === 'adjustDetail') {
      this.isAdjustDetailVisible = false;
    } else if (flag === 'adjustAdd') {
      this.isAdjustAddVisible = false;
    } else if (flag === 'adjustSend') {
      this.isAdjustSendVisible = false;
    } else if (flag === 'UserInfo') {
      this.isUserInfoDetailVisible = false;
    } else if (flag === 'UserCommon') {
      this.isUserInfoCommonVisible = false;
    } else if (flag === 'invoiceInfoDetail') {
      this.isInvoiceDetailVisible = false;
    }
  }

  doDelete(flag) {
    if (flag === 'Refund') {
      if (this.refundRadio === '') {
        this.modalService.confirm({ nzTitle: '提示', nzContent: '请先勾选需要提交的的乘客！' });
        return;
      }
      if (this.refundSelectName.length === 0) {
        this.modalService.confirm({ nzTitle: '提示', nzContent: '请在选中的乘客上，选择退票原因！' });
        return;
      }
      const refundInput = {
        'userId': this.refundInfo.userId + '',
        'orderId': this.refundInfo.orderId,
        'passengerId': '',
        'refundCauseId': '',
        'refundCause': '',
        'ticketPrice': '',
        'preRefundFee': '',
        'preRefundPrice': '',
      };

      this.dataRefund.forEach((item, i) => {
        if (item.passengerName === this.refundRadio) {
          let refundCauseId = '';
          let refundCause = '';
          this.refundSelectName.forEach((cell, j) => {
            if (i === cell.index) {
              refundCauseId = cell.id;
              refundCause = cell.text;
            }
          });
          refundInput.refundCauseId = refundCauseId;
          refundInput.refundCause = refundCause;

          refundInput.passengerId = item.passengerId;
          refundInput.ticketPrice = item.ticketPrice;
          refundInput.preRefundFee = item.preRefundFee;
          refundInput.preRefundPrice = item.preRefundPrice;
        }
      });
      this.bookingService.deleteRefundDetail(refundInput).subscribe(res => {
        if (res.retcode === 0) {
          this.modalService.success({ nzTitle: '退订成功', nzContent: res.message });
          const operationInput = { op_category: '订单管理', op_page: '退订机票' , op_name: '删除' };
          this.commonService.updateOperationlog(operationInput).subscribe();
          this.hideModal('Refund');
        } else {
          this.modalService.confirm({ nzTitle: '提示', nzContent: res.message });
        }
      });
    }
  }

  // 改变退订的数组
  onRefundMsgChange(value, index) {
    this.refundSelectArr.forEach((item, i) => {
      if (i === index) {
        if (item.msg === value) {
          const tempJson = { index: i, text: item.msg, id: item.id };
          this.refundSelectName.push(tempJson);
        }
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

  // 切换面板
  changePanel(flag): void {
    this.changeBookingPage = 1;
    this.bookingType = '';  // 重置公用的订票类型
    if (flag !== this.currentPanel) { this.loadData(flag); }
    this.currentPanel = flag;
    const operationInput = { op_category: '用户管理', op_page: flag === 'user' ? '用户管理' : flag === 'booking' ? '订单查询' : '', op_name: '访问' };
    this.commonService.updateOperationlog(operationInput).subscribe();
  }

  // 日期插件
  onChange(result, flag): void {
    if (flag === 'booking') {
      if (result !== '') {
        this.beginBookingDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss');
        this.endBookingDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
      }
      if (this.beginBookingDate === null) {
        this.beginBookingDate = null;
        this.endBookingDate = null;
      }
    } else if (flag === 'adjust') {
      if (result[0] !== '' || result[1] !== '') {
        this.beginAdjustDate = this.datePipe.transform(result[0], 'yyyy-MM-dd');
        this.endAdjustDate = this.datePipe.transform(result[1], 'yyyy-MM-dd');
      }
      if (this.beginAdjustDate === null || this.endAdjustDate === null) {
        this.beginAdjustDate = null;
        this.endAdjustDate = null;
      }
    } else if (flag === 'recharge') {
      if (result[0] !== '' || result[1] !== '') {
        this.beginRechargeDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss');
        this.endRechargeDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
      }
      if (this.beginRechargeDate === null || this.endRechargeDate === null) {
        this.beginRechargeDate = null;
        this.endRechargeDate = null;
      }
    } else if (flag === 'invoice') {
      if (result[0] !== '' || result[1] !== '') {
        this.beginInvoiceDate = this.datePipe.transform(result[0], 'yyyy-MM-dd ') + '00:00:00';
        this.endInvoiceDate = this.datePipe.transform(result[1], 'yyyy-MM-dd ') + '23:59:59';
      }
      if (this.beginInvoiceDate === null || this.endInvoiceDate === null) {
        this.beginInvoiceDate = null;
        this.endInvoiceDate = null;
      }
    } else if (flag === 'userRegister') {
      if (result[0] !== '' || result[1] !== '') {
        this.begUserRegisterDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss');
        this.endUserRegisterDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
      }
      if (this.begUserRegisterDate === null || this.endUserRegisterDate === null) {
        this.begUserRegisterDate = null;
        this.endUserRegisterDate = null;
      }
    } else if (flag === 'userLogin') {
      if (result[0] !== '' || result[1] !== '') {
        this.begUserLoginDate = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss');
        this.endUserLoginDate = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
      }
      if (this.begUserLoginDate === null || this.endUserLoginDate === null) {
        this.begUserLoginDate = null;
        this.endUserLoginDate = null;
      }
    } else if (flag === 'currentUserCommonTab') {
      this.userInfoCommonData.splice(0, this.userInfoCommonData.length);
      this.loadData('userInfoCommon');
    }
  }

  // 替换所有奇怪字符
  replaceHtmlStr(str) {
    return str = str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, '\'')
          .replace(/&quot;/g, '"').replace(/&nbsp;/g, '<br>').replace(/&ensp;/g, '   ')
          .replace(/&emsp;/g, '    ').replace(/%/g, '%').replace(/&amp;/g, '&');
  }

}
