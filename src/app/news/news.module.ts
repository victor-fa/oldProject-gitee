import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../public/public.module';
import { NewsComponent } from './news.component';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: NewsComponent
      }
    ]),
  ],
  declarations: [
    NewsComponent,
  ]
})
export class NewsModule {}
