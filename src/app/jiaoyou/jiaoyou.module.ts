import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../public/public.module';
import { JiaoyouComponent } from './jiaoyou.component';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: JiaoyouComponent
      }
    ]),
  ],
  declarations: [
    JiaoyouComponent,
  ]
})
export class JiaoyouModule {}
