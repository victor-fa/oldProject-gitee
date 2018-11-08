import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { PublicModule } from '../public/public.module';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserComponent
      }
    ]),
  ],
  declarations: [
    UserComponent,
  ]
})
export class UserModule {}
