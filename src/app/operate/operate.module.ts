import { NgModule } from '@angular/core';
import { PublicModule } from '../public/public.module';
import { OperateRoutingModule } from './operate.routing';
import { XiaowubeanComponent } from './xiaowubean/xiaowubean.component';
import { OperateComponent } from './operate.component';

@NgModule({
  imports: [
    PublicModule,
    OperateRoutingModule,
  ],
  declarations: [
    OperateComponent,
    XiaowubeanComponent,
  ]
})
export class OperateModule {}
