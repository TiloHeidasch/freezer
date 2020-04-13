import { Component } from '@angular/core';
import { FreezerDto, FreezerSlotDto, FrozenItemDto } from '@freezer/api-interfaces';
import { FreezerService } from './freezer.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateFreezerDialogComponent } from './create-freezer-dialog/create-freezer-dialog.component';
import { CreateFreezerSlotDialogComponent } from './create-freezer-slot-dialog/create-freezer-slot-dialog.component';
import { CreateFrozenItemDialogComponent } from './create-frozen-item-dialog/create-frozen-item-dialog.component';
import { EditNameDialogComponent } from './edit-name-dialog/edit-name-dialog.component';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'freezer-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  freezers: FreezerDto[];
  activeFreezer: FreezerDto = undefined;
  dataSources = [];
  displayedColumns: string[] = ['name', 'quantity', 'edit'];
  constructor(private freezerService: FreezerService, private dialog: MatDialog) { }

  async ngOnInit() {
    this.freezers = await this.freezerService.getAllFreezers();
    this.setActiveFreezer(this.freezers[0]);
  }
  setActiveFreezer(freezer: FreezerDto) {
    this.activeFreezer = freezer;
    this.updateDataSources();
  }
  private updateDataSources() {
    this.dataSources = [];
    this.activeFreezer.slots.forEach(slot => {
      const dataSource = new MatTableDataSource(slot.frozenItems);
      this.dataSources.push(dataSource);
    });
  }
  createNewFreezer() {
    const dialogRef = this.dialog.open(CreateFreezerDialogComponent);
    dialogRef.afterClosed().subscribe(async name => {
      if (name !== undefined) {
        const newFreezer: FreezerDto = await this.freezerService.createFreezer(name);
        this.freezers.push(newFreezer);
        this.setActiveFreezer(newFreezer);
      }
    });
  }
  createNewFreezerSlot() {
    const dialogRef = this.dialog.open(CreateFreezerSlotDialogComponent);
    dialogRef.afterClosed().subscribe(async name => {
      if (name !== undefined) {
        const newFreezerSlot: FreezerSlotDto = await this.freezerService.createFreezerSlot(this.activeFreezer, name);
        this.activeFreezer.slots.push(newFreezerSlot);
        this.updateDataSources();
      }
    });
  }
  createNewFrozenItem() {
    const dialogRef = this.dialog.open(CreateFrozenItemDialogComponent, { data: this.activeFreezer.slots });
    dialogRef.afterClosed().subscribe(async result => {
      if (result !== undefined && result.name !== '' && result.slot !== undefined && result.quantity >= 0) {
        const newFrozenItem: FrozenItemDto = await this.freezerService.createFrozenItem(this.activeFreezer, result.slot, result.name, result.quantity, result.unit);
        result.slot.frozenItems.push(newFrozenItem);
        this.updateDataSources();
      }
    });
  }
  editFrozenItemName(freezerSlotDto: FreezerSlotDto, frozenItemDto: FrozenItemDto) {
    const dialogRef = this.dialog.open(EditNameDialogComponent, { data: frozenItemDto });
    dialogRef.afterClosed().subscribe(async name => {
      if (name !== undefined) {
        frozenItemDto.name = name;
        frozenItemDto = await this.freezerService.updateFrozenItem(this.activeFreezer, freezerSlotDto, frozenItemDto);
        this.updateDataSources();
      }
    });
  }
  editFreezerSlotName(freezerSlotDto: FreezerSlotDto) {
    const dialogRef = this.dialog.open(EditNameDialogComponent, { data: freezerSlotDto });
    dialogRef.afterClosed().subscribe(async name => {
      if (name !== undefined) {
        freezerSlotDto.name = name;
        freezerSlotDto = await this.freezerService.updateFreezerSlot(this.activeFreezer, freezerSlotDto);
        this.updateDataSources();
      }
    });
  }
  editFreezerName() {
    const dialogRef = this.dialog.open(EditNameDialogComponent, { data: this.activeFreezer });
    dialogRef.afterClosed().subscribe(async name => {
      if (name !== undefined) {
        this.activeFreezer.name = name;
        this.setActiveFreezer(await this.freezerService.updateFreezer(this.activeFreezer));
      }
    });
  }
  reduceQuantity(freezerSlotDto: FreezerSlotDto, frozenItemDto: FrozenItemDto) {
    if (frozenItemDto.quantity > 1) {
      frozenItemDto.quantity = frozenItemDto.quantity - 1;
      this.freezerService.updateFrozenItem(this.activeFreezer, freezerSlotDto, frozenItemDto);
    } else {
      this.deleteItem(freezerSlotDto, frozenItemDto);
    }
    this.updateDataSources();
  }
  increaseQuantity(freezerSlotDto: FreezerSlotDto, frozenItemDto: FrozenItemDto) {
    frozenItemDto.quantity = frozenItemDto.quantity + 1;
    this.freezerService.updateFrozenItem(this.activeFreezer, freezerSlotDto, frozenItemDto);
    this.updateDataSources();
  }
  deleteItem(freezerSlotDto: FreezerSlotDto, frozenItemDto: FrozenItemDto) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, { data: frozenItemDto });
    dialogRef.afterClosed().subscribe(async confirmed => {
      if (confirmed) {
        freezerSlotDto.frozenItems = freezerSlotDto.frozenItems.filter(item => item.id !== frozenItemDto.id);
        this.freezerService.deleteFrozenItem(this.activeFreezer, freezerSlotDto, frozenItemDto);
        this.updateDataSources();
      }
    });
  }
  deleteSlot(freezerSlotDto: FreezerSlotDto) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, { data: freezerSlotDto });
    dialogRef.afterClosed().subscribe(async confirmed => {
      if (confirmed) {
        this.activeFreezer.slots = this.activeFreezer.slots.filter(slot => slot.id !== freezerSlotDto.id);
        this.freezerService.deleteFreezerSlot(this.activeFreezer, freezerSlotDto);
        this.updateDataSources();
      }
    });
  }
  deleteFreezer() {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, { data: this.activeFreezer });
    dialogRef.afterClosed().subscribe(async confirmed => {
      if (confirmed) {
        this.freezerService.deleteFreezer(this.activeFreezer);
        this.freezers = this.freezers.filter(freezer => freezer.id !== this.activeFreezer.id);
        this.setActiveFreezer(this.freezers[0]);
      }
    });
  }
  sortData(index: number, sort: Sort) {
    const data = this.activeFreezer.slots[index].frozenItems;
    if (!sort.active || sort.direction === '') {
      this.dataSources[index] = new MatTableDataSource(data);
      return;
    }

    this.dataSources[index] = new MatTableDataSource(data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'quantity': return compare(a.quantity, b.quantity, isAsc);
        default: return 0;
      }
    }));
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}