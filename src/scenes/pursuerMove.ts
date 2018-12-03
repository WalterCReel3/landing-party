import Phaser = require('phaser');

export class PursuerMoveScene extends Phaser.Scene {
    constructor() {
        super({
            key: "PursuerMoveScene"
        });
    }

    gameBoard(): any {
        const gameScene = this.scene.get('GameBoardScene');
        return gameScene;
    }

    preload(): void {
    }

    init(): void {
    }

    create(): void {
        let board = this.gameBoard();
    }

	update(): void {
	}
}
