import Phaser = require('phaser');
import { Map, MapObject } from "../map";
import Vector2 = Phaser.Math.Vector2;
import Graphics = Phaser.GameObjects.Graphics;

export class RsMoveScene extends Phaser.Scene {
    private inputState: any;
    private tileMarker: Graphics;
    private selectionMarker: Graphics;
    private destination: Vector2;

    constructor() {
        super({
          key: "RsMoveScene",
          active: false
        });

        this.tileMarker = null;
        this.selectionMarker = null;
        this.destination = null;
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

        this.selectionMarker = this.add
            .graphics({
                x: screenCoords.x,
                y: screenCoords.y,
            })
        this.selectionMarker.lineStyle(4, 0x14ff05, 0.5);
        this.selectionMarker.strokeRect(0, 0, 64, 64);
        this.selectionMarker.setVisible(false);
        this.input.on('pointerdown', (pointer) => {
            let tileCoords = Map.screenToTileCoords(new Vector2(pointer.x, pointer.y));
            let screenCoords = Map.tileToScreenCoords(tileCoords);

            this.selectionMarker.setVisible(true);
            this.selectionMarker.setX(screenCoords.x).setY(screenCoords.y);
            this.destination = tileCoords;
        });
    }

	update(): void {
        let pointer = this.input.activePointer;

        let tileCoords = Map.screenToTileCoords(new Vector2(pointer.x, pointer.y));
        let screenCoords = Map.tileToScreenCoords(tileCoords);

        this.tileMarker.setX(screenCoords.x).setY(screenCoords.y);
	}

    sendMessage(message): void {
        console.log(message);
    }
}
