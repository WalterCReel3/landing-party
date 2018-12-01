import Phaser = require('phaser');

export class GameBoardScene extends Phaser.Scene {
    private inputState: any;
    private player: any;
    private captainCoords: Array<number>;
    private initialObjects: Object;

    constructor() {
        super({
            key: "GameBoardScene"
        });
        this.initialObjects = {};
    }

    preload(): void {
        this.load.image("redshirt", "assets/lp_char_redshirt.png");
        this.load.image("player", "assets/lp_char_player.png");
        this.load.image("tiles", "assets/2dtop-full-set.png");
        this.load.tilemapTiledJSON("map", "assets/pathtest.json");
        this.load.tilemapTiledJSON("map", "assets/board01.json");
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
        baseLayer.setCollisionBetween(0, 7);
        let objectLayer = map.getObjectLayer('Object Layer 1');
        let objects = objectLayer.objects;
        objects.forEach((obj) => {
            this.initialObjects[obj.name] = [obj['x'], obj['y']];
        });
        let captainCoords = this.initialObjects['captain'];
        this.player = this.physics.add.sprite(captainCoords[0], captainCoords[1], 'player')

        if (!this.inputState.playerLocation) {
        }

    }

	update(): void {
	}
}
