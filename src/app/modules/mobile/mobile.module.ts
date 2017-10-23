import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileRoutingModule } from './mobile-routing.module';
import { MobileComponent } from './mobile.component';

import { NavMComponent } from './components/nav-m/nav-m.component';
import { HeaderMComponent } from './components/header-m/header-m.component';
import { AboutMComponent } from './components/about-m/about-m.component';
import { PlanMComponent } from './components/plan-m/plan-m.component';
import { PartnerMComponent } from './components/partner-m/partner-m.component';
import { TeamMComponent } from './components/team-m/team-m.component';
import { ContactMComponent } from './components/contact-m/contact-m.component';
import { FooterMComponent } from './components/footer-m/footer-m.component';
import { HomeMComponent } from './components/home-m/home-m.component';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        MobileRoutingModule,
        MatSidenavModule,
    ],
    declarations: [
        MobileComponent,
        NavMComponent,
        HeaderMComponent,
        AboutMComponent,
        PlanMComponent,
        PartnerMComponent,
        TeamMComponent,
        ContactMComponent,
        FooterMComponent,

        HomeMComponent
    ],
    providers: [
    ]
})
export class MobileModule { }
