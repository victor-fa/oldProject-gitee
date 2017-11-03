import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileRoutingModule } from './mobile-routing.module';
import { MobileComponent } from './mobile.component';

import { HeaderMComponent } from './components/header-m/header-m.component';
import { AboutMComponent } from './components/about-m/about-m.component';
import { PartnerMComponent } from './components/partner-m/partner-m.component';
import { ContactMComponent } from './components/contact-m/contact-m.component';
import { CareerMComponent } from './components/career-m/career-m.component';
import { HomeMComponent } from './components/home-m/home-m.component';
import { TechMComponent } from './components/tech-m/tech-m.component';
import { ProductMComponent } from './components/product-m/product-m.component';

import { Service } from './service'

@NgModule({
    imports: [
        CommonModule,
        MobileRoutingModule,
    ],
    declarations: [
        MobileComponent,

        HeaderMComponent,
        AboutMComponent,
        PartnerMComponent,
        ContactMComponent,
        CareerMComponent,
        HomeMComponent,
        TechMComponent,
        ProductMComponent
    ],
    entryComponents: [
        MobileComponent,
        TechMComponent,
        ProductMComponent,
        PartnerMComponent,
        AboutMComponent,
        ContactMComponent,
        CareerMComponent,
        HomeMComponent
    ],
    providers: [
        Service
    ]
})
export class MobileModule { }
