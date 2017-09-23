import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';

import { HeaderComponent } from "./components/header/header.component";
import { HomeComponent } from "./components/home/home.component";
import { HomeTitleZhComponent } from "./components/home/title/title-zh.component";
import { HomeTitleEnComponent } from "./components/home/title/title-en.component";
import { TechComponent } from "./components/tech/tech.component";
import { ProductComponent } from "./components/product/product.component";
import { PartnerComponent } from './components/partner/partner.component';
import { AboutComponent } from "./components/about/about.component";
import { CareerComponent } from "./components/career/career.component";
import { ContactComponent } from "./components/contact/contact.component";
import { FooterComponent } from "./components/footer/footer.component";

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
