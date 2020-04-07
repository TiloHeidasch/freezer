import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'freezer-create-freezer-dialog',
  templateUrl: './create-freezer-dialog.component.html',
  styleUrls: ['./create-freezer-dialog.component.scss']
})
export class CreateFreezerDialogComponent {
  name;
  constructor(
    public dialogRef: MatDialogRef<CreateFreezerDialogComponent>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
