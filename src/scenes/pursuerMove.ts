import Phaser = require('phaser');
import { getPath } from "../pathfinding";
import Vector2 = Phaser.Math.Vector2;

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

    private getMovableBoard(): number[][] {
        let board = this.gameBoard();
        let cloneBoard = board.map.getMovableBoard();
        const {x, y} = board.pursuer.position;
        cloneBoard[y][x] = false;
        return cloneBoard;
    }

    preload(): void {
    }

    init(): void {
        const board = this.gameBoard();
        const
        {x: startx, y: starty} = board.pursuer.position,
        {x: goalx, y: goaly} = board.getPlayer().position;
        let movableBoard = this.getMovableBoard();
        let path = getPath({
            board: movableBoard,
            start:[startx,starty],
            goal: [goalx, goaly],
            limitDistance: undefined
        });
        path = path.slice(0, 4); //limit path to 4 moves
        let [x, y] = path.pop(); //get last move
        // board.pursuer.position = new Vector2(newX, newY);
        console.log('move complete')
        console.log(board.pursuer.position)
        board.sendMessage({ action: 'update-pursuer-position', x, y});
        this.scene.stop('PursuerMoveScene');
        // this.scene.start('RsMoveScene');
    }

    create(): void {
    }

	update(): void {
	}
}
