import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: 'changePass', loadChildren: './changePass/changePass.module#ChangePassModule' },
  { path: 'appVersion', loadChildren: './appVersion/appVersion.module#AppVersionModule'},
  { path: 'user', loadChildren: './user/user.module#UserModule'},
  { path: 'customer', loadChildren: './customer/customer.module#CustomerModule'},
  { path: 'content', loadChildren: './content/content.module#ContentModule'},
  { path: 'preview', loadChildren: './preview/preview.module#PreviewModule'},
  { path: 'operate', loadChildren: './operate/operate.module#OperateModule'},
  { path: 'activity', loadChildren: './activity/activity.module#ActivityModule'},
  { path: 'account', loadChildren: './account/account.module#AccountModule'},
  { path: 'dataCenter', loadChildren: './dataCenter/dataCenter.module#DataCenterModule'},
  { path: 'consumer', loadChildren: './consumer/consumer.module#ConsumerModule'},
  { path: 'news', loadChildren: './news/news.module#NewsModule'},
  { path: 'sessionAnalysis', loadChildren: './sessionAnalysis/sessionAnalysis.module#SessionAnalysisModule'},
  // { path: 'regression', loadChildren: './regression/regression.module#RegressionModule'},
  { path: 'platform', loadChildren: './platform/platform.module#PlatformModule'},
  { path: 'markdown', loadChildren: './markdown/markdown.module#MarkdownModule'},
  { path: 'jiaoyou', loadChildren: './jiaoyou/jiaoyou.module#JiaoyouModule'},
  { path: '**', loadChildren: './public/page-not-found/page-not-found.module#PageNotFoundModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
