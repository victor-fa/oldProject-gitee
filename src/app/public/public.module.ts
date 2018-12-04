import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeftNavComponent } from './left-nav/left-nav.component';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ServicesModule } from './service/service.module';
import { DirectiveModule } from './directive/directive.module';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgZorroAntdModule.forRoot(),
    ServicesModule.forRoot(),
    DirectiveModule,
    QuillModule,
  ],
  declarations: [
    LeftNavComponent,
  ],
  exports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    NgZorroAntdModule,
    LeftNavComponent,
    ServicesModule,
    DirectiveModule,
    QuillModule,
  ]
})
export class PublicModule { }
