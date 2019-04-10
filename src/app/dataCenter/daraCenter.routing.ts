import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DataCenterComponent } from './dataCenter.component';
import { DataAppComponent } from './dataApp/dataApp.component';
import { KeepAppComponent } from './keepApp/keepApp.component';
import { DataOverviewComponent } from './dataOverview/dataOverview.component';
import { ProductComponent } from './product/product.component';
import { ErrorComponent } from './error/error.component';
import { TicketComponent } from './ticket/ticket.component';
import { TrainComponent } from './train/train.component';
import { HotelComponent } from './hotel/hotel.component';
import { WeatherComponent } from './weather/weather.component';
import { NavigateComponent } from './navigate/navigate.component';
import { TaxiComponent } from './taxi/taxi.component';
import { MusicComponent } from './music/music.component';


const routes: Routes = [
    {
        path: 'app',
        component: DataCenterComponent,
        children: [
            {
                path: 'app',
                component: DataAppComponent,
            },
            {
                path: 'keepApp',
                component: KeepAppComponent,
            },
            {
                path: 'overview',
                component: DataOverviewComponent,
            },
            {
                path: 'product',
                component: ProductComponent,
            },
            {
                path: 'error',
                component: ErrorComponent,
            },
            {
                path: 'ticket',
                component: TicketComponent,
            },
            {
                path: 'train',
                component: TrainComponent,
            },
            {
                path: 'hotel',
                component: HotelComponent,
            },
            {
                path: 'weather',
                component: WeatherComponent,
            },
            {
                path: 'navigate',
                component: NavigateComponent,
            },
            {
                path: 'taxi',
                component: TaxiComponent,
            },
            {
                path: 'music',
                component: MusicComponent,
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DataCenterRoutingModule { }
