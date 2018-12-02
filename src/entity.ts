import Phaser = require('phaser');
import { Map, MapObject } from "./map";
import Vector2 = Phaser.Math.Vector2;

export interface Entity {
    position: Vector2;
    sprite: any;

    setPosition(coord: Vector2): Entity;
}

class BaseEntity {
    position: Vector2;
    sprite: any;
}

class CharacterEntity extends BaseEntity {
    spriteCoords(coords: Vector2): Vector2 {
        let screenCoords = Map.tileToScreenCoords(this.position);
        // Include offsets from absolute screen-tile coordinates
        return new Vector2(screenCoords.x + 33, screenCoords.y + 32);
    }

    setPosition(coords): Entity {
        this.position.copy(coords);
        return this;
    }
}

class Player extends CharacterEntity {
    static spriteName = "player";

    constructor(scene: Phaser.Scene, mapObject: MapObject) {
        super();
        console.log('Player in');
        this.position = new Vector2().copy(mapObject.coords);
        let screenCoords = this.spriteCoords(this.position);
        this.sprite = scene.physics.add.sprite(screenCoords.x, screenCoords.y, Player.spriteName);
        console.log('Player out');
    }

}

class RedShirt extends CharacterEntity {
    static spriteName = "redshirt";

    constructor(scene: Phaser.Scene, mapObject: MapObject) {
        super();
        this.position = new Vector2().copy(mapObject.coords);
        let screenCoords = this.spriteCoords(this.position);
        this.sprite = scene.physics.add.sprite(screenCoords.x, screenCoords.y, Player.spriteName);
    }
}

class Pursuer extends CharacterEntity {
    static spriteName = "monster";

    constructor(scene: Phaser.Scene, mapObject: MapObject) {
        super();
        this.position = new Vector2().copy(mapObject.coords);
        let screenCoords = this.spriteCoords(this.position);
        this.sprite = scene.physics.add.sprite(screenCoords.x, screenCoords.y, Pursuer.spriteName);
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
        "pursuer": Pursuer
    }
}
