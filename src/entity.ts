import Phaser = require('phaser');
import { Map, MapObject } from "./map";
import Vector2 = Phaser.Math.Vector2;

export interface Entity {
    id: string;
    position: Vector2;
    sprite: any;

    setPosition(coord: Vector2): Entity;
    spriteCoords(): Vector2;
}

class BaseEntity {
    id: string;
    position: Vector2;
    sprite: any;
}

class CharacterEntity extends BaseEntity {
    spriteName: string;

    constructor(scene: Phaser.Scene, mapObject: MapObject, spriteName: string) {
        super();
        this.id = mapObject.name;
        this.spriteName = spriteName;
        this.position = new Vector2().copy(mapObject.coords);
        let screenCoords = this.spriteCoords();
        this.sprite = scene.physics.add.sprite(screenCoords.x, screenCoords.y, this.spriteName);
    }

    spriteCoords(): Vector2 {
        let screenCoords = Map.tileToScreenCoords(this.position);
        // Include offsets from absolute screen-tile coordinates
        return new Vector2(screenCoords.x + 33, screenCoords.y + 32);
    }

    setPosition(pos: Vector2): Entity {
        this.position.copy(pos);
        let coords = this.spriteCoords();
        this.sprite.setX(coords.x).setY(coords.y);
        return this;
    }
}

class Player extends CharacterEntity {
    constructor(scene: Phaser.Scene, mapObject: MapObject) {
        super(scene, mapObject, "player");
    }
}

class RedShirt extends CharacterEntity {
    constructor(scene: Phaser.Scene, mapObject: MapObject) {
        super(scene, mapObject, "redshirt");
    }
}

class Pursuer extends CharacterEntity {
    constructor(scene: Phaser.Scene, mapObject: MapObject) {
        super(scene, mapObject, "monster");
    }
}

class Objective extends CharacterEntity {
    constructor(scene: Phaser.Scene, mapObject: MapObject) {
        super(scene, mapObject, "star");
    }
}

export class EntityManager {
    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }
        
    loadAssets(): void {
        this.scene.load.image("redshirt", "assets/lp_char_redshirt.png");
        this.scene.load.image("monster", "assets/monster.png");
        this.scene.load.image("star", "assets/star.png");
        this.scene.load.image("player", "assets/lp_char_player.png");
        this.scene.load.image("tiles", "assets/2dtop-full-set.png");
    }

    makeEntity(mapObject: MapObject): Entity {
        let typeObj = EntityManager.entityTable[mapObject.typeName];
        if (typeObj === undefined) {
            console.log('lookup failed: ' + mapObject.typeName);
            return null;
        }

        console.log(typeObj);
        return new typeObj(this.scene, mapObject);
    }

    static entityTable = {
        "captain": Player,
        "redshirt": RedShirt,
        "pursuer": Pursuer,
        "objective": Objective
    }
}
