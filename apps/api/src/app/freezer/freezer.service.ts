import { Injectable, Logger } from '@nestjs/common';
import { Freezer, FreezerSlot, FrozenItem } from '@freezer/api-interfaces';
import { promisify } from 'util';
import { readFile, exists, writeFile } from 'fs';

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
        const freezer: Freezer = freezerFile.freezers.filter(freezer => freezer.id === freezerId)[0];
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
        freezerFile.freezers = freezerFile.freezers.filter(freezerInFile => freezerInFile.id !== freezer.id)
        freezerFile.freezers.push(freezer);
        promisify(writeFile)(this.freezerFilePath, JSON.stringify(freezerFile, undefined, 2));
    }
    async getAllFreezerSlots(freezerId: string): Promise<FreezerSlot[]> {
        const freezer: Freezer = await this.getFreezerById(freezerId);
        return freezer.slots;
    }
    async getFreezerSlotById(freezerId: string, slotId: string): Promise<FreezerSlot> {
        const freezer: Freezer = await this.getFreezerById(freezerId);
        return freezer.slots.find(slot => slot.id === slotId);
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

    async getAllFrozenItems(freezerId: string, freezerSlotId: string): Promise<FrozenItem[]> {
        const freezerSlot: FreezerSlot = await this.getFreezerSlotById(freezerId, freezerSlotId);
        return freezerSlot.frozenItems;
    }
    async getFrozenItemById(freezerId: string, freezerSlotId: string, frozenItemId: string): Promise<FrozenItem> {
        const freezerSlot: FreezerSlot = await this.getFreezerSlotById(freezerId, freezerSlotId);
        return freezerSlot.frozenItems.find(item => item.id === frozenItemId);
    }
    async addNewFrozenItem(freezerId: string, freezerSlotId: string, name: string, quantity?: number): Promise<FrozenItem> {
        const frozenItem: FrozenItem = new FrozenItem(name, quantity);
        const freezerSlot: FreezerSlot = await this.getFreezerSlotById(freezerId, freezerSlotId);
        freezerSlot.frozenItems.push(frozenItem);
        this.updateFreezerSlot(freezerId, freezerSlot);
        return frozenItem;
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
