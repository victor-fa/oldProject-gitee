import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app.routing';
import { CoreModule } from './core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginGuard } from './public/service/login.guard.service';
import { AppComponent } from './app.component';
import { AppSessionService } from './public/service/app.session.service';
import { CookiesService } from './public/service/cookies.service';
import { LocalizationService } from './public/service/localization.service';
import { AccountComponent } from './account/account.component';

@NgModule({
   declarations: [
      AppComponent,
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserModule,
      CoreModule,
      RouterModule,
      CommonModule
   ],
   providers: [
      LoginGuard,
      AppSessionService,
      CookiesService,
      LocalizationService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
