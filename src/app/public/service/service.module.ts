import { NgModule } from '@angular/core';
import { CommonService } from './common.service';
import { AppRouteGuard } from '../auth/auth.router.guard';
import { UserService } from './user.service';

@NgModule()
export class ServicesModule {
  static forRoot() {
    return {
      ngModule: ServicesModule,
      providers: [
        CommonService,
        AppRouteGuard,
        UserService,
      ]
    };
  }
}
