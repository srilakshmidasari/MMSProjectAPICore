// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule } from '@ngx-translate/core';

import { QuickAppProMaterialModule } from '../modules/material.module';

import { PageHeaderComponent } from './page-header/page-header.component';
import { AppDialogComponent } from './app-dialog/app-dialog.component';

import { GroupByPipe } from '../pipes/group-by.pipe';
import { TitleCaseDirective } from './validators/titleCaseDirective';
import { UserEditorComponent } from '../admin/security/user-editor/user-editor.component';
import { providers } from 'ngx-toasta';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from './validators/date.adapter';

@NgModule({
  imports: [
    FlexLayoutModule,
    FormsModule, ReactiveFormsModule,
    BrowserModule, BrowserAnimationsModule,
    QuickAppProMaterialModule,
    TranslateModule
  ],
  exports: [
    FlexLayoutModule,
    FormsModule, ReactiveFormsModule,
    BrowserModule, BrowserAnimationsModule,
    QuickAppProMaterialModule,
    TranslateModule,
    PageHeaderComponent,
    GroupByPipe,
    TitleCaseDirective,
    UserEditorComponent,
    AppDialogComponent
  ],
  declarations: [
    PageHeaderComponent,
    GroupByPipe,
    TitleCaseDirective,
    UserEditorComponent,
    AppDialogComponent
  ],
  entryComponents: [
    AppDialogComponent
  ],


  providers: [
    {
        provide: DateAdapter, useClass: AppDateAdapter
    },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
    ],
 
  
})
export class SharedModule {

}
