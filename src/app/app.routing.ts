import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './public/service/login.guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'content', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  // { path: 'account', loadChildren: './account/account.module#AccountModule'}, // , canActivate: [LoginGuard]
  { path: 'appVersion', loadChildren: './appVersion/appVersion.module#AppVersionModule'}, // , canActivate: [LoginGuard]
  { path: 'booking', loadChildren: './booking/booking.module#BookingModule'}, // , canActivate: [LoginGuard]
  { path: 'user', loadChildren: './user/user.module#UserModule'}, // , canActivate: [LoginGuard]
  { path: 'content', loadChildren: './content/content.module#ContentModule'}, // , canActivate: [LoginGuard]
  { path: 'preview', loadChildren: './preview/preview.module#PreviewModule'}, // , canActivate: [LoginGuard]
  { path: 'dataCenter', loadChildren: './dataCenter/dataCenter.module#DataCenterModule'}, // , canActivate: [LoginGuard]
  { path: 'coupon', loadChildren: './coupon/coupon.module#CouponModule'}, // , canActivate: [LoginGuard]
  { path: '**', loadChildren: './public/page-not-found/page-not-found.module#PageNotFoundModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
