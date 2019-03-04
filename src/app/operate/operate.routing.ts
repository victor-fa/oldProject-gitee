import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { XiaowubeanComponent } from './xiaowubean/xiaowubean.component';
import { OperateComponent } from './operate.component';


const routes: Routes = [
  {
    path: 'app',
    component: OperateComponent,
    children: [
      {
        path: 'app',
        component: XiaowubeanComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperateRoutingModule { }
