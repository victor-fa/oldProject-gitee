import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';


import { PartnerComponent } from './components/partner/partner.component';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "app/modules/main/components/footer/footer.component";
import { AboutComponent } from "app/modules/main/components/about/about.component";
import { PlanComponent } from "app/modules/main/components/plan/plan.component";
import { TeamComponent } from "app/modules/main/components/team/team.component";
import { ContactComponent } from "app/modules/main/components/contact/contact.component";



@NgModule({
    imports: [
        CommonModule,
        MainRoutingModule
    ],
    declarations: [
        MainComponent,
        HeaderComponent,
        FooterComponent,
        AboutComponent,
        PlanComponent,
        PartnerComponent,
        TeamComponent,
        ContactComponent
    ],
    providers: [
    ]
})
export class MainModule { }
