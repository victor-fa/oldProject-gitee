import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../public/public.module';
import { ConsumerComponent } from './consumer.component';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ConsumerComponent
      }
    ]),
  ],
  declarations: [
    ConsumerComponent,
  ]
})
export class ConsumerModule {}
