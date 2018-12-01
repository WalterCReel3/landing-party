import * as _ from "lodash";
import Phaser = require('phaser');

import { IntroScene } from './scenes/intro';
import { GameBoardScene } from './scenes/gameBoard';
import { RsMoveScene } from './scenes/rsMove';
import { RsPlayScene } from './scenes/rsPlay';

/// <reference path="../phaser.d.ts"/>

class Game {
    phaser;

    constructor() {
        this.startPhaser();
    }

    startPhaser() {
        let self = this;
        let config = {
            type: Phaser.WEBGL,
            width: 1280,
            height: 896,
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false
                }
            },
            scene: [ IntroScene, GameBoardScene, RsMoveScene, RsPlayScene ]
        }

        this.phaser = new Phaser.Game(config);
    }
}


let game = new Game();


