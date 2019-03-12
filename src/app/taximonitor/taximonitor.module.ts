import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../public/public.module';
import { TaximonitorComponent } from './taximonitor.component';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: TaximonitorComponent
      }
    ]),
  ],
  declarations: [
    TaximonitorComponent,
  ]
})
export class TaximonitorModule {}
