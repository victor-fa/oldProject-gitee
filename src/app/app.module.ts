import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app.routing';
import { CoreModule } from './core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { LocalizationService } from './public/service/localization.service';

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
      LocalizationService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
