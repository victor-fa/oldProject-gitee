import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app.routing';
import { CoreModule } from './core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginGuard } from './public/service/login.guard.service';
import { LocalizationService } from './public/service/localization.service';
import { AppComponent } from './app.component';

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
      LocalizationService
   ],
   bootstrap: [
    AppComponent,
   ]
})
export class AppModule { }
