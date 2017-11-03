import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileComponent } from './mobile.component';

import { HeaderMComponent } from './components/header-m/header-m.component';
import { AboutMComponent } from './components/about-m/about-m.component';
import { PlanMComponent } from './components/plan-m/plan-m.component';
import { PartnerMComponent } from './components/partner-m/partner-m.component';
import { TeamMComponent } from './components/team-m/team-m.component';
import { ContactMComponent } from './components/contact-m/contact-m.component';
import { CareerMComponent } from './components/career-m/career-m.component';
import { HomeMComponent } from './components/home-m/home-m.component';
import { TechMComponent } from './components/tech-m/tech-m.component';
import { ProductMComponent } from './components/product-m/product-m.component';

import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: MobileComponent
    },{
        path: 'prod',
        component:ProductMComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        MobileComponent,
        HeaderMComponent,
        AboutMComponent,
        PlanMComponent,
        PartnerMComponent,
        TeamMComponent,
        ContactMComponent,
        CareerMComponent,

        HomeMComponent,
        TechMComponent,
        ProductMComponent
    ],
    entryComponents: [
        HomeMComponent,
        ProductMComponent
    ],
    providers: [
    ]
})
export class MobileModule { }


