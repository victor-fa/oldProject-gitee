import { PublicModule } from '../public/public.module';
import { SessionAnalysisComponent } from './sessionAnalysis.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    PublicModule,
    RouterModule.forChild([
      {
        path: '',
        component: SessionAnalysisComponent
      }
    ]),
  ],
  declarations: [
    SessionAnalysisComponent,
  ]
})
export class SessionAnalysisModule {}
