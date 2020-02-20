// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Component, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { RoleEditorComponent } from '../role-editor/role-editor.component';
import { Role } from 'src/app/models/role.model';
import { Permission } from 'src/app/models/permission.model';
import { AccountService } from 'src/app/services/account.service';

@Component({
    selector: 'app-edit-user-dialog',
    templateUrl: 'edit-role-dialog.component.html',
    styleUrls: ['edit-role-dialog.component.scss']
})
export class EditRoleDialogComponent {
    @ViewChild(RoleEditorComponent, { static: true })
    roleEditor: RoleEditorComponent;
    textDir: string;

    get roleName(): any {
        return this.data.role ? { name: this.data.role.name } : null;
    }

    constructor(
        public dialogRef: MatDialogRef<RoleEditorComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { role: Role, allPermissions: Permission[] },
        private accountService: AccountService
    ) {
        this.textDir = localStorage.getItem('textdir')
       
    }

    ngAfterViewInit() {
        this.roleEditor.roleSaved$.subscribe(role => this.dialogRef.close(role));
    }

    cancel(): void {
        this.dialogRef.close(null);
    }

    get canAddRoles() {
        return this.accountService.userHasPermission(Permission.addRolesPermission);
    }
}
