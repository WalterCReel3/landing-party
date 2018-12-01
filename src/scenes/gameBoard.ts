import Phaser = require('phaser');

export class GameBoardScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GameBoardScene"
        });
    }

    preload(): void {
    }

    init(input): void {
        if (input.action === 'display') {
        }
    }

    create(): void {
    }

	update(): void {
	}
}
