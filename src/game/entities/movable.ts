import { Point } from 'pixi.js';
import { Tile } from './tile';

export class Movement {
    public readonly direction: Point|undefined;

    constructor(direction: string) {
        switch(direction.toLowerCase()) {
            case "up":
                this.direction = new Point(0, -1);
                break;
            case "down":
                this.direction = new Point(0, 1);
                break;
            case "left":
                this.direction = new Point(-1, 0);
                break;
            case "right":
                this.direction = new Point(1, 0);
                break;
        }
    }
}

export abstract class Movable extends Tile {
    public posX = 0;
    public posY = 0;
}

export class Player extends Movable {
    constructor(posX: number, posY: number) {
        super("player");

        this.posX = posX;
        this.posY = posY;
    }
}