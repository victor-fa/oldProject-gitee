import { DatePipe, registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../public/service/common.service';
import { DataCenterService } from '../public/service/dataCenter.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

registerLocaleData(zh);

@Component({
  selector: 'app-operate',
  templateUrl: './operate.component.html',
  styleUrls: ['./operate.component.scss']
})
export class OperateComponent implements OnInit {

  constructor(
    public commonService: CommonService,
    private dataCenterService: DataCenterService,
    private modalService: NzModalService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private notification: NzNotificationService,
    private _router: Router,
  ) {
    this.commonService.nav[9].active = true;
  }

  ngOnInit() {

  }

}
