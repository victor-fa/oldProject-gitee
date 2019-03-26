import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'appVersion', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: 'appVersion', loadChildren: './appVersion/appVersion.module#AppVersionModule'},
  { path: 'user', loadChildren: './user/user.module#UserModule'},
  { path: 'customer', loadChildren: './customer/customer.module#CustomerModule'},
  { path: 'content', loadChildren: './content/content.module#ContentModule'},
  { path: 'preview', loadChildren: './preview/preview.module#PreviewModule'},
  { path: 'operate', loadChildren: './operate/operate.module#OperateModule'},
  { path: 'dataCenter', loadChildren: './dataCenter/dataCenter.module#DataCenterModule'},
  { path: 'activity', loadChildren: './activity/activity.module#ActivityModule'},
  { path: 'account', loadChildren: './account/account.module#AccountModule'},
  // { path: '**', loadChildren: './public/page-not-found/page-not-found.module#PageNotFoundModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
