import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './public/service/login.guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'booking', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: 'booking', loadChildren: './booking/booking.module#BookingModule' , canActivate: [LoginGuard]}, // , canActivate: [LoginGuard]
  { path: 'user', loadChildren: './user/user.module#UserModule' , canActivate: [LoginGuard]}, // , canActivate: [LoginGuard]
  { path: '**', loadChildren: './public/page-not-found/page-not-found.module#PageNotFoundModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
