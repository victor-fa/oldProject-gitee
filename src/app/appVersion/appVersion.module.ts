import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../public/public.module';
import { AppVersionComponent } from './appVersion.component';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: AppVersionComponent
      }
    ]),
  ],
  declarations: [
    AppVersionComponent,
  ]
})
export class AppVersionModule {}
