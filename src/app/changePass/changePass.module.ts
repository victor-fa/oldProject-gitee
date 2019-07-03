import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../public/public.module';
import { ChangePassComponent } from './changePass.component';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChangePassComponent
      }
    ]),
  ],
  declarations: [
    ChangePassComponent,
  ]
})
export class ChangePassModule {}
