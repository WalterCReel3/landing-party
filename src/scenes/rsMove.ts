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
    private movableTiles: Array<any>;
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
      this.load.image('button', 'assets/tileselect.png');
    }

    init(input): void {
        this.inputState = input;

        this.scene.launch('GameBoardScene', { action: 'display', parentActor: 'RsMoveScene' });
        this.scene.sendToBack('GameBoardScene');

        this.movableTiles = [];
        this.redshirtOrder = [];
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
        this.input.on('pointerdown', (pointer, gameObject) => {
          if (gameObject && gameObject.length !== 0) {
            let newOrder = Map.screenToTileCoords(new Vector2(gameObject[0].x, gameObject[0].y));
            if (this.orderTarget.player) {
              this.playerOrder = newOrder;
              this.orderTarget = {};
            }
            if (typeof(this.orderTarget.redshirt)!=='undefined') {
              this.redshirtOrder[this.orderTarget.redshirt] = newOrder;
              this.orderTarget = {};
            }
            console.log('orders now :', this.playerOrder, this.redshirtOrder );
          }
          this.destroyButtons();

          let tileCoords = Map.screenToTileCoords(new Vector2(pointer.x, pointer.y));
          let screenCoords = Map.tileToScreenCoords(tileCoords);

          this.selectionMarker.setVisible(true);
          this.selectionMarker.setX(screenCoords.x).setY(screenCoords.y);

          if (this.isAtPlayerCoords(tileCoords)) {
            this.orderTarget = {player:true};

            this.spawnOrderTargetButton(new Vector2(tileCoords.x, tileCoords.y));
            this.spawnOrderTargetButton(new Vector2(tileCoords.x-1, tileCoords.y));
            this.spawnOrderTargetButton(new Vector2(tileCoords.x+1, tileCoords.y));
            this.spawnOrderTargetButton(new Vector2(tileCoords.x, tileCoords.y+1));
            this.spawnOrderTargetButton(new Vector2(tileCoords.x, tileCoords.y-1));
          }
          let redshirtIndex = this.getIndexOfRedshirtClicked(tileCoords);
          if (-1 !== redshirtIndex) {
            this.orderTarget = {redshirt:redshirtIndex};

            this.spawnOrderTargetButton(new Vector2(tileCoords.x, tileCoords.y));
            this.spawnOrderTargetButton(new Vector2(tileCoords.x-1, tileCoords.y));
            this.spawnOrderTargetButton(new Vector2(tileCoords.x+1, tileCoords.y));
            this.spawnOrderTargetButton(new Vector2(tileCoords.x, tileCoords.y+1));
            this.spawnOrderTargetButton(new Vector2(tileCoords.x, tileCoords.y-1));
            this.spawnOrderTargetButton(new Vector2(tileCoords.x+1, tileCoords.y+1));
            this.spawnOrderTargetButton(new Vector2(tileCoords.x+1, tileCoords.y-1));
            this.spawnOrderTargetButton(new Vector2(tileCoords.x-1, tileCoords.y+1));
            this.spawnOrderTargetButton(new Vector2(tileCoords.x-1, tileCoords.y-1));
            this.spawnOrderTargetButton(new Vector2(tileCoords.x-2, tileCoords.y));
            this.spawnOrderTargetButton(new Vector2(tileCoords.x+2, tileCoords.y));
            this.spawnOrderTargetButton(new Vector2(tileCoords.x, tileCoords.y+2));
            this.spawnOrderTargetButton(new Vector2(tileCoords.x, tileCoords.y-2));
          }
        });
    }

    update(): void {
        let pointer = this.input.activePointer;

        let tileCoords = Map.screenToTileCoords(new Vector2(pointer.x, pointer.y));
        let screenCoords = Map.tileToScreenCoords(tileCoords);

        this.tileMarker.setX(screenCoords.x).setY(screenCoords.y);
	}

    sendMessage(message): void {
        // console.log(message);
    }

    spawnOrderTargetButton(tileCoords): void {
      if (this.canMoveCoords(tileCoords)) {
        let screenCoords = Map.tileToScreenCoords(tileCoords);
        this.movableTiles.push(this.add.image(screenCoords.x + 32, screenCoords.y + 32, 'button').setInteractive());
      }
    }

    destroyButtons(): void {
      this.movableTiles.map((x) => {x.destroy();});
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
