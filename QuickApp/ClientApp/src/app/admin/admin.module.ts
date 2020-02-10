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
import { SiteEditorComponent } from './site-editor/site-editor.component';
import { SiteDialogComponent } from './site-dialog/site-dialog.component';
import { SiteLocationComponent } from './site-location/site-location.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ProfileComponent } from './profile/profile.component';
import { DeleteFileComponent } from './delete-file/delete-file.component';
import { ProjectComponent } from './project/project.component';
import { LookupListComponent } from './lookup-list/lookup-list.component';
import { LookupDialogComponent } from './lookup-dialog/lookup-dialog.component';
import { LookupEditorComponent } from './lookup-editor/lookup-editor.component';
import { LocationComponent } from './location/location.component';
import { AssetLocationComponent } from './asset/asset-location/asset-location.component';
import { AssetGroupComponent } from './asset/asset-group/asset-group.component';

@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
    LeafletModule.forRoot()
  ],
  declarations: [
    AdminComponent,
    RoleListComponent,
    EditRoleDialogComponent,
    RoleEditorComponent,
    UserListComponent,
    EditUserDialogComponent,
    SiteListComponent,
    SiteEditorComponent,
    SiteDialogComponent,
    SiteLocationComponent,
    ProfileComponent,
    DeleteFileComponent,
    ProjectComponent,    
    LookupListComponent,
    LookupDialogComponent,
    LookupEditorComponent,
    LocationComponent,
    AssetLocationComponent,
    AssetGroupComponent
  ],
  entryComponents: [
    EditUserDialogComponent,
    EditRoleDialogComponent,
    SiteDialogComponent,
    SiteLocationComponent,
    DeleteFileComponent,
    LookupDialogComponent
  ]
})
export class AdminModule {

}
