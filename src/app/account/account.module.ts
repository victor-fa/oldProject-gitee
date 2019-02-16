import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../public/public.module';
import { AccountComponent } from './account.component';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: AccountComponent
      }
    ]),
  ],
  declarations: [
    AccountComponent,
  ]
})
export class AccountModule {}
