import { Component } from '@angular/core';
import { FreezerDto, FreezerSlotDto, FrozenItemDto } from '@freezer/api-interfaces';
import { FreezerService } from './freezer.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateFreezerDialogComponent } from './create-freezer-dialog/create-freezer-dialog.component';
import { CreateFreezerSlotDialogComponent } from './create-freezer-slot-dialog/create-freezer-slot-dialog.component';
import { CreateFrozenItemDialogComponent } from './create-frozen-item-dialog/create-frozen-item-dialog.component';
import { Sort } from '@angular/material/Sort';
import { EditNameDialogComponent } from './edit-name-dialog/edit-name-dialog.component';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'freezer-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  freezers: FreezerDto[];
  activeFreezer: FreezerDto = undefined;
  displayedColumns: string[] = ['name', 'quantity', 'delete'];
  constructor(private freezerService: FreezerService, private dialog: MatDialog) { }

  async ngOnInit() {
    this.freezers = await this.freezerService.getAllFreezers();
    this.activeFreezer = this.freezers[0];
  }
  setActiveFreezer(freezer: FreezerDto) {
    this.activeFreezer = freezer;
    console.log(this.activeFreezer);
  }
  createNewFreezer() {
    const dialogRef = this.dialog.open(CreateFreezerDialogComponent);
    dialogRef.afterClosed().subscribe(async name => {
      if (name !== undefined) {
        const newFreezer: FreezerDto = await this.freezerService.createFreezer(name);
        this.freezers.push(newFreezer);
        this.activeFreezer = newFreezer;
      }
    });
  }
  createNewFreezerSlot() {
    const dialogRef = this.dialog.open(CreateFreezerSlotDialogComponent);
    dialogRef.afterClosed().subscribe(async name => {
      if (name !== undefined) {
        const newFreezerSlot: FreezerSlotDto = await this.freezerService.createFreezerSlot(this.activeFreezer, name);
        this.activeFreezer.slots.push(newFreezerSlot);
      }
    });
  }
  createNewFrozenItem() {
    const dialogRef = this.dialog.open(CreateFrozenItemDialogComponent, { data: this.activeFreezer.slots });
    dialogRef.afterClosed().subscribe(async result => {
      console.error(result);
      if (result !== undefined && result.name !== '' && result.slot !== undefined && result.quantity >= 0) {
        const newFrozenItem: FrozenItemDto = await this.freezerService.createFrozenItem(this.activeFreezer, result.slot, result.name, result.quantity);
        result.slot.frozenItems.push(newFrozenItem);
      }
    });
  }
  editFrozenItemName(freezerSlotDto: FreezerSlotDto, frozenItemDto: FrozenItemDto) {
    const dialogRef = this.dialog.open(EditNameDialogComponent, { data: frozenItemDto });
    dialogRef.afterClosed().subscribe(async name => {
      if (name !== undefined) {
        frozenItemDto.name = name;
        frozenItemDto = await this.freezerService.updateFrozenItem(this.activeFreezer, freezerSlotDto, frozenItemDto);
      }
    });
  }
  editFreezerSlotName(freezerSlotDto: FreezerSlotDto) {
    const dialogRef = this.dialog.open(EditNameDialogComponent, { data: freezerSlotDto });
    dialogRef.afterClosed().subscribe(async name => {
      if (name !== undefined) {
        freezerSlotDto.name = name;
        freezerSlotDto = await this.freezerService.updateFreezerSlot(this.activeFreezer, freezerSlotDto);
      }
    });
  }
  editFreezerName() {
    const dialogRef = this.dialog.open(EditNameDialogComponent, { data: this.activeFreezer });
    dialogRef.afterClosed().subscribe(async name => {
      if (name !== undefined) {
        this.activeFreezer.name = name;
        this.activeFreezer = await this.freezerService.updateFreezer(this.activeFreezer);
      }
    });
  }
  reduceQuantity(freezerSlotDto: FreezerSlotDto, frozenItem: FrozenItemDto) {
    if (frozenItem.quantity > 1) {
      frozenItem.quantity = frozenItem.quantity - 1;
      this.freezerService.updateFrozenItem(this.activeFreezer, freezerSlotDto, frozenItem);
    } else {
      this.deleteItem(freezerSlotDto, frozenItem);
    }
  }
  increaseQuantity(freezerSlotDto: FreezerSlotDto, frozenItem: FrozenItemDto) {
    frozenItem.quantity = frozenItem.quantity + 1;
    this.freezerService.updateFrozenItem(this.activeFreezer, freezerSlotDto, frozenItem);
  }
  deleteItem(freezerSlotDto: FreezerSlotDto, frozenItem: FrozenItemDto) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, { data: frozenItem });
    dialogRef.afterClosed().subscribe(async confirmed => {
      if (confirmed) {
        freezerSlotDto.frozenItems = freezerSlotDto.frozenItems.filter(item => item.id !== frozenItem.id);
        this.freezerService.deleteFrozenItem(this.activeFreezer, freezerSlotDto, frozenItem);
      }
    });
  }
  deleteSlot(freezerSlotDto: FreezerSlotDto) {
    this.activeFreezer.slots = this.activeFreezer.slots.filter(slot => slot.id !== freezerSlotDto.id);
    this.freezerService.deleteFreezerSlot(this.activeFreezer, freezerSlotDto);
  }
  deleteFreezer() {
    this.freezerService.deleteFreezer(this.activeFreezer);
    this.freezers = this.freezers.filter(freezer => freezer.id !== this.activeFreezer.id);
    this.activeFreezer = this.freezers[0];
  }
}