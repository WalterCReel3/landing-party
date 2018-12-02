import Phaser = require('phaser');
import { Map, MapObject } from "../map";
import { EntityManager } from "../entity";
import Vector2 = Phaser.Math.Vector2;

export class GameBoardScene extends Phaser.Scene {
    private inputState: any;
    private player: any;
    private objective: any;
    private pursuer: any;
    private redshirts: Array<any>;
    private map: Map;
    private entityManager: EntityManager;

    constructor() {
        super({
            key: "GameBoardScene",
            active: false
        });
        this.map = null;
        this.redshirts = [];
        this.entityManager = new EntityManager(this);
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
        console.log("Loading map...");
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
        return this.entityManager.makeEntity(mapObject);
    }

    loadSprites(): void {
        this.player = this.makeEntity(this.map.getPlayerObject());
        this.objective = this.makeSprite(this.map.getObjectiveObject(), 'star');
        let redshirts = this.map.getRedshirtObjects()
        redshirts.forEach((redshirtObject) => {
            console.log('++', redshirtObject)
            const redshirtSprite = {
                graphics: this.makeSprite(redshirtObject, 'redshirt'),
                id: redshirtObject.name,
                x: redshirtObject.coords.x,
                y: redshirtObject.coords.y
            };
            this.redshirts.push(redshirtSprite);
        });
        console.log('!!', this.redshirts)
        this.pursuer = this.makeSprite(this.map.getPursuerObject(), 'monster');
    }

    create(): void {
        console.log('got created');
        this.loadMap("pathtest");
        this.loadSprites();

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
                const redshirtSprite = this.redshirts.filter(obj => obj.x === redshirt.oldX && obj.y === redshirt.oldY)[0];
                const newCoords = Map.tileToScreenCoords(new Vector2(redshirt.newX, redshirt.newY));
                redshirtSprite.graphics.setX(newCoords.x).setY(newCoords.y);
            });
        }
    }
}
