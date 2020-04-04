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
        return freezerFile.freezers;
    }
    async getFreezerById(freezerId: string): Promise<Freezer> {
        const freezerFile = await this.loadFreezerFile();
        const freezer: Freezer = freezerFile.freezers.find(freezer => freezer.id === freezerId);
        if (freezer === undefined) {
            throw new NotFoundException('Freezer with id ' + freezerId + ' not found');
        }
        return freezer;
    }
    async addNewFreezer(name: string): Promise<Freezer> {
        const freezer: Freezer = new Freezer(name);
        const freezerFile = await this.loadFreezerFile();
        freezerFile.freezers.push(freezer);
        await promisify(writeFile)(this.freezerFilePath, JSON.stringify(freezerFile, undefined, 2));
        return freezer;
    }
    async updateFreezer(freezer: Freezer) {
        const freezerFile = await this.loadFreezerFile();
        freezerFile.freezers = freezerFile.freezers.filter(freezerInFile => freezerInFile.id !== freezer.id);
        freezerFile.freezers.push(freezer);
        promisify(writeFile)(this.freezerFilePath, JSON.stringify(freezerFile, undefined, 2));
    }
    async deleteFreezerById(freezerId: string) {
        //call to see if the freezer actually exists
        await this.getFreezerById(freezerId);
        const freezerFile = await this.loadFreezerFile();
        freezerFile.freezers = freezerFile.freezers.filter(freezerInFile => freezerInFile.id !== freezerId);
        promisify(writeFile)(this.freezerFilePath, JSON.stringify(freezerFile, undefined, 2));
    }
    async getAllFreezerSlots(freezerId: string): Promise<FreezerSlot[]> {
        const freezer: Freezer = await this.getFreezerById(freezerId);
        return freezer.slots;
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
        this.updateFreezer(freezer);
        return freezerSlot;
    }
    async updateFreezerSlot(freezerId: string, freezerSlot: FreezerSlot) {
        const freezer: Freezer = await this.getFreezerById(freezerId);
        freezer.slots = freezer.slots.filter(slot => slot.id !== freezerSlot.id);
        freezer.slots.push(freezerSlot);
        this.updateFreezer(freezer);
    }
    async deleteFreezerSlotById(freezerId: string, freezerSlotId: string) {
        //call to see if slot actually exists
        await this.getFreezerSlotById(freezerId, freezerSlotId);
        const freezer: Freezer = await this.getFreezerById(freezerId);
        freezer.slots = freezer.slots.filter(slot => slot.id !== freezerSlotId);
        this.updateFreezer(freezer);
    }

    async getAllFrozenItems(freezerId: string, freezerSlotId: string): Promise<FrozenItem[]> {
        const freezerSlot: FreezerSlot = await this.getFreezerSlotById(freezerId, freezerSlotId);
        return freezerSlot.frozenItems;
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
        this.updateFreezerSlot(freezerId, freezerSlot);
        return frozenItem;
    }
    async deleteFrozenItemById(freezerId: string, freezerSlotId: string, frozenItemId: string) {
        //call to see if item actually exists
        await this.getFrozenItemById(freezerId, freezerSlotId, frozenItemId);
        const freezerSlot: FreezerSlot = await this.getFreezerSlotById(freezerId, freezerSlotId);
        freezerSlot.frozenItems = freezerSlot.frozenItems.filter(item => item.id !== frozenItemId);
        this.updateFreezerSlot(freezerId, freezerSlot);
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
}
