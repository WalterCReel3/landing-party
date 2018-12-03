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

        this.scene.launch('RsMoveScene',);
        this.scene.bringToTop('RsMoveScene');
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
        this.pursuer = this.makeEntity(this.map.getPursuerObject());
    }

    create(): void {
        this.loadMap("pathtest");
        this.loadEntities();

        if (!this.inputState.playerLocation) {
        }
    }

    update(): void {
    }

    sendMessage(message: any): void {
        if (message.action === 'update-redshirt-positions') {
            message.redshirts.forEach(moveCommand => {
                if (moveCommand.requestedTile) {
                    console.log('-=-', moveCommand);
                    console.log(this.redshirts)
                    const redshirt = this.redshirts.filter((obj) => {
                        return moveCommand.startingTile.equals(obj.position);
                    })[0];
                    redshirt.setPosition(moveCommand.requestedTile);
                }
            });
        } else if (message.action === 'update-player-position') {
            if (message.player.requestedTile) {
                let destination = message.player.requestedTile;
                if (destination) {
                    this.player.setPosition(destination);
                }
            }
        } else if (message.action === 'update-pursuer-position') {
            const {x, y} = message;
            const newPos = new Vector2(x, y);
            this.pursuer.setPosition(newPos);

            const newCoords = Map.tileToScreenCoords(newPos);
            this.pursuer.sprite.setX(newCoords.x + 32).setY(newCoords.y + 32);
        }
    }
}
