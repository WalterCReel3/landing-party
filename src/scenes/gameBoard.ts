import Phaser = require('phaser');
import { Map, MapObject } from "../map";

export class GameBoardScene extends Phaser.Scene {
    private inputState: any;
    private player: any;
    private objective: any;
    private pursuer: any;
    private redshirts: Array<any>;
    private map: Map;

    constructor() {
        super({
            key: "GameBoardScene",
            active: false
        });
        this.map = null;
        this.redshirts = [];
    }

    preload(): void {
        this.load.image("redshirt", "assets/lp_char_redshirt.png");
        this.load.image("monster", "assets/monster.png");
        this.load.image("star", "assets/star.png");
        this.load.image("player", "assets/lp_char_player.png");
        this.load.image("tiles", "assets/2dtop-full-set.png");
        this.load.tilemapTiledJSON("pathtest", "assets/pathtest.json");
        this.load.tilemapTiledJSON("board01", "assets/board01.json");
    }

    init(input): void {
        this.inputState = input;
    }

    loadMap(name: string): void {
        if (this.map) {
            this.map.release();
        }
        this.map = new Map(this, name);
    }

    makeSprite(mapObject: MapObject, spriteName: string): any {
        let screenCoords = Map.tileToScreenCoords(mapObject.coords);
        return this.physics.add.sprite(screenCoords.x, screenCoords.y, spriteName);
    }

    loadSprites(): void {
        this.player = this.makeSprite(this.map.getPlayerObject(), 'player');
        this.objective = this.makeSprite(this.map.getObjectiveObject(), 'star');
        let redshirts = this.map.getRedshirtObjects()
        redshirts.forEach((redshirtObject) => {
            this.redshirts.push(this.makeSprite(redshirtObject, 'redshirt'));
        });
        this.pursuer = this.makeSprite(this.map.getPursuerObject(), 'monster');
    }

    create(): void {
        this.loadMap("pathtest");
        this.loadSprites();

        if (!this.inputState.playerLocation) {
        }

        const parentActor: any = this.scene.get(this.inputState.parentActor);
        parentActor.sendMessage('It works!');

    }

	update(): void {
	}
}
