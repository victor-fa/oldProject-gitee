import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PreviewComponent } from './preview.component';
import { PublicModule } from '../public/public.module';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: PreviewComponent
      }
    ]),
  ],
  declarations: [
    PreviewComponent,
  ]
})
export class PreviewModule {}
