import Phaser = require('phaser');
import { Map, MapObject } from "../map";
import Vector2 = Phaser.Math.Vector2;
import Graphics = Phaser.GameObjects.Graphics;

export class RsMoveScene extends Phaser.Scene {
    private inputState: any;
    private tileMarker: Graphics;
    private selectionMarker: Graphics;
    private orderMarker: Graphics;
    private playerOrder: Vector2;
    private redshirtOrder: Array<Vector2>;
    private movableTiles: Array<Graphics>;
    private orderTarget: any;

    constructor() {
        super({
          key: "RsMoveScene",
          active: false
        });

        this.tileMarker = null;
        this.selectionMarker = null;
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
        this.selectionMarker.lineStyle(4, 0xffff00, 0.5);
        this.selectionMarker.strokeRect(0, 0, 64, 64);
        this.selectionMarker.setVisible(false);
        this.input.on('pointerdown', (pointer, gameObject) => {
          let tileCoords = Map.screenToTileCoords(new Vector2(pointer.x, pointer.y));
          let screenCoords = Map.tileToScreenCoords(tileCoords);

          this.selectionMarker.setVisible(true);
          this.selectionMarker.setX(screenCoords.x).setY(screenCoords.y);

          if (this.isAtPlayerCoords(tileCoords)) {
            console.log('clicked player');
            this.orderTarget = {player:true};
          }
          let redshirtIndex = this.getIndexOfRedshirtClicked(tileCoords);
          if (-1 !== redshirtIndex) {
            console.log('clicked redshirt #'+redshirtIndex);
            this.orderTarget = {redshirt:redshirtIndex};
          }
        });
    }

    update(): void {
        let pointer = this.input.activePointer;

        let tileCoords = Map.screenToTileCoords(new Vector2(pointer.x, pointer.y));
        let screenCoords = Map.tileToScreenCoords(tileCoords);

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
        // console.log(message);
    }

    spawnOrderTargetButton(tileCoords): void {
      if (this.canMoveCoords(tileCoords)) {
        let screenCoords = Map.tileToScreenCoords(tileCoords);
        let button = this.add
            .graphics({
                x: screenCoords.x,
                y: screenCoords.y,
            })
        button.fillStyle(0x55ffff, 0.25);
        button.fillRect(0, 0, 64, 64);
        // button.setInt
      }
    }

// Start hardcoded stubs: TODO implement plz
    isAtPlayerCoords(tileCoords): boolean {
      return tileCoords.x === 2 && tileCoords.y === 2;
    }

    getIndexOfRedshirtClicked(tileCoords): number {
      if (tileCoords.x === 3 && tileCoords.y === 2) {
        return 0;
      }
      if (tileCoords.x === 3 && tileCoords.y === 4) {
        return 1;
      }
      return -1;
    }

    canMoveCoords(tileCoords): boolean {
      return tileCoords.x > 0 && tileCoords.y > 0 && tileCoords.x < 12 && tileCoords.y < 12;
    }
}
