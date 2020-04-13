import { v4 as uuidv4 } from 'uuid';

export class Freezer {
    id: string;
    name: string;
    slots: FreezerSlot[];
    created: Date;
    constructor(name: string) {
        this.id = uuidv4();
        this.name = name;
        this.slots = [];
        this.created = new Date();
    }
}
export class FreezerSlot {
    id: string;
    name: string;
    frozenItems: FrozenItem[];
    created: Date;
    constructor(name: string) {
        this.id = uuidv4();
        this.name = name;
        this.frozenItems = [];
        this.created = new Date();
    }
}
export class FrozenItem {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    created: Date;
    constructor(name: string, quantity?: number, unit?: string, ) {
        this.id = uuidv4();
        this.name = name;
        if (quantity !== undefined) {
            this.quantity = quantity;
        } else {
            this.quantity = 0;
        }
        if (unit !== undefined) {
            this.unit = unit;
        } else {
            this.unit = '';
        }
        this.created = new Date();
    }
}
