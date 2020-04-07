import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { CreateFreezerDialogComponent } from './create-freezer-dialog/create-freezer-dialog.component';
import { CreateFreezerSlotDialogComponent } from './create-freezer-slot-dialog/create-freezer-slot-dialog.component';
import { CreateFrozenItemDialogComponent } from './create-frozen-item-dialog/create-frozen-item-dialog.component';
import { EditNameDialogComponent } from './edit-name-dialog/edit-name-dialog.component';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';

@NgModule({
  declarations: [AppComponent, CreateFreezerDialogComponent, CreateFreezerSlotDialogComponent, CreateFrozenItemDialogComponent, EditNameDialogComponent, DeleteConfirmationDialogComponent],
  imports: [BrowserModule, HttpClientModule, BrowserAnimationsModule, MaterialModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
