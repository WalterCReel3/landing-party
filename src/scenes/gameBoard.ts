import Phaser = require('phaser');
import { Map } from "../map";

export class GameBoardScene extends Phaser.Scene {
    private inputState: any;
    private player: any;
    private objective: any;
    private redshirts: Array<any>;
    private map: Map;

    constructor() {
        super({
            key: "GameBoardScene"
        });
        this.map = null;
    }

    preload(): void {
        this.load.image("redshirt", "assets/lp_char_redshirt.png");
        this.load.image("star", "assets/star.png");
        this.load.image("player", "assets/lp_char_player.png");
        this.load.image("tiles", "assets/2dtop-full-set.png");
        this.load.tilemapTiledJSON("pathtest", "assets/pathtest.json");
        this.load.tilemapTiledJSON("board01", "assets/board01.json");
    }

    init(input): void {
        this.inputState = input;
    }

    loadMap(name: string) {
        if (this.map) {
            this.map.release();
        }
        this.map = new Map(this, name);
    }

    create(): void {
        this.loadMap("pathtest");

        let playerObject = this.map.getPlayerObject();
        let playerCoords = Map.tileToScreenCoords(playerObject.coords);
        this.player = this.physics.add.sprite(playerCoords.x, playerCoords.y, 'player')

        let objectiveObject = this.map.getObjectiveObject();
        let objectiveCoords = Map.tileToScreenCoords(objectiveObject.coords);
        this.objective = this.physics.add.sprite(objectiveCoords.x, objectiveCoords.y, 'star')

        let redshirts = this.map.getRedshirtObjects()
        redshirts.forEach((redshirt) => {
            let screenCoords = Map.tileToScreenCoords(redshirt.coords);
            console.log(screenCoords);
            this.physics.add.sprite(screenCoords.x, screenCoords.y, 'redshirt');
        });

        if (!this.inputState.playerLocation) {
        }

    }

	update(): void {
	}
}
