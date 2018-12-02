import Phaser = require('phaser');
import { Map, MapObject } from "../map";
import Vector2 = Phaser.Math.Vector2;
import Graphics = Phaser.GameObjects.Graphics;

export class RsMoveScene extends Phaser.Scene {
    private inputState: any;
    private tileMarker: Graphics;

    constructor() {
        super({
          key: "RsMoveScene",
          active: false
        });

        this.tileMarker = null;
    }

    preload(): void {
    }

    init(input): void {
        this.inputState = input;

        this.scene.launch('GameBoardScene', { action: 'display', parentActor: 'RsMoveScene' });
        this.scene.sendToBack('GameBoardScene');
    }

    create(): void {
        let tileCoords = new Vector2(1, 1);
        let screenCoords = Map.tileToScreenCoords(tileCoords);
        this.tileMarker = this.add
            .graphics({
                x: screenCoords.x,
                y: screenCoords.y,
            })
        this.tileMarker.fillStyle(0x55ffff, 0.25);
        this.tileMarker.fillRect(0, 0, 64, 64);
        this.tileMarker.setActive(false);
    }

	update(): void {
        let pointer = this.input.activePointer;

        let tileCoords = Map.screenToTileCoords(new Vector2(pointer.x, pointer.y));
        let screenCoords = Map.tileToScreenCoords(tileCoords);

        this.tileMarker.setActive(true);
        this.tileMarker.setX(screenCoords.x).setY(screenCoords.y);

        // const tileMarker = this.add
        //     .graphics({
        //         x: 300,
        //         y: 400,
        //         fillStyle: { color: 0x55ffff, alpha: 0.1 }
        //     })
        //     .fillRect(100, 100, 100, 100);
	}

    sendMessage(message): void {
        console.log(message);
    }
}
