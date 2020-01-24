// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminComponent } from './admin.component';
import { RoleListComponent } from './role-list/role-list.component';
import { EditRoleDialogComponent } from './edit-role-dialog/edit-role-dialog.component';
import { RoleEditorComponent } from './role-editor/role-editor.component';
import { UserListComponent } from './user-list/user-list.component';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { SiteListComponent } from './site-list/site-list.component';

@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule
  ],
  declarations: [
    AdminComponent,
    RoleListComponent,
    EditRoleDialogComponent,
    RoleEditorComponent,
    UserListComponent,
    EditUserDialogComponent,
    SiteListComponent
  ],
  entryComponents: [
    EditUserDialogComponent,
    EditRoleDialogComponent
  ]
})
export class AdminModule {

}
