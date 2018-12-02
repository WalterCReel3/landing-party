import Phaser = require('phaser');
import Vector2 = Phaser.Math.Vector2;

export class MovementOrder {
    startingTile: Vector2;
    requestedTile: Vector2;
    entityMetadata: any;

    constructor(start: Vector2, metadata?: any) {
        this.startingTile = start.clone();
        if (metadata) {
            this.entityMetadata = metadata;
        }
    }
}
