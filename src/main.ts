import * as _ from "lodash";
import Phaser = require('phaser');

import { IntroScene } from './scenes/intro';

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
            width: 800,
            height: 600,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 },
                    debug: false
                }
            },
            scene: IntroScene
        }

        this.phaser = new Phaser.Game(config);
    }
}


let game = new Game();


