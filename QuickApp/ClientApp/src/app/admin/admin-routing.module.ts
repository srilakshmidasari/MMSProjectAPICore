// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';

import { ProfileComponent } from './profile/profile.component';

import { AssetGroupComponent } from './asset/asset-group/asset-group.component';
import { AssetsComponent } from './asset/assets/assets.component';
import { UserListComponent } from './security/user-list/user-list.component';
import { RoleListComponent } from './security/role-list/role-list.component';
import { LookupListComponent } from './master/lookup-list/lookup-list.component';
import { ItemComponent } from './inventory/item/item.component';
import { PurchaseorderComponent } from './inventory/purchaseorder/purchaseorder.component';
import { InventoryItemsComponent } from './inventory/inventory-items/inventory-items.component';
import { SiteListComponent } from './master/site-list/site-list.component';
import { ProjectComponent } from './master/project/project.component';
import { LocationComponent } from './master/location/location.component';
import { PreventivemaintenanceComponent } from './PM/preventivemaintenance/preventivemaintenance.component';
import { JobPlanComponent } from './PM/job-plan/job-plan.component';
import { PmOrderComponent } from './PM/pm-order/pm-order.component';
import { SupplierComponent } from './inventory/supplier/supplier.component';
import { WorkOrderComponent } from './PM/work-order/work-order.component';


const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      
      { path: 'users', component: UserListComponent, canActivate: [AuthGuard], data: { title: 'Admin | Users' } },
      { path: 'roles', component: RoleListComponent, canActivate: [AuthGuard], data: { title: 'Admin | Roles' } },
      { path: 'site', component: SiteListComponent, canActivate: [AuthGuard], data: { title: 'Admin | Site' } },
      { path: 'project', component: ProjectComponent, canActivate: [AuthGuard], data: { title: 'Admin | Project' } },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: { title: 'Admin | Profile' } },      
      { path: 'lookup', component: LookupListComponent, canActivate: [AuthGuard], data: { title: 'Admin | LookUp' } },
      { path: 'location', component: LocationComponent, canActivate: [AuthGuard], data: { title: 'Admin | Location' } },
      { path: 'assets', component: AssetsComponent, canActivate: [AuthGuard], data: { title: 'Admin | Asset' } },
      { path: 'asset-group', component: AssetGroupComponent, canActivate: [AuthGuard], data: { title: 'Admin | Asset-Group' } },
      { path: 'supplier', component: SupplierComponent, canActivate: [AuthGuard], data: { title: 'Admin | Supplier' } },
      { path: 'item', component: ItemComponent, canActivate: [AuthGuard], data: { title: 'Admin | item' } },
      { path: 'purchaseorder', component: PurchaseorderComponent, canActivate: [AuthGuard], data: { title: 'Admin | Purchase Order' } },
      { path: 'work-order', component: WorkOrderComponent, canActivate: [AuthGuard], data: { title: 'Admin | Work Order' } },
      { path: 'inventory-items', component: InventoryItemsComponent, canActivate: [AuthGuard], data: { title: 'Admin | Inventory Items' } },
      { path: 'pm-procedures', component: PreventivemaintenanceComponent, canActivate: [AuthGuard], data: { title: 'Admin | Preventive Maintenance' }},
      { path: 'job-plan', component: JobPlanComponent, canActivate: [AuthGuard], data: { title: 'Admin | Job Plan' }},
      { path: 'pm-order', component: PmOrderComponent, canActivate: [AuthGuard], data: { title: 'Admin | PM Order' }},
     
    
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthService, AuthGuard
  ]
})
export class AdminRoutingModule { }
