import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DuihuaComponent } from './duihua.component';
import { DuihuaRoutingModule } from './duihua-routing.module';

@NgModule({
    imports: [
        DuihuaRoutingModule,
        RouterModule
    ],
    declarations: [DuihuaComponent]
})
export class DuihuaModule { }
