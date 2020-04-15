// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminComponent } from './admin.component';


import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ProfileComponent } from './profile/profile.component';
import { DeleteFileComponent } from './delete-file/delete-file.component';

import { AssetGroupComponent } from './asset/asset-group/asset-group.component';
import { AssetsComponent } from './asset/assets/assets.component';
import { SupplierComponent } from './supplier/supplier.component';
import { ItemComponent } from './inventory/item/item.component';
import { RoleListComponent } from './security/role-list/role-list.component';
import { EditRoleDialogComponent } from './security/edit-role-dialog/edit-role-dialog.component';
import { RoleEditorComponent } from './security/role-editor/role-editor.component';
import { UserListComponent } from './security/user-list/user-list.component';
import { EditUserDialogComponent } from './security/edit-user-dialog/edit-user-dialog.component';
import { LookupListComponent } from './master/lookup-list/lookup-list.component';
import { LookupDialogComponent } from './master/lookup-dialog/lookup-dialog.component';
import { LookupEditorComponent } from './master/lookup-editor/lookup-editor.component';
import { PurchaseorderComponent } from './inventory/purchaseorder/purchaseorder.component';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {CheckboxModule} from 'primeng/checkbox';
import { DocumentFileComponent } from './inventory/document-file/document-file.component';
import { WorkOrderComponent } from './inventory/work-order/work-order.component';
import { ReceiveItemComponent } from './inventory/receive-item/receive-item.component';
import { CloseorderComponent } from './inventory/closeorder/closeorder.component';
import { InventoryItemsComponent } from './inventory/inventory-items/inventory-items.component';
import { SiteListComponent } from './master/site-list/site-list.component';
import { SiteEditorComponent } from './master/site-editor/site-editor.component';
import { SiteDialogComponent } from './master/site-dialog/site-dialog.component';
import { SiteLocationComponent } from './master/site-location/site-location.component';
import { ProjectComponent } from './master/project/project.component';
import { LocationComponent } from './master/location/location.component';
import { PreventivemaintenanceComponent } from './PM/preventivemaintenance/preventivemaintenance.component';
import { JobPlanComponent } from './PM/job-plan/job-plan.component';
import { SelectAssetComponent } from './PM/select-asset/select-asset.component';
import { PmOrderComponent } from './PM/pm-order/pm-order.component';
import { ApprovePmOrderComponent } from './PM/approve-pm-order/approve-pm-order.component';
import { AddAssetPmComponent } from './PM/add-asset-pm/add-asset-pm.component';
import { ChartsComponent } from './charts/charts.component';
import { ChartsModule } from 'ng2-charts';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
    TableModule,
    CheckboxModule,
    InputTextModule,
    ChartsModule,
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
    AssetGroupComponent,
    AssetsComponent,
    SupplierComponent,
    ItemComponent,
    PurchaseorderComponent,
    DocumentFileComponent,
    WorkOrderComponent,
    ReceiveItemComponent,
    CloseorderComponent,
    InventoryItemsComponent,
    PreventivemaintenanceComponent,
    JobPlanComponent,
    SelectAssetComponent,
    PmOrderComponent,
    ApprovePmOrderComponent,
    AddAssetPmComponent,
    ChartsComponent,
    DashboardComponent
  ],
  entryComponents: [
    EditUserDialogComponent,
    EditRoleDialogComponent,
    SiteDialogComponent,
    SiteLocationComponent,
    DeleteFileComponent,
    LookupDialogComponent,
    DocumentFileComponent,
    ReceiveItemComponent,
    CloseorderComponent,
    SelectAssetComponent,
    ApprovePmOrderComponent,
    AddAssetPmComponent
  ]
})
export class AdminModule {

}
