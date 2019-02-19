import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../public/public.module';
import { CouponComponent } from './coupon.component';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: CouponComponent
      }
    ]),
  ],
  declarations: [
    CouponComponent,
  ]
})
export class CouponModule {}
