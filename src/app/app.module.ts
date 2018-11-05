import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { MobiGuard } from './mobi.guard';
import { CookieService } from 'ngx-cookie-service';

/// <reference path="../jquery.d.ts" />
import * as $ from 'jquery';
import { NewPageComponent } from './new-page/new-page.component';

@NgModule({
    declarations: [
        AppComponent,
        NewPageComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
    ],
    providers: [
        MobiGuard,
        CookieService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
