import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../public/public.module';
import { LoginComponent } from './login.component';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: LoginComponent
      }
    ]),
  ],
  declarations: [
    LoginComponent,
  ]
})
export class LoginModule {}
