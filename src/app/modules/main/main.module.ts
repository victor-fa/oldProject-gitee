import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';


import { HeaderComponent } from "./components/header/header.component";
import { HomeComponent } from "./components/home/home.component";
import { HomeTitleZhComponent } from "./components/home/title-zh/title-zh.component";
import { HomeTitleEnComponent } from "./components/home/title-en/title-en.component";
import { TechComponent } from "app/modules/main/components/tech/tech.component";
import { ProductComponent } from "app/modules/main/components/product/product.component";
import { PartnerComponent } from './components/partner/partner.component';
import { AboutComponent } from "app/modules/main/components/about/about.component";
import { CareerComponent } from "app/modules/main/components/career/career.component";
import { ContactComponent } from "app/modules/main/components/contact/contact.component";
import { FooterComponent } from "app/modules/main/components/footer/footer.component";



@NgModule({
    imports: [
        CommonModule,
        MainRoutingModule
    ],
    declarations: [
        MainComponent,

        HeaderComponent,
        HomeComponent,
        HomeTitleZhComponent,
        HomeTitleEnComponent,
        TechComponent,
        ProductComponent,
        PartnerComponent,
        AboutComponent,
        CareerComponent,
        ContactComponent,
        FooterComponent
    ],
    providers: [
    ]
})
export class MainModule { }
