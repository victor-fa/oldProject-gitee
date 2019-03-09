import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../public/public.module';
import { BatchsendComponent } from './batchsend.component';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: BatchsendComponent
      }
    ]),
  ],
  declarations: [
    BatchsendComponent,
  ]
})
export class BatchsendModule {}
