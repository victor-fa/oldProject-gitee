import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentComponent } from './content.component';
import { PublicModule } from '../public/public.module';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ContentComponent
      }
    ]),
  ],
  declarations: [
    ContentComponent,
  ]
})
export class ContentModule {}
