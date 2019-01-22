import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../public/public.module';
import { DataAppComponent } from './dataApp/dataApp.component';
import { DataCenterComponent } from './dataCenter.component';
import { DataOverviewComponent } from './dataOverview/dataOverview.component';
import { ErrorComponent } from './error/error.component';
import { KeepAppComponent } from './keepApp/keepApp.component';
import { ProductComponent } from './product/product.component';
import { TicketComponent } from './ticket/ticket.component';
import { TrainComponent } from './train/train.component';
import { HotelComponent } from './hotel/hotel.component';
import { WeatherComponent } from './weather/weather.component';
import { NavigateComponent } from './navigate/navigate.component';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: 'app',
        component: DataCenterComponent
      },
      {
        path: 'keepApp',
        component: DataCenterComponent
      },
      {
        path: 'overview',
        component: DataCenterComponent
      },
      {
        path: 'product',
        component: DataCenterComponent
      },
      {
        path: 'error',
        component: DataCenterComponent
      },
      {
        path: 'ticket',
        component: DataCenterComponent
      },
      {
        path: 'train',
        component: DataCenterComponent
      },
      {
        path: 'hotel',
        component: DataCenterComponent
      },
      {
        path: 'weather',
        component: DataCenterComponent
      },
      {
        path: 'navigate',
        component: DataCenterComponent
      }
    ]),
  ],
  declarations: [
    DataCenterComponent,
    DataAppComponent,
    KeepAppComponent,
    DataOverviewComponent,
    ProductComponent,
    ErrorComponent,
    TicketComponent,
    TrainComponent,
    HotelComponent,
    WeatherComponent,
    NavigateComponent,
  ]
})
export class DataCenterModule {}
