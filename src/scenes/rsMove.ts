import Phaser = require('phaser');
import { Map, MapObject } from "../map";
import { MovementOrder } from "../commands";
import Vector2 = Phaser.Math.Vector2;
import Graphics = Phaser.GameObjects.Graphics;
import Image = Phaser.GameObjects.Image;

export class RsMoveScene extends Phaser.Scene {
    private inputState: any;
    private tileMarker: Graphics;
    private selectionMarker: Graphics;

    private playerOrder: MovementOrder;
    private playerOrderMarker: Image;
    private redshirtOrders: Array<MovementOrder>;
    private redshirtOrderMarkers: Array<Image>;

    private movableTiles: Array<any>;
    private orderTarget: any;
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
        this.load.image('button', 'assets/tileselect.png');
        this.load.image('player', 'assets/lp_char_player.png');
        this.load.image('redshirt', 'assets/lp_char_redshirt.png');
    }

    init(input): void {
        this.inputState = input;

        this.scene.launch('GameBoardScene', { action: 'display', parentActor: 'RsMoveScene' });
        this.scene.sendToBack('GameBoardScene');

        this.movableTiles = [];
        this.redshirtOrders = [];
        this.redshirtOrderMarkers = [];
    }

    gameBoard(): any {
        const gameScene = this.scene.get('GameBoardScene');
        return gameScene;
    }

    getPlayerMovementOrder(): MovementOrder {
        if (!this.playerOrder) {
            let gameBoard = this.gameBoard();
            let player = gameBoard.getPlayer();

            this.playerOrder = new MovementOrder(player.position, player);
        }
        return this.playerOrder;
    }

    getRedshirtMovementOrder(index): MovementOrder {
        if (!this.redshirtOrders[index]) {
            let gameBoard = this.gameBoard();
            let redshirt = gameBoard.redshirts[index];
            if (redshirt) {
                this.redshirtOrders[index] = new MovementOrder(redshirt.position, redshirt);
            }
        }
        return this.redshirtOrders[index];
    }

    getPlayerOrderMarker(): Image {
        if (!this.playerOrderMarker) {
            this.playerOrderMarker = this.add.image(0, 0, 'player').setAlpha(0.5).setVisible(false);
        }
        return this.playerOrderMarker;
    }

    getRedshirtOrderMarker(index): Image {
        if (!this.redshirtOrderMarkers[index]) {
            this.redshirtOrderMarkers[index] = this.add.image(0, 0, 'redshirt').setAlpha(0.5).setVisible(false);
        }
        return this.redshirtOrderMarkers[index];
    }

    create(): void {
        const proceedButton = this.add.text(1000, 100, "Proceed", { font: '32px Courier', fill: 0xffffff });
        proceedButton.setInteractive();
        proceedButton.on('pointerdown', () => {

            const gameScene = this.gameBoard();
            gameScene.sendMessage({ action: 'update-redshirt-positions', redshirts: this.redshirtOrders });
            gameScene.sendMessage({ action: 'update-player-position', player: this.playerOrder});

            this.scene.start('PursuerMoveScene');
            this.scene.stop('RsMoveScene');
        });

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

        // Handle all click events
        this.input.on('pointerdown', (pointer, gameObject) => {
            // If an entity was clicked (destination button) handle first
            if (gameObject && gameObject.length !== 0 && gameObject[0].type !=='Text') {
                let newOrder = Map.screenToTileCoords(new Vector2(gameObject[0].x, gameObject[0].y));
                if (this.orderTarget.player) {
                    this.getPlayerMovementOrder().requestedTile = newOrder;
                    let playerGhost = this.getPlayerOrderMarker();
                    playerGhost.x = gameObject[0].x;
                    playerGhost.y = gameObject[0].y;
                    playerGhost.setVisible(true);
                }
                if (typeof(this.orderTarget.redshirt)!=='undefined') {
                    this.getRedshirtMovementOrder(this.orderTarget.redshirt).requestedTile = newOrder;
                    let redshirtGhost = this.getRedshirtOrderMarker(this.orderTarget.redshirt);
                    redshirtGhost.x = gameObject[0].x;
                    redshirtGhost.y = gameObject[0].y;
                    redshirtGhost.setVisible(true);
                }
                console.log('orders now :', this.playerOrder, this.redshirtOrders );
            }
            // clear any active buttons on click, both as resolve and cancel
            this.orderTarget = {};
            this.destroyButtons();

            // Update selection (last clicked tile)
            let tileCoords = Map.screenToTileCoords(new Vector2(pointer.x, pointer.y));
            let screenCoords = Map.tileToScreenCoords(tileCoords);
            this.selectionMarker.setVisible(true);
            this.selectionMarker.setX(screenCoords.x).setY(screenCoords.y);
            this.destination = tileCoords;

            // If player is selected, queue up movement selection for player
            if (this.isAtPlayerCoords(tileCoords)) {
                this.orderTarget = {player:true}; //janky state for which thing is being ordered

                this.spawnOrderTargetButton(tileCoords, new Vector2(tileCoords.x, tileCoords.y));
                this.spawnOrderTargetButton(tileCoords, new Vector2(tileCoords.x-1, tileCoords.y));
                this.spawnOrderTargetButton(tileCoords, new Vector2(tileCoords.x+1, tileCoords.y));
                this.spawnOrderTargetButton(tileCoords, new Vector2(tileCoords.x, tileCoords.y+1));
                this.spawnOrderTargetButton(tileCoords, new Vector2(tileCoords.x, tileCoords.y-1));
            }

            // If redshirt selected; figure out which one and queue movement selection for them
            let redshirtIndex = this.getIndexOfRedshirtClicked(tileCoords);
            if (-1 !== redshirtIndex) {
                this.orderTarget = {redshirt:redshirtIndex}; //janky state for which thing is being ordered

                this.spawnOrderTargetButton(tileCoords, new Vector2(tileCoords.x, tileCoords.y));
                this.spawnOrderTargetButton(tileCoords, new Vector2(tileCoords.x-1, tileCoords.y));
                this.spawnOrderTargetButton(tileCoords, new Vector2(tileCoords.x+1, tileCoords.y));
                this.spawnOrderTargetButton(tileCoords, new Vector2(tileCoords.x, tileCoords.y+1));
                this.spawnOrderTargetButton(tileCoords, new Vector2(tileCoords.x, tileCoords.y-1));
                this.spawnOrderTargetButton(tileCoords, new Vector2(tileCoords.x+1, tileCoords.y+1));
                this.spawnOrderTargetButton(tileCoords, new Vector2(tileCoords.x+1, tileCoords.y-1));
                this.spawnOrderTargetButton(tileCoords, new Vector2(tileCoords.x-1, tileCoords.y+1));
                this.spawnOrderTargetButton(tileCoords, new Vector2(tileCoords.x-1, tileCoords.y-1));
                this.spawnOrderTargetButton(tileCoords, new Vector2(tileCoords.x-2, tileCoords.y));
                this.spawnOrderTargetButton(tileCoords, new Vector2(tileCoords.x+2, tileCoords.y));
                this.spawnOrderTargetButton(tileCoords, new Vector2(tileCoords.x, tileCoords.y+2));
                this.spawnOrderTargetButton(tileCoords, new Vector2(tileCoords.x, tileCoords.y-2));
            }
        });

        // Testing
        //const gamescene = this.gameBoard();
        //function testfunc() {
        //    gamescene.sendMessage({ action: 'update-redshirt-positions',
        //        redshirts: [ { newX: 5, newY: 7, oldX:3, oldY: 2 } ]
        //    });
        //}
        //setTimeout(testfunc, 4000);
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

    spawnOrderTargetButton(startCords, tileCoords): void {
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
        let gameBoard = this.gameBoard();
        let player = gameBoard.getPlayer();
        return tileCoords.x === player.position.x && tileCoords.y === player.position.y;
    }

    getIndexOfRedshirtClicked(tileCoords): number {
        let gameBoard = this.gameBoard();
        let redshirts = gameBoard.redshirts;
        for (let index=0; index<redshirts.length; index++) {
            if (tileCoords.x === redshirts[index].position.x
                 && tileCoords.y === redshirts[index].position.y) {
                return index;
            }
        }
        return -1;
    }

    canMoveCoords(tileCoords): boolean {
        return tileCoords.x > 0 && tileCoords.y > 0 && tileCoords.x < 12 && tileCoords.y < 12;
    }
}
