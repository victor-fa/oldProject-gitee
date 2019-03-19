import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../public/public.module';
import { CustomerComponent } from './customer.component';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: CustomerComponent
      }
    ]),
  ],
  declarations: [
    CustomerComponent,
  ]
})
export class CustomerModule {}
