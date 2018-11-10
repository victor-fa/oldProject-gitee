import { Component, OnInit } from '@angular/core';
import { registerLocaleData, DatePipe } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from '../public/service/common.service';
import { NzModalService } from 'ng-zorro-antd';
import { LocalizationService } from '../public/service/localization.service';
import { UserService } from '../public/service/user.service';
import { BookingService } from '../public/service/booking.service';
import { ModifyBookingInput, SearchBookingInput } from '../public/model/booking.model';
registerLocaleData(zh);

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  data = [];
  dataDetail = [];
  displayData = [];
  allChecked = false;
  indeterminate = false;
  isBookingDetailVisible = false;
  isModifyVisible = false;
  orderId = '';
  searchForm: FormGroup;  // 查询表单
  searchItem = new SearchBookingInput();
  modifyForm: FormGroup;  // 修改表单
  modifyItem = new ModifyBookingInput();
  isFlightOrder = false;
  isHotelOrder = false;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private modalService: NzModalService,
    private localizationService: LocalizationService,
    private userService: UserService,
    private bookingService: BookingService,
  ) {
    this.commonService.nav[0].active = true;
    this._initSearchForm();
    this._initModifyForm();
  }

  ngOnInit() {
    this.loadData();
  }

  /* 加载信息 */
  private loadData(): void {
    this.bookingService.getBookingList().subscribe(res => {
      this.data = JSON.parse(res.payload);
    });
  }

  /* 加载信息 */
  private loadDataByKey(sortType, sortKey): void {
    this.bookingService.getBookingList(sortType, sortKey).subscribe(res => {
      this.data = JSON.parse(res.payload);
    });
  }

  doSearch(e) {
    e.preventDefault();
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
    this.bookingService.getBookingDetail(0, data.orderId).subscribe(res => {
      if (res.retcode === 0) {
        console.log(JSON.parse(res.payload));
        if (JSON.parse(res.payload).flightOrderReturn) {
          this.dataDetail = JSON.parse(res.payload).flightOrderReturn;
          this.isFlightOrder = true;
          this.isHotelOrder = false;
        }
        if (JSON.parse(res.payload).hotelOrder) {
          this.dataDetail = JSON.parse(res.payload).hotelOrder;
          this.isFlightOrder = false;
          this.isHotelOrder = true;
        }
        console.log(this.dataDetail);
      } else {
        this.modalService.confirm({
          nzTitle: '提示',
          nzContent: res.message
        });
      }
    });
    this.isBookingDetailVisible = true;
  }

  hideBookingDetail(): void {
    this.isBookingDetailVisible = false;
  }

  /* 展示修改弹框 */
  doModify(): void {
    this.bookingService.updateBookingInfo(this.modifyForm.controls['updateType'].value, this.orderId).subscribe(res => {
      console.log(res);
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
