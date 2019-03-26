import { NgModule } from '@angular/core';
import { CommonService } from './common.service';
import { UserService } from './user.service';

@NgModule()
export class ServicesModule {
  static forRoot() {
    return {
      ngModule: ServicesModule,
      providers: [
        CommonService,
        UserService,
      ]
    };
  }
}
