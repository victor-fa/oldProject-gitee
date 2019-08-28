import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../public/public.module';
import { PlatformComponent } from './platform.component';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: PlatformComponent
      }
    ]),
  ],
  declarations: [
    PlatformComponent,
  ]
})
export class PlatformModule {}
