import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../public/public.module';
import { DataCenterComponent } from './dataCenter.component';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: DataCenterComponent
      }
    ]),
  ],
  declarations: [
    DataCenterComponent,
  ]
})
export class DataCenterModule {}
