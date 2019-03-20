import { NgModule } from '@angular/core';
import { PublicModule } from '../public/public.module';
import { OperateComponent } from './operate.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: OperateComponent
      }
    ]),
  ],
  declarations: [
    OperateComponent,
  ]
})
export class OperateModule {}
