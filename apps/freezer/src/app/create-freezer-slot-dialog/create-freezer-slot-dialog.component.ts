import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'freezer-create-freezer-slot-dialog',
  templateUrl: './create-freezer-slot-dialog.component.html',
  styleUrls: ['./create-freezer-slot-dialog.component.scss']
})
export class CreateFreezerSlotDialogComponent {
  name;
  constructor(
    public dialogRef: MatDialogRef<CreateFreezerSlotDialogComponent>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
