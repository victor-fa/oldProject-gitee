import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DuihuaComponent } from './duihua.component';
import { DuihuaRoutingModule } from './duihua-routing.module';

@NgModule({
    imports: [
        CommonModule,
        DuihuaRoutingModule,
    ],
    declarations: [DuihuaComponent]
})
export class DuihuaModule { }
