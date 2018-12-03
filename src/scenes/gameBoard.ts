import Phaser = require('phaser');
import { Map, MapObject } from "../map";
import { EntityManager, Entity } from "../entity";
import Vector2 = Phaser.Math.Vector2;
import { MovementOrder } from "../commands";

export class GameBoardScene extends Phaser.Scene {
    inputState: any;
    player: any;
    objective: any;
    pursuer: any;
    redshirts: Array<any>;
    map: Map;
    entityManager: EntityManager;
    entityList: Array<Entity>;

    constructor() {
        super({
            key: "GameBoardScene",
            active: false
        });
        this.map = null;
        this.redshirts = [];
        this.entityManager = new EntityManager(this);
        this.entityList = [];
    }

    preload(): void {
        this.entityManager.loadAssets();

        this.load.image("tiles", "assets/2dtop-full-set.png");
        this.load.tilemapTiledJSON("pathtest", "assets/pathtest.json");
        this.load.tilemapTiledJSON("board01", "assets/board01.json");
    }

    init(input): void {
        console.log(input);
        this.inputState = input;
    }

    loadMap(name: string): void {
        if (this.map) {
            this.map.release();
        }
        this.map = new Map(this, name);
    }

    makeSprite(mapObject: MapObject, spriteName: string): any {
        let screenCoords = Map.tileToSpriteCoords(mapObject.coords);
        return this.physics.add.sprite(screenCoords.x, screenCoords.y, spriteName);
    }

    makeEntity(mapObject: MapObject): any {
        let entity = this.entityManager.makeEntity(mapObject);
        this.entityList.push(entity);
        return entity;
    }

    getPlayer(): any {
        return this.player;
    }

    loadEntities(): void {
        this.player = this.makeEntity(this.map.getPlayerObject());
        this.objective = this.makeSprite(this.map.getObjectiveObject(), 'star');
        let redshirts = this.map.getRedshirtObjects()
        redshirts.forEach((redshirtObject) => {
            console.log('++', redshirtObject)
            let redshirt = this.makeEntity(redshirtObject);
            this.redshirts.push(redshirt);
        });

        console.log('!!', this.redshirts)
        this.pursuer = this.makeSprite(this.map.getPursuerObject(), 'monster');
    }

    create(): void {
        this.loadMap("pathtest");
        this.loadEntities();

        if (!this.inputState.playerLocation) {
        }

        const parentActor: any = this.scene.get(this.inputState.parentActor);
        parentActor.sendMessage('It works!');
    }

	update(): void {
	}

    sendMessage(message: any): void {
        if (message.action === 'update-redshirt-positions') {
            message.redshirts.forEach(redshirt => {
                if (redshirt.requestedTile) {
                    console.log('-=-', redshirt);
                    const currX = redshirt.startingTile.x;
                    const currY = redshirt.startingTile.y;
                    const newX = redshirt.requestedTile.x;
                    const newY = redshirt.requestedTile.y;
                    console.log(currX, currY)
                    console.log(this.redshirts)
                    const redshirtSprite = this.redshirts.filter(obj => obj.position.x === currX && obj.position.y === currY)[0];
                    const newCoords = Map.tileToScreenCoords(new Vector2(newX, newY));
                    redshirtSprite.sprite.setX(newCoords.x + 32).setY(newCoords.y + 32);
                }
            });
        } else if (message.action === 'update-player-position') {
            if (message.player.requestedTile) {
                const newX = message.player.requestedTile.x;
                const newY = message.player.requestedTile.Y;
                const newCoords = Map.tileToScreenCoords(new Vector2(newX, newY));
                this.player.setPosition(newCoords);
            }
        }
    }
}
