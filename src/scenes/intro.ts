import Phaser = require('phaser');

import { LevelOneScene } from './levelOne';

export class IntroScene extends Phaser.Scene {
    private introText: Phaser.GameObjects.Text;
	private background: Phaser.GameObjects.Sprite;
    private startKey: Phaser.Input.Keyboard.Key;

    constructor() {
        super({
            key: "IntroScene"
        });
    }

    preload(): void {
		this.load.image('background', '../../assets/sky.png');
    }

    init(): void {
        this.startKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        );
        this.startKey.isDown = false;
    }

    create(): void {
		console.log('In create');
		this.add.image(400, 300, 'sky');

        this.introText = this.add.text(
            this.sys.canvas.width / 2,
            this.sys.canvas.height / 2,
            "Landing Party",
            {
				fontFamily: "Connection",
				fontSize: 38,
				stroke: "#fff",
				strokeThickness: 6,
				fill: "#000000"
            }
        );
    }

	update(): void {
        if (this.startKey.isDown) {
            this.scene.start('LevelOneScene');
        }
	}
}
