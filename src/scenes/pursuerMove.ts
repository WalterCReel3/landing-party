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
        
        let previousTile = [startx, starty];
        let redshirtFound;
        path.forEach(tile => {
            board.redshirts.forEach(redshirt => {
                const {x: rx, y: ry} = redshirt.position;
                const [tx, ty] = tile;
                if(tx === rx && ty === ry && !redshirtFound){ // !redshirtFound is my breakout
                    // red shirt is on the next spot, use previous
                    redshirtFound = redshirt;
                }
            });
            if(!redshirtFound){
                previousTile = tile;
            }
        });

        let newTileX, newTileY;
        if(redshirtFound){
            [newTileX, newTileY] = previousTile;
            board.redshirts = board.redshirts.filter(redshirt => redshirt === redshirtFound);
            console.log(board.redshirts)
            console.log(board.redshirts.filter(redshirt => redshirt === redshirtFound));
            console.log(redshirtFound)
        } else {
            [newTileX, newTileY] = path.pop(); //get last move
        }

        board.sendMessage({ action: 'update-pursuer-position', x: newTileX, y: newTileY});
        this.scene.start('RsMoveScene');
        this.scene.stop('PursuerMoveScene');
    }

    create(): void {
    }

	update(): void {
	}
}
