import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicModule } from '../public/public.module';
import { MakedownComponent } from './makedown.component';
import { EditorMdDirective } from '../editor/editor-md.directive';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    PublicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: MakedownComponent
      }
    ]),
  ],
  declarations: [
    MakedownComponent,
    EditorMdDirective,
  ]
})
export class MakedownModule {}
