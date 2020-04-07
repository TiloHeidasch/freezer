import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'freezer-create-frozen-item-dialog',
  templateUrl: './create-frozen-item-dialog.component.html',
  styleUrls: ['./create-frozen-item-dialog.component.scss']
})
export class CreateFrozenItemDialogComponent {
  data: { name; slot; quantity; } = { name: '', slot: this.slots[0], quantity: 1 };

  nameFormControl = new FormControl('', [
    Validators.required,
  ]);
  nameMatcher = new MyErrorStateMatcher();
  slotFormControl = new FormControl(this.slots[0], [
    Validators.required,
  ]);
  slotMatcher = new MyErrorStateMatcher();
  quantityFormControl = new FormControl(1, [
    Validators.min(1),
  ]);
  quantityMatcher = new MyErrorStateMatcher();
  constructor(
    public dialogRef: MatDialogRef<CreateFrozenItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public slots) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
