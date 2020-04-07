import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { promisify } from 'util';
import { readFile, exists, writeFile } from 'fs';
import { Freezer, FreezerSlot, FrozenItem } from './types';

@Injectable()
export class FreezerService {
    private readonly freezerFilePath = 'freezer.json';
    private readonly logger = new Logger(FreezerService.name);

    async getAllFreezers(): Promise<Freezer[]> {
        const freezerFile = await this.loadFreezerFile();
        return this.sortFreezers(freezerFile.freezers);
    }
    async getFreezerById(freezerId: string): Promise<Freezer> {
        const freezerFile = await this.loadFreezerFile();
        const freezer: Freezer = freezerFile.freezers.find(freezer => freezer.id === freezerId);
        if (freezer === undefined) {
            console.log(freezerFile);
            throw new NotFoundException('Freezer with id ' + freezerId + ' not found');
        }
        return freezer;
    }
    async addNewFreezer(name: string): Promise<Freezer> {
        const freezer: Freezer = new Freezer(name);
        const freezerFile = await this.loadFreezerFile();
        freezerFile.freezers.push(freezer);
        freezerFile.freezers = this.sortFreezers(freezerFile.freezers);
        await promisify(writeFile)(this.freezerFilePath, JSON.stringify(freezerFile, undefined, 2));
        return freezer;
    }
    async updateFreezer(freezer: Freezer) {
        const freezerFile = await this.loadFreezerFile();
        freezerFile.freezers = freezerFile.freezers.filter(freezerInFile => freezerInFile.id !== freezer.id);
        freezerFile.freezers.push(freezer);
        freezerFile.freezers = this.sortFreezers(freezerFile.freezers);
        await promisify(writeFile)(this.freezerFilePath, JSON.stringify(freezerFile, undefined, 2));
    }
    async deleteFreezerById(freezerId: string) {
        //call to see if the freezer actually exists
        await this.getFreezerById(freezerId);
        const freezerFile = await this.loadFreezerFile();
        freezerFile.freezers = freezerFile.freezers.filter(freezerInFile => freezerInFile.id !== freezerId);
        freezerFile.freezers = this.sortFreezers(freezerFile.freezers);
        await promisify(writeFile)(this.freezerFilePath, JSON.stringify(freezerFile, undefined, 2));
    }
    async updateOrCreateFreezer(newFreezer: Freezer): Promise<Freezer> {
        try {
            //check if it exists
            await this.getFreezerById(newFreezer.id);
            await this.updateFreezer(newFreezer);
            return newFreezer;
        } catch (error) {
            //if it doesn't exist we have to create a new one
            const freezer: Freezer = await this.addNewFreezer(newFreezer.name);
            //and add the requested contents to it
            for (let index = 0; index < newFreezer.slots.length; index++) {
                const newSlot = newFreezer.slots[index];
                freezer.slots.push(await this.updateOrCreateFreezerSlot(freezer.id, newSlot));
            }
            await this.updateFreezer(freezer);
            return await this.getFreezerById(freezer.id);
        }
    }
    async getAllFreezerSlots(freezerId: string): Promise<FreezerSlot[]> {
        const freezer: Freezer = await this.getFreezerById(freezerId);
        return this.sortFreezerSlots(freezer.slots);
    }
    async getFreezerSlotById(freezerId: string, slotId: string): Promise<FreezerSlot> {
        const freezer: Freezer = await this.getFreezerById(freezerId);
        const slot: FreezerSlot = freezer.slots.find(slot => slot.id === slotId);
        if (slot === undefined) {
            throw new NotFoundException('FreezerSlot with id ' + slotId + ' not found');
        }
        return slot;
    }
    async addNewFreezerSlot(freezerId: string, name: string): Promise<FreezerSlot> {
        const freezerSlot: FreezerSlot = new FreezerSlot(name);
        const freezer: Freezer = await this.getFreezerById(freezerId);
        freezer.slots.push(freezerSlot);
        await this.updateFreezer(freezer);
        return freezerSlot;
    }
    async updateFreezerSlot(freezerId: string, freezerSlot: FreezerSlot) {
        const freezer: Freezer = await this.getFreezerById(freezerId);
        freezer.slots = freezer.slots.filter(slot => slot.id !== freezerSlot.id);
        freezer.slots.push(freezerSlot);
        await this.updateFreezer(freezer);
    }
    async deleteFreezerSlotById(freezerId: string, freezerSlotId: string) {
        //call to see if slot actually exists
        await this.getFreezerSlotById(freezerId, freezerSlotId);
        const freezer: Freezer = await this.getFreezerById(freezerId);
        freezer.slots = freezer.slots.filter(slot => slot.id !== freezerSlotId);
        await this.updateFreezer(freezer);
    }
    async updateOrCreateFreezerSlot(freezerId: string, newFreezerSlot: FreezerSlot): Promise<FreezerSlot> {
        try {
            //check if it exists
            await this.getFreezerSlotById(freezerId, newFreezerSlot.id);
            await this.updateFreezerSlot(freezerId, newFreezerSlot);
            return newFreezerSlot;
        } catch (error) {
            //if it doesn't exist we have to create a new one
            const freezerSlot: FreezerSlot = await this.addNewFreezerSlot(freezerId, newFreezerSlot.name);
            //and add the requested contents to it
            for (let index = 0; index < newFreezerSlot.frozenItems.length; index++) {
                const newItem = newFreezerSlot.frozenItems[index];
                freezerSlot.frozenItems.push(await this.updateOrCreateFrozenItem(freezerId, freezerSlot.id, newItem));
            }
            await this.updateFreezerSlot(freezerId, freezerSlot);
            return await this.getFreezerSlotById(freezerId, freezerSlot.id);
        }
    }

    async getAllFrozenItems(freezerId: string, freezerSlotId: string): Promise<FrozenItem[]> {
        const freezerSlot: FreezerSlot = await this.getFreezerSlotById(freezerId, freezerSlotId);
        return this.sortFrozenItems(freezerSlot.frozenItems);
    }
    async getFrozenItemById(freezerId: string, freezerSlotId: string, frozenItemId: string): Promise<FrozenItem> {
        const freezerSlot: FreezerSlot = await this.getFreezerSlotById(freezerId, freezerSlotId);
        const item: FrozenItem = freezerSlot.frozenItems.find(item => item.id === frozenItemId);
        if (item === undefined) {
            throw new NotFoundException('FrozenItem with id ' + frozenItemId + ' not found');
        }
        return item;
    }
    async addNewFrozenItem(freezerId: string, freezerSlotId: string, name: string, quantity?: number): Promise<FrozenItem> {
        const frozenItem: FrozenItem = new FrozenItem(name, quantity);
        const freezerSlot: FreezerSlot = await this.getFreezerSlotById(freezerId, freezerSlotId);
        freezerSlot.frozenItems.push(frozenItem);
        await this.updateFreezerSlot(freezerId, freezerSlot);
        return frozenItem;
    }
    async updateFrozenItem(freezerId: string, freezerSlotId: string, frozenItem: FrozenItem) {
        const freezerSlot: FreezerSlot = await this.getFreezerSlotById(freezerId, freezerSlotId);
        freezerSlot.frozenItems = freezerSlot.frozenItems.filter(item => item.id !== frozenItem.id);
        freezerSlot.frozenItems.push(frozenItem);
        await this.updateFreezerSlot(freezerId, freezerSlot);
    }
    async deleteFrozenItemById(freezerId: string, freezerSlotId: string, frozenItemId: string) {
        //call to see if item actually exists
        await this.getFrozenItemById(freezerId, freezerSlotId, frozenItemId);
        const freezerSlot: FreezerSlot = await this.getFreezerSlotById(freezerId, freezerSlotId);
        freezerSlot.frozenItems = freezerSlot.frozenItems.filter(item => item.id !== frozenItemId);
        await this.updateFreezerSlot(freezerId, freezerSlot);
    }
    async updateOrCreateFrozenItem(freezerId: string, freezerSlotId: string, newFrozenItem: FrozenItem): Promise<FrozenItem> {
        try {
            //check if it exists
            await this.getFrozenItemById(freezerId, freezerSlotId, newFrozenItem.id);
            await this.updateFrozenItem(freezerId, freezerSlotId, newFrozenItem);
            return newFrozenItem;
        } catch (error) {
            //if it doesn't exist we have to create a new one
            const frozenItem: FrozenItem = await this.addNewFrozenItem(freezerId, freezerSlotId, newFrozenItem.name, newFrozenItem.quantity);
            return frozenItem;
        }
    }




    private async loadFreezerFile(): Promise<{ freezers: Freezer[] }> {
        try {
            if (await this.resultFileExists()) {
                const freezersBuffer = await promisify(readFile)(this.freezerFilePath);
                const freezers = freezersBuffer.toString();
                return freezers ? JSON.parse(freezers) : { freezers: [] };
            } else {
                return { freezers: [] };
            }
        } catch (error) {
            this.logger.error(error);
            return { freezers: [] };
        }
    }

    /**
     * Check if the result file exists.
     */
    async resultFileExists() {
        return await promisify(exists)(this.freezerFilePath);
    }
    private sortFreezers(freezers: Freezer[]): Freezer[] {
        freezers = freezers.sort((f1, f2) => f1.created.valueOf() - f2.created.valueOf());
        freezers.forEach(freezer => {
            freezer.slots = this.sortFreezerSlots(freezer.slots);
        });
        return freezers;
    }
    private sortFreezerSlots(slots: FreezerSlot[]): FreezerSlot[] {
        slots.sort((s1, s2) => s1.created.valueOf() - s2.created.valueOf());
        slots.forEach(slot => {
            slot.frozenItems = this.sortFrozenItems(slot.frozenItems);
        });
        return slots;
    }
    private sortFrozenItems(items: FrozenItem[]): FrozenItem[] {
        return items.sort((i1, i2) => i1.created.valueOf() - i2.created.valueOf());
    }
}
