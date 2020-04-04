import { v4 as uuidv4 } from 'uuid';

export class Freezer {
    id: string;
    name: string;
    slots: FreezerSlot[];
    constructor(name: string) {
        this.id = uuidv4();
        this.name = name;
        this.slots = [];
    }
}
export class FreezerSlot {
    id: string;
    name: string;
    frozenItems: FrozenItem[];
    constructor(name: string) {
        this.id = uuidv4();
        this.name = name;
        this.frozenItems = [];
    }
}
export class FrozenItem {
    id: string;
    name: string;
    quantity: number;
    constructor(name: string, quantity?: number) {
        this.id = uuidv4();
        this.name = name;
        if (quantity !== undefined) {
            this.quantity = quantity;
        } else {
            this.quantity = 0;
        }
    }
}
