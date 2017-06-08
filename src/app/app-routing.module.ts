import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MobiGuard } from './mobi.guard';

const routes: Routes = [
    { path: '', 
    loadChildren: './modules/main/main.module#MainModule',
  canActivate: [MobiGuard],},
    { path: 'm', loadChildren: './modules/mobile/mobile.module#MobileModule'},
    { path: 'not-found', loadChildren: './modules/not-found/not-found.module#NotFoundModule' },
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}