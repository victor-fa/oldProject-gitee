import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { MobiGuard } from './mobi.guard';
import { CookieService } from 'ngx-cookie-service';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';

/// <reference path="../jquery.d.ts" />
import * as $ from 'jquery';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        NoopAnimationsModule
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
