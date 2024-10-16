import { IComponent } from '../../engine/component';
import { Entity } from '../../engine/entity';
import { ListProxy } from '../proxies/list';
import properties from '../../engine/properties';
import { PropertyNames } from '../entities/map';

interface BodyPart {
    max: number;
    items: string[];
}

export class Inventory implements IComponent {
    public entity: Entity | null = null;

    private readonly items = new Map<string, Item>();
    private readonly equippedList: ListProxy;
    private readonly packedList: ListProxy;
    private readonly equippedParts = new Map<string, BodyPart>();

    constructor() {
        this.equippedList = new ListProxy('#equipped');
        this.packedList = new ListProxy('#packed');
        this.equippedParts = new Map([
            ['hand', { max: 2, items: [] }],
            ['head', { max: 1, items: [] }],
            ['body', { max: 2, items: [] }]
        ]);
    }

    public addItem(name: string, specs: any): boolean {
        const item = new Item(name, specs);
        this.items.set(name, item);

        if (item.isEquipment() && this.canEquip(item)) {
            item.onEquip();
            this.equippedList.add(`${name} (${item.part})`);
        } else {
            item.onTake();
            this.packedList.add(name);
        }

        return true;
    }

    public removeItem(name: string): boolean {
        const item = this.items.get(name);
        if (item === undefined) return true;

        item.onDrop();
        this.items.delete(name);
        return true;
    }

    private canEquip(item: Item): boolean {
        const part = this.equippedParts.get(item.part);
        if (part !== undefined && part.items.length < part.max) {
            part.items.push(item.name);
            return true;
        }
        return false;
    }
}

class Item {
    public readonly name: string;
    private readonly specs: any;

    constructor(name: string, specs: any) {
        this.name = name;
        this.specs = specs;
    }

    public isEquipment(): boolean {
        return this.specs.has('equip');
    }

    public get part(): string {
        return this.specs.get('part');
    }

    public onTake(): void {
        this.onAdd('take');
    }

    public onDrop(): void {
        this.onRemove('take');
    }

    public onEquip(): void {
        this.onAdd('equip');
    }

    public onUnequip(): void {
        this.onRemove('equip');
    }

    private onAdd(action: string): void {
        const changes = this.specs.get(action) as string[][];
        if (changes !== undefined) {
            changes.forEach((change) => {
                properties.set(change[0] as PropertyNames, change[1]);
            });
        }
    }

    private onRemove(action: string): void {
        const changes = this.specs.get(action) as string[][];
        if (changes !== undefined) {
            changes.forEach((change) => {
                properties.reset(change[0] as PropertyNames);
            });
        }
    }
}
