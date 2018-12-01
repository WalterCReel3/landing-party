import Phaser = require('phaser');

export class RsMoveScene extends Phaser.Scene {
    private inputState: any;

    constructor() {
        super({
          key: "RsMoveScene",
          active: true
        });
    }

    preload(): void {
    }

    init(input): void {
        this.inputState = input;
    }

    create(): void {
        this.scene.start('GameBoardScene', { action: 'display' });
        this.scene.sendToBack('GameBoardScene');
    }

	update(): void {
	}
}
