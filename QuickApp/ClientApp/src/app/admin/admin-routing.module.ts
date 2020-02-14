// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin.component';
import { RoleListComponent } from './role-list/role-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { SiteListComponent } from './site-list/site-list.component';
import { ProfileComponent } from './profile/profile.component';
import { ProjectComponent } from './project/project.component';
import { LookupListComponent } from './lookup-list/lookup-list.component';
import { LocationComponent } from './location/location.component';
import { AssetLocationComponent } from './asset/asset-location/asset-location.component';
import { AssetGroupComponent } from './asset/asset-group/asset-group.component';
import { AssetsComponent } from './asset/assets/assets.component';
import { SupplierComponent } from './supplier/supplier.component';
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
      { path: 'supplier', component: SupplierComponent, canActivate: [AuthGuard], data: { title: 'Admin | Supplier' } }
      
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
