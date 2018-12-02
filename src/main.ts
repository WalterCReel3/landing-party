import * as _ from "lodash";
import Phaser = require('phaser');

import { IntroScene } from './scenes/intro';
import { HowToScene } from './scenes/howto';
import { GameBoardScene } from './scenes/gameBoard';
import { RsMoveScene } from './scenes/rsMove';
//import { RsPlayScene } from './scenes/rsPlay';

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
            scene: [ IntroScene ]
        }

        this.phaser = new Phaser.Game(config);
        this.phaser.scene.add('GameBoardScene', GameBoardScene, false);
        this.phaser.scene.add('HowToScene', HowToScene, false);
        this.phaser.scene.add('RsMoveScene', RsMoveScene, false);
    }
}


let game = new Game();
