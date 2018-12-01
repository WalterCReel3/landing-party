import Phaser = require('phaser');

export class GameBoardScene extends Phaser.Scene {
    private inputState: any;

    constructor() {
        super({
            key: "GameBoardScene"
        });
    }

    preload(): void {
        this.load.image("tiles", "assets/2dtop-full-set.png");
        this.load.tilemapTiledJSON("map", "assets/pathtest.json");
    }

    init(input): void {
        this.inputState = input;
    }

    create(): void {
        // Create the empty tilemap
        const map = this.make.tilemap({key: "map"});
        // Link the tileset reference with the loaded image
        const tileset = map.addTilesetImage("2dtop-tileset-64", "tiles");
        const baseLayer = map.createStaticLayer("Tile Layer 1", tileset, 0, 0);
        baseLayer.setCollisionBetween(12, 44);
    }

	update(): void {
	}
}
