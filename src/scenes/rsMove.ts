import Phaser = require('phaser');

export class RsMoveScene extends Phaser.Scene {
    constructor() {
        super({
          key: "RsMoveScene",
          active: true
        });
    }

    preload(): void {
    }

    init(): void {
    }

    create(): void {
        this.scene.start('GameBoardScene', { action: 'display' });
        this.scene.sendToBack('GameBoardScene');
    }

	update(): void {
	}
}
