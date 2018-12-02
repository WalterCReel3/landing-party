import Phaser = require('phaser');
import { Map } from "../map";

export class GameBoardScene extends Phaser.Scene {
    private inputState: any;
    private player: any;
    private map: Map;

    constructor() {
        super({
            key: "GameBoardScene"
        });
        this.map = null;
    }

    preload(): void {
        this.load.image("redshirt", "assets/lp_char_redshirt.png");
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
        let playerCoords = Map.tileToScreenCoords(this.map.initialCoords['captain']);
        this.player = this.physics.add.sprite(playerCoords.x, playerCoords.y, 'player')

        if (!this.inputState.playerLocation) {
        }

    }

	update(): void {
	}
}
