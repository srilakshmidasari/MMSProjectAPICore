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
import { LookupListComponent } from './lookup-list/lookup-list.component';
const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'users', component: UserListComponent, canActivate: [AuthGuard], data: { title: 'Admin | Users' } },
      { path: 'roles', component: RoleListComponent, canActivate: [AuthGuard], data: { title: 'Admin | Roles' } },
      { path: 'site', component: SiteListComponent, canActivate: [AuthGuard], data: { title: 'Admin | Site' } },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: { title: 'Admin | Profile' } },
      { path: 'LookUp', component: LookupListComponent, canActivate: [AuthGuard], data: { title: 'Admin | LookUp' } }
      
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
