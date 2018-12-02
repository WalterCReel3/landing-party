import Phaser = require('phaser');

export class RsMoveScene extends Phaser.Scene {
    private inputState: any;

    constructor() {
        super({
          key: "RsMoveScene",
          active: false
        });
    }

    preload(): void {
    }

    init(input): void {
        this.inputState = input;

        this.scene.launch('GameBoardScene', { action: 'display', parentActor: 'RsMoveScene' });
        this.scene.sendToBack('GameBoardScene');
    }

    create(): void {
    }

	update(): void {
        //const testRect = this.add
        //    .graphics({
        //        x: 300,
        //        y: 400,
        //        fillStyle: { color: 0x55ffff, alpha: 0.1 }
        //    })
        //    .fillRect(100, 100, 100, 100);
	}

    sendMessage(message): void {
        console.log(message);
    }
}
