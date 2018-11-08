import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../public.module';
import { PageNotFoundComponent } from './page-not-found.component';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: PageNotFoundComponent
      }
    ]),
  ],
  declarations: [
    PageNotFoundComponent,
  ]
})
export class PageNotFoundModule {}
