// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

import { Component, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { UserEditorComponent } from '../user-editor/user-editor.component';
import { User } from 'src/app/models/user.model';
import { Role } from 'src/app/models/role.model';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: 'edit-user-dialog.component.html',
  styleUrls: ['edit-user-dialog.component.scss']
})
export class EditUserDialogComponent {
  @ViewChild(UserEditorComponent, { static: true })
  editUser: UserEditorComponent;
  textDir: string;

  get userName(): any {
    return this.data.user ? { name: this.data.user.userName } : null;
  }

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User, roles: Role[] }) {
      this.textDir = localStorage.getItem('textdir')
  }

  ngAfterViewInit() {
    this.editUser.userSaved$.subscribe(user => this.dialogRef.close(user));
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
