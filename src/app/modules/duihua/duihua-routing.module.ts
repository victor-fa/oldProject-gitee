import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DuihuaComponent } from "./duihua.component";

const routes: Routes = [
    { path: '', component: DuihuaComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DuihuaRoutingModule {
}
