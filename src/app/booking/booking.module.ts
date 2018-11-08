import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BookingComponent } from './booking.component';
import { PublicModule } from '../public/public.module';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: BookingComponent
      }
    ]),
  ],
  declarations: [
    BookingComponent,
  ]
})
export class BookingModule {}
