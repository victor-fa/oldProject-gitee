import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app.routing';
import { CoreModule } from './core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { LocalizationService } from './public/service/localization.service';
import { FormsModule } from '@angular/forms';

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
      CommonModule,
      FormsModule
   ],
   providers: [
      LocalizationService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
