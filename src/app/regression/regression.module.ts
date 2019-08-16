import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../public/public.module';
import { RegressionComponent } from './regression.component';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: RegressionComponent
      }
    ]),
  ],
  declarations: [
    RegressionComponent,
  ]
})
export class RegressionModule {}
