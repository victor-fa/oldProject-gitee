import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../public/public.module';
import { ActivityComponent } from './activity.component';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ActivityComponent
      }
    ]),
  ],
  declarations: [
    ActivityComponent,
  ]
})
export class ActivityModule {}
