import Phaser = require('phaser');
import Vector2 = Phaser.Math.Vector2;
import { Entity } from "./entity";

export class MovementOrder {
    startingTile: Vector2;
    requestedTile: Vector2;
    entity: Entity;
    entityMetadata: any;

    constructor(start: Vector2, entity: Entity, metadata?: any) {
        this.startingTile = start.clone();
        if (metadata) {
            this.entityMetadata = metadata;
        }
    }
}
